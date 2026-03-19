export default function ProductsTable({ 
  products = [], 
  total = 0, 
  page = 1, 
  limit = 10 
}: { 
  products?: any[]
  total?: number
  page?: number
  limit?: number
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e8e4dc',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e8e4dc' }}>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Name</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Brand</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Price</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Stock</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr style={{ borderBottom: '1px solid #e8e4dc' }}>
              <td style={{ padding: '12px' }} colSpan={5}>No products yet</td>
            </tr>
          ) : (
            products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e8e4dc' }}>
                <td style={{ padding: '12px' }}>{p.name}</td>
                <td style={{ padding: '12px' }}>{p.brand}</td>
                <td style={{ padding: '12px' }}>${(p.price / 100).toFixed(2)}</td>
                <td style={{ padding: '12px' }}>{p.stock_qty ?? 0} units</td>
                <td style={{ padding: '12px' }}>Edit</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        Page {page} · Showing {products.length} of {total} products
      </div>
    </div>
  )
}
