'use client'

import Link from 'next/link'
import {useState, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {ChevronUp, Music2} from 'lucide-react'

interface FooterProps {
  navigation?: Array<{title: string; href: string}>
  siteName?: string
  siteTagline?: string
  navigationHeading?: string
  connectHeading?: string
  socialLinks?: Array<{platform: string; url: string}>
  socialFacebookLabel?: string
  socialInstagramLabel?: string
  copyrightText?: string
  bookingText?: string
  bioLabel?: string
  epkLabel?: string
  showBio?: boolean
  showEpk?: boolean
}

// Social media icons
const SocialIcon = ({platform}: {platform: string}) => {
  const normalized = platform.toLowerCase()

  if (normalized === 'facebook') {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    )
  }

  if (normalized === 'instagram') {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
      </svg>
    )
  }

  if (normalized === 'youtube') {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }

  if (normalized === 'spotify') {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    )
  }

  // Default music icon
  return <Music2 className="w-5 h-5" />
}

export function Footer({
  navigation,
  siteName,
  siteTagline,
  navigationHeading,
  connectHeading,
  socialLinks,
  socialFacebookLabel,
  socialInstagramLabel,
  copyrightText,
  bookingText,
  bioLabel,
  epkLabel,
  showBio = true,
  showEpk = true,
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const navItems = navigation || [
    {title: 'Shows', href: '/shows'},
    {title: 'Lessons', href: '/lessons'},
    {title: 'Setlist', href: '/setlist'},
    {title: 'Merch', href: '/merch'},
    {title: 'Contact', href: '/contact'},
  ]

  const defaultSocialLinks = [
    {platform: 'facebook', url: 'https://www.facebook.com/kivettbednar'},
    {platform: 'instagram', url: 'https://www.instagram.com/kivettbednar'},
  ]

  const social = socialLinks && socialLinks.length > 0 ? socialLinks : defaultSocialLinks

  const getPlatformLabel = (platform: string) => {
    const normalized = platform.toLowerCase()
    if (normalized === 'facebook') return socialFacebookLabel || 'Facebook'
    if (normalized === 'instagram') return socialInstagramLabel || 'Instagram'
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  return (
    <>
      <footer className="relative bg-background border-t border-border text-text-primary overflow-hidden">
        {/* Subtle ambient glow at top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)',
          }}
        />

        <div className="container mx-auto px-4 py-16">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            {/* Brand - larger column */}
            <div className="md:col-span-5">
              <Link href="/" className="inline-block group">
                <h3 className="text-3xl font-bebas uppercase tracking-wide text-white group-hover:text-accent-primary transition-colors">
                  {siteName || 'Kivett Bednar'}
                </h3>
              </Link>
              <p className="mt-4 text-text-muted max-w-sm leading-relaxed">
                {siteTagline || 'Gritty Texas Blues meets the heart of the Pacific Northwest'}
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-5 mt-6">
                {social.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={getPlatformLabel(link.platform)}
                    className="text-text-muted hover:text-accent-primary transition-colors duration-300"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold mb-6 text-accent-primary uppercase tracking-[0.2em]">
                {navigationHeading || 'Navigation'}
              </h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-text-secondary hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-accent-primary group-hover:w-4 transition-all duration-300" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-semibold mb-6 text-accent-primary uppercase tracking-[0.2em]">
                {connectHeading || 'Get in Touch'}
              </h4>
              <div className="space-y-4">
                <p className="text-text-muted text-sm">
                  {bookingText || 'For booking inquiries, lessons, or just to say hello.'}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-white hover:text-accent-primary transition-colors group"
                >
                  <span>Contact</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              {copyrightText
                ? copyrightText.replace('{year}', currentYear.toString())
                : `© ${currentYear} Kivett Bednar. All rights reserved.`}
            </p>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-text-muted">
              {showBio && (
                <>
                  <Link href="/bio" className="hover:text-text-secondary transition-colors">
                    {bioLabel || 'Bio'}
                  </Link>
                  <span className="w-1 h-1 rounded-full bg-border" />
                </>
              )}
              {showEpk && (
                <>
                  <Link href="/epk" className="hover:text-text-secondary transition-colors">
                    {epkLabel || 'Press Kit'}
                  </Link>
                  <span className="w-1 h-1 rounded-full bg-border" />
                </>
              )}
              <Link href="/privacy-policy" className="hover:text-text-secondary transition-colors">
                Privacy Policy
              </Link>
              <span className="w-1 h-1 rounded-full bg-border" />
              <Link href="/terms" className="hover:text-text-secondary transition-colors">
                Terms of Service
              </Link>
              <span className="w-1 h-1 rounded-full bg-border" />
              <Link href="/returns" className="hover:text-text-secondary transition-colors">
                Returns & Refunds
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 20}}
            transition={{duration: 0.2}}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-surface border border-border rounded-full text-text-muted hover:text-accent-primary hover:border-accent-primary hover:bg-accent-primary/10 transition-all duration-300 shadow-lg"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
