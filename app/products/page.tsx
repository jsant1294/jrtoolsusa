'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
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

type Product = {
  id: string
  name: string
  brand: string
  model: string
  slug: string
  price: number
  stock: number
  category: string
  images: string[]
  voltage?: string
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState(searchParams.get('brand') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('brand', { ascending: true })
      .then(({ data }) => {
        setAllProducts(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = allProducts.filter(p => {
    if (brand && p.brand !== brand) return false
    if (category && p.category !== category) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.model.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const activeTitle = category
    ? CATEGORIES.find(c => c.value === category)?.label ?? category
    : brand ? `${brand} Tools` : 'All Tools & Equipment'

  const btnStyle = (active: boolean, color: string = 'var(--navy)') => ({
    padding: '6px 14px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700 as const,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    background: active ? color : 'white',
    color: active ? 'white' : 'var(--navy)',
    border: `1px solid ${active ? color : '#e8e4dc'}`,
    cursor: 'pointer',
    fontFamily: "'Barlow Condensed', sans-serif",
    transition: 'all 0.15s ease',
  })

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
              {loading ? '...' : `${filtered.length} products`}
            </span>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', maxWidth: '500px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or model number..."
            style={{
              flex: 1, padding: '10px 16px',
              border: '1px solid #e8e4dc', borderRadius: '4px',
              fontSize: '14px', fontFamily: "'Barlow', sans-serif",
              background: 'white', color: 'var(--navy)', outline: 'none',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={btnStyle(false)}>Clear</button>
          )}
        </div>

        {/* Brand Filters */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '8px' }}>
            Shop by Brand
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button onClick={() => setBrand('')} style={btnStyle(!brand)}>All</button>
            {BRANDS.map(b => (
              <button key={b} onClick={() => setBrand(brand === b ? '' : b)} style={btnStyle(brand === b, 'var(--red)')}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '8px' }}>
            Shop by Category
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button onClick={() => setCategory('')} style={btnStyle(!category)}>All</button>
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCategory(category === c.value ? '' : c.value)} style={btnStyle(category === c.value, 'var(--red)')}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '64px 32px', color: 'var(--mid)' }}>
            Loading products...
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filtered.map(p => (
              <Link href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  background: 'white', borderRadius: '8px', padding: '20px',
                  border: '1px solid #e8e4dc', height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {p.images && p.images.length > 0 && (
                    <div style={{ width: '100%', height: '180px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {p.brand}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px', lineHeight: 1.3 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '12px' }}>
                      {p.model}{p.voltage ? ` · ${p.voltage}V` : ''}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #f5f0e8', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>${p.price}</div>
                    {p.stock <= 5 && p.stock > 0 && (
                      <div style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 600 }}>Only {p.stock} left</div>
                    )}
                    {p.stock === 0 && (
                      <div style={{ fontSize: '11px', color: '#999', fontWeight: 600 }}>Out of Stock</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 32px' }}>
            <div style={{ fontSize: '18px', color: 'var(--mid)' }}>No tools found. Try a different filter.</div>
            <button onClick={() => { setBrand(''); setCategory(''); setSearch('') }}
              style={{ ...btnStyle(true), marginTop: '16px', background: 'var(--red)', borderColor: 'var(--red)' }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
