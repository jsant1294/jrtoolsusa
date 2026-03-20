export default function LocalPickup() {
  return (
    <section style={{
      background: 'var(--navy)',
      padding: '40px 32px',
      borderTop: '3px solid var(--red)',
      borderBottom: '3px solid var(--red)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px',
          }}>
            ★ Alpharetta, GA
          </div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '32px', fontWeight: 800,
            color: 'var(--white)', margin: '0 0 8px',
            letterSpacing: '0.02em',
          }}>
            Local Pickup Available
          </h2>
          <p style={{ fontSize: '14px', color: '#8899bb', margin: 0 }}>
            Skip the shipping — pick up your tools same day in Alpharetta
          </p>
        </div>

        {/* Contact Buttons */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          gap: '12px', justifyContent: 'center',
        }}>

          {/* Call Now */}
          <a href="tel:14045657099" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--red)', color: 'var(--white)',
            padding: '14px 24px', borderRadius: '4px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            Call Now
          </a>

          {/* Text Us */}
          <a href="sms:14045657099" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'var(--white)',
            padding: '14px 24px', borderRadius: '4px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            Text Us
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/14045657099" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#25D366',
            color: 'var(--white)',
            padding: '14px 24px', borderRadius: '4px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          {/* Facebook Messenger */}
          <a href="https://m.me/jrtoolsusa" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#0084FF',
            color: 'var(--white)',
            padding: '14px 24px', borderRadius: '4px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
            </svg>
            Messenger
          </a>
        </div>

        {/* Address */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '13px', color: '#556', margin: 0 }}>
            📍 Alpharetta, GA · Mon–Sat 8am–6pm · Call ahead for same-day pickup
          </p>
        </div>

      </div>
    </section>
  )
}
