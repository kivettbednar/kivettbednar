'use client'

import {createContext, useContext, useEffect, useMemo, useState, useCallback} from 'react'
import {CartItem, loadCart, saveCart, cartTotalCents} from '@/lib/cart'

type PromoCodeData = {
  code: string
  discountCents: number
  description?: string
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, optionsKey?: string) => void
  updateQty: (productId: string, qty: number, optionsKey?: string) => void
  clear: () => void
  totalCents: number
  // Promo code state
  promoCode: PromoCodeData | null
  applyPromoCode: (code: string, discountCents: number, description?: string) => void
  removePromoCode: () => void
  finalTotalCents: number
}

const Ctx = createContext<CartState | null>(null)

export function optionsKey(options?: Record<string, string>) {
  if (!options) return ''
  return Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|')
}

export function CartProvider({children}: {children: React.ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState<PromoCodeData | null>(null)

  useEffect(() => {
    setItems(loadCart())
    // Load promo code from localStorage
    try {
      const savedPromo = localStorage.getItem('cart-promo-code')
      if (savedPromo) {
        setPromoCode(JSON.parse(savedPromo))
      }
    } catch (e) {
      // Ignore errors
    }
  }, [])

  useEffect(() => {
    saveCart(items)
  }, [items])

  // Save promo code to localStorage when it changes
  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem('cart-promo-code', JSON.stringify(promoCode))
      } else {
        localStorage.removeItem('cart-promo-code')
      }
    } catch (e) {
      // Ignore errors
    }
  }, [promoCode])

  const applyPromoCode = useCallback((code: string, discountCents: number, description?: string) => {
    setPromoCode({code, discountCents, description})
  }, [])

  const removePromoCode = useCallback(() => {
    setPromoCode(null)
  }, [])

  const totalCents = cartTotalCents(items)
  const finalTotalCents = Math.max(0, totalCents - (promoCode?.discountCents || 0))

  const api: CartState = useMemo(
    () => ({
      items,
      addItem: (item) => {
        setItems((prev) => {
          const key = optionsKey(item.options)
          const idx = prev.findIndex(
            (i) => i.productId === item.productId && optionsKey(i.options) === key,
          )
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = {...next[idx], quantity: next[idx].quantity + item.quantity}
            return next
          }
          return [...prev, item]
        })
      },
      removeItem: (productId, optKey = '') => {
        setItems((prev) => prev.filter((i) => !(i.productId === productId && optionsKey(i.options) === optKey)))
      },
      updateQty: (productId, qty, optKey = '') => {
        const safeQty = Math.max(1, Math.min(99, qty))
        setItems((prev) =>
          prev.map((i) => (i.productId === productId && optionsKey(i.options) === optKey ? {...i, quantity: safeQty} : i)),
        )
      },
      clear: () => {
        setItems([])
        setPromoCode(null)
      },
      totalCents,
      promoCode,
      applyPromoCode,
      removePromoCode,
      finalTotalCents,
    }),
    [items, totalCents, promoCode, applyPromoCode, removePromoCode, finalTotalCents],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

