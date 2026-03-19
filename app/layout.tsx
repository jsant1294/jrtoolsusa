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
    <header className="sticky top-0 z-50 bg-[#0A1628] border-b border-[#0A1628]/50 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16 h-16 flex items-center justify-between">
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
      </div>
    </header>
  )
}


function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white py-12 px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-8">
        {/* Brand Column */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="font-barlow-condensed text-2xl font-bold mb-4">
            JR<span className="text-[#C41230]">Tools</span>USA
          </div>
          <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
            Dallas, TX. Veteran owned. Providing pro-grade tools at unbeatable prices since 2018. Save up to 40% vs retail.
          </p>
          <div className="flex flex-wrap gap-2">
            {['★ Veteran Owned', '★ Ships Same Day', '★ 30-Day Returns'].map(b => (
              <span key={b} className="bg-white/5 border border-white/10 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Links Columns */}
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
          }
        ].map((column) => (
           <div key={column.title}>
             <h4 className="font-barlow-condensed text-lg font-bold uppercase tracking-wider mb-4 text-[#C41230]">
               {column.title}
             </h4>
             <ul className="space-y-3">
               {column.links.map(link => (
                 <li key={link.label}>
                   <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                     {link.label}
                   </a>
                 </li>
               ))}
             </ul>
           </div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} JRToolsUSA. All rights reserved.
      </div>
    </footer>
  )
}