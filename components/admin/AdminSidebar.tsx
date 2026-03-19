export default function AdminSidebar({ adminName }: { adminName?: string }) {
  return (
    <aside style={{
      width: '250px',
      background: 'var(--navy)',
      color: 'white',
      padding: '24px',
      minHeight: '100vh',
    }}>
      <h2 style={{ marginBottom: '24px', fontFamily: "'Barlow Condensed', sans-serif" }}>Admin</h2>
      {adminName && <p style={{ fontSize: '12px', marginBottom: '24px', opacity: 0.8 }}>{adminName}</p>}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a href="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
        <a href="/admin/products" style={{ color: 'white', textDecoration: 'none' }}>Products</a>
        <a href="/admin/orders" style={{ color: 'white', textDecoration: 'none' }}>Orders</a>
      </nav>
    </aside>
  )
}
