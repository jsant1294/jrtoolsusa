/**
 * JRToolsUSA — Groq AI Integration
 * Fast, free LLM for product search and recommendations
 */

import Groq from 'groq-sdk'
import { formatPrice } from '@/lib/cart'
import type { RetrievedSupportChunk } from '@/lib/support-rag'

export const GROQ_CHAT_MODEL = process.env.GROQ_CHAT_MODEL || 'llama-3.3-70b-versatile'

let groqClient: Groq | null = null

type SearchProduct = {
  name: string
  brand: string
  price: number
  stock?: number | null
}

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('AI service not configured: GROQ_API_KEY is missing.')
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey })
  }

  return groqClient
}

/**
 * Search products using AI understanding
 * Works with natural language queries
 */
export async function searchProductsWithAI(query: string, products: SearchProduct[]) {
  const groq = getGroqClient()
  const productList = products
    .map(p => {
      const stock = typeof p.stock === 'number' ? p.stock : 0
      const availability = stock > 0 ? `In stock (${stock})` : 'Sold out'
      return `${p.name} (${p.brand}, ${formatPrice(p.price)}) - ${availability}`
    })
    .join('\n')

  const response = await groq.chat.completions.create({
    model: GROQ_CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a helpful tool sales assistant for JRToolsUSA. Help customers find the right tools.
        
Available products:
${productList}

Rules:
- Use only the products listed above.
- Availability is based only on the stock shown above.
- If stock is 0, clearly say the item is sold out and suggest an alternative from the list.
- Do not promise restock dates unless explicitly provided.

When asked what tools a customer needs, recommend specific products from the list. Be concise and helpful.`,
      },
      {
        role: 'user',
        content: query,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  })

  return response.choices[0]?.message?.content || 'I could not find a suitable tool recommendation.'
}

/**
 * General customer support chat
 */
export async function supportChat(messages: Array<{ role: 'user' | 'assistant'; content: string }>) {
  return supportChatWithContext(messages, [])
}

export async function supportChatWithContext(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  contextChunks: RetrievedSupportChunk[]
) {
  const groq = getGroqClient()
  const contextBlock = contextChunks.length
    ? contextChunks
        .map((chunk, index) => `[#${index + 1}] ${chunk.title}\n${chunk.content}`)
        .join('\n\n')
    : 'No external context was retrieved.'

  const response = await groq.chat.completions.create({
    model: GROQ_CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a helpful customer support agent for JRToolsUSA - America's Best Tool Prices.
We sell pro-grade power tools from DeWalt, Milwaukee, Makita, Bosch, Festool, Hilti and more.
We are located in Alpharetta, GA 30009. Local pickup is available — customers can call or text ahead.
Key facts:
- Located in Alpharetta, GA (local pickup available Mon–Sat 8am–6pm)
- Free shipping over $99
- Same-day shipping on orders placed before 2pm CT (ships from Alpharetta, GA)
- 30-day returns, no questions asked
- Price Match Guarantee - we have America's lowest prices

Grounding rules:
- Use the retrieved context below as your primary source.
- If the answer is not in the retrieved context, say you are not fully sure and offer support contact details.
- Do not promise inventory or in-stock status unless the retrieved context explicitly includes availability details.
- Keep responses concise and practical.
- When using retrieved info, cite the source number like [#1] in-line.

Retrieved context:
${contextBlock}

If unsure, suggest contacting support at (404) 565-7099 or info@jrtoolsusa.com.`,
      },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  return response.choices[0]?.message?.content || 'Sorry, I could not process that. Please try again.'
}
