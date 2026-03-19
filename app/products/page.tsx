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
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '6px' }}>★ Shop Tools</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '42px', fontWeight: 800, color: 'var(--navy)' }}>
              {activeTitle}
            </h1>
            <span style={{ fontSize: '14px', color: 'var(--mid)' }}>{products?.length ?? 0} products</span>
          </div>
        </div>

        {/* Search */}
        <form method="GET" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', maxWidth: '480px' }}>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or model number..."
              style={{
                flex: 1, height: '42px',
                border: '1.5px solid var(--light)', borderRight: 'none',
                padding: '0 16px', fontSize: '13px',
                fontFamily: 'Barlow, sans-serif',
                background: 'var(--white)', outline: 'none',
                borderRadius: '3px 0 0 3px',
              }}
            />
            <button type="submit" style={{
              height: '42px', padding: '0 20px',
              background: 'var(--navy)', color: 'var(--white)',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              borderRadius: '0 3px 3px 0',
            }}>Search</button>
          </div>
        </form>

        {/* Brand filters */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '8px' }}>Shop by brand</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Link href="/products" style={{
              padding: '6px 14px', borderRadius: '2px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', textDecoration: 'none',
              background: !brand && !category ? 'var(--navy)' : 'var(--white)',
              color: !brand && !category ? 'var(--white)' : 'var(--steel)',
              border: '1px solid var(--light)',
            }}>All</Link>
            {BRANDS.map(b => (
              <Link key={b} href={`/products?brand=${b}`} style={{
                padding: '6px 14px', borderRadius: '2px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', textDecoration: 'none',
                background: brand === b ? 'var(--navy)' : 'var(--white)',
                color: brand === b ? 'var(--white)' : 'var(--steel)',
                border: '1px solid var(--light)',
              }}>{b}</Link>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '8px' }}>Shop by category</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/products?category=${cat}`} style={{
                padding: '5px 12px', borderRadius: '2px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', textDecoration: 'none',
                background: category === cat ? 'var(--red)' : 'var(--cream)',
                color: category === cat ? 'var(--white)' : 'var(--mid)',
                border: `1px solid ${category === cat ? 'var(--red)' : 'var(--light)'}`,
              }}>{cat}</Link>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {(brand || category || q) && (
          <div style={{ marginBottom: '20px' }}>
            <Link href="/products" style={{
              fontSize: '12px', color: 'var(--red)',
              textDecoration: 'none', fontWeight: 600,
            }}>✕ Clear filters</Link>
          </div>
        )}

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {products?.map(p => (
            <Link href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: 'var(--white)',
                borderRadius: '6px',
                border: '1px solid #e8e4dc',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Image */}
                <div style={{
                  height: '160px',
                  background: '#f8f6f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #f0ede8',
                }}>
                  {p.images?.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                    />
                  ) : (
                    <div style={{ fontSize: '40px', opacity: 0.3 }}>🔧</div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    fontSize: '10px', fontWeight: 700,
                    color: 'var(--red)', textTransform: 'uppercase',
                    letterSpacing: '0.14em', marginBottom: '5px',
                  }}>{p.brand}</div>

                  <div style={{
                    fontSize: '14px', fontWeight: 600,
                    color: 'var(--navy)', lineHeight: 1.3,
                    marginBottom: '5px', flex: 1,
                  }}>{p.name}</div>

                  <div style={{
                    fontSize: '11px', color: 'var(--mid)',
                    marginBottom: '12px', fontFamily: 'monospace',
                  }}>{p.model}</div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f5f0e8', paddingTop: '10px',
                  }}>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '22px', fontWeight: 800, color: 'var(--navy)',
                    }}>
                      ${(p.price / 100).toFixed(0)}
                    </div>
                    <div style={{
                      background: 'var(--red)', color: 'var(--white)',
                      padding: '5px 12px', borderRadius: '2px',
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
                  {p.stock === 0 && (
                    <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, marginTop: '6px' }}>
                      Out of stock
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {(!products || products.length === 0) && (
          <div style={{ textAlign: 'center', padding: '80px 32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>🔧</div>
            <div style={{ fontSize: '18px', color: 'var(--mid)', marginBottom: '12px' }}>No tools found</div>
            <Link href="/products" style={{ color: 'var(--red)', fontWeight: 600, fontSize: '14px' }}>
              Clear filters →
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}