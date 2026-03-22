'use client'

import {useState, useEffect, useRef, useCallback} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {motion, AnimatePresence} from 'framer-motion'
import {Search, X, Loader2, Command} from 'lucide-react'
import {formatPrice} from '@/lib/format'

type SearchResult = {
  _id: string
  title: string
  slug: string
  priceCents: number
  currency: string
  images?: Array<{asset?: {url: string}; alt?: string}>
}

type SearchModalProps = {
  open: boolean
  onClose: () => void
}

export function SearchModal({open, onClose}: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [results])

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
      setQuery('')
      setSelectedIndex(-1)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          router.push(`/merch/${results[selectedIndex].slug}`)
          onClose()
        }
        break
    }
  }, [results, selectedIndex, router, onClose])

  // Handle Escape key
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

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      setError('')
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Search failed')
          setResults([])
          return
        }

        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError('Search failed. Please try again.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[300]">
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="relative z-10 container mx-auto px-4 pt-20">
            <motion.div
              initial={{opacity: 0, y: -20, scale: 0.98}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: -20, scale: 0.98}}
              transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-modal-title"
              className="max-w-3xl mx-auto bg-surface border border-border shadow-2xl overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.1)',
              }}
            >
              {/* Search Input */}
              <div className="p-6 border-b border-border bg-surface-elevated">
                <h2 id="search-modal-title" className="sr-only">Search Products</h2>
                <div className="flex items-center gap-4">
                  <Search className="w-6 h-6 text-accent-primary flex-shrink-0" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for products..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-muted text-lg font-medium"
                    aria-label="Search for products"
                    aria-autocomplete="list"
                    aria-controls="search-results"
                    aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
                  />
                  {loading && (
                    <Loader2 className="w-5 h-5 text-accent-primary animate-spin" aria-hidden="true" />
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-text-muted hover:text-white hover:bg-white/5 transition-colors rounded-full"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {error && (
                  <div className="p-8 text-center text-red-400" role="alert">
                    {error}
                  </div>
                )}

                {query.length >= 2 && !loading && !error && results.length === 0 && (
                  <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="p-8 text-center text-text-muted"
                  >
                    No products found for &quot;{query}&quot;
                  </motion.div>
                )}

                {results.length > 0 && (
                  <div className="p-4" ref={resultsRef}>
                    <div id="search-results" role="listbox" className="grid gap-1">
                      {results.map((product, index) => {
                        const isSelected = index === selectedIndex
                        return (
                        <motion.div
                          key={product._id}
                          initial={{opacity: 0, y: 10}}
                          animate={{opacity: 1, y: 0}}
                          transition={{delay: index * 0.03}}
                        >
                          <Link
                            id={`search-result-${index}`}
                            role="option"
                            aria-selected={isSelected}
                            href={`/merch/${product.slug}`}
                            onClick={onClose}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`flex items-center gap-4 p-3 border transition-all group ${
                              isSelected
                                ? 'bg-accent-primary/10 border-accent-primary/30'
                                : 'hover:bg-white/5 border-transparent hover:border-border'
                            }`}
                          >
                            {/* Product Image */}
                            <div className="w-14 h-14 bg-background border border-border flex-shrink-0 relative overflow-hidden">
                              {product.images?.[0]?.asset?.url ? (
                                <Image
                                  src={product.images[0].asset.url}
                                  alt={product.images[0].alt || product.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg
                                    className="w-6 h-6 text-text-muted/30"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1}
                                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bebas text-lg uppercase tracking-wide text-white group-hover:text-accent-primary transition-colors truncate">
                                {product.title}
                              </h3>
                              <span className="text-sm font-bold text-accent-primary">
                                ${formatPrice(product.priceCents)}
                              </span>
                            </div>

                            {/* Arrow */}
                            <div className="flex-shrink-0 text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </Link>
                        </motion.div>
                      )})}
                    </div>

                    {results.length === 8 && (
                      <div className="mt-4 text-center text-xs text-text-muted">
                        Showing top 8 results. Try refining your search for more specific results.
                      </div>
                    )}
                  </div>
                )}

                {query.length > 0 && query.length < 2 && (
                  <div className="p-8 text-center text-text-muted text-sm">
                    Type at least 2 characters to search
                  </div>
                )}
              </div>

              {/* Keyboard hints */}
              <div className="px-6 py-3 border-t border-border bg-surface-elevated/50 flex items-center justify-center gap-4 flex-wrap">
                <span className="text-xs text-text-muted flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border text-text-secondary rounded text-xs font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-background border border-border text-text-secondary rounded text-xs font-mono">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border text-text-secondary rounded text-xs font-mono">↵</kbd>
                  <span>select</span>
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border text-text-secondary rounded text-xs font-mono">esc</kbd>
                  <span>close</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
