export default function Footer() {
  return (
    <footer style={{
      background: 'var(--navy)',
      backgroundImage: 'url("/footer.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '48px 32px 24px',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(10,22,40,0.85) 0%, rgba(26,42,63,0.85) 100%)',
        zIndex: 0,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          paddingBottom: '32px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: '24px',
        }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: 800, color: 'var(--white)', marginBottom: '8px' }}>
              JR<span style={{ color: 'var(--red)' }}>Tools</span>USA
            </div>
            <div style={{ fontSize: '13px', color: '#556', lineHeight: 1.6, maxWidth: '220px' }}>
              Alpharetta, GA. Unbeatable tool prices since 2018. Save up to 40%.
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              {['★ Tools for Less', '★ Ships Same Day', '★ 30-Day Returns'].map(b => (
                <span key={b} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '4px 10px', borderRadius: '2px',
                  fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#8899bb',
                }}>{b}</span>
              ))}
            </div>
          </div>

          {[
            { title: 'Shop', links: [
              { label: 'All Tools', href: '/products' },
              { label: 'Combo Kits', href: '/products?category=combo' },
              { label: 'New Arrivals', href: '/products/new' },
              { label: 'Clearance', href: '/deals' },
            ]},
            { title: 'Company', links: [
              { label: 'About Us', href: '/about' },
              { label: 'Brands', href: '/brands' },
              { label: 'Deals', href: '/deals' },
              { label: 'Careers', href: '#' },
            ]},
            { title: 'Support', links: [
              { label: 'Order Status', href: '/orders' },
              { label: 'Shipping Info', href: '#' },
              { label: 'FAQ', href: '#' },
              { label: 'Contact Us', href: '#' },
            ]},
            { title: 'Contact', links: [
              { label: '(404) 565-7099', href: 'tel:+14045657099' },
              { label: 'info@jrtoolsusa.com', href: 'mailto:info@jrtoolsusa.com' },
              { label: 'Alpharetta, GA 30009', href: 'https://www.google.com/maps/search/JRToolsUSA+Alpharetta+GA' },
              { label: 'Mon-Fri 7am-6pm CT', href: '#' },
            ]},
          ].map(col => (
            <div key={col.title}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '14px',
              }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {col.links.map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: '13px', color: '#667', textDecoration: 'none' }}>{l.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        }}>
          <span style={{ fontSize: '11px', color: '#445' }}>© 2025 JRToolsUSA.com · All rights reserved</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['★ Secure Checkout', '★ SSL Encrypted', '★ Stripe Payments'].map(t => (
              <span key={t} style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#445',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
