import LocalPickup from '@/components/LocalPickup'

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0A1628]">
          <img
            src="/jrhero.jpg"
            alt="Power Tools Background"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full pt-16 pb-24 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-xs font-bold text-[#D4A017] uppercase tracking-widest">
              ★ TOOLS FOR LESS · AMERICA'S BEST PRICES ★
            </span>
          </div>
          <h1 className="font-barlow-condensed text-6xl md:text-7xl lg:text-8xl font-bold leading-none text-white mb-6 drop-shadow-xl">
            Pro-Grade Power Tools at<br />
            <span className="text-white">Contractor Prices</span>
          </h1>
          <div className="flex justify-center">
            <p className="text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed drop-shadow-md font-medium text-center">
              DeWalt, Milwaukee, Makita, and more. Ships same day.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/products" className="bg-[#C41230] hover:bg-[#A00E26] px-8 py-3.5 rounded font-barlow-condensed font-bold text-sm uppercase tracking-widest transition-all shadow-lg" style={{ color: '#FFFFFF' }}>
              Shop Now
            </a>
            <a href="/deals" className="border-2 border-white hover:bg-white/20 px-8 py-3.5 rounded font-barlow-condensed font-bold text-sm uppercase tracking-widest transition-all" style={{ color: '#FFFFFF' }}>
              Deals Now
            </a>
          </div>
          <div className="mt-5 font-bold text-center" style={{ color: '#D4A017', fontSize: '1.15rem', letterSpacing: '0.01em' }}>
            <span role="img" aria-label="fire">🔥</span> Power Tool Deals Below Retail<br />
            <span style={{ fontWeight: 700 }}>Milwaukee &bull; DeWalt &bull; Makita</span><br />
            <span style={{ fontWeight: 700 }}>New &amp; Open Box — Limited Stock</span>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-b border-gray-100 flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '💰', title: 'UNBEATABLE PRICES', subtitle: 'Up to 40% off retail' },
              { icon: '🚀', title: 'SAME-DAY SHIP', subtitle: 'Order before 2pm CT' },
              { icon: '🏆', title: 'PRICE MATCH', subtitle: 'Lowest guaranteed' },
              { icon: '🔒', title: 'SSL SECURE', subtitle: 'Encrypted checkout' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-barlow-condensed text-sm font-bold text-[#0A1628] uppercase tracking-wider mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Pickup */}
      <LocalPickup />

      {/* CTA Section */}
      <section className="bg-[#0A1628] text-white py-16 border-t border-white/5 flex flex-col items-center">
        <div className="w-full max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-barlow-condensed text-4xl font-bold mb-4">
            Ready to upgrade your toolkit?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
            Browse our full selection of pro-grade tools from top brands like Milwaukee, DeWalt, and Makita.
          </p>
          <a href="/products" className="inline-block bg-[#C41230] hover:bg-[#A00E26] text-white px-10 py-3.5 rounded font-barlow-condensed font-bold text-sm tracking-[0.15em] uppercase transition-all shadow-lg transform hover:-translate-y-0.5">
            View All Tools
          </a>
        </div>
      </section>
    </main>
  )
}
