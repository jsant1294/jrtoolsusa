/**
 * JRToolsUSA — Admin Layout + Auth Guard
 * File: app/admin/layout.tsx
 *
 * Protects all /admin routes.
 * Only users with is_admin = true in their profile can access.
 * Everyone else gets redirected to /sign-in.
 */

import { redirect }              from 'next/navigation'
import { createAuthServerClient } from '@/lib/supabase'
import AdminSidebar              from '@/components/admin/AdminSidebar'
import AdminTopbar               from '@/components/admin/AdminTopbar'

export const metadata = {
  title: { default: 'Admin', template: '%s | JRToolsUSA Admin' },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createAuthServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → sign in page
  if (!user) redirect('/sign-in?next=/admin')

  // Check admin flag in profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single()

  // Not an admin → redirect home
  if (!profile?.is_admin) redirect('/?error=unauthorized')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      <AdminSidebar adminName={profile.full_name ?? user.email ?? 'Admin'} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AdminTopbar />
        <main style={{ flex: 1, padding: '20px 24px', background: '#f1f5f9' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

/**
 * To make yourself an admin:
 * Run this in Supabase SQL Editor (replace with your user ID):
 *
 * ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean default false;
 * UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';
 */
