export default function Home() {
  return (
    <main className="bg-cream">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[#0A1628]">
          <img 
            src="/jrhero.jpg" 
            alt="Power Tools Background" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/70 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full pt-12 pb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#C41230]/10 border border-[#C41230]/20 rounded-full px-3 py-1 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#C41230]"></span>
              <span className="text-xs font-bold text-[#C41230] uppercase tracking-widest">Same-day shipping</span>
            </div>
            
            <h1 className="font-barlow-condensed text-6xl md:text-8xl font-bold leading-none text-white mb-6 drop-shadow-xl">
              Pro Tools.<br />
              <span className="text-[#C41230]">Less Price.</span>
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 max-w-lg leading-relaxed drop-shadow-md font-medium">
              DeWalt, Milwaukee, Makita & more. Free shipping over $99. 30-day returns.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="/products" className="bg-[#C41230] hover:bg-[#A00E26] text-white px-10 py-4 rounded font-barlow-condensed font-bold text-xl uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-red-900/30">
                Shop Now <span>→</span>
              </a>
              <a href="/products" className="border-2 border-white/20 hover:border-white hover:bg-white/10 text-white px-10 py-4 rounded font-barlow-condensed font-bold text-xl uppercase tracking-wider transition-all backdrop-blur-sm">
                View Brands
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {[
               { icon: '🏷️', title: 'Up to 40% Off', subtitle: 'vs retail price' },
               { icon: '🚀', title: 'Same-Day Ship', subtitle: 'Order by 2pm CT' },
               { icon: '⭐', title: 'Price Match', subtitle: 'Lowest guaranteed' },
               { icon: '🔒', title: 'SSL Secure', subtitle: 'Encrypted checkout' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors group w-full max-w-[280px]">
                <div className="w-16 h-16 bg-gray-50 group-hover:bg-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm border border-gray-100 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-barlow-condensed text-xl font-bold text-[#0A1628] uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0A1628] text-white py-16 px-8 text-center border-t border-white/5">
        <h2 className="font-barlow-condensed text-4xl font-bold mb-4">
          Ready to upgrade your toolkit?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          Browse our full selection of pro-grade tools from top brands like Milwaukee, DeWalt, and Makita.
        </p>
        <a href="/products" className="inline-block bg-[#C41230] hover:bg-[#A00E26] text-white px-10 py-3.5 rounded font-barlow-condensed font-bold text-sm tracking-[0.15em] uppercase transition-all shadow-lg hover:shadow-red-900/20 transform hover:-translate-y-0.5">
          View All Tools
        </a>
      </section>
    </main>
  )
}
