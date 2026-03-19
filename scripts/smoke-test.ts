/**
 * JRToolsUSA — Production Smoke Test Script
 * File: scripts/smoke-test.ts
 *
 * Runs automated checks against your live site.
 * Run AFTER deploying: npx tsx scripts/smoke-test.ts
 *
 * Checks:
 *   - Site is reachable
 *   - Products load from Supabase
 *   - Product pages render
 *   - Sitemap exists
 *   - API routes respond correctly
 *   - Stripe is in live mode
 *   - Webhook endpoint reachable
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const SITE    = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jrtoolsusa.com'
const SK      = process.env.STRIPE_SECRET_KEY ?? ''

type CheckResult = { name: string; pass: boolean; detail?: string }
const results: CheckResult[] = []

function pass(name: string, detail?: string) {
  results.push({ name, pass: true, detail })
  console.log(`  ✓  ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name: string, detail?: string) {
  results.push({ name, pass: false, detail })
  console.log(`  ✗  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn()
    pass(name)
  } catch (err: any) {
    fail(name, err.message)
  }
}

// ─── Checks ───────────────────────────────────────────────────────────────────

async function smokeTest() {
  console.log(`\n╔══════════════════════════════════════════╗`)
  console.log(`║   JRToolsUSA Production Smoke Test       ║`)
  console.log(`║   Target: ${SITE.padEnd(31)}║`)
  console.log(`╚══════════════════════════════════════════╝\n`)

  // ── 1. Site reachability ────────────────────────────────

  console.log('1. Site reachability')
  await check('Homepage loads', async () => {
    const r = await fetch(SITE)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
  })
  await check('Products page loads', async () => {
    const r = await fetch(`${SITE}/products`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
  })
  await check('Sitemap.xml returns XML', async () => {
    const r = await fetch(`${SITE}/sitemap.xml`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const ct = r.headers.get('content-type') ?? ''
    if (!ct.includes('xml')) throw new Error(`Wrong content-type: ${ct}`)
  })
  await check('Robots.txt returns text', async () => {
    const r = await fetch(`${SITE}/robots.txt`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
  })

  // ── 2. API routes ──────────────────────────────────────

  console.log('\n2. API routes')
  await check('Webhook endpoint exists (POST)', async () => {
    const r = await fetch(`${SITE}/api/webhooks/stripe`, { method: 'POST', body: '{}' })
    // Expect 400 (invalid signature) not 404
    if (r.status === 404) throw new Error('Endpoint not found')
  })
  await check('Checkout endpoint exists (POST)', async () => {
    const r = await fetch(`${SITE}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [] }),
    })
    if (r.status === 404) throw new Error('Endpoint not found')
  })

  // ── 3. Supabase connection ─────────────────────────────

  console.log('\n3. Database')
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await check('Supabase connection works', async () => {
    const { error } = await supabase.from('products').select('id').limit(1)
    if (error) throw new Error(error.message)
  })
  await check('Products table has records', async () => {
    const { count, error } = await supabase
      .from('products').select('id', { count: 'exact', head: true }).eq('active', true)
    if (error) throw new Error(error.message)
    if (!count || count < 1) throw new Error(`Only ${count} active products`)
    pass('Products table has records', `${count} active products`)
  })
  await check('Products have stripe_price_id', async () => {
    const { data, error } = await supabase
      .from('products').select('id').is('stripe_price_id', null).eq('active', true)
    if (error) throw new Error(error.message)
    if (data && data.length > 0) throw new Error(`${data.length} products missing stripe_price_id — run stripe-sync.ts`)
  })
  await check('Orders table exists', async () => {
    const { error } = await supabase.from('orders').select('id').limit(1)
    if (error) throw new Error(error.message)
  })

  // ── 4. Stripe configuration ────────────────────────────

  console.log('\n4. Stripe')
  if (!SK) {
    fail('Stripe key present', 'STRIPE_SECRET_KEY not set in .env.local')
  } else {
    await check('Stripe key is valid', async () => {
      const { default: Stripe } = await import('stripe')
      const stripe = new Stripe(SK, { apiVersion: '2026-02-25.clover' as any })
      await stripe.products.list({ limit: 1 })
    })
    await check('Stripe is in LIVE mode', async () => {
      if (SK.startsWith('sk_test_')) throw new Error('Still using test key — swap to sk_live_ before going live')
    })
    await check('Live products exist in Stripe', async () => {
      const { default: Stripe } = await import('stripe')
      const stripe = new Stripe(SK, { apiVersion: '2026-02-25.clover' as any })
      const { data } = await stripe.products.list({ limit: 1, active: true })
      if (!data.length) throw new Error('No active products in Stripe — run stripe-sync.ts')
    })
  }

  // ── 5. Environment variables ───────────────────────────

  console.log('\n5. Environment variables')
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'RESEND_API_KEY',
    'NEXT_PUBLIC_SITE_URL',
  ]
  for (const key of required) {
    if (process.env[key]) {
      pass(`${key} is set`)
    } else {
      fail(`${key} is MISSING`)
    }
  }

  // ── Summary ────────────────────────────────────────────

  const passed = results.filter(r => r.pass).length
  const failed = results.filter(r => !r.pass).length
  const total  = results.length

  console.log(`\n${'─'.repeat(46)}`)
  console.log(`Passed: ${passed} / ${total}`)
  if (failed > 0) {
    console.log(`Failed: ${failed} — fix the issues above before going live`)
    process.exit(1)
  } else {
    console.log(`\n✅ All checks passed — JRToolsUSA is ready to go live!\n`)
  }
}

smokeTest().catch(err => {
  console.error('\n❌ Smoke test crashed:', err.message)
  process.exit(1)
})
