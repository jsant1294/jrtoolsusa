-- Support RAG setup for JRToolsUSA
-- Run in Supabase SQL editor.

create table if not exists public.chat_knowledge (
  id bigserial primary key,
  source_type text not null,
  source_id text not null,
  title text not null,
  chunk_text text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_knowledge
  add constraint if not exists chat_knowledge_source_unique unique (source_type, source_id);

create index if not exists chat_knowledge_active_idx
  on public.chat_knowledge (active);

create index if not exists chat_knowledge_source_idx
  on public.chat_knowledge (source_type, source_id);

-- Optional starter rows. Customize as needed.
insert into public.chat_knowledge (source_type, source_id, title, chunk_text, active)
values
  ('policy', 'shipping', 'Shipping Policy', 'Free shipping on orders over $99. Orders placed before 2pm CT typically ship same day.', true),
  ('policy', 'returns', 'Returns Policy', '30-day returns with no hassle. Customers can request help from support for return instructions.', true),
  ('policy', 'price-match', 'Price Match Guarantee', 'JRToolsUSA offers a price match guarantee on legitimate competitor pricing.', true),
  ('support', 'contact', 'Support Contact', 'Support phone is (404) 565-7099 and support email is info@jrtoolsusa.com. Hours are Mon-Fri 7am-6pm CT.', true)
on conflict do nothing;
