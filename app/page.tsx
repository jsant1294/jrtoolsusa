export default function Home() {
  return (
    <main className="bg-cream">
      {/* Hero Section with Background */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1a2a3f 100%)', color: 'var(--white)', padding: '0', position: 'relative', minHeight: '600px', display: 'flex', alignItems: 'center' }} className="hero-section">
        {/* Background Image Placeholder */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/jrhero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
          zIndex: 1,
        }}></div>

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.5) 0%, rgba(26, 42, 63, 0.5) 100%)',
          zIndex: 2,
        }}></div>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 32px', position: 'relative', zIndex: 3, textAlign: 'center' }} className="hero-content">
          <div style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }} className="hero-badge">
            ★ Tools for Less · America's Best Prices ★
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '64px', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }} className="hero-headline">
            Pro-Grade Power Tools at Contractor Prices
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#ccc', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }} className="hero-desc">
            DeWalt, Milwaukee, Makita, and more. Ships same day. 30-day returns. Free shipping over $99.
          </p>
          <a href="/products" style={{
            display: 'inline-block',
            background: 'var(--red)',
            color: 'var(--white)',
            padding: '16px 48px',
            borderRadius: '4px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginRight: '16px',
            marginBottom: '16px',
            textDecoration: 'none',
            transition: 'background 0.3s',
          }}>
            Shop Now
          </a>
          <a href="#" style={{
            display: 'inline-block',
            background: 'transparent',
            border: '2px solid var(--light)',
            color: 'var(--white)',
            padding: '14px 48px',
            borderRadius: '4px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.3s',
          }}>
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '64px 32px', background: 'var(--white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { icon: '💰', title: 'Unbeatable Prices', desc: 'Up to 40% off retail' },
            { icon: '✈', title: 'Ships Same Day', desc: 'Order before 2pm CT' },
            { icon: '🏆', title: 'Less Price Guaranteed', desc: 'America\'s lowest prices' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'SSL encrypted payments' },
          ].map((feature, i) => (
            <div key={i}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {feature.title}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--mid)', lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'var(--navy)', color: 'var(--white)', padding: '48px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
          Ready to upgrade your toolkit?
        </h2>
        <p style={{ fontSize: '16px', color: '#bbb', marginBottom: '24px' }}>Browse our full selection of pro-grade tools.</p>
        <a href="/products" style={{
          display: 'inline-block',
          background: 'var(--red)',
          color: 'var(--white)',
          padding: '14px 40px',
          borderRadius: '4px',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'background 0.3s',
        }}>
          View All Tools
        </a>
      </section>
    </main>
  )
}
