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