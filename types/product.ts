/**
 * JRToolsUSA — Product type
 * File: types/product.ts
 *
 * Mirrors the Supabase `products` table exactly.
 * Update both the DB schema and this file when adding new fields.
 */

export type ProductMetadata = {
  weight_lbs?:  number
  amps?:        number
  max_torque?:  string
  rpm?:         string
  blade_size?:  string
  disc_size?:   string
  included?:    string[]
  warranty?:    string
  [key: string]: unknown   // allows any future jsonb fields without type errors
}

export type ProductBadge = 'sale' | 'new' | 'hot' | null

export type ProductCategory =
  | 'drills'
  | 'saws'
  | 'grinders'
  | 'nailers'
  | 'sanders'
  | 'measuring'
  | 'combo'
  | 'accessories'

export type ProductBrand =
  | 'DeWalt'
  | 'Milwaukee'
  | 'Makita'
  | 'Bosch'
  | 'Ridgid'
  | 'Ryobi'
  | 'Metabo'
  | 'Craftsman'

export type Product = {
  id:               string
  name:             string
  slug:             string
  brand:            ProductBrand
  category:         ProductCategory
  subcategory:      string
  model:            string
  description:      string | null
  price:            number          // always in cents
  compare_price:    number | null   // null = no sale
  voltage:          string
  images:           string[]        // Supabase Storage public URLs
  stock:            number
  stripe_price_id:  string | null   // set after Stripe sync
  badge:            ProductBadge
  rating:           number          // 1.0–5.0
  review_count:     number
  metadata:         ProductMetadata
  active:           boolean
  created_at:       string          // ISO timestamp
}

// Cart item — minimal shape stored in Zustand
export type CartItem = {
  productId: string
  name:      string
  price:     number   // cents, validated server-side before checkout
  quantity:  number
  image?:    string
}
