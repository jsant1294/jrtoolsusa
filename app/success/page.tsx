/**
 * JRToolsUSA — Checkout Success Page
 * File: app/success/page.tsx
 *
 * Shown after Stripe redirects back post-payment.
 * Reads the session_id from URL, fetches order details,
 * clears the cart, and shows a confirmation.
 */

'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams }     from 'next/navigation'
import { useCartStore }        from '@/lib/cart'
import { formatPrice }         from '@/lib/cart'
import Link                    from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderDetail = {
  id:              string
  status:          string
  total:           number
  customer_email:  string
  customer_name:   string
  shipping_address: {
    line1:       string
    line2?:      string
    city:        string
    state:       string
    postal_code: string
    country:     string
  }
  created_at:      string
  items: Array<{
    name:     string
    quantity: number
    price:    number
  }>
}

// ─── Animated checkmark ───────────────────────────────────────────────────────

function SuccessIcon() {
  return (
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  )
}

// ─── Order items list ─────────────────────────────────────────────────────────

function OrderItemsList({ items }: { items: OrderDetail['items'] }) {
  return (
    <div style={{ border: '1px solid #e8e4dc', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
      <div style={{ background: 'var(--navy)', padding: '12px 16px' }}>
        <h3 style={{
          color: 'var(--white)',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '14px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Items ordered
        </h3>
      </div>
      <div>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            fontSize: '14px',
            borderBottom: i < items.length - 1 ? '1px solid #e8e4dc' : 'none',
          }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{item.name}</div>
              <div style={{ color: 'var(--mid)', fontSize: '12px' }}>Qty: {item.quantity}</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--navy)' }}>
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── What happens next ────────────────────────────────────────────────────────

function NextSteps() {
  const steps = [
    { icon: '📧', title: 'Confirmation email', body: 'Check your inbox — a receipt is on its way.' },
    { icon: '📦', title: 'Order processing', body: 'We\'ll pick, pack and ship within 24 hours.' },
    { icon: '🚚', title: 'Tracking number', body: 'You\'ll get a tracking email once it ships.' },
    { icon: '🛠️', title: 'Need help?', body: 'Call 1-800-JR-TOOLS Mon–Fri 7am–6pm CT.' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '32px',
    }}>
      {steps.map(s => (
        <div key={s.title} style={{
          background: '#f8f7f5',
          border: '1px solid #e8e4dc',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>{s.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--mid)', lineHeight: 1.4 }}>{s.body}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SuccessPageContent() {
  const searchParams            = useSearchParams()
  const sessionId               = searchParams.get('session_id')
  const clearCart               = useCartStore(s => s.clearCart)
  const [order, setOrder]       = useState<OrderDetail | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    // Clear the cart immediately
    clearCart()

    if (!sessionId) {
      setError('No session ID found.')
      setLoading(false)
      return
    }

    // Fetch order details from our API
    fetch(`/api/orders/by-session?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setOrder(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid var(--red)',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'var(--mid)', fontSize: '14px' }}>Loading your order...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 32px', background: 'var(--cream)' }}>
      <SuccessIcon />

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '36px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--navy)',
          marginBottom: '8px',
        }}>
          Order confirmed!
        </h1>
        <p style={{ color: 'var(--mid)', fontSize: '15px' }}>
          {order
            ? `Thanks ${order.customer_name?.split(' ')[0] ?? 'for your order'}! We'll have it on its way within 24 hours.`
            : 'Your payment was successful. Thank you for shopping with JRToolsUSA!'}
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(212, 160, 23, 0.05)',
          border: '1px solid rgba(212, 160, 23, 0.2)',
          color: 'var(--mid)',
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '24px',
        }}>
          Note: {error} — but your order was placed. Check your email for confirmation.
        </div>
      )}

      {order && (
        <>
          {/* Order summary card */}
          <div style={{
            background: 'var(--white)',
            border: '1px solid #e8e4dc',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: '14px',
              marginBottom: '16px',
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mid)', marginBottom: '4px' }}>Order ID</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--navy)', fontSize: '16px' }}>
                  #{order.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mid)', marginBottom: '4px' }}>Total</div>
                <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '18px' }}>{formatPrice(order.total)}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mid)', marginBottom: '4px' }}>Email</div>
                <div style={{ color: 'var(--navy)', fontSize: '14px' }}>{order.customer_email}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mid)', marginBottom: '4px' }}>Status</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 600, fontSize: '14px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }} />
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {order.shipping_address && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid #e8e4dc' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mid)', marginBottom: '4px' }}>Ships to</div>
                <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.5 }}>
                  {order.shipping_address.line1}
                  {order.shipping_address.line2 && `, ${order.shipping_address.line2}`}
                  <br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </div>
              </div>
            )}
          </div>

          {order.items?.length > 0 && <OrderItemsList items={order.items} />}
        </>
      )}

      <NextSteps />

      {/* CTA buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <a
          href="/orders"
          style={{
            textAlign: 'center',
            padding: '16px',
            border: '2px solid var(--navy)',
            color: 'var(--navy)',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            borderRadius: '4px',
            textDecoration: 'none',
            transition: 'all 0.3s',
          }}
        >
          View order history
        </a>
        <a
          href="/products"
          style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--red)',
            color: 'var(--white)',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            borderRadius: '4px',
            textDecoration: 'none',
            transition: 'background 0.3s',
          }}
        >
          Continue shopping
        </a>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
