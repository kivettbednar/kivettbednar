'use client'

import {useState, useMemo, useEffect} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {ProductCard} from '@/components/ui/ProductCard'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {Search, SlidersHorizontal, X} from 'lucide-react'
import {cn} from '@/lib/utils'
import type {ProductListItem} from '@/types/product'
import type {CollectionData} from './page'

type MerchPageData = {
  heroHeading?: string | null
  heroSubheading?: string | null
  heroImage?: {
    asset?: {url: string | null} | null
    alt?: string | null
  } | null
  emptyStateHeading?: string | null
  emptyStateText?: string | null
  emptyStateButton1Text?: string | null
  emptyStateButton1Link?: string | null
  emptyStateButton2Text?: string | null
  emptyStateButton2Link?: string | null
}

type Props = {
  merchPage: MerchPageData | null
  products: ProductListItem[]
  collections?: CollectionData[]
}

const PRODUCTS_PER_PAGE = 24

export function MerchPageContent({merchPage, products, collections}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      )
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }
    if (selectedCollection !== 'all' && collections?.length) {
      const col = collections.find(c => c.slug === selectedCollection)
      if (col?.productSlugs) {
        const slugSet = new Set(col.productSlugs.filter(Boolean))
        filtered = filtered.filter((p) => p.slug && slugSet.has(p.slug))
      }
    }
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        case 'price-low':
          return a.priceCents - b.priceCents
        case 'price-high':
          return b.priceCents - a.priceCents
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
    return sorted
  }, [products, selectedCategory, selectedCollection, sortBy, searchQuery, collections])

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE)
  }, [selectedCategory, selectedCollection, sortBy, searchQuery])

  const displayedProducts = filteredAndSortedProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAndSortedProducts.length

  const categories = [
    {value: 'all', label: 'All'},
    {value: 'apparel', label: 'Apparel'},
    {value: 'music', label: 'Music'},
    {value: 'accessories', label: 'Accessories'},
    {value: 'prints', label: 'Prints'},
    {value: 'amps', label: 'Amps & Cases'},
  ]

  const heroHeading = merchPage?.heroHeading || 'Merch'
  const heroSubheading = merchPage?.heroSubheading || 'Apparel, vinyl, and accessories — built for the road, the stage, and everywhere in between.'
  const emptyHeading = merchPage?.emptyStateHeading || 'Store Opening Soon'
  const emptyText = merchPage?.emptyStateText || 'Exclusive merchandise is coming your way. Premium apparel, limited edition vinyl, and unique accessories crafted for true blues enthusiasts.'
  const button1Text = merchPage?.emptyStateButton1Text || 'Get Notified'
  const button1Link = merchPage?.emptyStateButton1Link || '/contact'
  const button2Text = merchPage?.emptyStateButton2Text || 'See Live Shows'
  const button2Link = merchPage?.emptyStateButton2Link || '/shows'

  const hasActiveFilters = selectedCategory !== 'all' || selectedCollection !== 'all' || sortBy !== 'featured' || searchQuery.length > 0
  const heroImageUrl = merchPage?.heroImage?.asset?.url

  return (
    <div className="min-h-screen bg-background">
      {/* Compact editorial hero */}
      <section className="relative border-b border-white/5 overflow-hidden">
        {heroImageUrl ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={heroImageUrl}
                alt={merchPage?.heroImage?.alt || 'Kivett Bednar merchandise'}
                fill
                sizes="100vw"
                className="object-cover"
                style={{objectPosition: '50% 30%'}}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
              <div
                className="absolute inset-0"
                style={{background: 'radial-gradient(ellipse 50% 40% at 15% 80%, rgba(0,0,0,0.55), transparent 60%)'}}
              />
            </div>
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-80 pointer-events-none"
            style={{background: 'radial-gradient(ellipse 60% 50% at 85% 20%, rgba(212,175,55,0.12), transparent 60%)'}}
          />
        )}

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto py-20 md:py-28 lg:py-32">
            <AnimatedSection animation="fadeUp">
              <span className="inline-flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-accent-primary" />
                <span className="text-[11px] uppercase tracking-[0.35em] text-accent-primary font-medium">
                  Official Store
                </span>
              </span>
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <h1 className="font-bebas text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-none text-text-primary">
                {heroHeading}
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <p className="font-display italic text-lg md:text-xl text-text-secondary mt-5 max-w-2xl leading-snug">
                {heroSubheading}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {products && products.length > 0 ? (
              <>
                {/* Slim sticky filter bar */}
                <div className="sticky top-16 md:top-20 z-sticky bg-background/85 backdrop-blur-md border-b border-white/5 -mx-4 px-4">
                  <div className="py-4 flex items-center gap-3 flex-wrap">
                    {/* Category pills — horizontal scroll on mobile */}
                    <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none -mx-1 px-1">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {categories.map((cat) => {
                          const active = selectedCategory === cat.value
                          return (
                            <button
                              key={cat.value}
                              onClick={() => setSelectedCategory(cat.value)}
                              className={cn(
                                'px-4 py-1.5 text-xs uppercase tracking-[0.2em] border rounded-full transition-colors',
                                active
                                  ? 'bg-accent-primary text-black border-accent-primary'
                                  : 'bg-transparent text-text-secondary border-white/10 hover:border-accent-primary/60 hover:text-text-primary'
                              )}
                            >
                              {cat.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Sort (compact) */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="hidden md:block bg-transparent border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-text-secondary hover:border-accent-primary/60 focus:border-accent-primary focus:outline-none cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="name">Name A–Z</option>
                      <option value="price-low">Price ↑</option>
                      <option value="price-high">Price ↓</option>
                    </select>

                    {/* Search + advanced toggle */}
                    <button
                      type="button"
                      onClick={() => setFiltersOpen((v) => !v)}
                      aria-label="Toggle search and advanced filters"
                      className={cn(
                        'w-9 h-9 border rounded-full flex items-center justify-center transition-colors',
                        filtersOpen || searchQuery
                          ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                          : 'border-white/10 text-text-secondary hover:border-accent-primary/60 hover:text-text-primary'
                      )}
                    >
                      {filtersOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expandable search + collection */}
                  {filtersOpen && (
                    <div className="pb-4 flex flex-col md:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products, categories, tags…"
                          className="w-full bg-surface border border-white/10 pl-10 pr-10 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                          autoFocus
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-primary"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {collections && collections.length > 0 && (
                        <select
                          value={selectedCollection}
                          onChange={(e) => setSelectedCollection(e.target.value)}
                          className="bg-surface border border-white/10 px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none md:w-64"
                        >
                          <option value="all">All Collections</option>
                          {collections.map((col) => (
                            <option key={col._id} value={col.slug || col._id}>
                              {col.title}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Mobile sort */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="md:hidden bg-surface border border-white/10 px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
                      >
                        <option value="featured">Featured</option>
                        <option value="name">Name A–Z</option>
                        <option value="price-low">Price ↑</option>
                        <option value="price-high">Price ↓</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Results meta */}
                <div className="flex items-center justify-between py-4 text-xs uppercase tracking-[0.2em] text-text-muted">
                  <span>
                    {filteredAndSortedProducts.length}{' '}
                    {filteredAndSortedProducts.length === 1 ? 'Product' : 'Products'}
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all')
                        setSelectedCollection('all')
                        setSortBy('featured')
                        setSearchQuery('')
                        setVisibleCount(PRODUCTS_PER_PAGE)
                      }}
                      className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Products grid */}
                {filteredAndSortedProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-16">
                      {displayedProducts.map((product, index) => (
                        <ProductCard key={product._id} product={product} priority={index < 4} />
                      ))}
                    </div>
                    {hasMore && (
                      <div className="text-center pb-24">
                        <button
                          onClick={() => setVisibleCount(prev => prev + PRODUCTS_PER_PAGE)}
                          className="inline-flex items-center gap-3 px-8 py-3 border border-white/15 text-text-primary uppercase tracking-[0.25em] text-xs font-semibold hover:border-accent-primary hover:text-accent-primary transition-colors"
                        >
                          <span>Load More</span>
                          <span className="text-text-muted">
                            ({filteredAndSortedProducts.length - visibleCount} remaining)
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <AnimatedSection animation="fadeUp" delay={0.1}>
                    <div className="py-24 text-center">
                      <h3 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-3">
                        No Products Found
                      </h3>
                      <p className="text-text-secondary mb-6">
                        Nothing matches your current filters.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory('all')
                          setSortBy('featured')
                          setSearchQuery('')
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-black font-semibold uppercase tracking-[0.25em] text-xs hover:bg-accent-primary/90 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </AnimatedSection>
                )}
              </>
            ) : (
              <AnimatedSection animation="fadeUp" delay={0.1}>
                <div className="py-24 md:py-32 max-w-2xl mx-auto text-center">
                  <h2 className="font-bebas text-5xl md:text-6xl uppercase tracking-tight text-text-primary mb-5 leading-none">
                    {emptyHeading}
                  </h2>
                  <p className="font-display italic text-lg md:text-xl text-text-secondary mb-10 leading-snug">
                    {emptyText}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href={button1Link}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent-primary text-black font-semibold uppercase tracking-[0.25em] text-xs hover:bg-accent-primary/90 transition-colors"
                    >
                      {button1Text}
                    </Link>
                    <Link
                      href={button2Link}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/15 text-text-primary uppercase tracking-[0.25em] text-xs font-semibold hover:border-accent-primary hover:text-accent-primary transition-colors"
                    >
                      {button2Text}
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
