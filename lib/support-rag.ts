import { createServerClient } from '@/lib/supabase'

export type RetrievedSupportChunk = {
  sourceType: string
  sourceId: string
  title: string
  content: string
}

type RetrievedSupportResult = {
  chunks: RetrievedSupportChunk[]
  references: Array<{ title: string; sourceType: string; sourceId: string }>
}

type ScoredChunk = RetrievedSupportChunk & { score: number }

const FALLBACK_SUPPORT_CORPUS: RetrievedSupportChunk[] = [
  {
    sourceType: 'policy',
    sourceId: 'shipping',
    title: 'Shipping Policy',
    content: 'Free shipping on orders over $99. Orders placed before 2pm CT typically ship same day.',
  },
  {
    sourceType: 'policy',
    sourceId: 'returns',
    title: 'Returns Policy',
    content: '30-day returns with no hassle. Customers can request help from support for return instructions.',
  },
  {
    sourceType: 'policy',
    sourceId: 'price-match',
    title: 'Price Match Guarantee',
    content: 'JRToolsUSA offers a price match guarantee on legitimate competitor pricing.',
  },
  {
    sourceType: 'support',
    sourceId: 'contact',
    title: 'Support Contact',
    content: 'Support phone is (404) 565-7099 and support email is info@jrtoolsusa.com. Hours are Mon-Fri 7am-6pm CT.',
  },
  {
    sourceType: 'info',
    sourceId: 'location',
    title: 'Store Location',
    content: 'JRToolsUSA is located in Alpharetta, GA 30009. Local pickup is available Monday through Saturday, 8am–6pm. Call or text (404) 565-7099 ahead to confirm pickup availability. We ship nationwide from Alpharetta, GA.',
  },
  {
    sourceType: 'info',
    sourceId: 'brands',
    title: 'Brands We Carry',
    content: 'JRToolsUSA carries the top professional power tool brands: DeWalt, Milwaukee, Makita, Bosch, Festool, Hilti, Ridgid, Ryobi, Metabo, and Craftsman. We stock authentic, warranty-backed tools — no fakes or grey-market products.',
  },
  {
    sourceType: 'info',
    sourceId: 'categories',
    title: 'Tool Categories',
    content: 'We carry a wide range of tool categories including: drills and impact drivers, circular saws and miter saws, angle grinders, nailers and staplers, sanders, tape measures and laser levels, and combo kits. We also stock accessories like blades, bits, batteries, and chargers.',
  },
  {
    sourceType: 'info',
    sourceId: 'price-ranges',
    title: 'Typical Price Ranges',
    content: 'Our prices are up to 40% off retail. Typical price ranges: cordless drills $49–$199, combo kits $99–$399, circular saws $69–$249, miter saws $149–$499, angle grinders $39–$149, nailers $89–$299. Prices vary by brand and voltage — Milwaukee and DeWalt 20V/18V tools tend to be at the higher end, Ryobi and Craftsman at the lower end.',
  },
  {
    sourceType: 'info',
    sourceId: 'dewalt',
    title: 'DeWalt Tools',
    content: 'We carry a large selection of DeWalt tools including their 20V MAX and FLEXVOLT lines. Popular items: DCD777 drill, DCK240C2 combo kit, DCS565 circular saw, DWE7491RS table saw. DeWalt tools come with a 3-year limited warranty, 1-year free service, and 90-day money-back guarantee.',
  },
  {
    sourceType: 'info',
    sourceId: 'milwaukee',
    title: 'Milwaukee Tools',
    content: 'We carry Milwaukee Tool products including their M12, M18, and MX FUEL lines. Known for durability and innovation. Milwaukee offers a 5-year tool warranty and lifetime battery guarantee on REDLITHIUM batteries. Popular for electricians, plumbers, and heavy-duty contractors.',
  },
  {
    sourceType: 'info',
    sourceId: 'makita',
    title: 'Makita Tools',
    content: 'We carry Makita tools including their 18V LXT and 40V XGT lines. Makita is known for lightweight ergonomic designs and long battery life. Great for finish carpenters and woodworkers. Makita offers a 3-year limited warranty on tools and batteries.',
  },
  {
    sourceType: 'info',
    sourceId: 'combo-kits',
    title: 'Combo Kits',
    content: 'Combo kits are our best value — you get multiple tools sharing the same battery platform. We carry 2-piece, 3-piece, and 5-piece combo kits from DeWalt, Milwaukee, Makita, and Ridgid. Typical combos include a drill/driver plus an impact driver, often bundled with batteries and a charger. Price range $99–$399.',
  },
  {
    sourceType: 'info',
    sourceId: 'batteries',
    title: 'Batteries and Chargers',
    content: 'We stock replacement batteries and chargers for all major brands. DeWalt 20V, Milwaukee M18/M12, Makita 18V LXT, Bosch 18V, and Ryobi 18V ONE+ batteries are all available. Buying extra batteries is recommended for job site use. We also carry fast chargers that can charge a battery in 30–60 minutes.',
  },
  {
    sourceType: 'policy',
    sourceId: 'warranty',
    title: 'Warranty Coverage',
    content: 'All tools sold by JRToolsUSA come with the full manufacturer warranty. DeWalt: 3-year limited. Milwaukee: 5-year. Makita: 3-year. Bosch: 1-year. Ridgid: lifetime service agreement with registration. If you have a warranty issue, contact the manufacturer directly or call us at (404) 565-7099 for guidance.',
  },
  {
    sourceType: 'policy',
    sourceId: 'payment',
    title: 'Payment Methods',
    content: 'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through Stripe secure checkout. We do not currently accept PayPal, cash, or checks for online orders. In-person pickup payments can be arranged by calling (404) 565-7099.',
  },
  {
    sourceType: 'info',
    sourceId: 'about',
    title: 'About JRToolsUSA',
    content: 'JRToolsUSA is a veteran-owned discount power tool reseller founded in 2018 and based in Alpharetta, GA. We offer pro-grade tools at up to 40% off retail prices. We serve contractors, homeowners, and tradespeople across the US. Every tool is authentic and warranty-backed — no grey market or refurbished items unless clearly marked.',
  },
]

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
}

