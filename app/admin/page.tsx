/**
 * JRToolsUSA — Admin Overview Page
 * File: app/admin/page.tsx
 *
 * Shows key metrics, recent orders, low stock alerts,
 * and top selling products at a glance.
 */

import { createServerClient } from '@/lib/supabase'
import Link                   from 'next/link'
import type { Metadata }      from 'next'

export const metadata: Metadata = { title: 'Overview' }
export const revalidate = 60

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-800',
    paid:       'bg-blue-100 text-blue-800',
    processing: 'bg-violet-100 text-violet-800',
    shipped:    'bg-purple-100 text-purple-800',
    delivered:  'bg-green-100 text-green-800',
    cancelled:  'bg-red-100 text-red-800',
  }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminOverviewPage() {
  const supabase = createServerClient()

  // Fetch all data in parallel
  const [
    { data: recentOrders },
    { data: lowStockProducts },
    { data: productCount },
    { data: todayOrders },
  ] = await Promise.all([
    supabase
      .from('order_summary')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),

    supabase
      .from('low_stock_products')
      .select('*')
      .limit(5),

    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('active', true),

    supabase
      .from('orders')
      .select('total', { count: 'exact' })
      .gte('created_at', new Date().toISOString().split('T')[0]),
  ])

  const todayRevenue = todayOrders?.reduce((s, o) => s + (o.total ?? 0), 0) ?? 0
  const todayCount   = todayOrders?.length ?? 0
  const lowStockCount = lowStockProducts?.length ?? 0
  const activeProductCount = productCount?.length ?? 0

  return (
    <div>
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Revenue today',    value: fmt(todayRevenue),               sub: `${todayCount} orders` },
          { label: 'Orders today',     value: String(todayCount),              sub: 'Across all statuses' },
          { label: 'Active products',  value: String(activeProductCount), sub: '8 brands · 8 categories' },
          { label: 'Low stock alerts', value: String(lowStockCount),           sub: 'Need reorder soon', alert: lowStockCount > 0 },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{m.label}</div>
            <div className={`font-condensed text-3xl font-bold leading-none mb-1 ${m.alert ? 'text-red-600' : 'text-navy-900'}`}>
              {m.value}
            </div>
            <div className="text-xs text-gray-400">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h2 className="font-condensed font-bold text-sm uppercase tracking-wide">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-red-600 font-medium hover:underline">View all →</Link>
          </div>
          <div>
            {recentOrders?.map(order => (
              <div key={order.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <span className="font-mono text-xs text-gray-400 w-16 flex-shrink-0">
                  #{order.id.slice(0, 6).toUpperCase()}
                </span>
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{order.customer_name}</span>
                <span className="font-condensed font-bold text-sm w-16 text-right">{fmt(order.total)}</span>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h2 className="font-condensed font-bold text-sm uppercase tracking-wide">Low stock alerts</h2>
            <Link href="/admin/stock" className="text-xs text-red-600 font-medium hover:underline">View all →</Link>
          </div>
          <div>
            {lowStockProducts?.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.brand} · {p.model}</div>
                </div>
                <span className={`font-condensed font-bold text-lg w-8 text-center flex-shrink-0 ${p.stock <= 2 ? 'text-red-600' : 'text-amber-600'}`}>
                  {p.stock}
                </span>
                <div className="w-20 flex-shrink-0">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.stock <= 2 ? 'bg-red-500' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
