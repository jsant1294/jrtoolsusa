export default function OrdersTable({ 
  orders = [], 
  total = 0, 
  page = 1, 
  limit = 10 
}: { 
  orders?: any[]
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
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Order ID</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Customer</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Date</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Status</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 700 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr style={{ borderBottom: '1px solid #e8e4dc' }}>
              <td style={{ padding: '12px' }} colSpan={5}>No orders yet</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #e8e4dc' }}>
                <td style={{ padding: '12px' }}>{order.id}</td>
                <td style={{ padding: '12px' }}>{order.customer_email}</td>
                <td style={{ padding: '12px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>{order.status}</td>
                <td style={{ padding: '12px' }}>View</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        Page {page} · Showing {orders.length} of {total} orders
      </div>
    </div>
  )
}
