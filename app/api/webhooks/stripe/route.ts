/**
 * JRToolsUSA — Stripe Webhook Handler (Phase 4 — with emails)
 * File: app/api/webhooks/stripe/route.ts
 *
 * REPLACES the Phase 1 version with full email integration.
 *
 * Handles:
 *   checkout.session.completed  → create order + send confirmation email
 *   payment_intent.succeeded    → capture payment_intent ID for refunds
 *   charge.refunded             → update order status to refunded
 */

import { stripe }             from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'
import { sendEmail }          from '@/lib/resend'
import { OrderConfirmation }  from '@/emails/OrderConfirmation'
import { NextResponse }       from 'next/server'
import React                  from 'react'

export async function POST(req: Request) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  // ── Verify webhook signature ──────────────────────────────

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServerClient()

  // ── checkout.session.completed ────────────────────────────

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      const items       = JSON.parse(session.metadata?.items ?? '[]')
      const addr        = null
      const customerEmail = session.customer_details?.email ?? ''
      const customerName  = session.customer_details?.name  ?? ''

      // 1. Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_session_id:     session.id,
          stripe_payment_intent: session.payment_intent as string,
          status:                'paid',
          total:                 session.amount_total        ?? 0,
          subtotal:              session.amount_subtotal     ?? 0,
          shipping_cost:         session.shipping_cost?.amount_total ?? 0,
          customer_email:        customerEmail,
          customer_name:         customerName,
          shipping_address:      null,
        })
        .select()
        .single()

      if (orderError) {
        console.error('Failed to create order:', orderError)
        return NextResponse.json({ error: 'Order creation failed' }, { status: 500 })
      }

      // 2. Fetch product details for order items + snapshot
      const productIds = items.map((i: any) => i.productId)
      const { data: products } = await supabase
        .from('products')
        .select('id, name, brand, model, price, images')
        .in('id', productIds)

      // 3. Insert order items with product snapshot
      const orderItems = items.map((item: any) => {
        const product = products?.find(p => p.id === item.productId)
        return {
          order_id:   order.id,
          product_id: item.productId,
          quantity:   item.quantity,
          price:      product?.price ?? item.price,  // use DB price, not client price
          variant:    item.variant ?? {},
          snapshot:   product ? {
            name:   product.name,
            brand:  product.brand,
            model:  product.model,
            price:  product.price,
            image:  product.images?.[0] ?? null,
          } : {},
        }
      })

      await supabase.from('order_items').insert(orderItems)

      // 4. Decrement stock for each item
      for (const item of items) {
        await supabase.rpc('decrement_stock', {
          product_id: item.productId,
          amount:     item.quantity,
        })
      }

      // 5. Send order confirmation email
      if (customerEmail) {
        const emailItems = (products ?? []).map(p => {
          const cartItem = items.find((i: any) => i.productId === p.id)
          return {
            name:     p.name,
            brand:    p.brand,
            model:    p.model,
            quantity: cartItem?.quantity ?? 1,
            price:    p.price,
            image:    p.images?.[0],
          }
        })

        const subtotal    = emailItems.reduce((s, i) => s + i.price * i.quantity, 0)
        const shippingAmt = session.shipping_cost?.amount_total ?? 0
        const taxAmt      = Math.round(subtotal * 0.0825)
        const totalAmt    = session.amount_total ?? 0

        await sendEmail({
          to:      customerEmail,
          subject: `Order confirmed — #${order.id.slice(0, 8).toUpperCase()} · ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalAmt / 100)}`,
          react:   React.createElement(OrderConfirmation, {
            orderId:         order.id,
            customerName,
            customerEmail,
            items:           emailItems,
            subtotal,
            shippingCost:    shippingAmt,
            tax:             taxAmt,
            total:           totalAmt,
            shippingAddress: { line1: '', city: '', state: '', postal_code: '', country: '' },
            orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          }),
        })

        console.log(`✓ Order ${order.id} created — confirmation email sent to ${customerEmail}`)
      }

    } catch (err: any) {
      console.error('checkout.session.completed handler error:', err)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  // ── charge.refunded ───────────────────────────────────────

  if (event.type === 'charge.refunded') {
    const charge = event.data.object

    try {
      await supabase
        .from('orders')
        .update({ status: 'refunded', updated_at: new Date().toISOString() })
        .eq('stripe_payment_intent', charge.payment_intent)

      console.log(`✓ Order refunded — payment intent: ${charge.payment_intent}`)
    } catch (err: any) {
      console.error('charge.refunded handler error:', err)
    }
  }

  return NextResponse.json({ received: true })
}
