'use client'

import { useState } from 'react'

const NAV_SECTIONS = [
  {
    label: 'Shop',
    links: [
      { label: 'All Tools', href: '/products' },
      { label: 'Combo Kits', href: '/products?category=combo' },
      { label: 'New Arrivals', href: '/products/new' },
      { label: 'Clearance & Deals', href: '/deals' },
    ]
  },
  {
    label: 'Browse',å
    links: [
      { label: 'Brands', href: '/brands' },
      { label: 'About Us', href: '/about' },
    ]
  }
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          flexDirection: 'column',
          gap: '5px',
          zIndex: 200,
        }}
      >
        <span style={{
          display: 'block', width: '22px', height: '2px',
          background: 'var(--navy)', transition: 'all 0.3s ease',
          transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none',
        }} />
        <span style={{
          display: 'block', width: '22px', height: '2px',
          background: 'var(--navy)', transition: 'all 0.3s ease',
          opacity: open ? 0 : 1,
        }} />
        <span style={{
          display: 'block', width: '22px', height: '2px',
          background: 'var(--navy)', transition: 'all 0.3s ease',
          transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
        }} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div style={{
          position: 'fixed',
          top: '64px', left: 0, right: 0,
          background: 'var(--white)',
          borderBottom: '3px solid var(--red)',
          zIndex: 150,
          padding: '8px 24px 24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <div style={{
                fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--mid)', padding: '14px 0 4px',
              }}>
                {section.label}
              </div>
              {section.links.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '13px 0',
                    borderBottom: '1px solid #f0ece4',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '17px', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--navy)', textDecoration: 'none',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}

          {/* Shop Now CTA */}
          <a
            href="/products"
            onClick={() => setOpen(false)}
            style={{
              display: 'block', marginTop: '20px',
              background: 'var(--red)', color: 'white',
              padding: '14px 20px', borderRadius: '3px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '14px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Shop Now →
          </a>
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, top: '64px',
            background: 'rgba(0,0,0,0.3)', zIndex: 140,
          }}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
          .desktop-shop-now { display: none !important; }
        }
      `}</style>
    </>
  )
}
