'use client'

import Link from 'next/link'
import {useState, useEffect, useRef} from 'react'
import {usePathname} from 'next/navigation'
import {ShoppingCart, Search, X} from 'lucide-react'
import {CartDrawer} from './CartDrawer'
import {SearchModal} from './SearchModal'
import {useCart} from './CartContext'
import {motion, AnimatePresence} from 'framer-motion'

interface HeaderProps {
  siteName?: string
  navigation?: Array<{title: string; href: string}>
}

export function Header({siteName, navigation}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isScrolled = scrollY > 20
  // Home page: logo fades from 0→1 across first 200px of scroll; elsewhere always visible.
  const logoOpacity = !mounted || !isHomePage ? 1 : Math.min(1, Math.max(0, scrollY / 200))
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const {items} = useCart()
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const prevItemCount = useRef(itemCount)
  const [cartBounce, setCartBounce] = useState(false)

  // Check if a nav item is active (matches current path)
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animate cart badge when item count increases
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setCartBounce(true)
      const timer = setTimeout(() => setCartBounce(false), 300)
      return () => clearTimeout(timer)
    }
    prevItemCount.current = itemCount
  }, [itemCount])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      // Close mobile menu on Escape
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  // Fallback navigation if not provided from CMS
  const navItems = navigation || [
    {title: 'Shows', href: '/shows'},
    {title: 'Lessons', href: '/lessons'},
    {title: 'Setlist', href: '/setlist'},
    {title: 'Merch', href: '/merch'},
    {title: 'Contact', href: '/contact'},
  ]

  const logoText = siteName || 'KIVETT BEDNAR'

  // Track scroll Y (throttled via rAF) — used for scrolled-bg and home logo fade.
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open (iOS-friendly approach)
  useEffect(() => {
    if (mobileMenuOpen) {
      // Store scroll position in a CSS variable for potential use
      const scrollY = window.scrollY
      document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`)

      // Apply scroll lock - works better on iOS than position:fixed
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      document.documentElement.style.overflow = 'hidden'
    } else {
      // Remove scroll lock
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.documentElement.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.documentElement.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="skip-to-content"
      >
        Skip to main content
      </a>

      <motion.header
        initial={{opacity: 0, y: -12}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1]}}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out ${
          isScrolled ? 'shadow-lg shadow-black/50' : ''
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
          borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.2)' : 'none',
        }}
        role="banner"
      >
        <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - White text with strong shadow for visibility over images */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-white hover:text-accent-primary"
            style={{
              opacity: logoOpacity,
              pointerEvents: logoOpacity < 0.2 ? 'none' : 'auto',
              transition: 'color 0.2s ease',
              textShadow: isScrolled
                ? '0 1px 2px rgba(0,0,0,0.5)'
                : '0 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.5)',
            }}
          >
            {logoText}
          </Link>

          {/* Desktop Navigation - Dark cinematic theme */}
          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = isActiveLink(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-link-animated font-medium uppercase tracking-wider text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-accent-primary'
                      : isScrolled
                        ? 'text-white/90 hover:text-accent-primary'
                        : 'text-white hover:text-accent-primary'
                  } ${isActive ? 'active' : ''}`}
                  style={{
                    textShadow: isScrolled
                      ? '0 1px 2px rgba(0,0,0,0.3)'
                      : '0 1px 3px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)'
                  }}
                >
                  {item.title}
                </Link>
              )
            })}
            {/* Search Button */}
            <button
              aria-label="Search products"
              className={`rounded-full p-2 transition-colors ${
                isScrolled ? 'text-white/90 hover:text-accent-primary' : 'text-white hover:text-accent-primary'
              }`}
              onClick={() => setSearchOpen(true)}
              type="button"
            >
              <Search className="h-6 w-6" />
            </button>
            {/* Cart Button */}
            <motion.button
              aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
              className={`relative rounded-full p-2 transition-colors ${
                isScrolled ? 'text-white/90 hover:text-accent-primary' : 'text-white hover:text-accent-primary'
              }`}
              onClick={() => setCartOpen(true)}
              type="button"
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              <ShoppingCart className="h-6 w-6" />
              <AnimatePresence mode="wait">
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{scale: 0.5, opacity: 0}}
                    animate={{
                      scale: cartBounce ? [1, 1.3, 1] : 1,
                      opacity: 1,
                    }}
                    exit={{scale: 0.5, opacity: 0}}
                    transition={{duration: 0.2}}
                    className="absolute -top-1 -right-1 text-xs bg-accent-primary text-black rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </nav>

          {/* Mobile menu button - Always white for visibility */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            style={{
              textShadow: isScrolled
                ? '0 1px 2px rgba(0,0,0,0.5)'
                : '0 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - Full-screen drawer with smooth animations */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] md:hidden"
                onClick={() => setMobileMenuOpen(false)}
                onTouchEnd={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Mobile Menu Drawer */}
              <motion.nav
                id="mobile-menu"
                initial={{x: '100%'}}
                animate={{x: 0}}
                exit={{x: '100%'}}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 250,
                  mass: 0.8,
                }}
                className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm z-[100] md:hidden overflow-y-auto overscroll-contain"
                role="navigation"
                aria-label="Mobile navigation"
                style={{
                  background: 'rgba(10, 10, 10, 0.98)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  borderLeft: '1px solid rgba(212, 175, 55, 0.2)',
                }}
              >
                <div className="flex flex-col h-full">
                  {/* Header with Close Button */}
                  <div className="flex items-center justify-between p-6 border-b border-accent-primary/20">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Menu</h2>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-white/80 hover:text-accent-primary transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Navigation Links with Staggered Animation */}
                  <div className="flex-1 px-6 py-8 space-y-2">
                    {navItems.map((item, index) => {
                      const isActive = isActiveLink(item.href)
                      return (
                        <motion.div
                          key={item.href}
                          initial={{opacity: 0, x: 20}}
                          animate={{opacity: 1, x: 0}}
                          transition={{
                            delay: index * 0.06,
                            duration: 0.25,
                            ease: 'easeOut',
                          }}
                        >
                          <Link
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={`block py-4 px-4 rounded-lg transition-all duration-200 font-medium uppercase tracking-wider text-lg border-l-2 active:scale-95 ${
                              isActive
                                ? 'text-accent-primary bg-accent-primary/10 border-accent-primary'
                                : 'text-white/90 hover:text-accent-primary hover:bg-accent-primary/10 border-transparent hover:border-accent-primary'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Bottom Actions with Divider */}
                  <div className="border-t border-accent-primary/20 p-6 space-y-4">
                    <motion.button
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      transition={{
                        delay: navItems.length * 0.06 + 0.1,
                        duration: 0.25,
                        ease: 'easeOut',
                      }}
                      aria-label="Search products"
                      className="flex items-center gap-3 text-white/90 hover:text-accent-primary hover:bg-accent-primary/10 transition-all duration-200 w-full py-3 px-4 rounded-lg active:scale-95"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setSearchOpen(true)
                      }}
                      type="button"
                    >
                      <Search className="h-5 w-5" />
                      <span className="uppercase tracking-wider text-sm font-medium">Search</span>
                    </motion.button>

                    <motion.div
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      transition={{
                        delay: navItems.length * 0.06 + 0.15,
                        duration: 0.25,
                        ease: 'easeOut',
                      }}
                      className="flex gap-3"
                    >
                      <button
                        aria-label="Open cart"
                        className="flex-1 flex items-center justify-center gap-2 text-white/90 hover:text-accent-primary hover:bg-accent-primary/10 transition-all duration-200 py-3 px-4 rounded-lg border border-accent-primary/30 active:scale-95"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setCartOpen(true)
                        }}
                        type="button"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="uppercase tracking-wider text-sm font-medium">Cart</span>
                        {itemCount > 0 && (
                          <span className="text-xs bg-accent-primary text-black rounded-full px-2 py-0.5 font-bold">
                            {itemCount}
                          </span>
                        )}
                      </button>
                      <Link
                        href="/cart"
                        className="btn-primary py-3 px-6 text-sm active:scale-95 transition-transform"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        View
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* Cart Drawer */}
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        {/* Search Modal */}
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
      </motion.header>
    </>
  )
}
