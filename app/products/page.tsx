import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'

const BRANDS = ['Milwaukee','DeWalt','Makita','Bosch','Ridgid','Ryobi','Metabo']
const CATEGORIES = ['drills','saws','grinders','nailers','sanders','measuring','combo','accessories']

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; category?: string; q?: string }>
}) {
  const { brand, category, q } = await searchParams
  const supabase = createServerClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('brand', { ascending: true })

  if (brand)    query = query.eq('brand', brand)
  if (category) query = query.eq('category', category)
  if (q)        query = query.ilike('name', `%${q}%`)

  const { data: products } = await query

  const activeTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : brand ? `${brand} Tools` : 'All Tools & Equipment'

  return (
    <main className="bg-[#F5F0E8] min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#C41230] mb-2">★ Shop Tools</div>
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="font-barlow-condensed text-4xl md:text-5xl font-bold text-[#0A1628]">
              {activeTitle}
            </h1>
            <span className="text-sm text-gray-500 font-medium">{products?.length ?? 0} products</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-end justify-between border-b border-gray-200 pb-8">
          
          {/* Search */}
          <form method="GET" className="w-full max-w-md">
            <div className="flex w-full">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by name or model number..."
                className="flex-1 h-11 border border-gray-300 border-r-0 px-4 text-sm font-barlow bg-white outline-none focus:border-[#0A1628] transition-colors rounded-l-sm"
              />
              <button type="submit" className="h-11 px-6 bg-[#0A1628] text-white border-none cursor-pointer font-barlow-condensed text-sm font-bold tracking-widest uppercase rounded-r-sm hover:bg-[#C41230] transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex-1 w-full md:w-auto">
             <div className="mb-4">
               <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Shop by brand</div>
               <div className="flex gap-2 flex-wrap">
                  <Link href="/products" className={`px-3 py-1.5 rounded-sm font-barlow-condensed text-xs font-bold tracking-wider uppercase border transition-all ${!brand && !category ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                    All
                  </Link>
                  {BRANDS.map(b => (
                    <Link key={b} href={`/products?brand=${b}`} className={`px-3 py-1.5 rounded-sm font-barlow-condensed text-xs font-bold tracking-wider uppercase border transition-all ${brand === b ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>
                      {b}
                    </Link>
                  ))}
               </div>
             </div>
             
             <div>
               <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Shop by category</div>
               <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <Link key={cat} href={`/products?category=${cat}`} className={`px-3 py-1.5 rounded-sm font-barlow-condensed text-xs font-bold tracking-wider uppercase border transition-all ${category === cat ? 'bg-[#C41230] text-white border-[#C41230]' : 'bg-[#F5F0E8] text-gray-500 border-gray-300 hover:border-gray-400'}`}>
                      {cat}
                    </Link>
                  ))}
               </div>
             </div>
          </div>
        </div>

        {/* Clear filters */}
        {(brand || category || q) && (
          <div className="mb-6">
            <Link href="/products" className="text-xs text-[#C41230] font-bold hover:underline">
              ✕ Clear filters
            </Link>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map(p => (
            <Link href={`/products/${p.slug}`} key={p.id} className="group block h-full">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:border-gray-300">
                {/* Image */}
                <div className="h-48 bg-[#f8f6f2] flex items-center justify-center border-b border-gray-100 p-6 relative">
                  {p.images?.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-4xl opacity-20">🔧</div>
                  )}
                  {/* Badge if stock low? */}
                  {p.stock <= 5 && p.stock > 0 && (
                     <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                        Low Stock
                     </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[10px] font-bold text-[#C41230] uppercase tracking-[0.15em] mb-2">
                    {p.brand}
                  </div>

                  <div className="text-sm font-bold text-[#0A1628] leading-snug mb-2 flex-1 group-hover:text-[#C41230] transition-colors">
                    {p.name}
                  </div>

                  <div className="text-xs text-gray-500 font-mono mb-4">
                    {p.model}
                  </div>

                  <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
                    <div className="font-barlow-condensed text-2xl font-bold text-[#0A1628]">
                      ${(p.price / 100).toFixed(0)}
                    </div>
                    <div className="bg-[#0A1628] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest group-hover:bg-[#C41230] transition-colors">
                      View
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
