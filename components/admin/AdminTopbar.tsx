export default function AdminTopbar() {
  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #e8e4dc',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px' }}>Admin Panel</h1>
      <button style={{
        background: 'var(--red)',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}>
        Logout
      </button>
    </div>
  )
}
