import { NextRequest, NextResponse } from 'next/server'
import { hasTwilioConfig, sendSms } from '@/lib/twilio'

export const runtime = 'nodejs'

function getBearerToken(headerValue: string | null) {
  if (!headerValue) return null
  const match = headerValue.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

function isAuthorized(req: NextRequest) {
  const adminToken = process.env.TWILIO_ADMIN_TOKEN
  if (!adminToken) return false

  const tokenFromHeader = req.headers.get('x-admin-token') || getBearerToken(req.headers.get('authorization'))
  return tokenFromHeader === adminToken
}

function isE164(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone)
}

function normalizeMessage(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= 1200) return normalized
  return normalized.slice(0, 1200)
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasTwilioConfig()) {
      return NextResponse.json({ error: 'Twilio is not configured' }, { status: 503 })
    }

    const { to, message } = await req.json()

    if (!to || !message || typeof to !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid payload. Expected { to, message }.' }, { status: 400 })
    }

    const normalizedTo = to.trim()
    const normalizedMessage = normalizeMessage(message)

    if (!isE164(normalizedTo)) {
      return NextResponse.json({ error: 'Phone number must be in E.164 format (example: +14045551234).' }, { status: 400 })
    }

    if (!normalizedMessage) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 })
    }

    const result = await sendSms(normalizedTo, normalizedMessage)

    return NextResponse.json({
      ok: true,
      sid: result.sid,
      status: result.status,
      to: result.to,
    })
  } catch (error) {
    console.error('Twilio send error:', error)
    return NextResponse.json({ error: 'Failed to send SMS.' }, { status: 500 })
  }
}
