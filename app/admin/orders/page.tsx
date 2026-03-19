/**
 * JRToolsUSA — Admin Orders Page
 * File: app/admin/orders/page.tsx
 *
 * Full order management:
 *  - View all orders with status, customer, total
 *  - Filter by status, date range
 *  - Mark as shipped + enter tracking number
 *  - Trigger shipping email via Resend
 *  - Mark as delivered
 *  - Issue refund via Stripe
 */

import { createServerClient }  from '@/lib/supabase'
import OrdersTable             from '@/components/admin/OrdersTable'
import type { Metadata }       from 'next'

export const metadata: Metadata = { title: 'Orders' }
export const revalidate = 0

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string; page?: string }
}) {
  const supabase = createServerClient()
  const page     = parseInt(searchParams.page ?? '1')
  const limit    = 20
  const from     = (page - 1) * limit
  const to       = from + limit - 1

  let query = supabase
    .from('order_summary')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.q)      query = query.ilike('customer_email', `%${searchParams.q}%`)

  const { data: orders, count, error } = await query

  // Status counts for tab bar
  const { data: statusCounts } = await supabase
    .from('orders')
    .select('status')

  const counts = (statusCounts ?? []).reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      {/* Status tab bar */}
      <div className="flex gap-0 border-b-2 border-gray-200 mb-4">
        {[
          { label: 'All', value: '', count: count ?? 0 },
          { label: 'Pending',    value: 'pending',    count: counts.pending    ?? 0 },
          { label: 'Processing', value: 'processing', count: counts.processing ?? 0 },
          { label: 'Shipped',    value: 'shipped',    count: counts.shipped    ?? 0 },
          { label: 'Delivered',  value: 'delivered',  count: counts.delivered  ?? 0 },
        ].map(tab => (
          <a
            key={tab.value}
            href={`/admin/orders${tab.value ? `?status=${tab.value}` : ''}`}
            className={`px-4 py-2 font-condensed font-bold text-xs uppercase tracking-wide border-b-2 -mb-0.5 transition-colors
              ${searchParams.status === tab.value || (!searchParams.status && !tab.value)
                ? 'text-red-600 border-red-600'
                : 'text-gray-400 border-transparent hover:text-gray-700'
              }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </a>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">
          {error.message}
        </div>
      )}

      <OrdersTable
        orders={orders ?? []}
        total={count ?? 0}
        page={page}
        limit={limit}
      />
    </div>
  )
}
