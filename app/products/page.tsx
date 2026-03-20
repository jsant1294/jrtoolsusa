import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'

const BRANDS = ['Milwaukee', 'DeWalt', 'Makita', 'Bosch', 'Ridgid', 'Ryobi', 'Metabo']
const CATEGORIES = [
  { value: 'drills', label: 'Drills' },
  { value: 'saws', label: 'Saws' },
  { value: 'grinders', label: 'Grinders' },
  { value: 'nailers', label: 'Nailers' },
  { value: 'sanders', label: 'Sanders' },
  { value: 'batteries', label: 'Batteries' },
  { value: 'combo', label: 'Combo Kits' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'measuring', label: 'Measuring' },
]

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
    ? CATEGORIES.find(c => c.value === category)?.label ?? category
    : brand ? `${brand} Tools` : 'All Tools & Equipment'

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '48px 32px' }} className="products-page">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '8px' }}>
            ★ Shop Tools
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '16px', marginBottom: '8px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '48px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
              {activeTitle}
            </h1>
            <span style={{ fontSize: '16px', color: 'var(--mid)' }}>
              {products?.length ?? 0} products
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <form method="GET" style={{ marginBottom: '24px', display: 'flex', gap: '8px', maxWidth: '500px' }}>
          {brand && <input type="hidden" name="brand" value={brand} />}
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name or model number..."
            style={{
              flex: 1,
              padding: '10px 16px',
              border: '1px solid #e8e4dc',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: "'Barlow', sans-serif",
              background: 'white',
              color: 'var(--navy)',
              outline: 'none',
            }}
          />
          <button type="submit" style={{
            background: 'var(--navy)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}>
            Search
          </button>
        </form>

        {/* Brand Filters */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '8px' }}>
            Shop by Brand
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Link href={`/products${category ? `?category=${category}` : ''}`} style={{
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: !brand ? 'var(--navy)' : 'white',
              color: !brand ? 'white' : 'var(--navy)',
              border: '1px solid',
              borderColor: !brand ? 'var(--navy)' : '#e8e4dc',
            }}>All</Link>
            {BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${b}${category ? `&category=${category}` : ''}`} style={{
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                background: brand === b ? 'var(--red)' : 'white',
                color: brand === b ? 'white' : 'var(--navy)',
                border: '1px solid',
                borderColor: brand === b ? 'var(--red)' : '#e8e4dc',
              }}>{b}</Link>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '8px' }}>
            Shop by Category
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Link href={`/products${brand ? `?brand=${brand}` : ''}`} style={{
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: !category ? 'var(--navy)' : 'white',
              color: !category ? 'white' : 'var(--navy)',
              border: '1px solid',
              borderColor: !category ? 'var(--navy)' : '#e8e4dc',
            }}>All</Link>
            {CATEGORIES.map(c => (
              <Link key={c.value} href={`/products?category=${c.value}${brand ? `&brand=${brand}` : ''}`} style={{
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                background: category === c.value ? 'var(--red)' : 'white',
                color: category === c.value ? 'white' : 'var(--navy)',
                border: '1px solid',
                borderColor: category === c.value ? 'var(--red)' : '#e8e4dc',
              }}>{c.label}</Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }} className="product-grid">
          {products?.map(p => (
            <Link href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e8e4dc',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}>
                {/* Product Image */}
                {p.images && p.images.length > 0 && (
                  <div style={{ width: '100%', height: '180px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}

                {/* Brand */}
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {p.brand}
                </div>

                {/* Name & Model */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px', lineHeight: 1.3 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '12px' }}>
                    {p.model}{p.voltage ? ` · ${p.voltage}V` : ''}
                  </div>
                </div>

                {/* Price & Stock */}
                <div style={{ borderTop: '1px solid #f5f0e8', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>
                    ${p.price}
                  </div>
                  {p.stock <= 5 && p.stock > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 600 }}>⚠ Only {p.stock} left</div>
                  )}
                  {p.stock === 0 && (
                    <div style={{ fontSize: '11px', color: '#999', fontWeight: 600 }}>Out of Stock</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!products || products.length === 0) && (
          <div style={{ textAlign: 'center', padding: '64px 32px' }}>
            <div style={{ fontSize: '18px', color: 'var(--mid)' }}>No tools found. Try a different filter.</div>
            <Link href="/products" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--red)', fontWeight: 600 }}>Clear filters</Link>
          </div>
        )}
      </div>
    </main>
  )
}
