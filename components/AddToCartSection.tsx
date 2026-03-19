/**
 * JRToolsUSA — AddToCartSection
 * File: components/AddToCartSection.tsx
 *
 * Client component — handles quantity, variant selection, and cart interaction.
 * Keeps the parent product page as a pure RSC.
 */

'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cart'
import type { Product } from '@/types/product'

type Props = { product: Product }

export default function AddToCartSection({ product }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded]       = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const inStock = product.stock > 0

  function handleAdd() {
    if (!inStock) return
    addItem({ productId: product.id, name: product.name, price: product.price, quantity, image: product.images?.[0] })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium w-20">Quantity</span>
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-bold">{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-400">{product.stock} available</span>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className={`w-full py-4 text-sm font-bold font-condensed tracking-widest uppercase rounded transition-all
          ${inStock
            ? added
              ? 'bg-green-600 text-white'
              : 'bg-[#0A1628] text-white hover:bg-[#C41230]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        {!inStock ? 'Out of stock' : added ? '✓ Added to cart' : 'Add to cart'}
      </button>

      {/* Buy now */}
      {inStock && (
        <button className="w-full py-4 text-sm font-bold font-condensed tracking-widest uppercase rounded border-2 border-[#0A1628] text-[#0A1628] hover:bg-[#0A1628] hover:text-white transition-all">
          Buy now
        </button>
      )}
    </div>
  )
}
