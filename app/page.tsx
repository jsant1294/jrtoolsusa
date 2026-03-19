export default function Home() {
  return (
    <main className="bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center bg-[#0A1628] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C41230] opacity-10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#4338ca] opacity-10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="pt-12 pb-20">
            <div className="inline-flex items-center gap-2 bg-[#C41230]/10 border border-[#C41230]/20 rounded-full px-3 py-1 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C41230]"></span>
              <span className="text-xs font-bold text-[#C41230] uppercase tracking-widest">Same-day shipping</span>
            </div>
            
            <h1 className="font-barlow-condensed text-6xl md:text-7xl font-bold leading-none text-white mb-6">
              Pro Tools.<br />
              <span className="text-[#C41230]">Less Price.</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 max-w-md leading-relaxed">
              DeWalt, Milwaukee, Makita & more. Free shipping over $99. 30-day returns.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="/products" className="bg-[#C41230] hover:bg-[#A00E26] text-white px-8 py-4 rounded font-barlow-condensed font-bold text-lg uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-red-900/20">
                Shop Now <span>→</span>
              </a>
              <a href="/products" className="border border-white/30 hover:border-white hover:bg-white/5 text-white px-8 py-4 rounded font-barlow-condensed font-bold text-lg uppercase tracking-wider transition-all">
                View Brands
              </a>
            </div>
          </div>

          {/* Right Image (Placeholder for tool collage) */}
          <div className="hidden md:block relative h-full min-h-[500px]">
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent z-10 bottom-0 h-1/3"></div>
             <img src="/jrhero.jpg" alt="Power Tools" className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl border border-white/5" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
             { icon: '🏷️', title: 'Up to 40% Off', subtitle: 'vs retail price' },
             { icon: '🚀', title: 'Same-Day Ship', subtitle: 'Order by 2pm CT' },
             { icon: '⭐', title: 'Price Match', subtitle: 'Lowest guaranteed' },
             { icon: '🔒', title: 'SSL Secure', subtitle: 'Encrypted checkout' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-4">
                {item.icon}
              </div>
              <h3 className="font-barlow-condensed text-lg font-bold text-[#0A1628] uppercase tracking-wide mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {item.subtitle}
              </p>
            </div>
          ))}
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
