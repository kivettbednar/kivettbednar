'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useCart, optionsKey} from './CartContext'
import {useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {X, Minus, Plus, ShoppingBag, Tag, Trash2} from 'lucide-react'

type PromoCodeData = {
  code: string
  discountType: string
  discountCents: number
  description: string
}

export function CartDrawer({open, onClose}: {open: boolean; onClose: () => void}) {
  const {items, totalCents, updateQty, removeItem, promoCode: appliedPromo, applyPromoCode, removePromoCode, finalTotalCents} = useCart()
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  // Handle Escape key to close drawer
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return

    setPromoLoading(true)
    setPromoError('')

    try {
      const response = await fetch('/api/promo-code', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          code: promoInput.trim(),
          cartTotal: totalCents,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPromoError(data.error || 'Failed to apply promo code')
      } else {
        applyPromoCode(data.code, data.discountCents, data.description)
        setPromoInput('')
        setPromoError('')
      }
    } catch (error) {
      setPromoError('Failed to apply promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleRemovePromo = () => {
    removePromoCode()
    setPromoInput('')
    setPromoError('')
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200]">
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{x: '100%'}}
            animate={{x: 0}}
            exit={{x: '100%'}}
            transition={{type: 'spring', damping: 30, stiffness: 300}}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-surface text-text-primary shadow-2xl flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-accent-primary" />
                <h2 id="cart-drawer-title" className="text-xl font-bebas uppercase tracking-wide">
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="text-xs bg-accent-primary text-black px-2 py-0.5 font-bold">
                    {items.reduce((sum, it) => sum + it.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                className="p-2 text-text-muted hover:text-white hover:bg-white/5 transition-colors rounded-full"
                onClick={onClose}
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-text-muted/30 mb-4" />
                  <p className="text-text-muted text-lg">Your cart is empty</p>
                  <Link
                    href="/merch"
                    onClick={onClose}
                    className="mt-4 text-accent-primary hover:underline text-sm"
                  >
                    Browse merchandise
                  </Link>
                </div>
              ) : (
                items.map((it, index) => {
                  const optKey = optionsKey(it.options)
                  const optDisplay = it.options ? Object.entries(it.options).map(([k, v]) => `${k}: ${v}`).join(', ') : ''
                  return (
                    <motion.div
                      key={it.productId + optKey}
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: index * 0.05}}
                      className="flex gap-4 p-3 bg-background/50 border border-border hover:border-border/80 transition-colors group"
                    >
                      {it.imageUrl && (
                        <Link href={`/merch/${it.slug}`} onClick={onClose} className="relative w-20 h-20 bg-surface flex-shrink-0 overflow-hidden">
                          <Image
                            src={it.imageUrl}
                            alt={it.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/merch/${it.slug}`}
                          onClick={onClose}
                          className="font-medium text-white hover:text-accent-primary transition-colors line-clamp-1"
                        >
                          {it.title}
                        </Link>
                        {optDisplay && (
                          <div className="text-xs text-text-muted mt-0.5">{optDisplay}</div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity controls */}
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQty(it.productId, Math.max(1, it.quantity - 1), optKey)}
                              className="p-1.5 text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                              {it.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(it.productId, it.quantity + 1, optKey)}
                              className="p-1.5 text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-bold text-accent-primary">
                            ${((it.priceCents * it.quantity) / 100).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(it.productId, optKey)}
                        className="p-1 text-text-muted hover:text-red-400 transition-colors self-start"
                        aria-label={`Remove ${it.title} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border bg-surface-elevated flex-shrink-0 safe-bottom space-y-4">
              {/* Promo Code Section */}
              {items.length > 0 && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-text-muted">
                    <Tag className="w-3.5 h-3.5" />
                    Promo Code
                  </label>
                  {!appliedPromo ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                        placeholder="Enter code"
                        className="flex-1 bg-background border border-border px-3 py-2.5 text-sm uppercase tracking-wider focus:border-accent-primary focus:outline-none transition-all"
                        disabled={promoLoading}
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoInput.trim()}
                        className="px-4 py-2.5 bg-accent-primary text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {promoLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{opacity: 0, scale: 0.95}}
                      animate={{opacity: 1, scale: 1}}
                      className="flex items-center justify-between bg-green-500/10 border border-green-500/30 px-3 py-2.5"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-green-400 text-sm uppercase tracking-wider">
                          {appliedPromo.code}
                        </div>
                        {appliedPromo.description && (
                          <div className="text-xs text-text-muted">{appliedPromo.description}</div>
                        )}
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="p-1 text-text-muted hover:text-red-400 transition-colors"
                        aria-label="Remove promo code"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                  {promoError && (
                    <div className="text-xs text-red-400">{promoError}</div>
                  )}
                </div>
              )}

              {/* Totals */}
              {items.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Subtotal</span>
                    <span className="text-white">${(totalCents / 100).toFixed(2)}</span>
                  </div>
                  {appliedPromo && appliedPromo.discountCents > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-${(appliedPromo.discountCents / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-accent-primary">${(finalTotalCents / 100).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {items.length > 0 && (
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block w-full py-4 bg-accent-primary text-black font-bold text-center uppercase tracking-wider hover:bg-accent-primary/90 transition-colors"
                >
                  View Cart / Checkout
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

