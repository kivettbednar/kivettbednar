'use client'

import Image from 'next/image'
import Link from 'next/link'
import {urlFor} from '@/lib/image-positioning'
import {useState} from 'react'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'
import {formatCurrency} from '@/lib/format'

type Product = {
  _id: string
  title: string
  slug: string
  image: (SanityImageWithPositioning & {alt?: string}) | null
  priceCents: number
  compareAtPriceCents?: number
  onSale?: boolean
  currency: string
  stockStatus?: string
  badges?: string[]
  inventoryQuantity?: number
  trackInventory?: boolean
  lowStockThreshold?: number
  hasOptions?: boolean
}

export function ProductCard({product, priority = false}: {product: Product; priority?: boolean}) {
  const isMobile = useIsMobile()
  const [imageError, setImageError] = useState(false)

  const formattedPrice = formatCurrency(product.priceCents, product.currency)
  const compareAtPriceCents = typeof product.compareAtPriceCents === 'number' ? product.compareAtPriceCents : null
  const formattedCompareAtPrice = compareAtPriceCents
    ? formatCurrency(compareAtPriceCents, product.currency)
    : null

  // Calculate stock status
  const isLowStock =
    product.trackInventory &&
    product.inventoryQuantity !== undefined &&
    product.inventoryQuantity > 0 &&
    product.inventoryQuantity <= (product.lowStockThreshold || 5)

  const isOutOfStock =
    product.trackInventory &&
    product.inventoryQuantity !== undefined &&
    product.inventoryQuantity === 0

  const discountPercentage =
    product.onSale && product.compareAtPriceCents
      ? Math.round(((product.compareAtPriceCents - product.priceCents) / product.compareAtPriceCents) * 100)
      : null

  const imageAsset = product.image?.asset
  const imageUrl = imageAsset ? urlFor(imageAsset).width(500).height(500).url() : null
  const blurDataURL = imageAsset?.metadata?.lqip || undefined

  return (
    <Link
      href={`/merch/${product.slug}`}
      className="group block bg-surface border border-border hover:border-accent-primary transition-colors duration-300 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-background overflow-hidden">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={product.image?.alt || product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setImageError(true)}
            style={{
              objectPosition: product.image ? getObjectPosition(product.image, isMobile) : 'center',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated via-surface to-background flex items-center justify-center">
            <svg
              className="w-16 h-16 text-text-muted/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.onSale && discountPercentage && (
            <span className="bg-accent-red text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider">
              {discountPercentage}% Off
            </span>
          )}
          {product.badges?.map((badge) => (
            <span
              key={badge}
              className="bg-accent-primary text-black text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider"
            >
              {badge === 'bestseller'
                ? 'Best Seller'
                : badge === 'limited'
                ? 'Limited'
                : badge === 'tour-exclusive'
                ? 'Tour Exclusive'
                : badge === 'back-in-stock'
                ? 'Back in Stock'
                : badge === 'new'
                ? 'New'
                : badge}
            </span>
          ))}
          {isOutOfStock && (
            <span className="bg-text-muted text-black text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider">
              Out of Stock
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-orange-600 text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider">
              Only {product.inventoryQuantity} Left
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 border-t border-border">
        <h3 className="font-bebas text-lg md:text-xl uppercase tracking-wide text-text-primary group-hover:text-accent-primary transition-colors duration-200 mb-2 line-clamp-2 leading-tight">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-accent-primary">{formattedPrice}</span>
          {formattedCompareAtPrice && product.onSale && (
            <span className="text-sm text-text-muted line-through">{formattedCompareAtPrice}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
