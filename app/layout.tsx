import type { Metadata } from 'next'
import './globals.css'
import ChatWidget from '@/components/ChatWidget'
import MobileNav from '@/components/MobileNav'

export const metadata: Metadata = {
  title: 'JRToolsUSA — Pro Grade Power Tools',
  description: 'Veteran owned. Alpharetta GA. DeWalt, Milwaukee, Makita and more. Free shipping over $99.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />
        <style>{`
          @media (max-width: 768px) {
            .mobile-menu-btn { display: flex !important; }
            .desktop-nav { display: none !important; }
            .desktop-shop-now { display: none !important; }
            .footer-grid { grid-template-columns: 1fr !important; }
            .footer-bottom { flex-direction: column !important; text-align: center !important; }
          }
        `}</style>
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}

function Nav() {
  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '3px solid var(--red)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <span style={{ fontSize: '28px' }}>🇺🇸</span>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '0.04em' }}>
            JR<span style={{ color: 'var(--red)' }}>Tools</span>USA
          </div>
          <div style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--mid)' }}>
            Tools for Less
          </div>
        </div>
      </a>

      <nav className="desktop-nav" style={{ display: 'flex', gap: '24px' }}>
        {[
          { label: 'Shop', href: '/products' },
          { label: 'Brands', href: '/brands' },
          { label: 'Deals', href: '/deals' },
          { label: 'About', href: '/about' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{
            fontSize: '12px', fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--steel)', textDecoration: 'none',
          }}>
            {item.label}
          </a>
        ))}
      </nav>

      <a href="/products" className="desktop-shop-now" style={{
        background: 'var(--red)', color: 'var(--white)',
        padding: '10px 20px', borderRadius: '3px',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', textDecoration: 'none',
      }}>
        Shop Now
      </a>

      <MobileNav />
    </header>
  )
}

function Footer() {
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
              { label: '1-800-JR-TOOLS', href: 'tel:1-800-587-8657' },
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
