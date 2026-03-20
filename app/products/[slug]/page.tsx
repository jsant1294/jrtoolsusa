import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartSection from '@/components/AddToCartSection'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createServerClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!product) return notFound()

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '48px 32px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <Link href="/products" style={{ color: 'var(--red)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
          ← Back to all tools
        </Link>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginTop: '48px' }}>
          {/* Image Area */}
          <div style={{
            background: 'var(--white)',
            borderRadius: '8px',
            padding: '32px',
            border: '1px solid #e8e4dc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            overflow: 'hidden',
          }}>
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  maxHeight: '400px',
                }}
              />
            ) : (
              <div style={{ color: 'var(--mid)', fontSize: '14px' }}>
                No image available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Brand */}
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              {product.brand}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Model & Voltage */}
            <div style={{ fontSize: '14px', color: 'var(--mid)', marginBottom: '24px' }}>
              {product.model} · {product.voltage}V
            </div>

            {/* Price */}
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
              ${(product.price / 100).toFixed(0)}
            </div>

            {/* Stock Status */}
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '32px',
              padding: '8px 0',
              color: product.stock > 0 ? '#16a34a' : 'var(--red)',
            }}>
              {product.stock > 0 ? (
                <>✓ In stock — {product.stock} available</>
              ) : (
                <>❌ Out of stock</>
              )}
            </div>

            {/* Add to Cart Button */}
            <AddToCartSection product={product as anynow
              
            } />

            {/* Description */}
            <div style={{ borderTop: '1px solid #e8e4dc', paddingTop: '32px' }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                About This Tool
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--mid)' }}>
                {product.description}
              </p>
            </div>

            {/* Specs */}
            <div style={{ borderTop: '1px solid #e8e4dc', paddingTop: '32px', marginTop: '32px' }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                Specifications
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', fontSize: '14px' }}>
                <div><span style={{ color: 'var(--mid)', display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Brand</span><span style={{ color: 'var(--navy)', fontWeight: 600 }}>{product.brand}</span></div>
                <div><span style={{ color: 'var(--mid)', display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Model</span><span style={{ color: 'var(--navy)', fontWeight: 600 }}>{product.model}</span></div>
                <div><span style={{ color: 'var(--mid)', display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Voltage</span><span style={{ color: 'var(--navy)', fontWeight: 600 }}>{product.voltage}V</span></div>
                <div><span style={{ color: 'var(--mid)', display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Category</span><span style={{ color: 'var(--navy)', fontWeight: 600, textTransform: 'capitalize' }}>{product.category}</span></div>
              </div>
            </div>

            {/* Reviews */}
            {product.rating && (
              <div style={{ borderTop: '1px solid #e8e4dc', paddingTop: '32px', marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)' }}>{product.rating}/5</div>
                  <div style={{ fontSize: '13px', color: 'var(--mid)' }}>({product.review_count} reviews)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}