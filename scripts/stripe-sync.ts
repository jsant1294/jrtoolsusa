/**
 * JRToolsUSA — Stripe Sync Script
 * File: scripts/stripe-sync.ts
 *
 * Run AFTER:
 *   1. supabase-setup.sql has been run in Supabase SQL Editor
 *   2. seed-products.ts has been run (products exist in DB)
 *
 * Run with:
 *   npx tsx scripts/stripe-sync.ts
 *
 * What it does:
 *   - Loops through every product in Supabase
 *   - Creates a Stripe Product + Price for each one
 *   - Writes stripe_price_id back to Supabase
 *   - Safe to re-run — skips products that already have a stripe_price_id
 *
 * Requirements:
 *   npm install stripe @supabase/supabase-js tsx dotenv
 *
 * Env vars (.env.local):
 *   STRIPE_SECRET_KEY=sk_test_...
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

import Stripe         from 'stripe'
import { createClient } from '@supabase/supabase-js'
import * as dotenv    from 'dotenv'
dotenv.config({ path: '.env.local' })

// ─── Clients ──────────────────────────────────────────────────────────────────

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover' as any,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function fmt(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function syncProducts() {
  console.log('╔══════════════════════════════════════════════════╗')
  console.log('║       JRToolsUSA — Stripe Product Sync           ║')
  console.log('╚══════════════════════════════════════════════════╝\n')

  // Fetch all active products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, brand, model, description, price, images, metadata, stripe_price_id')
    .eq('active', true)
    .order('brand', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch products from Supabase:', error.message)
    process.exit(1)
  }

  if (!products?.length) {
    console.error('❌ No products found. Run seed-products.ts first.')
    process.exit(1)
  }

  console.log(`Found ${products.length} products in Supabase\n`)

  let created  = 0
  let skipped  = 0
  let failed   = 0

  for (const product of products) {

    // ── Skip if already synced ──────────────────────────────

    if (product.stripe_price_id) {
      console.log(`  ⏭  Skipping ${product.brand} ${product.model} — already synced`)
      skipped++
      continue
    }

    try {
      // ── Create Stripe Product ───────────────────────────────

      const stripeProduct = await stripe.products.create({
        name:        `${product.name} — ${product.model}`,
        description: product.description?.slice(0, 500) ?? undefined,
        images:      product.images?.slice(0, 8) ?? [],   // Stripe allows max 8 images
        metadata: {
          supabase_id: product.id,
          brand:       product.brand,
          model:       product.model,
          slug:        product.slug,
        },
        // Shippable physical product
        shippable:   true,
        package_dimensions: product.metadata?.weight_lbs ? {
          weight: product.metadata.weight_lbs,
          height: 12,
          length: 18,
          width:  12,
        } : undefined,
      })

      // ── Create Stripe Price ─────────────────────────────────

      const stripePrice = await stripe.prices.create({
        product:     stripeProduct.id,
        unit_amount: product.price,
        currency:    'usd',
        metadata: {
          supabase_id:        product.id,
          supabase_product_id: product.id,
        },
      })

      // ── Write stripe_price_id back to Supabase ──────────────

      const { error: updateError } = await supabase
        .from('products')
        .update({ stripe_price_id: stripePrice.id })
        .eq('id', product.id)

      if (updateError) {
        console.error(`  ❌ Failed to update Supabase for ${product.model}:`, updateError.message)
        failed++
        continue
      }

      console.log(`  ✓  ${product.brand} ${product.model} — ${fmt(product.price)} — ${stripePrice.id}`)
      created++

      // Rate limit: Stripe allows 100 req/s in test, 25/s in live
      // 100ms delay keeps us well under both limits
      await sleep(100)

    } catch (err: any) {
      console.error(`  ❌ Failed to sync ${product.model}:`, err.message)
      failed++
    }
  }

  // ── Summary ───────────────────────────────────────────────

  console.log('\n' + '─'.repeat(52))
  console.log(`✅ Created:  ${created} Stripe products`)
  console.log(`⏭  Skipped:  ${skipped} already synced`)
  if (failed > 0) {
    console.log(`❌ Failed:   ${failed} — check errors above`)
  }
  console.log('─'.repeat(52))

  if (created > 0) {
    console.log('\nNext steps:')
    console.log('  1. Verify in Stripe Dashboard → Products')
    console.log('  2. Run: npm run dev')
    console.log('  3. Add a product to cart and test checkout')
    console.log('\nTo go live: swap STRIPE_SECRET_KEY for your sk_live_ key')
    console.log('and re-run this script to create live prices.\n')
  }
}

// ─── Update prices (run when you change a product price) ──────────────────────

async function syncPriceUpdate(productId: string, newPriceCents: number) {
  /**
   * Stripe prices are immutable — you can't edit them.
   * To update a price: create a new Price, archive the old one,
   * and update the stripe_price_id in Supabase.
   *
   * Usage:
   *   await syncPriceUpdate('supabase-product-uuid', 14900)
   */

  const { data: product } = await supabase
    .from('products')
    .select('stripe_price_id, name, model')
    .eq('id', productId)
    .single()

  if (!product) throw new Error(`Product ${productId} not found`)

  // Archive old price
  if (product.stripe_price_id) {
    await stripe.prices.update(product.stripe_price_id, { active: false })
    console.log(`Archived old price: ${product.stripe_price_id}`)
  }

  // Get the Stripe product ID from the old price
  const oldPrice = await stripe.prices.retrieve(product.stripe_price_id!)
  const stripeProductId = oldPrice.product as string

  // Create new price
  const newPrice = await stripe.prices.create({
    product:     stripeProductId,
    unit_amount: newPriceCents,
    currency:    'usd',
    metadata:    { supabase_id: productId },
  })

  // Update Supabase
  await supabase
    .from('products')
    .update({ stripe_price_id: newPrice.id, price: newPriceCents })
    .eq('id', productId)

  console.log(`✓ ${product.model} price updated → ${fmt(newPriceCents)} — ${newPrice.id}`)
}

// ─── Run ──────────────────────────────────────────────────────────────────────

syncProducts().catch(err => {
  console.error('\n❌ Stripe sync failed:', err.message)
  process.exit(1)
})

// Export for individual use
export { syncPriceUpdate }
