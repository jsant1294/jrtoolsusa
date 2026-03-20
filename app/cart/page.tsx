/**
 * JRToolsUSA — Cart Page
 * File: app/cart/page.tsx
 *
 * Client component — reads from Zustand cart store.
 * Shows line items, quantity controls, order summary,
 * free shipping progress, and checkout button.
 */

'use client'

import { useCartStore, formatPrice, freeShippingRemaining } from '@/lib/cart'
import Image from 'next/image'
import Link  from 'next/link'
import { useState } from 'react'

// ─── Free shipping progress bar ───────────────────────────────────────────────

function ShippingProgress({ total }: { total: number }) {
  const threshold  = 9900
  const remaining  = freeShippingRemaining(total, threshold)
  const pct        = Math.min(100, Math.round((total / threshold) * 100))
  const qualified  = remaining === 0

  return (
    <div style={{
      background: 'rgba(212, 160, 23, 0.05)',
      border: '1px solid rgba(212, 160, 23, 0.2)',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '8px'
      }}>
        <span style={{ color: qualified ? '#16a34a' : 'var(--navy)' }}>
          {qualified
            ? '✓ You qualify for free shipping!'
            : `Add ${formatPrice(remaining)} more for free shipping`}
        </span>
        <span style={{ color: 'var(--mid)' }}>${(threshold / 100).toFixed(0)} threshold</span>
      </div>
      <div style={{ height: '8px', background: '#e8e4dc', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '4px',
            transition: 'all 0.5s ease',
            background: qualified ? '#16a34a' : 'var(--red)',
            width: `${pct}%`,
          }}
        />
      </div>
    </div>
  )
}

// ─── Cart line item ────────────────────────────────────────────────────────────

function CartLineItem({
  item,
  onQty,
  onRemove,
}: {
  item: any
  onQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
      {/* Image */}
      <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} width={80} height={80} className="object-contain p-1" />
        ) : (
          <span className="text-3xl">🔧</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">
          {item.name}
        </div>
        <div className="text-xs text-red-600 font-bold tracking-widest uppercase mb-3">
          {formatPrice(item.price)} each
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => onQty(item.productId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold text-lg"
            >−</button>
            <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
            <button
              onClick={() => onQty(item.productId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold text-lg"
            >+</button>
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="text-xs text-gray-400 hover:text-red-600 underline"
          >Remove</button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right flex-shrink-0">
        <div className="text-base font-bold text-gray-900 font-condensed">
          {formatPrice(item.price * item.quantity)}
        </div>
        {item.quantity > 1 && (
          <div className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.price)}</div>
        )}
      </div>
    </div>
  )
}

// ─── Order summary panel ──────────────────────────────────────────────────────

function OrderSummary({
  subtotal,
  onCheckout,
  loading,
}: {
  subtotal: number
  onCheckout: () => void
  loading: boolean
}) {
  const threshold     = 9900
  const freeShipping  = subtotal >= threshold
  const shippingCost  = freeShipping ? 0 : 1200   // $12 standard
  const estimatedTax  = Math.round(subtotal * 0.0825) // 8.25% TX sales tax
  const total         = subtotal + shippingCost + estimatedTax

  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid #e8e4dc',
      borderRadius: '8px',
      padding: '24px',
      position: 'sticky' as const,
      top: '24px',
    }}>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'var(--navy)',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e8e4dc',
      }}>
        Order summary
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
          <span style={{ color: 'var(--mid)' }}>Subtotal</span>
          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{formatPrice(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
          <span style={{ color: 'var(--mid)' }}>Shipping</span>
          <span style={{ fontWeight: 600, color: freeShipping ? '#16a34a' : 'var(--navy)' }}>
            {freeShipping ? 'FREE' : formatPrice(shippingCost)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
          <span style={{ color: 'var(--mid)' }}>Est. tax (TX)</span>
          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{formatPrice(estimatedTax)}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid #e8e4dc',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--navy)',
        }}>
          <span>Estimated total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '14px',
          fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          borderRadius: '4px',
          border: 'none',
          background: loading ? '#ccc' : 'var(--red)',
          color: 'var(--white)',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.3s',
          marginBottom: '16px',
        }}
      >
        {loading ? 'Redirecting to checkout...' : 'Proceed to checkout'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--mid)' }}>
          <span>🔒</span>
          <span>Secure checkout powered by Stripe</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--mid)' }}>
          <span>↩️</span>
          <span>30-day hassle-free returns</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--mid)' }}>
          <span>🚚</span>
          <span>Ships from Alpharetta, GA within 24 hrs</span>
        </div>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e8e4dc' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--mid)', marginBottom: '8px' }}>We accept</div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--mid)', fontFamily: 'monospace' }}>
          <span style={{ border: '1px solid #e8e4dc', padding: '4px 8px', borderRadius: '4px' }}>VISA</span>
          <span style={{ border: '1px solid #e8e4dc', padding: '4px 8px', borderRadius: '4px' }}>MC</span>
          <span style={{ border: '1px solid #e8e4dc', padding: '4px 8px', borderRadius: '4px' }}>AMEX</span>
          <span style={{ border: '1px solid #e8e4dc', padding: '4px 8px', borderRadius: '4px' }}>DISC</span>
        </div>
      </div>
    </div>
  )
}

// ─── Empty cart ────────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div style={{ textAlign: 'center', padding: '96px 32px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '28px',
        fontWeight: 800,
        color: 'var(--navy)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '8px',
      }}>
        Your cart is empty
      </h2>
      <p style={{ color: 'var(--mid)', marginBottom: '32px', fontSize: '15px' }}>
        Looks like you haven't added any tools yet.
      </p>
      <a
        href="/products"
        style={{
          display: 'inline-block',
          background: 'var(--red)',
          color: 'var(--white)',
          padding: '12px 32px',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          textDecoration: 'none',
          borderRadius: '4px',
          transition: 'background 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#a00b24'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--red)'}
      >
        Shop all tools
      </a>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, totalPrice } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const subtotal   = totalPrice()
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  async function handleCheckout() {
    if (!items.length) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items:      items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl:  `${window.location.origin}/cart`,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Checkout failed')
      if (!data.url) throw new Error('No checkout URL returned')

      // Redirect to Stripe hosted checkout
      window.location.href = data.url

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px', background: 'var(--cream)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '36px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--navy)',
        }}>
          Shopping cart
          {totalItems > 0 && (
            <span style={{ marginLeft: '16px', fontSize: '18px', color: 'var(--mid)', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal' }}>
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              fontSize: '13px',
              color: 'var(--mid)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
          {/* Line items */}
          <div>
            <ShippingProgress total={subtotal} />

            {error && (
              <div style={{
                background: 'rgba(196, 18, 48, 0.05)',
                border: '1px solid rgba(196, 18, 48, 0.2)',
                color: 'var(--red)',
                fontSize: '14px',
                padding: '12px 16px',
                borderRadius: '4px',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <div style={{
              background: 'var(--white)',
              border: '1px solid #e8e4dc',
              borderRadius: '8px',
            }}>
              {items.map(item => (
                <CartLineItem
                  key={item.productId}
                  item={item}
                  onQty={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <a
                href="/products"
                style={{
                  fontSize: '13px',
                  color: 'var(--mid)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ← Continue shopping
              </a>
              <div style={{ fontSize: '13px', color: 'var(--mid)' }}>
                All prices in USD · Tax calculated at checkout
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <OrderSummary
              subtotal={subtotal}
              onCheckout={handleCheckout}
              loading={loading}
            />
          </div>
        </div>
      )}
    </main>
  )
}
