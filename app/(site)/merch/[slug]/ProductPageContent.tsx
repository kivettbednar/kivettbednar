'use client'

import Image from 'next/image'
import {useState} from 'react'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {PurchaseSection} from '@/components/merch/ProductPurchase'
import {ImageLightbox} from '@/components/ui/ImageLightbox'
import {RelatedProductsCarousel} from '@/components/merch/RelatedProductsCarousel'
import {PortableText} from '@portabletext/react'
import {motion} from 'framer-motion'
import {ShieldCheck, Star, Truck, Package, Guitar, Sparkles} from 'lucide-react'
import type {Product, ProductListItem} from '@/types/product'

type ProductPageContentProps = {
  product: Product
  price: string
  productSlug: string
  mainImageUrl?: string
  thumbnailImages?: Array<{url: string; alt: string}>
  allImages?: Array<{url: string; alt: string}>
  relatedProducts?: ProductListItem[]
  trustBadges?: Array<{title: string; description: string; icon: string}>
}

export function ProductPageContent({product, price, productSlug, mainImageUrl, thumbnailImages, allImages, relatedProducts = [], trustBadges}: ProductPageContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }
  return (
    <>
      {/* Hero Section with Product Title */}
      <div className="relative bg-background border-b border-border">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn" delay={0.1}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="h-px bg-accent-primary w-8 sm:w-12" />
                <span className="text-accent-primary text-xs sm:text-sm uppercase tracking-wider font-bold">
                  Official Merch
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.2}>
              <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-wide text-text-primary mb-4">
                {product.title}
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.3}>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent-primary">${price}</span>
                  <span className="text-text-muted uppercase tracking-wide text-sm sm:text-base">{product.currency}</span>
                </div>
                {product.stockStatus !== 'out_of_stock' && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-medium uppercase tracking-wide">In Stock</span>
                  </div>
                )}
                {product.stockStatus === 'out_of_stock' && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-red-400 text-sm font-medium uppercase tracking-wide">Out of Stock</span>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-surface py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
              {/* Images Section */}
              <div className="space-y-6">
                {/* Main Image */}
                <AnimatedSection animation="fadeIn" delay={0.1}>
                  {mainImageUrl ? (
                    <button
                      onClick={() => openLightbox(0)}
                      className="relative aspect-square bg-background border border-border overflow-hidden group w-full cursor-zoom-in"
                      aria-label="View image in lightbox"
                    >
                      <Image
                        src={mainImageUrl}
                        alt={product.images?.[0]?.alt || product.title || 'Product image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(min-width: 768px) 50vw, 100vw"
                        priority
                      />
                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {/* Zoom indicator */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-2 text-xs uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                        Click to Zoom
                      </div>
                    </button>
                  ) : (
                    <div className="relative aspect-square bg-gradient-to-br from-surface-elevated via-surface to-background border border-border flex items-center justify-center">
                      <div className="text-center px-8">
                        <svg
                          className="w-24 h-24 mx-auto text-text-muted/20 mb-3"
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
                        <p className="text-text-muted/40 text-sm uppercase tracking-widest font-bold">Image Coming Soon</p>
                      </div>
                    </div>
                  )}
                </AnimatedSection>

                {/* Thumbnail Gallery */}
                {thumbnailImages && thumbnailImages.length > 0 && (
                  <AnimatedSection animation="fadeUp" delay={0.2}>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                      {thumbnailImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => openLightbox(idx + 1)}
                          className="relative aspect-square bg-background border border-border overflow-hidden group cursor-pointer hover:border-accent-primary transition-colors"
                          aria-label={`View image ${idx + 2} in lightbox`}
                        >
                          <Image
                            src={img.url}
                            alt={img.alt || ''}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(min-width: 640px) 12vw, 30vw"
                          />
                        </button>
                      ))}
                    </div>
                  </AnimatedSection>
                )}
              </div>

              {/* Details Section */}
              <div className="space-y-8">
                {/* Description */}
                {product.description && (
                  <AnimatedSection animation="fadeUp" delay={0.2}>
                    <div className="prose prose-invert prose-lg max-w-none">
                      <div className="text-text-secondary leading-relaxed">
                        <PortableText value={product.description} />
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Purchase Section */}
                <AnimatedSection animation="fadeUp" delay={0.3}>
                  <div className="bg-gradient-to-br from-surface-elevated to-surface border-2 border-accent-primary/20 p-6 sm:p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="font-bebas text-xl sm:text-2xl uppercase tracking-wide text-text-primary">
                        Select Options
                      </h3>
                      {product.stockStatus !== 'out_of_stock' && (
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Available</span>
                        </div>
                      )}
                    </div>
                    <PurchaseSection
                      product={{
                        _id: product._id,
                        title: product.title,
                        slug: productSlug,
                        priceCents: product.priceCents,
                        currency: product.currency,
                        options: product.options || [],
                        variants: product.variants || [],
                        imageUrl: product.images?.[0]?.asset?.url || undefined
                      }}
                    />
                  </div>
                </AnimatedSection>

                {/* Shipping Info */}
                {product.shippingNotes && (
                  <AnimatedSection animation="fadeUp" delay={0.4}>
                    <div className="bg-background/50 border border-border p-6">
                      <div className="flex gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-accent-primary flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                          />
                        </svg>
                        <div>
                          <h4 className="font-bold text-text-primary mb-1 uppercase tracking-wide text-sm">
                            Shipping Information
                          </h4>
                          <p className="text-text-secondary text-sm">{product.shippingNotes}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {/* Trust Badges & Emotional Connection */}
                <AnimatedSection animation="fadeUp" delay={0.5}>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                    {(trustBadges && trustBadges.length > 0 ? trustBadges : [
                      {title: 'Authentic', description: 'Official merchandise', icon: 'shield'},
                      {title: 'Quality', description: 'Premium materials', icon: 'star'},
                      {title: 'Free Shipping', description: 'On all orders', icon: 'truck'},
                      {title: 'Blues Spirit', description: 'Crafted with soul', icon: 'guitar'},
                    ]).map((badge, index) => {
                      const IconComponent = {
                        shield: ShieldCheck,
                        star: Star,
                        truck: Truck,
                        guitar: Guitar,
                        package: Package,
                        sparkles: Sparkles,
                      }[badge.icon] || ShieldCheck
                      return (
                        <div key={index} className="bg-background/30 border border-border p-4 hover:border-accent-primary/50 transition-all duration-300 group">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="w-5 h-5 text-accent-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <div className="text-accent-primary font-bold uppercase tracking-wider text-xs sm:text-sm">
                              {badge.title}
                            </div>
                          </div>
                          <div className="text-text-muted text-xs sm:text-sm">{badge.description}</div>
                        </div>
                      )
                    })}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProductsCarousel products={relatedProducts} />
      )}

      {/* Image Lightbox */}
      {allImages && allImages.length > 0 && (
        <ImageLightbox
          images={allImages}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
