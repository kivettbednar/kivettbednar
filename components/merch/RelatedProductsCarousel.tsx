'use client'

import {useState, useRef, useEffect} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {ProductCard} from '@/components/ui/ProductCard'

type Product = {
  _id: string
  title: string
  slug: string
  image: any
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

type RelatedProductsCarouselProps = {
  products: Product[]
  title?: string
}

export function RelatedProductsCarousel({
  products,
  title = 'You May Also Like',
}: RelatedProductsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check scroll state
  const checkScrollState = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
  }

  useEffect(() => {
    checkScrollState()
    window.addEventListener('resize', checkScrollState)
    return () => window.removeEventListener('resize', checkScrollState)
  }, [products])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  if (products.length === 0) return null

  return (
    <div className="bg-background border-t border-border py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px bg-accent-primary w-12" />
                <span className="text-accent-primary text-xs uppercase tracking-wider font-bold">
                  Related Products
                </span>
              </div>
              <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary">
                {title}
              </h2>
            </div>

            {/* Navigation Buttons (Desktop) */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-12 h-12 border border-border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'hover:border-accent-primary hover:text-accent-primary'
                    : 'opacity-30 cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-12 h-12 border border-border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'hover:border-accent-primary hover:text-accent-primary'
                    : 'opacity-30 cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollState}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex-none w-[calc(100vw-2rem)] sm:w-[calc(50vw-3rem)] md:w-[calc(33.333vw-3rem)] lg:w-[calc(25vw-3rem)] snap-start"
                  style={{maxWidth: '400px'}}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Mobile Navigation Hint */}
            <div className="md:hidden mt-6 flex justify-center gap-2">
              {Array.from({length: Math.ceil(products.length / 2)}).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-border"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
