import Link from 'next/link'

export default function DealsPage() {
  const deals = [
    { badge: 'Save $150', title: 'DeWalt 20V Drill Kit', original: 199, sale: 149 },
    { badge: 'Save $200', title: 'Milwaukee M18 Impact Driver', original: 349, sale: 149 },
    { badge: 'Save $100', title: 'Makita Jigsaw Bundle', original: 299, sale: 199 },
    { badge: 'Save $120', title: 'Bosch Circular Saw', original: 220, sale: 100 },
    { badge: 'Limited Stock', title: 'Festool Dust Extractor', original: 495, sale: 399 },
    { badge: 'Final Sale', title: 'Milwaukee Hackzall Saw', original: 149, sale: 89 },
  ]

  return (
    <main style={{ background: 'var(--cream)', padding: '48px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '8px' }}>
            ★ Limited Time
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '48px', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
            Current Deals & Discounts
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--mid)', maxWidth: '600px' }}>
            Hand-picked deals on pro-grade tools. Limited stock, so grab yours while supplies last.
          </p>
        </div>

        {/* Deals Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {deals.map((deal, i) => (
            <div key={i} style={{
              background: 'var(--white)',
              border: '1px solid #e8e4dc',
              borderRadius: '8px',
              padding: '24px',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}>
              {/* Badge */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '24px',
                background: 'var(--red)',
                color: 'var(--white)',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {deal.badge}
              </div>

              {/* Content */}
              <div style={{ paddingTop: '12px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--navy)',
                  marginBottom: '12px',
                  lineHeight: 1.3,
                }}>
                  {deal.title}
                </h3>

                {/* Pricing */}
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e8e4dc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: 'var(--red)',
                    }}>
                      ${deal.sale}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--mid)',
                      textDecoration: 'line-through',
                    }}>
                      ${deal.original}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                    Save ${deal.original - deal.sale}
                  </div>
                </div>

                {/* CTA */}
                <a href="/products" style={{
                  display: 'block',
                  textAlign: 'center',
                  background: 'var(--navy)',
                  color: 'var(--white)',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  transition: 'background 0.3s',
                }}>
                  View Deal
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div style={{ background: 'rgba(212, 160, 23, 0.05)', border: '1px solid rgba(212, 160, 23, 0.2)', borderRadius: '8px', padding: '24px', marginBottom: '48px' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            ★ Member Benefits
          </h3>
          <ul style={{ fontSize: '14px', color: 'var(--mid)', lineHeight: 1.8 }}>
            <li style={{ marginBottom: '4px' }}>✓ Exclusive deals emailed weekly</li>
            <li style={{ marginBottom: '4px' }}>✓ Early access to flash sales</li>
            <li style={{ marginBottom: '4px' }}>✓ Free shipping on all orders</li>
            <li>✓ Priority customer support</li>
          </ul>
        </div>

        {/* Back Link */}
        <Link href="/products" style={{ color: 'var(--red)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
          ← Back to all tools
        </Link>
      </div>
    </main>
  )
}
