export default function AddProductButton() {
  return (
    <button style={{
      background: 'var(--red)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 700,
      fontSize: '14px',
    }}>
      + Add Product
    </button>
  )
}
