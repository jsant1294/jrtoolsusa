import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function ProductsPage() {
  const supabase = createServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <main style={{ padding: '48px 32px', background: 'var(--cream)' }} className="products-page">
      {/* Page Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 48px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '8px' }}>
          ★ Shop Tools
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '48px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
          All Tools & Equipment
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--mid)', marginBottom: '16px' }}>
          ({products?.length ?? 0} items)
        </p>
      </div>

      {/* Product Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }} className="product-grid">
        {products?.map(p => (
          <Link href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              background: 'var(--white)',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid #e8e4dc',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Product Image */}
              {p.images && p.images.length > 0 && (
                <div style={{
                  width: '100%',
                  height: '180px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img 
                    src={p.images[0]} 
                    alt={p.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}

              {/* Brand Tag */}
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {p.brand}
              </div>

              {/* Product Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px', lineHeight: 1.3 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '12px', lineHeight: 1.4 }}>
                  {p.model} · {p.voltage}V
                </div>
              </div>

              {/* Price & Stock */}
              <div style={{ borderTop: '1px solid #f5f0e8', paddingTop: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
                  ${(p.price / 100).toFixed(0)}
                </div>
                {p.stock <= 5 && p.stock > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 600 }}>
                    ⚠ Only {p.stock} left
                  </div>
                )}
                {p.stock === 0 && (
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {!products || products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 32px' }}>
          <div style={{ fontSize: '18px', color: 'var(--mid)' }}>No tools available at the moment.</div>
        </div>
      )}
    </main>
  )
}