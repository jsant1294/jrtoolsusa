/** @type {import('next').NextConfig} */
const nextConfig = {

  // ── Output ───────────────────────────────────────────────
  output: 'standalone',

  // ── Images ───────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      // Supabase Storage — your product images
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Unsplash — placeholder images during development
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // ── Compiler ─────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ── Performance ──────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ── Experimental ─────────────────────────────────────────
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // ── Headers ──────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/api/webhooks/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },

  // ── Redirects ─────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/shop',  destination: '/products', permanent: true },
      { source: '/store', destination: '/products', permanent: true },
    ]
  },

  // ── Turbopack ────────────────────────────────────────────
  turbopack: {},
}

module.exports = nextConfig
