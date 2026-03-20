/**
 * Seed support knowledge for chat RAG.
 *
 * Run:
 * npm run seed:chat-knowledge
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

type KnowledgeRow = {
  source_type: string
  source_id: string
  title: string
  chunk_text: string
  active: boolean
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const rows: KnowledgeRow[] = [
  {
    source_type: 'policy',
    source_id: 'shipping-core',
    title: 'Shipping Policy',
    chunk_text: 'Free shipping on orders over $99. Orders placed before 2pm CT typically ship same day.',
    active: true,
  },
  {
    source_type: 'policy',
    source_id: 'returns-core',
    title: 'Returns Policy',
    chunk_text: '30-day returns with no hassle. Customers can request help from support for return instructions.',
    active: true,
  },
  {
    source_type: 'policy',
    source_id: 'price-match-core',
    title: 'Price Match Guarantee',
    chunk_text: 'JRToolsUSA offers a price match guarantee on legitimate competitor pricing.',
    active: true,
  },
  {
    source_type: 'support',
    source_id: 'contact-core',
    title: 'Support Contact',
    chunk_text: 'Support phone is (404) 565-7099 and support email is info@jrtoolsusa.com. Hours are Mon-Fri 7am-6pm CT.',
    active: true,
  },
]

async function run() {
  const { error } = await supabase
    .from('chat_knowledge')
    .upsert(rows, { onConflict: 'source_type,source_id' })

  if (error) {
    throw error
  }

  console.log(`Upserted ${rows.length} chat knowledge rows.`)
}

run().catch(error => {
  console.error('Failed to seed chat knowledge:', error)
  process.exit(1)
})
