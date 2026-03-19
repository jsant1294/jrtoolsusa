import Link from 'next/link'

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1a2a3f 100%)', color: 'var(--white)', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '56px', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}>
            About JRToolsUSA
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>
            America's trusted discount tool reseller. Pro-grade tools at unbeatable prices since 2018.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '64px 32px', background: 'var(--white)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '36px', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
                Our Story
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--mid)', marginBottom: '16px' }}>
                JRToolsUSA was founded in 2018 to bring quality, pro-grade tools at discount prices to contractors and homeowners across America.
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--mid)', marginBottom: '16px' }}>
                Today, we operate from a 5,000 sq ft warehouse in South Dallas, stocking over 1,500 SKUs from the industry's most trusted brands: DeWalt, Milwaukee, Makita, Bosch, Festool, and more.
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--mid)' }}>
                Every order ships same-day with full manufacturer warranty. We stand behind our products and our customers.
              </p>
            </div>
            <div style={{
              background: '#f0e8dc',
              borderRadius: '8px',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--mid)',
              fontSize: '14px',
            }}>
              Placeholder: Company photo
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '64px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '36px', fontWeight: 800, color: 'var(--navy)', textAlign: 'center', marginBottom: '48px' }}>
            Our Values
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            {[
              { title: 'Unbeatable Prices', desc: 'Up to 40% off retail. We pass savings to contractors and homeowners.' },
              { title: 'Price Match Guarantee', desc: 'Find it cheaper elsewhere? We\'ll match any legitimate price.' },
              { title: 'Quality Guaranteed', desc: 'Only authentic, warranty-backed tools. No fakes, no seconds.' },
              { title: 'Fast Shipping', desc: 'Same-day ship from Dallas. 24-48hr delivery across Texas.' },
              { title: 'Expert Support', desc: 'Tool experts on staff. Real advice, not sales pitch.' },
              { title: 'Easy Returns', desc: '30-day returns, no questions asked. Your satisfaction first.' },
            ].map((value, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                border: '1px solid #e8e4dc',
                borderRadius: '8px',
                padding: '24px',
              }}>
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--navy)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}>
                  {value.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--mid)', lineHeight: 1.6 }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ background: 'var(--navy)', color: 'var(--white)', padding: '48px 32px', textAlign: 'center', marginTop: '48px' }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
          Have Questions?
        </h2>
        <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '24px' }}>
          Talk to a real person. We're here Mon–Fri, 7am–6pm CT.
        </p>
        <a href="tel:1-800-577-8657" style={{
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
          Call 1-800-JR-TOOLS
        </a>
      </section>

      {/* Back Link */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px' }}>
        <Link href="/products" style={{ color: 'var(--red)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
          ← Back to all tools
        </Link>
      </div>
    </main>
  )
}
