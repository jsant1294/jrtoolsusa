/**
 * JRToolsUSA — API: Get order by Stripe session ID
 * File: app/api/orders/by-session/route.ts
 *
 * Called by the success page to show order details
 * after Stripe redirects back.
 *
 * GET /api/orders/by-session?session_id=cs_test_...
 */

import { createServerClient } from '@/lib/supabase'
import { stripe }             from '@/lib/stripe'
import { NextResponse }       from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId        = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    const supabase = createServerClient()

    // Fetch order from Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id, status, total, customer_email, customer_name,
        shipping_address, created_at, tracking_number, carrier,
        order_items (
          quantity, price,
          products ( name, images )
        )
      `)
      .eq('stripe_session_id', sessionId)
      .single()

    if (error || !order) {
      // Order might not exist yet (webhook can be slightly delayed)
      // Fall back to fetching directly from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      return NextResponse.json({
        id:              sessionId,
        status:          session.payment_status === 'paid' ? 'paid' : 'pending',
        total:           session.amount_total ?? 0,
        customer_email:  session.customer_details?.email ?? '',
        customer_name:   session.customer_details?.name ?? '',
        shipping_address: null,
        created_at:      new Date().toISOString(),
        items:           [],
      })
    }

    // Shape the response
    return NextResponse.json({
      ...order,
      items: order.order_items?.map((item: any) => ({
        name:     item.products?.name ?? 'Unknown product',
        quantity: item.quantity,
        price:    item.price,
        image:    item.products?.images?.[0] ?? null,
      })) ?? [],
    })

  } catch (err: any) {
    console.error('GET /api/orders/by-session error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


// ══════════════════════════════════════════════════════════════
// GLOBAL ERROR PAGE
// File: app/error.tsx
// ══════════════════════════════════════════════════════════════

/*
'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('JRToolsUSA global error:', error)
  }, [error])

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-condensed font-bold uppercase tracking-wide text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          We hit an unexpected error. Our team has been notified.
          {error.digest && (
            <span className="block mt-2 font-mono text-xs text-gray-400">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#C41230] text-white font-condensed font-bold text-sm uppercase tracking-widest rounded hover:bg-[#0A1628] transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-condensed font-bold text-sm uppercase tracking-widest rounded hover:border-gray-500 transition-colors"
          >
            Go home
          </a>
        </div>
        <div className="mt-8 text-sm text-gray-400">
          Need help? Call{' '}
          <a href="tel:+14045657099" className="text-[#C41230] font-medium hover:underline">
            (404) 565-7099
          </a>
        </div>
      </div>
    </main>
  )
}
*/


// ══════════════════════════════════════════════════════════════
// 404 NOT FOUND PAGE
// File: app/not-found.tsx
// ══════════════════════════════════════════════════════════════

/*
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-condensed font-bold text-8xl text-gray-200 mb-2">404</div>
        <h1 className="text-2xl font-condensed font-bold uppercase tracking-wide text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/products"
            className="px-6 py-3 bg-[#C41230] text-white font-condensed font-bold text-sm uppercase tracking-widest rounded hover:bg-[#0A1628] transition-colors"
          >
            Shop all tools
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-condensed font-bold text-sm uppercase tracking-widest rounded hover:border-gray-500 transition-colors"
          >
            Go home
          </Link>
        </div>
        <div className="mt-8 text-sm text-gray-400">
          Looking for a specific tool?{' '}
          <Link href="/products" className="text-[#C41230] hover:underline">
            Try searching our catalogue
          </Link>
        </div>
      </div>
    </main>
  )
}
*/
