import twilio from 'twilio'

let twilioClient: ReturnType<typeof twilio> | null = null

export function hasTwilioConfig() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
  )
}

export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    throw new Error('Twilio is not configured: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required.')
  }

  if (!twilioClient) {
    twilioClient = twilio(accountSid, authToken)
  }

  return twilioClient
}

export async function sendSms(to: string, body: string) {
  const from = process.env.TWILIO_PHONE_NUMBER
  if (!from) {
    throw new Error('Twilio is not configured: TWILIO_PHONE_NUMBER is required.')
  }

  const client = getTwilioClient()
  return client.messages.create({ from, to, body })
}

export function validateTwilioRequest(
  signature: string | null,
  webhookUrl: string,
  params: Record<string, string>
) {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken) return false
  if (!signature) return false

  return twilio.validateRequest(authToken, signature, webhookUrl, params)
}

export function twimlMessage(message: string) {
  const messagingResponse = new twilio.twiml.MessagingResponse()
  messagingResponse.message(message)
  return messagingResponse.toString()
}
