import type { Metadata } from 'next'
import './globals.css'
import ChatWidget from '@/components/ChatWidget'

export const metadata: Metadata = {
  title: 'JRToolsUSA — Pro Grade Power Tools',
  description: 'Veteran owned. Dallas TX. DeWalt, Milwaukee, Makita and more. Free shipping over $99.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />
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
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-8 bg-[#0A1628] border-b border-[#0A1628]/50 text-white">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 group">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#C41230] text-white font-bold transition-transform group-hover:scale-105">
          JR
        </div>
        <span className="font-barlow-condensed text-xl font-bold uppercase tracking-wider text-white">
          JRToolsUSA
        </span>
      </a>

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-8">
        <a href="/products" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Shop</a>
        <a href="/products" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Brands</a>
        <a href="/products" className="bg-[#C41230] hover:bg-[#A00E26] text-white px-5 py-2 rounded text-sm font-bold uppercase tracking-wide transition-all">
          Shop Now
        </a>
      </nav>

      {/* Mobile Menu Icon (Placeholder) */}
      <button className="md:hidden text-white">
        <span className="text-2xl">☰</span>
      </button>
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
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.85) 0%, rgba(26, 42, 63, 0.85) 100%)',
        zIndex: 0,
      }} />
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '32px', paddingBottom: '32px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        marginBottom: '24px',
      }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '22px', fontWeight: 800,
            color: 'var(--white)', marginBottom: '8px',
          }}>
            JR<span style={{ color: 'var(--red)' }}>Tools</span>USA
          </div>
          <div style={{ fontSize: '13px', color: '#556', lineHeight: 1.6, maxWidth: '220px' }}>
            Dallas, TX. Unbeatable tool prices since 2018. Save up to 40%.
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
          { 
            title: 'Shop', 
            links: [
              { label: 'All Tools', href: '/products' }, 
              { label: 'Combo Kits', href: '/products' }, 
              { label: 'New Arrivals', href: '/products' }, 
              { label: 'Clearance', href: '/deals' }
            ] 
          },
          { 
            title: 'Company', 
            links: [
              { label: 'About Us', href: '/about' }, 
              { label: 'Brands', href: '/brands' }, 
              { label: 'Deals', href: '/deals' }, 
              { label: 'Careers', href: '#' }
            ] 
          },
          { 
            title: 'Support', 
            links: [
              { label: 'Order Status', href: '/orders' }, 
              { label: 'Shipping Info', href: '#' }, 
              { label: 'FAQ', href: '#' }, 
              { label: 'Contact Us', href: '#' }
            ] 
          },
          { 
            title: 'Contact', 
            content: [
              { type: 'link', label: '1-800-JR-TOOLS', href: 'tel:1-800-587-8657' },
              { type: 'link', label: 'info@jrtoolsusa.com', href: 'mailto:info@jrtoolsusa.com' },
              { type: 'text', label: 'Dallas, TX 75201' },
              { type: 'text', label: 'Mon–Fri 7am–6pm CT' }
            ]
          }
        ].map(col => (
          <div key={col.title}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: '14px',
            }}>{col.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {('links' in col && col.links) ? col.links.map(l => (
                <a key={l.label} href={l.href} style={{ fontSize: '13px', color: '#667', textDecoration: 'none' }}>{l.label}</a>
              )) : ('content' in col && col.content) ? col.content.map((item, idx) => 
                item.type === 'link' ? (
                  <a key={idx} href={item.href} style={{ fontSize: '13px', color: '#667', textDecoration: 'none' }}>{item.label}</a>
                ) : (
                  <span key={idx} style={{ fontSize: '13px', color: '#667' }}>{item.label}</span>
                )
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: '12px', color: '#445',
        flexWrap: 'wrap', gap: '16px',
      }}>
        <span style={{ fontSize: '11px' }}>© 2025 JRToolsUSA.com · All rights reserved</span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {['★ Secure Checkout', '★ SSL Encrypted', '★ Stripe Payments'].map(t => (
            <span key={t} style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>{t}</span>
          ))}
        </div>
      </div>
      </div>
    </footer>
  )
}