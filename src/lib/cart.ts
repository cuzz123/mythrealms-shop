// Client-side cart management
// Uses zustand for state + localStorage for persistence

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { trackAddToCart } from '@/lib/tracking'

export interface CartProduct {
  id: string
  name: string
  slug: string
  image: string
  price: number
  variantId?: string
  variantName?: string
}

export const MAX_GIFT_NOTE_LENGTH = 240

export function normalizeGiftNote(note?: string): string | undefined {
  if (typeof note !== "string") return undefined
  const normalized = note.trim().slice(0, MAX_GIFT_NOTE_LENGTH)
  return normalized || undefined
}

export interface CartItem {
  product: CartProduct
  quantity: number
  giftNote?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (product: CartProduct, quantity?: number, giftNote?: string) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  setGiftNote: (productId: string, variantId: string | undefined, note?: string) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, giftNote) => {
        trackAddToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          variant: product.variantName,
        })
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.product.variantId === product.variantId
          )

          if (existingIndex > -1) {
            const updated = [...state.items]
            updated[existingIndex].quantity += quantity
            return { items: updated }
          }

          const normalizedGiftNote = normalizeGiftNote(giftNote)
          return {
            items: [
              ...state.items,
              { product, quantity, ...(normalizedGiftNote ? { giftNote: normalizedGiftNote } : {}) },
            ],
          }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId && item.product.variantId === variantId)
          ),
        }))
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, variantId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.product.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      setGiftNote: (productId, variantId, note) => {
        const giftNote = normalizeGiftNote(note)
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.product.variantId === variantId
              ? { ...item, ...(giftNote ? { giftNote } : { giftNote: undefined }) }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
    }),
    { name: 'mythrealms-cart' }
  )
)

// Cart UI store — controls the cart drawer open/close state
interface CartUIStore {
  isOpen: boolean
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartUIStore = create<CartUIStore>()((set) => ({
  isOpen: false,
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}))
