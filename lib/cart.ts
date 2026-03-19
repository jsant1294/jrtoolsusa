/**
 * JRToolsUSA — Cart Store
 * File: lib/cart.ts
 *
 * Zustand store with localStorage persistence.
 * Used by: AddToCartSection, CartDrawer, CheckoutButton, Nav cart count.
 *
 * Requirements:
 *   npm install zustand
 */

import { create }         from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem }  from '@/types/product'

// ─── Types ────────────────────────────────────────────────────────────────────

type CartStore = {
  items:        CartItem[]
  isOpen:       boolean

  // Actions
  addItem:      (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem:   (productId: string) => void
  updateQty:    (productId: string, quantity: number) => void
  clearCart:    () => void
  openCart:     () => void
  closeCart:    () => void
  toggleCart:   () => void

  // Computed (called as functions — Zustand doesn't support computed props)
  totalItems:   () => number
  totalPrice:   () => number
  itemCount:    (productId: string) => number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_QTY_PER_ITEM = 99
const MAX_LINE_ITEMS   = 50   // Stripe checkout supports up to 100 — stay safe at 50

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({

      items:  [],
      isOpen: false,

      // ── Add item ────────────────────────────────────────────

      addItem: (incoming) => {
        const { productId, name, price, image } = incoming
        const qty = incoming.quantity ?? 1

        set(state => {
          const existing = state.items.find(i => i.productId === productId)

          if (existing) {
            // Increment existing item — cap at MAX_QTY_PER_ITEM
            return {
              items: state.items.map(i =>
                i.productId === productId
                  ? { ...i, quantity: Math.min(i.quantity + qty, MAX_QTY_PER_ITEM) }
                  : i
              ),
              isOpen: true,
            }
          }

          // Add new item — cap total line items
          if (state.items.length >= MAX_LINE_ITEMS) {
            console.warn(`JRToolsUSA cart: max ${MAX_LINE_ITEMS} line items reached`)
            return state
          }

          return {
            items: [...state.items, { productId, name, price, image, quantity: Math.min(qty, MAX_QTY_PER_ITEM) }],
            isOpen: true,
          }
        })
      },

      // ── Remove item ─────────────────────────────────────────

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(i => i.productId !== productId),
        }))
      },

      // ── Update quantity ─────────────────────────────────────

      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, MAX_QTY_PER_ITEM) }
              : i
          ),
        }))
      },

      // ── Clear cart ──────────────────────────────────────────

      clearCart: () => set({ items: [] }),

      // ── Drawer controls ─────────────────────────────────────

      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      // ── Computed ────────────────────────────────────────────

      totalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      totalPrice: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },

      itemCount: (productId) => {
        return get().items.find(i => i.productId === productId)?.quantity ?? 0
      },
    }),

    {
      name:    'jrtoolsusa-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items — not the drawer open state
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format cart items for the /api/checkout POST body.
 * Called by CheckoutButton before sending to the server.
 */
export function cartItemsForCheckout(items: CartItem[]) {
  return items.map(item => ({
    productId: item.productId,
    quantity:  item.quantity,
    price:     item.price,  // server re-validates this against DB — don't trust client
  }))
}

/**
 * Format cents as USD string.
 * e.g. 14900 → "$149"
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

/**
 * Free shipping threshold — returns amount remaining in cents.
 * e.g. threshold = 9900 ($99), cart = 4900 → returns 5000 ($50 remaining)
 */
export function freeShippingRemaining(totalCents: number, thresholdCents = 9900): number {
  return Math.max(0, thresholdCents - totalCents)
}
