/**
 * JRToolsUSA — Admin Server Actions
 * File: app/admin/actions.ts
 *
 * All admin mutations live here as Next.js Server Actions.
 * Called from client components — no API routes needed.
 *
 * Each action:
 *  1. Verifies the user is an admin
 *  2. Performs the DB mutation
 *  3. Revalidates the relevant cache path
 *  4. Returns { success, error }
 */

'use server'

import { revalidatePath }         from 'next/cache'
import { createAuthServerClient,
         createServerClient }     from '@/lib/supabase'
import { stripe }                 from '@/lib/stripe'
import { resend }                 from '@/lib/resend'
import { ShippingUpdate }         from '@/emails/ShippingUpdate'

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createAuthServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) throw new Error('Not authorized')
  return user
}

// ─── Product actions ──────────────────────────────────────────────────────────

export async function toggleProductActive(productId: string, active: boolean) {
  try {
    await requireAdmin()
    const supabase = createServerClient()

    const { error } = await supabase
      .from('products')
      .update({ active, updated_at: new Date().toISOString() })
      .eq('id', productId)

    if (error) throw error
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateProductStock(productId: string, newStock: number) {
  try {
    await requireAdmin()
    if (newStock < 0) throw new Error('Stock cannot be negative')

    const supabase = createServerClient()
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', productId)

    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/admin/products')
    revalidatePath('/admin/stock')
    revalidatePath('/products')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateProduct(productId: string, data: {
  name?: string
  price?: number
  compare_price?: number | null
  stock?: number
  badge?: string | null
  description?: string
  active?: boolean
}) {
  try {
    await requireAdmin()
    const supabase = createServerClient()

    const { error } = await supabase
      .from('products')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', productId)

    if (error) throw error

    // If price changed, create new Stripe price
    if (data.price !== undefined) {
      const { data: product } = await supabase
        .from('products')
        .select('stripe_price_id, name, model, slug')
        .eq('id', productId)
        .single()

      if (product?.stripe_price_id) {
        // Archive old price
        await stripe.prices.update(product.stripe_price_id, { active: false })

        // Get Stripe product ID
        const oldPrice = await stripe.prices.retrieve(product.stripe_price_id)
        const stripeProductId = oldPrice.product as string

        // Create new price
        const newPrice = await stripe.prices.create({
          product:     stripeProductId,
          unit_amount: data.price,
          currency:    'usd',
          metadata:    { supabase_id: productId },
        })

        // Update stripe_price_id in Supabase
        await supabase
          .from('products')
          .update({ stripe_price_id: newPrice.id })
          .eq('id', productId)
      }
    }

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath('/products/[slug]', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function addProduct(data: {
  name:          string
  brand:         string
  model:         string
  category:      string
  subcategory?:  string
  voltage:       string
  price:         number
  compare_price?: number
  stock:         number
  badge?:        string
  description?:  string
}) {
  try {
    await requireAdmin()
    const supabase = createServerClient()

    // Generate slug
    const slug = data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + `-${data.model.toLowerCase()}`

    // Insert product
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        ...data,
        slug,
        images:   [],
        rating:   0,
        review_count: 0,
        metadata: {},
        active:   true,
      })
      .select()
      .single()

    if (error) throw error

    // Create Stripe Product + Price
    const stripeProduct = await stripe.products.create({
      name:     `${data.name} — ${data.model}`,
      metadata: { supabase_id: newProduct.id, brand: data.brand, model: data.model },
      shippable: true,
    })

    const stripePrice = await stripe.prices.create({
      product:     stripeProduct.id,
      unit_amount: data.price,
      currency:    'usd',
      metadata:    { supabase_id: newProduct.id },
    })

    // Write stripe_price_id back
    await supabase
      .from('products')
      .update({ stripe_price_id: stripePrice.id })
      .eq('id', newProduct.id)

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true, productId: newProduct.id }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteProduct(productId: string) {
  try {
    await requireAdmin()
    const supabase = createServerClient()

    // Soft delete — set active = false, never hard delete
    const { error } = await supabase
      .from('products')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', productId)

    if (error) throw error
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ─── Order actions ────────────────────────────────────────────────────────────

export async function markOrderShipped(
  orderId:        string,
  trackingNumber: string,
  carrier:        string
) {
  try {
    await requireAdmin()
    const supabase = createServerClient()

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status:         'shipped',
        tracking_number: trackingNumber,
        carrier,
        shipped_at:     new Date().toISOString(),
        updated_at:     new Date().toISOString(),
      })
      .eq('id', orderId)
      .select('customer_email, customer_name, shipping_address')
      .single()

    if (error) throw error

    // Send shipping update email
    if (order?.customer_email) {
      await resend.emails.send({
        from:    'orders@jrtoolsusa.com',
        to:      order.customer_email,
        subject: `Your order has shipped! Tracking: ${trackingNumber}`,
        react:   ShippingUpdate({
          customerName:   order.customer_name ?? 'Valued Customer',
          trackingNumber,
          carrier,
          orderId,
        }),
      })
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/orders/${orderId}`)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function markOrderDelivered(orderId: string) {
  try {
    await requireAdmin()
    const supabase = createServerClient()

    const { error } = await supabase
      .from('orders')
      .update({
        status:       'delivered',
        delivered_at: new Date().toISOString(),
        updated_at:   new Date().toISOString(),
      })
      .eq('id', orderId)

    if (error) throw error
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function refundOrder(orderId: string) {
  try {
    await requireAdmin()
    const supabase = createServerClient()

    // Get Stripe payment intent
    const { data: order } = await supabase
      .from('orders')
      .select('stripe_payment_intent, total')
      .eq('id', orderId)
      .single()

    if (!order?.stripe_payment_intent) {
      throw new Error('No payment intent found for this order')
    }

    // Issue full refund via Stripe
    await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent,
    })

    // Update order status
    const { error } = await supabase
      .from('orders')
      .update({ status: 'refunded', updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) throw error
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
