/**
 * JRToolsUSA — Resend Client
 * File: lib/resend.ts
 *
 * Single Resend instance shared across the app.
 *
 * Install: npm install resend @react-email/components
 * Docs: resend.com/docs
 *
 * Setup:
 *  1. Create account at resend.com
 *  2. Add your domain (jrtoolsusa.com) under Domains
 *  3. Add the DNS records Resend gives you
 *  4. Create API key → paste into RESEND_API_KEY in .env.local
 */

import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL  ?? 'orders@jrtoolsusa.com'
export const FROM_NAME   = 'JRToolsUSA'
export const REPLY_TO    = 'support@jrtoolsusa.com'
export const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jrtoolsusa.com'

// ─── Shared send helper with error logging ────────────────────────────────────

type SendEmailOptions = {
  to:      string
  subject: string
  react:   React.ReactElement
  replyTo?: string
}

export async function sendEmail({ to, subject, react, replyTo }: SendEmailOptions) {
  try {
    const result = await resend.emails.send({
      from:     `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      react,
      replyTo:  replyTo ?? REPLY_TO,
    })

    if (result.error) {
      console.error('Resend send error:', result.error)
      return { success: false, error: result.error.message }
    }

    console.log(`Email sent to ${to}: ${result.data?.id}`)
    return { success: true, id: result.data?.id }

  } catch (err: any) {
    console.error('Resend unexpected error:', err)
    return { success: false, error: err.message }
  }
}
