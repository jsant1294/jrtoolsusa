import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'
import { formatPrice } from '@/lib/cart'

export default async function NewArrivalsPage() {
  const supabase = createServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(24)

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '48px 32px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '8px' }}>
            ★ Just In
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '16px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '48px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
              New Arrivals
            </h1>
            <span style={{ fontSize: '16px', color: 'var(--mid)' }}>{products?.length ?? 0} products</span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--mid)', marginTop: '8px' }}>
            The latest tools added to our inventory. Fresh stock, unbeatable prices.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {products?.map(p => (
            <Link href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #e8e4dc', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-block', background: 'var(--navy)', color: 'white', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '2px', marginBottom: '12px', alignSelf: 'flex-start' }}>New</div>
                {p.images && p.images.length > 0 && (
                  <div style={{ width: '100%', height: '180px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.brand}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px', lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--mid)', marginBottom: '12px' }}>{p.model}{p.voltage ? ` · ${p.voltage}V` : ''}</div>
                </div>
                <div style={{ borderTop: '1px solid #f5f0e8', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>{formatPrice(p.price)}</div>
                  {p.stock <= 5 && p.stock > 0 && <div style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 600 }}>Only {p.stock} left</div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
