/**
 * JRToolsUSA — Chat API Route
 * Handles AI-powered chat requests
 */

import { createServerClient } from '@/lib/supabase'
import { supportChat } from '@/lib/groq'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, mode } = await req.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    let response: string

    if (mode === 'product-search') {
      // Get products from Supabase
      const supabase = createServerClient()
      const { data: products } = await supabase.from('products').select('*').eq('active', true).limit(20)

      if (!products || products.length === 0) {
        response = 'No products available right now. Please try again later.'
      } else {
        // For product search, just use user's last message
        const lastUserMessage = messages[messages.length - 1]?.content
        if (!lastUserMessage) {
          return NextResponse.json({ error: 'No user message' }, { status: 400 })
        }

        // Call Groq with product context
        const { groq } = await import('@/lib/groq')
        const productList = products
          .map(p => `${p.name} (${p.brand}, $${p.price})`)
          .join('\n')

        const result = await groq.chat.completions.create({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are a helpful tool sales assistant for JRToolsUSA. Help customers find the right tools from our catalog.

Available products:
${productList}

When asked what tools a customer needs, recommend specific products from the list. Be concise and helpful. Include product names and prices.`,
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
      // General support chat
      response = await supportChat(messages)
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
