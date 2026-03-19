/**
 * JRToolsUSA — Admin Products Page
 * File: app/admin/products/page.tsx
 *
 * Full product management:
 *  - Search by name, brand, model
 *  - Filter by category and brand
 *  - Toggle active/inactive
 *  - Edit product inline
 *  - Add new product (opens modal)
 *  - Delete product (soft delete via active=false)
 *
 * Server component for data — client components for interactions.
 */

import { createServerClient } from '@/lib/supabase'
import ProductsTable          from '@/components/admin/ProductsTable'
import AddProductButton       from '@/components/admin/AddProductButton'
import type { Metadata }      from 'next'

export const metadata: Metadata = { title: 'Products' }
export const revalidate = 0  // always fresh — admin needs real-time data

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; brand?: string; page?: string }
}) {
  const supabase = createServerClient()
  const page     = parseInt(searchParams.page ?? '1')
  const limit    = 25
  const from     = (page - 1) * limit
  const to       = from + limit - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('brand', { ascending: true })
    .order('name', { ascending: true })
    .range(from, to)

  if (searchParams.q) {
    query = query.or(
      `name.ilike.%${searchParams.q}%,model.ilike.%${searchParams.q}%,brand.ilike.%${searchParams.q}%`
    )
  }
  if (searchParams.category) query = query.eq('category', searchParams.category)
  if (searchParams.brand)    query = query.eq('brand', searchParams.brand)

  const { data: products, count, error } = await query

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          Showing <strong>{products?.length ?? 0}</strong> of <strong>{count ?? 0}</strong> products
        </div>
        <AddProductButton />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">
          Error loading products: {error.message}
        </div>
      )}

      <ProductsTable
        products={products ?? []}
        total={count ?? 0}
        page={page}
        limit={limit}
      />
    </div>
  )
}
