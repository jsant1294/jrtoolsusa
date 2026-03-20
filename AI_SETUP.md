# JRToolsUSA AI Assistant Setup Guide

## Step 1: Get Groq API Key (FREE)

1. Visit: https://console.groq.com
2. Sign up with email
3. Go to "API Keys" section
4. Create new API key
5. Copy the key

## Step 2: Add Environment Variable

Create `.env.local` in the project root and add:

```
GROQ_API_KEY=your_api_key_here
ENABLE_PRODUCT_CHAT=false
GROQ_CHAT_MODEL=llama-3.3-70b-versatile
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_INBOUND_WEBHOOK_URL=
TWILIO_VERIFY_SIGNATURE=false
```

Replace `your_api_key_here` with your actual Groq API key.

Set `ENABLE_PRODUCT_CHAT=false` while product data is being refreshed.
Set `ENABLE_PRODUCT_CHAT=true` when you are ready to re-enable product recommendations in chat.
`GROQ_CHAT_MODEL` lets you swap models without code changes.
Set `TWILIO_VERIFY_SIGNATURE=true` in production after setting `TWILIO_INBOUND_WEBHOOK_URL`.

## Step 3: Install Dependencies

```bash
npm install groq-sdk
```

## Step 4: Test the Chat Widget

1. Start the dev server: `npm run dev`
2. Visit http://localhost:3000
3. Look for the red chat bubble 💬 in the bottom right
4. Click to open the chat
5. Try asking:
   - **Support mode**: "What's your warranty policy?"
   - **Product search mode**: "I need a drill for drywall under $300"

## Features

✅ **Support Mode** - Answer FAQs about shipping, returns, payments, etc.
✅ **Product Search** - Natural language product recommendations
✅ **Floating Widget** - Available on all pages
✅ **Real-time Streaming** - Fast responses using Groq

## API Endpoints

- `POST /api/chat` - Main chat endpoint
  - Requires: `messages[]` and `mode` ('support' or 'product-search')
  - Returns: AI response text
- `POST /api/twilio/inbound` - Twilio inbound SMS webhook
  - Consumes Twilio form-encoded payloads
  - Returns TwiML with an AI-generated reply grounded in support RAG context

## Notes

- Groq is **free and fast** - perfect for production use
- Widget persists chat history during session
- All product data pulled from Supabase in real-time
- AI has context about:
  - Product catalog
  - Shipping policies (same-day before 2pm CT)
  - Returns policy (30-day, no questions)
  - Price Match Guarantee
  - Contact info
