/**
 * JRToolsUSA — Order History Page
 * File: app/orders/page.tsx
 *
 * Shows all orders for the logged-in user.
 * Uses Supabase auth + RLS so users only see their own orders.
 * Guest users (no account) see a sign-in prompt.
 */

import { createAuthServerClient } from '@/lib/supabase'
import { formatPrice }            from '@/lib/cart'
import Link                       from 'next/link'
import type { Metadata }          from 'next'

export const metadata: Metadata = {
  title: 'Order History | JRToolsUSA',
  description: 'View your past orders and tracking information.',
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    pending:    { bg: 'bg-yellow-50',  text: 'text-yellow-700', dot: 'bg-yellow-400' },
    paid:       { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500'   },
    processing: { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500'   },
    shipped:    { bg: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-500' },
    delivered:  { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500'  },
    cancelled:  { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-400'    },
    refunded:   { bg: 'bg-gray-50',    text: 'text-gray-600',   dot: 'bg-gray-400'   },
  }

  const s = map[status] ?? map['pending']

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ─── Order row ────────────────────────────────────────────────────────────────

function OrderRow({ order }: { order: any }) {
  const date = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs text-gray-400 font-mono mb-1">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </div>
          <div className="text-sm text-gray-500">{date}</div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <div>
          <span className="text-gray-400">Total: </span>
          <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
        </div>
        <div>
          <span className="text-gray-400">Items: </span>
          <span className="font-medium">{order.item_count ?? '—'}</span>
        </div>
        {order.tracking_number && (
          <div>
            <span className="text-gray-400">Tracking: </span>
            <span className="font-mono text-blue-600">{order.tracking_number}</span>
          </div>
        )}
      </div>

      {/* Product names preview */}
      {order.product_names?.length > 0 && (
        <div className="text-xs text-gray-500 mb-4 line-clamp-1">
          {order.product_names.slice(0, 3).join(' · ')}
          {order.product_names.length > 3 && ` · +${order.product_names.length - 3} more`}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href={`/orders/${order.id}`}
          className="text-xs font-bold text-[#C41230] hover:text-[#0A1628] uppercase tracking-widest"
        >
          View details →
        </Link>
        {order.tracking_number && order.carrier && (
          <a
            href={`https://www.google.com/search?q=${order.carrier}+tracking+${order.tracking_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-gray-400 hover:text-gray-700 uppercase tracking-widest"
          >
            Track package →
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Guest prompt ─────────────────────────────────────────────────────────────

function GuestPrompt() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🔐</div>
      <h2 className="text-xl font-condensed font-bold uppercase tracking-wide text-gray-900 mb-2">
        Sign in to view your orders
      </h2>
      <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
        Create an account or sign in to track your orders, view history, and manage returns.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/sign-in"
          className="px-6 py-3 bg-[#0A1628] text-white font-condensed font-bold text-sm uppercase tracking-widest rounded hover:bg-[#C41230] transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="px-6 py-3 border border-gray-300 text-gray-700 font-condensed font-bold text-sm uppercase tracking-widest rounded hover:border-gray-500 transition-colors"
        >
          Create account
        </Link>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OrdersPage() {
  const supabase = await createAuthServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-condensed font-bold uppercase tracking-wide text-gray-900 mb-8">
        Order history
      </h1>
      <GuestPrompt />
    </main>
  )

  // Fetch orders via the order_summary view
  const { data: orders, error } = await supabase
    .from('order_summary')
    .select('*')
    .eq('user_id', user.id)          // RLS also enforces this
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-3xl font-condensed font-bold uppercase tracking-wide text-gray-900">
          Order history
        </h1>
        <span className="text-sm text-gray-400">
          {orders?.length ?? 0} orders
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-6">
          Failed to load orders: {error.message}
        </div>
      )}

      {!orders?.length ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-condensed font-bold uppercase tracking-wide text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            When you place an order, it'll show up here.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-[#C41230] text-white font-condensed font-bold text-sm uppercase tracking-widest rounded hover:bg-[#0A1628] transition-colors"
          >
            Shop all tools
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  )
}
