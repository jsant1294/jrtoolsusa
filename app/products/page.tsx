import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'

const BRANDS = ['DeWalt','Milwaukee','Makita','Bosch','Ridgid','Ryobi','Metabo','Craftsman']
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
    .order('created_at', { ascending: false })

  if (brand)    query = query.eq('brand', brand)
  if (category) query = query.eq('category', category)
  if (q)        query = query.ilike('name', `%${q}%`)

  const { data: products } = await query

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '8px' }}>★ Shop Tools</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '48px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : brand ? `${brand} Tools` : 'All Tools & Equipment'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--mid)' }}>{products?.length ?? 0} products</p>
        </div>

        {/* Search */}
        <form method="GET" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '0', maxWidth: '500px' }}>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or model..."
              style={{
                flex: 1, height: '44px', border: '1.5px solid var(--light)',
                borderRight: 'none', padding: '0 16px', fontSize: '14px',
                fontFamily: 'Barlow, sans-serif', background: 'var(--white)',
                outline: 'none', borderRadius: '3px 0 0 3px',
              }}
            />
            <button type="submit" style={{
              height: '44px', padding: '0 20px',
              background: 'var(--red)', color: 'var(--white)',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '13px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              borderRadius: '0 3px 3px 0',
            }}>Search</button>
          </div>
        </form>

        {/* Brand filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Link href="/products" style={{
            padding: '6px 16px', borderRadius: '2px', fontSize: '12px',
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: !brand ? 'var(--navy)' : 'var(--white)',
            color: !brand ? 'var(--white)' : 'var(--steel)',
            border: '1px solid var(--light)', textDecoration: 'none',
          }}>All Brands</Link>
          {BRANDS.map(b => (
            <Link key={b} href={`/products?brand=${b}`} style={{
              padding: '6px 16px', borderRadius: '2px', fontSize: '12px',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: brand === b ? 'var(--navy)' : 'var(--white)',
              color: brand === b ? 'var(--white)' : 'var(--steel)',
              border: '1px solid var(--light)', textDecoration: 'none',
            }}>{b}</Link>
          ))}
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {CATEGORIES.map(cat => (
            <Link key={cat} href={`/products?category=${cat}`} style={{
              padding: '5px 14px', borderRadius: '2px', fontSize: '11px',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: category === cat ? 'var(--red)' : 'var(--cream)',
              color: category === cat ? 'var(--white)' : 'var(--mid)',
              border: '1px solid var(--light)', textDecoration: 'none',
            }}>{cat}</Link>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {products?.map(p => (
            <Link href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: 'var(--white)', borderRadius: '6px',
                border: '1px solid #e8e4dc', overflow: 'hidden',
                height: '100%', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s, border-color 0.2s',
              }}>
                {/* Image */}
                <div style={{
                  height: '180px', background: '#f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderBottom: '1px solid #f0ede8',
                }}>
                  {p.images?.length > 0 ? (
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
                  ) : (
                    <div style={{ fontSize: '48px' }}>🔧</div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '6px' }}>{p.brand}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3, marginBottom: '6px', flex: 1 }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '12px' }}>{p.model} · {p.voltage}</div>

                  <div style={{ borderTop: '1px solid #f5f0e8', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>
                      ${(p.price / 100).toFixed(0)}
                    </div>
                    <div style={{
                      background: 'var(--navy)', color: 'var(--white)',
                      padding: '6px 14px', borderRadius: '2px',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '11px', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>View</div>
                  </div>

                  {p.stock <= 5 && p.stock > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 600, marginTop: '6px' }}>
                      ⚠ Only {p.stock} left
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 32px', color: 'var(--mid)' }}>
            No tools found. <Link href="/products" style={{ color: 'var(--red)' }}>Clear filters</Link>
          </div>
        )}
      </div>
    </main>
  )
}