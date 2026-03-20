import { NextRequest, NextResponse } from 'next/server'
import { supportChatWithContext } from '@/lib/groq'
import { retrieveSupportContext } from '@/lib/support-rag'
import { hasTwilioConfig, twimlMessage, validateTwilioRequest } from '@/lib/twilio'

export const runtime = 'nodejs'

function shouldVerifySignature() {
  if (process.env.TWILIO_VERIFY_SIGNATURE) {
    return process.env.TWILIO_VERIFY_SIGNATURE === 'true'
  }

  return process.env.NODE_ENV === 'production'
}

function normalizeForSms(text: string) {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 1200) return trimmed
  return `${trimmed.slice(0, 1197)}...`
}

export async function POST(req: NextRequest) {
  try {
    if (!hasTwilioConfig()) {
      return new NextResponse(twimlMessage('Support SMS is not configured yet. Please call us at (404) 565-7099.'), {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      })
    }

    const rawBody = await req.text()
    const form = new URLSearchParams(rawBody)
    const body = form.get('Body')?.trim() || ''

    const params: Record<string, string> = {}
    for (const [key, value] of form.entries()) {
      params[key] = value
    }

    if (shouldVerifySignature()) {
      const signature = req.headers.get('x-twilio-signature')
      const webhookUrl = process.env.TWILIO_INBOUND_WEBHOOK_URL || req.url
      const valid = validateTwilioRequest(signature, webhookUrl, params)

      if (!valid) {
        return new NextResponse('Invalid Twilio signature', { status: 403 })
      }
    }

    if (!body) {
      return new NextResponse(
        twimlMessage('Thanks for contacting JRToolsUSA. Reply with your question and we will help right away.'),
        {
          headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        }
      )
    }

    const retrieval = await retrieveSupportContext(body, 4)
    const reply = await supportChatWithContext([{ role: 'user', content: body }], retrieval.chunks)

    return new NextResponse(twimlMessage(normalizeForSms(reply)), {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    })
  } catch (error) {
    console.error('Twilio inbound error:', error)
    return new NextResponse(
      twimlMessage('Sorry, we hit an issue processing your message. Please call us at (404) 565-7099.'),
      {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      }
    )
  }
}
