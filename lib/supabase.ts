/**
 * JRToolsUSA — Supabase Client Helpers
 * File: lib/supabase.ts
 *
 * Two clients:
 *   createServerClient() — uses service role key, for RSC + API routes
 *   createBrowserClient() — uses anon key, for client components
 *
 * Requirements:
 *   npm install @supabase/supabase-js @supabase/ssr
 */

import { createClient }         from '@supabase/supabase-js'
import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { cookies }              from 'next/headers'

// ─── Server client (RSC + API routes + scripts) ───────────────────────────────

/**
 * Use in:
 *   - app/products/page.tsx (product listing)
 *   - app/products/[slug]/page.tsx (product detail)
 *   - app/api/checkout/route.ts (validate prices)
 *   - app/api/webhooks/stripe/route.ts (write orders)
 *   - scripts/stripe-sync.ts
 *   - scripts/seed-products.ts
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY — bypasses RLS.
 * NEVER expose this key client-side.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

/**
 * Auth-aware server client for RSC with cookie-based session.
 * Use when you need to know WHO is making the request
 * (e.g. order history page showing only the user's orders).
 */
export async function createAuthServerClient() {
  const cookieStore = await cookies()

  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// ─── Browser client (Client Components) ──────────────────────────────────────

/**
 * Use in:
 *   - components/AddToCartSection.tsx (if reading product data)
 *   - app/account/page.tsx (user profile)
 *   - components/AuthButton.tsx (sign in/out)
 *
 * Uses NEXT_PUBLIC_SUPABASE_ANON_KEY — safe to expose.
 * Subject to RLS policies.
 */
let browserClient: ReturnType<typeof createClient> | null = null

export function createBrowserClient() {
  if (browserClient) return browserClient

  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return browserClient
}
