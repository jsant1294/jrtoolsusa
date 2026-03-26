/**
 * JRToolsUSA — Chat API Route
 * Handles AI-powered chat requests
 */

import { createServerClient } from '@/lib/supabase'
import { getGroqClient, GROQ_CHAT_MODEL, supportChatWithContext } from '@/lib/groq'
import { retrieveSupportContext } from '@/lib/support-rag'
import { formatPrice } from '@/lib/cart'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, mode } = await req.json()
    const productChatEnabled = process.env.ENABLE_PRODUCT_CHAT === 'true'

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    let response: string
    let references: Array<{ title: string; sourceType: string; sourceId: string }> = []

    if (mode === 'product-search') {
      if (!productChatEnabled) {
        response = 'Product recommendations are temporarily paused while we refresh catalog data. Please browse /products or /deals, or ask support and we can help directly at (404) 565-7099.'
        return NextResponse.json({ response, references })
      }

      // Get products from Supabase
      const supabase = createServerClient()
      const { data: products } = await supabase
        .from('products')
        .select('name, brand, category, price, stock')
        .limit(20)

      if (!products || products.length === 0) {
        response = 'No products available right now. Please try again later.'
      } else {
        // For product search, just use user's last message
        const lastUserMessage = messages[messages.length - 1]?.content
        if (!lastUserMessage) {
          return NextResponse.json({ error: 'No user message' }, { status: 400 })
        }

        // Call Groq with product context
        const groq = getGroqClient()
        const productList = products
          .map(p => {
            const stock = typeof p.stock === 'number' ? p.stock : 0
            const availability = stock > 0 ? `In stock (${stock})` : 'Sold out'
            return `${p.name} (${p.brand}, ${p.category}, ${formatPrice(p.price)}) - ${availability}`
          })
          .join('\n')

        const result = await groq.chat.completions.create({
          model: GROQ_CHAT_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a helpful tool sales assistant for JRToolsUSA. Help customers find the right tools from our catalog.

Available products:
${productList}

Rules:
- Use only the products listed above.
- Availability is based only on the stock shown above.
- If stock is 0, clearly say the item is sold out and suggest an alternative from the list.
- Do not promise restock dates unless explicitly provided.

When asked what tools a customer needs, recommend specific products from the list. Be concise and helpful. Include product names, prices, and availability.`,
            },
            {
              role: 'user',
              content: lastUserMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        })

        response = result.choices[0]?.message?.content || 'I could not find suitable recommendations.'
      }
    } else {
      // General support chat with retrieval-augmented context
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content
      if (!lastUserMessage) {
        return NextResponse.json({ error: 'No user message' }, { status: 400 })
      }

      const retrieval = await retrieveSupportContext(lastUserMessage, 4)
      references = retrieval.references
      response = await supportChatWithContext(messages, retrieval.chunks)
    }

    return NextResponse.json({ response, references })
  } catch (error) {
    console.error('Chat API error:', error)
    if (error instanceof Error && /GROQ_API_KEY|AI service not configured/i.test(error.message)) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
