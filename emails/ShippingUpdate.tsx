/**
 * JRToolsUSA — Shipping Update Email
 * File: emails/ShippingUpdate.tsx
 *
 * Sent when admin marks an order as shipped in the admin dashboard.
 * Includes tracking number, carrier link, estimated delivery,
 * and visual progress indicator.
 *
 * Install: npm install @react-email/components
 */

import {
  Body, Button, Column, Container, Head,
  Heading, Hr, Html, Link, Preview,
  Row, Section, Text,
} from '@react-email/components'
import { SITE_URL } from '@/lib/resend'

// ─── Types ────────────────────────────────────────────────────────────────────

type ShippingItem = {
  name:     string
  brand:    string
  model:    string
  quantity: number
  price:    number
}

type ShippingUpdateProps = {
  orderId:          string
  customerName:     string
  trackingNumber:   string
  carrier:          'UPS' | 'FedEx' | 'USPS' | 'DHL' | string
  estimatedDelivery?: string
  items?:           ShippingItem[]
  total?:           number
}

// ─── Tracking URL builder ─────────────────────────────────────────────────────

function trackingUrl(carrier: string, trackingNumber: string): string {
  const urls: Record<string, string> = {
    UPS:   `https://www.ups.com/track?tracknum=${trackingNumber}`,
    FedEx: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    USPS:  `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    DHL:   `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${trackingNumber}`,
  }
  return urls[carrier] ?? `https://www.google.com/search?q=${carrier}+tracking+${trackingNumber}`
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}

const firstName = (name: string) => name.split(' ')[0]

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  body:       { backgroundColor: '#f4f4f5', fontFamily: "'Barlow', Arial, sans-serif", margin: 0 },
  container:  { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
  header:     { backgroundColor: '#0A1628', padding: '28px 32px' },
  logoName:   { fontSize: '20px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.04em', margin: 0 },
  logoSub:    { fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#3a5070', margin: '2px 0 0' },
  hero:       { backgroundColor: '#0A1628', padding: '0 32px 28px', textAlign: 'center' as const },
  heroH1:     { fontSize: '30px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1', margin: '0 0 8px', textAlign: 'center' as const },
  heroSub:    { fontSize: '13px', color: '#6b8090', lineHeight: '1.6', margin: 0, textAlign: 'center' as const },
  trackBox:   { border: '2px solid #C41230', borderRadius: '4px', padding: '16px', margin: '0 32px', textAlign: 'center' as const, backgroundColor: '#ffffff' },
  trackLabel: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C41230', margin: '0 0 6px' },
  trackNum:   { fontSize: '22px', fontWeight: '800', color: '#0A1628', letterSpacing: '0.06em', fontFamily: "'Barlow Condensed', Arial, sans-serif", margin: 0 },
  trackSub:   { fontSize: '11px', color: '#6b7280', margin: '4px 0 0' },
  bodyPad:    { padding: '24px 32px' },
  label:      { fontSize: '10px', fontWeight: '700', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#6b7280', margin: '16px 0 8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' },
  estBox:     { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '12px 14px', margin: '0 0 16px' },
  estLabel:   { fontSize: '10px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#166534', margin: '0 0 3px' },
  estDate:    { fontSize: '16px', fontWeight: '700', color: '#166534', fontFamily: "'Barlow Condensed', Arial, sans-serif", margin: 0 },
  itemName:   { fontSize: '12px', fontWeight: '500', color: '#111827', margin: '0 0 2px', lineHeight: '1.3' },
  itemMeta:   { fontSize: '11px', color: '#9ca3af', margin: 0 },
  itemPrice:  { fontSize: '14px', fontWeight: '700', color: '#111827', fontFamily: "'Barlow Condensed', Arial, sans-serif", margin: 0, textAlign: 'right' as const },
  ctaBtn:     { backgroundColor: '#C41230', color: '#ffffff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 24px', borderRadius: '3px', display: 'block', textAlign: 'center' as const },
  trustCell:  { textAlign: 'center' as const, padding: '10px', border: '1px solid #e5e7eb' },
  trustText:  { fontSize: '10px', fontWeight: '600', color: '#374151', margin: '4px 0 0' },
  footer:     { backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '20px 32px', textAlign: 'center' as const },
  footerLink: { fontSize: '11px', color: '#6b7280', margin: '0 8px' },
  footerCopy: { fontSize: '10px', color: '#d1d5db', margin: '8px 0 0' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShippingUpdate({
  orderId,
  customerName,
  trackingNumber,
  carrier,
  estimatedDelivery,
  items = [],
  total,
}: ShippingUpdateProps) {

  const previewText  = `Your JRToolsUSA order has shipped! Tracking: ${trackingNumber}`
  const shortId      = orderId.slice(0, 8).toUpperCase()
  const trackUrl     = trackingUrl(carrier, trackingNumber)
  const orderUrl     = `${SITE_URL}/orders/${orderId}`
  const deliveryText = estimatedDelivery ?? '5–7 business days'

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>

          {/* Header */}
          <Section style={s.header}>
            <Row>
              <Column>
                <Text style={s.logoName}>JR<span style={{ color: '#C41230' }}>Tools</span>USA</Text>
                <Text style={s.logoSub}>Pro grade · American proud</Text>
              </Column>
              <Column align="right">
                <Text style={{ fontSize: '10px', color: '#3a5070', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  Shipping update
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section style={s.hero}>
            <Text style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#60a5fa', margin: '0 0 10px', textAlign: 'center' }}>
              Your order has shipped
            </Text>
            <Heading style={s.heroH1}>
              It's on the <span style={{ color: '#C41230' }}>way!</span>
            </Heading>
            <Text style={s.heroSub}>
              Your tools are packed and in the hands of {carrier}.
            </Text>
          </Section>

          {/* Tracking box */}
          <Section style={{ padding: '20px 32px 0' }}>
            <Section style={s.trackBox}>
              <Text style={s.trackLabel}>Tracking number</Text>
              <Text style={s.trackNum}>{trackingNumber}</Text>
              <Text style={s.trackSub}>{carrier} · Est. delivery {deliveryText}</Text>
            </Section>
          </Section>

          {/* Progress steps (visual — text-based for email client compatibility) */}
          <Section style={{ padding: '20px 32px 0' }}>
            <Row>
              {[
                { label: 'Ordered',   done: true  },
                { label: 'Processed', done: true  },
                { label: 'Shipped',   done: true, active: true },
                { label: 'Delivered', done: false },
              ].map((step, i) => (
                <Column key={step.label} align="center">
                  <Text style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: step.done ? '#C41230' : '#e5e7eb',
                    display: 'block', margin: '0 auto 5px',
                    fontSize: '10px', lineHeight: '18px', textAlign: 'center',
                    color: step.done ? '#ffffff' : 'transparent',
                  }}>
                    {step.done ? '✓' : ' '}
                  </Text>
                  <Text style={{
                    fontSize: '9px', fontWeight: '600', textTransform: 'uppercase',
                    letterSpacing: '0.08em', textAlign: 'center', margin: 0,
                    color: step.done ? '#C41230' : '#9ca3af',
                  }}>
                    {step.label}
                  </Text>
                </Column>
              ))}
            </Row>
          </Section>

          {/* Estimated delivery */}
          <Section style={s.bodyPad}>
            <Section style={s.estBox}>
              <Row>
                <Column style={{ width: '32px' }}>
                  <Text style={{ fontSize: '22px', margin: 0 }}>📦</Text>
                </Column>
                <Column style={{ paddingLeft: '10px' }}>
                  <Text style={s.estLabel}>Estimated delivery</Text>
                  <Text style={s.estDate}>{deliveryText}</Text>
                </Column>
              </Row>
            </Section>

            {/* Items */}
            {items.length > 0 && (
              <>
                <Text style={s.label}>What you ordered</Text>
                {items.map((item, i) => (
                  <Row key={i} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', marginBottom: '10px' }}>
                    <Column style={{ width: '44px' }}>
                      <div style={{ width: '44px', height: '44px', backgroundColor: '#f3f4f6', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                        🔧
                      </div>
                    </Column>
                    <Column style={{ paddingLeft: '12px' }}>
                      <Text style={s.itemName}>{item.name}</Text>
                      <Text style={s.itemMeta}>{item.brand} · {item.model} · Qty: {item.quantity}</Text>
                    </Column>
                    <Column align="right">
                      <Text style={s.itemPrice}>{fmt(item.price * item.quantity)}</Text>
                    </Column>
                  </Row>
                ))}
                {total && (
                  <Row>
                    <Column><Text style={{ fontSize: '13px', fontWeight: '700', color: '#111827', fontFamily: "'Barlow Condensed', Arial, sans-serif", margin: '8px 0 0', textAlign: 'right' }}>Order total: {fmt(total)}</Text></Column>
                  </Row>
                )}
              </>
            )}

            {/* Track CTA */}
            <Section style={{ margin: '20px 0 16px' }}>
              <Button href={trackUrl} style={s.ctaBtn}>
                Track with {carrier} →
              </Button>
            </Section>

            {/* Secondary: view order */}
            <Section style={{ margin: '0 0 16px' }}>
              <Button
                href={orderUrl}
                style={{ ...s.ctaBtn, backgroundColor: 'transparent', color: '#0A1628', border: '2px solid #0A1628' }}
              >
                View order details
              </Button>
            </Section>

            {/* Trust row */}
            <Row>
              {[
                { icon: '↩️', text: '30-day returns'   },
                { icon: '🛡️', text: 'Insured shipment' },
                { icon: '📞', text: '1-800-JR-TOOLS'   },
              ].map(t => (
                <Column key={t.text} style={s.trustCell}>
                  <Text style={{ fontSize: '18px', margin: 0 }}>{t.icon}</Text>
                  <Text style={s.trustText}>{t.text}</Text>
                </Column>
              ))}
            </Row>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            <Text style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', lineHeight: '1.7', margin: 0 }}>
              Not home when it arrives? {carrier} will leave it in a safe place or you can reschedule at {carrier.toLowerCase()}.com
            </Text>
          </Section>

          {/* Footer */}
          <Section style={s.footer}>
            <Row>
              {['Track order', 'Return policy', 'Contact us', 'Unsubscribe'].map(l => (
                <Column key={l} align="center">
                  <Link href={SITE_URL} style={s.footerLink}>{l}</Link>
                </Column>
              ))}
            </Row>
            <Text style={s.footerCopy}>
              © {new Date().getFullYear()} JRToolsUSA · 1234 Commerce St, Dallas TX 75201
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default ShippingUpdate
