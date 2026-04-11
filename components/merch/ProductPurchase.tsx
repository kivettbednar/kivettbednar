"use client"

import {useState} from 'react'
import {useCart} from '@/components/ui/CartContext'
import {useToast} from '@/components/ui/Toast'

import {variantOptionValuesToRecord} from '@/types/product'
import {formatCurrency} from '@/lib/format'

type ProductOption = {name: string; values: string[]}
type ProductVariant = {optionValues?: Array<{key?: string; value?: string; _key: string}>; priceCents?: number; sku?: string}

export function PurchaseSection({
  product,
}: {
  product: {
    _id: string
    title: string
    slug: string
    priceCents: number
    currency: string
    options: ProductOption[]
    variants?: ProductVariant[]
    imageUrl?: string
  }
}) {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const {addItem} = useCart()
  const {showToast} = useToast()

  // Check for variant-specific pricing
  const effectivePriceCents = (() => {
    if (!product.variants || !Object.keys(selected).length) return product.priceCents
    const matchingVariant = product.variants.find((v) => {
      if (!v.optionValues) return false
      const ov = variantOptionValuesToRecord(v.optionValues)
      return Object.entries(selected).every(
        ([key, val]) => ov[key] === val || ov[key.toLowerCase()] === val
      )
    })
    return matchingVariant?.priceCents || product.priceCents
  })()

  const normalizedUnitPrice = effectivePriceCents || 0
  const unitPriceDisplay = formatCurrency(normalizedUnitPrice, product.currency)
  const totalPriceDisplay = formatCurrency(normalizedUnitPrice * quantity, product.currency)

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      title: product.title,
      slug: product.slug,
      imageUrl: product.imageUrl,
      priceCents: effectivePriceCents,
      currency: product.currency || 'USD',
      quantity,
      options: Object.keys(selected).length ? selected : undefined,
    })

    // Show success toast
    showToast(`Added ${quantity}x ${product.title} to cart!`, 'success')
  }

  return (
    <div className="space-y-6">
      {/* Options */}
      {product.options?.map((opt) => (
        <div key={opt.name}>
          <label className="block text-sm uppercase tracking-wider font-bold text-text-primary mb-3">
            {opt.name}
          </label>
          <div className="flex gap-3 flex-wrap">
            {opt.values?.map((val) => (
              <button
                key={val}
                className={`px-5 py-3 border transition-all duration-200 uppercase tracking-wide text-sm font-bold ${
                  selected[opt.name] === val
                    ? 'bg-accent-primary text-black border-accent-primary'
                    : 'bg-transparent text-text-secondary border-border hover:border-accent-primary hover:text-text-primary'
                }`}
                onClick={() => setSelected((s) => ({...s, [opt.name]: val}))}
                type="button"
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm uppercase tracking-wider font-bold text-text-primary mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 border border-border hover:border-accent-primary hover:bg-accent-primary hover:text-black transition-all duration-200 flex items-center justify-center text-text-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <div className="w-20 h-12 border border-border bg-background flex items-center justify-center text-text-primary font-bold text-lg">
            {quantity}
          </div>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 border border-border hover:border-accent-primary hover:bg-accent-primary hover:text-black transition-all duration-200 flex items-center justify-center text-text-primary font-bold"
            type="button"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        {/* Show unit price if quantity > 1 */}
        {quantity > 1 && (
          <p className="text-text-muted text-sm mt-2">
            {unitPriceDisplay} each × {quantity}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Add to Cart Button */}
      <button
        className="w-full group relative bg-accent-primary hover:bg-accent-primary/90 text-black font-bold text-lg uppercase tracking-wider py-5 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-accent-primary/30"
        onClick={handleAddToCart}
        type="button"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <span className="flex flex-col items-center">
              <span className="flex items-center gap-2">
                Add to Cart
                <span className="inline-block w-px h-4 bg-black/30" />
                {totalPriceDisplay}
              </span>
            {quantity > 1 && (
              <span className="text-xs font-normal opacity-75 mt-0.5">
                {quantity} items
              </span>
            )}
          </span>
        </span>
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>

      {/* Additional Info */}
      <div className="flex items-start gap-2 text-text-muted text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 flex-shrink-0 mt-0.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Secure checkout with cart functionality</span>
      </div>
    </div>
  )
}
