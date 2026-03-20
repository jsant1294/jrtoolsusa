import { Suspense } from 'react'
import ProductsClient from './ProductsClient'

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--mid)', fontFamily: "'Barlow', sans-serif", fontSize: '16px' }}>Loading products...</p>
      </div>
    }>
      <ProductsClient />
    </Suspense>
  )
}
