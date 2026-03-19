import Link from 'next/link'
import type { Product } from '@/types/product'

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (!products?.length) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {products.map(p => (
        <Link href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#C41230', marginBottom: '4px', textTransform: 'uppercase' as const }}>{p.brand}</div>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>{p.name}</div>
            <div style={{ fontSize: '16px', fontWeight: '700' }}>${(p.price / 100).toFixed(0)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