function tokenize(text: string) {
  return normalize(text)
    .split(/\s+/)
    .filter(token => token.length > 2)
}

function scoreChunk(query: string, chunk: RetrievedSupportChunk): number {
  const queryTokens = new Set(tokenize(query))
  if (queryTokens.size === 0) return 0

  const haystack = `${chunk.title} ${chunk.content}`
  const chunkTokens = new Set(tokenize(haystack))
  let overlap = 0

  for (const token of queryTokens) {
    if (chunkTokens.has(token)) overlap += 1
  }

  const queryNormalized = normalize(query)
  const haystackNormalized = normalize(haystack)
  const phraseBoost = haystackNormalized.includes(queryNormalized) ? 2 : 0
  const titleBoost = normalize(chunk.title).split(/\s+/).some(token => queryTokens.has(token)) ? 0.5 : 0

  return overlap + phraseBoost + titleBoost
}

function rankByQuery(query: string, chunks: RetrievedSupportChunk[], limit: number) {
  return chunks
    .map(chunk => ({ ...chunk, score: scoreChunk(query, chunk) }))
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function toReferences(chunks: RetrievedSupportChunk[]) {
  const seen = new Set<string>()
  const refs: Array<{ title: string; sourceType: string; sourceId: string }> = []

  for (const chunk of chunks) {
    const key = `${chunk.sourceType}:${chunk.sourceId}`
    if (seen.has(key)) continue
    seen.add(key)
    refs.push({ title: chunk.title, sourceType: chunk.sourceType, sourceId: chunk.sourceId })
  }

  return refs
}

function mapKnowledgeRows(rows: any[]): RetrievedSupportChunk[] {
  return rows
    .filter(row => typeof row.chunk_text === 'string' && row.chunk_text.length > 0)
    .map(row => ({
      sourceType: String(row.source_type || 'support'),
      sourceId: String(row.source_id || row.id || 'unknown'),
      title: String(row.title || 'Support Knowledge'),
      content: String(row.chunk_text),
    }))
}

export async function retrieveSupportContext(query: string, limit = 4): Promise<RetrievedSupportResult> {
  let candidateChunks = FALLBACK_SUPPORT_CORPUS

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('chat_knowledge')
      .select('id, source_type, source_id, title, chunk_text, active')
      .eq('active', true)
      .limit(250)

    if (!error && data && data.length > 0) {
      candidateChunks = mapKnowledgeRows(data)
    }
  } catch {
    // Keep the fallback corpus when Supabase retrieval fails.
  }

  const ranked = rankByQuery(query, candidateChunks, limit)
  const chunks = ranked.length > 0
    ? ranked.map(({ score, ...chunk }) => chunk)
    : candidateChunks.slice(0, limit)

  return {
    chunks,
    references: toReferences(chunks),
  }
}