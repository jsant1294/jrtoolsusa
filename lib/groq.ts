/**
 * JRToolsUSA — Groq AI Integration
 * Fast, free LLM for product search and recommendations
 */

import Groq from 'groq-sdk'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

/**
 * Search products using AI understanding
 * Works with natural language queries
 */
export async function searchProductsWithAI(query: string, products: any[]) {
  const productList = products
    .map(p => `${p.name} (${p.brand}, $${p.price})`)
    .join('\n')

  const response = await groq.chat.completions.create({
    model: 'mixtral-8x7b-32768',
    messages: [
      {
        role: 'system',
        content: `You are a helpful tool sales assistant for JRToolsUSA. Help customers find the right tools.
        
Available products:
${productList}

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
  const response = await groq.chat.completions.create({
    model: 'mixtral-8x7b-32768',
    messages: [
      {
        role: 'system',
        content: `You are a helpful customer support agent for JRToolsUSA - America's Best Tool Prices.
We sell pro-grade power tools from DeWalt, Milwaukee, Makita, Bosch, Festool, Hilti and more.
Key facts:
- Free shipping over $99
- Same-day shipping before 2pm CT
- 30-day returns, no questions asked
- Price Match Guarantee - we have America's lowest prices

Be friendly, concise, and helpful. If unsure, suggest contacting support at (404) 565-7099 or info@jrtoolsusa.com`,
      },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  return response.choices[0]?.message?.content || 'Sorry, I could not process that. Please try again.'
}
