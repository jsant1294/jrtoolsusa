import type { Metadata } from 'next'
import './globals.css'
import ChatWidget from '@/components/ChatWidget'
import MobileNav from '@/components/MobileNav'
import Footer from '@/components/Footer'

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
