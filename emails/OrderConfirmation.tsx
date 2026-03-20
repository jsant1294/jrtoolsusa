/**
 * JRToolsUSA — Order Confirmation Email
 * File: emails/OrderConfirmation.tsx
 *
 * Sent immediately after checkout.session.completed webhook fires.
 * Built with React Email — preview with: npx email dev
 *
 * Install: npm install @react-email/components
 */

import {
  Body, Column, Container, Head, Heading,
  Hr, Html, Img, Link, Preview, Row,
  Section, Text, Button,
} from '@react-email/components'
import { SITE_URL } from '@/lib/resend'

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderItem = {
  name:      string
  brand:     string
  model:     string
  quantity:  number
  price:     number  // cents
  image?:    string
}

type ShippingAddress = {
  line1:       string
  line2?:      string
  city:        string
  state:       string
  postal_code: string
  country:     string
}

type OrderConfirmationProps = {
  orderId:         string
  customerName:    string
  customerEmail:   string
  items:           OrderItem[]
  subtotal:        number  // cents
  shippingCost:    number  // cents
  tax:             number  // cents
  total:           number  // cents
  shippingAddress: ShippingAddress
  paymentLast4?:   string
  orderDate?:      string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  }).format(cents / 100)
}

const firstName = (name: string) => name.split(' ')[0]

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  body:       { backgroundColor: '#f4f4f5', fontFamily: "'Barlow', Arial, sans-serif", margin: 0 },
  container:  { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
  header:     { backgroundColor: '#0A1628', padding: '28px 32px' },
  logoName:   { fontSize: '20px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.04em', margin: 0 },
  logoSub:    { fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#3a5070', margin: '2px 0 0' },
  heroBg:     { backgroundColor: '#0A1628', padding: '0 32px 32px' },
  heroH1:     { fontSize: '30px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1', margin: '0 0 8px' },
  heroSub:    { fontSize: '13px', color: '#6b8090', lineHeight: '1.6', margin: 0 },
  body_pad:   { padding: '28px 32px' },
  label:      { fontSize: '9px', fontWeight: '700', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#9ca3af', margin: '0 0 3px' },
  metaVal:    { fontSize: '15px', fontWeight: '700', color: '#111827', fontFamily: "'Barlow Condensed', Arial, sans-serif", margin: 0 },
  sectionHd:  { fontSize: '10px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#6b7280', margin: '16px 0 8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' },
  itemName:   { fontSize: '12px', fontWeight: '500', color: '#111827', margin: '0 0 2px', lineHeight: '1.3' },
  itemMeta:   { fontSize: '11px', color: '#9ca3af', margin: 0 },
  itemPrice:  { fontSize: '14px', fontWeight: '700', color: '#111827', fontFamily: "'Barlow Condensed', Arial, sans-serif", margin: 0, textAlign: 'right' as const },
  totalRow:   { fontSize: '12px', color: '#6b7280', margin: '3px 0' },
  totalFinal: { fontSize: '16px', fontWeight: '700', color: '#111827', fontFamily: "'Barlow Condensed', Arial, sans-serif", margin: '8px 0 0', borderTop: '1px solid #e5e7eb', paddingTop: '8px' },
  addrBox:    { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '12px 14px' },
  addrText:   { fontSize: '12px', color: '#1e40af', lineHeight: '1.6', margin: 0 },
  ctaBtn:     { backgroundColor: '#C41230', color: '#ffffff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '14px 24px', borderRadius: '3px', display: 'block', textAlign: 'center' as const },
  trustCell:  { textAlign: 'center' as const, padding: '10px', border: '1px solid #e5e7eb' },
  trustText:  { fontSize: '10px', fontWeight: '600', color: '#374151', margin: '4px 0 0' },
  footer:     { backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '20px 32px', textAlign: 'center' as const },
  footerLink: { fontSize: '11px', color: '#6b7280', margin: '0 8px' },
  footerCopy: { fontSize: '10px', color: '#d1d5db', margin: '8px 0 0' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderConfirmation({
  orderId,
  customerName,
  customerEmail,
  items,
  subtotal,
  shippingCost,
  tax,
  total,
  shippingAddress,
  paymentLast4,
  orderDate,
}: OrderConfirmationProps) {

  const previewText = `Order #${orderId.slice(0,8).toUpperCase()} confirmed — ${fmt(total)} · ${items.length} item${items.length > 1 ? 's' : ''}`
  const orderUrl   = `${SITE_URL}/orders`
  const shortId    = orderId.slice(0, 8).toUpperCase()
  const date       = orderDate ?? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

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
                  Order receipt
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section style={s.heroBg}>
            <Text style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#22c55e', margin: '0 0 10px' }}>
              ✓ Payment confirmed
            </Text>
            <Heading style={s.heroH1}>
              Your order<br />
              is <span style={{ color: '#C41230' }}>confirmed!</span>
            </Heading>
            <Text style={s.heroSub}>
              Thanks {firstName(customerName)} — we'll have it packed and on its way within 24 hours.
            </Text>
          </Section>

          {/* Order meta */}
          <Section style={s.body_pad}>
            <Row>
              <Column style={{ padding: '12px 14px', border: '1px solid #e5e7eb', borderRight: 'none' }}>
                <Text style={s.label}>Order ID</Text>
                <Text style={s.metaVal}>#{shortId}</Text>
              </Column>
              <Column style={{ padding: '12px 14px', border: '1px solid #e5e7eb' }}>
                <Text style={s.label}>Order date</Text>
                <Text style={s.metaVal}>{date}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ padding: '12px 14px', border: '1px solid #e5e7eb', borderRight: 'none', borderTop: 'none' }}>
                <Text style={s.label}>Payment</Text>
                <Text style={s.metaVal}>{paymentLast4 ? `Visa ···· ${paymentLast4}` : 'Card on file'}</Text>
              </Column>
              <Column style={{ padding: '12px 14px', border: '1px solid #e5e7eb', borderTop: 'none' }}>
                <Text style={s.label}>Status</Text>
                <Text style={{ ...s.metaVal, color: '#16a34a' }}>Confirmed</Text>
              </Column>
            </Row>

            {/* Items */}
            <Text style={s.sectionHd}>Items ordered</Text>
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

            {/* Totals */}
            <Section style={{ backgroundColor: '#f9fafb', borderRadius: '4px', padding: '14px', margin: '16px 0' }}>
              <Row><Column><Text style={s.totalRow}>Subtotal</Text></Column><Column align="right"><Text style={s.totalRow}>{fmt(subtotal)}</Text></Column></Row>
              <Row><Column><Text style={s.totalRow}>Shipping</Text></Column><Column align="right"><Text style={{ ...s.totalRow, color: '#16a34a' }}>{shippingCost === 0 ? 'FREE' : fmt(shippingCost)}</Text></Column></Row>
              <Row><Column><Text style={s.totalRow}>Tax (TX 8.25%)</Text></Column><Column align="right"><Text style={s.totalRow}>{fmt(tax)}</Text></Column></Row>
              <Row><Column><Text style={s.totalFinal}>Total charged</Text></Column><Column align="right"><Text style={s.totalFinal}>{fmt(total)}</Text></Column></Row>
            </Section>

            {/* Shipping address */}
            <Text style={s.sectionHd}>Shipping to</Text>
            <Section style={s.addrBox}>
              <Text style={s.addrText}>
                {customerName}<br />
                {shippingAddress.line1}
                {shippingAddress.line2 && <>, {shippingAddress.line2}</>}<br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
              </Text>
            </Section>

            {/* CTA */}
            <Section style={{ margin: '20px 0 16px' }}>
              <Button href={orderUrl} style={s.ctaBtn}>
                View your order
              </Button>
            </Section>

            {/* Trust row */}
            <Row>
              {[
                { icon: '🚚', text: 'Ships in 24 hrs' },
                { icon: '↩️', text: '30-day returns' },
                { icon: '📞', text: '(404) 565-7099' },
              ].map(t => (
                <Column key={t.text} style={s.trustCell}>
                  <Text style={{ fontSize: '18px', margin: 0 }}>{t.icon}</Text>
                  <Text style={s.trustText}>{t.text}</Text>
                </Column>
              ))}
            </Row>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            <Text style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', lineHeight: '1.7', margin: 0 }}>
              Questions? Reply to this email or call us Mon–Fri 7am–6pm CT.<br />
              <Link href={`mailto:support@jrtoolsusa.com`} style={{ color: '#6b7280' }}>support@jrtoolsusa.com</Link>
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

export default OrderConfirmation
