import Link from 'next/link'

export default function BrandsPage() {
  const brands = [
    { name: 'DeWalt', description: 'Professional cordless tools and power equipment', icon: '⚙️' },
    { name: 'Milwaukee', description: 'Heavy-duty tools for demanding jobsites', icon: '🔧' },
    { name: 'Makita', description: 'Japanese precision and reliability', icon: '🛠️' },
    { name: 'Bosch', description: 'German engineering for homeowners and pros', icon: '⚡' },
    { name: 'Festool', description: 'Premium dust collection and finishing tools', icon: '💨' },
    { name: 'Hilti', description: 'Professional construction tools', icon: '🏗️' },
  ]

  return (
    <main style={{ background: 'var(--cream)', padding: '48px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '8px' }}>
            ★ Authorized Reseller
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '48px', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
            Premium Tool Brands
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--mid)', maxWidth: '600px' }}>
            We partner with the industry's most trusted tool manufacturers. All products are authentic, backed by warranty, and in stock.
          </p>
        </div>

        {/* Brands Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {brands.map(brand => (
            <div key={brand.name} style={{
              background: 'var(--white)',
              border: '1px solid #e8e4dc',
              borderRadius: '8px',
              padding: '32px 24px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{brand.icon}</div>
              <h3 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--navy)',
                marginBottom: '8px',
              }}>
                {brand.name}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--mid)', lineHeight: 1.6, marginBottom: '16px' }}>
                {brand.description}
              </p>
              <a href="/products" style={{
                display: 'inline-block',
                color: 'var(--red)',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: 'none',
              }}>
                View {brand.name} tools →
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--navy)', color: 'var(--white)', padding: '48px 32px', borderRadius: '8px', textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Don't see your favorite brand?
          </h2>
          <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '24px' }}>
            Contact us and we'll source it for you.
          </p>
          <a href="#" style={{
            display: 'inline-block',
            background: 'var(--red)',
            color: 'var(--white)',
            padding: '12px 32px',
            borderRadius: '4px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            textDecoration: 'none',
          }}>
            Request a Tool
          </a>
        </div>

        {/* Back Link */}
        <Link href="/products" style={{ color: 'var(--red)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
          ← Back to all tools
        </Link>
      </div>
    </main>
  )
}
