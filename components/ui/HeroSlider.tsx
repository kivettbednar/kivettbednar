'use client'

import {useState, useEffect, useRef} from 'react'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {motion, useScroll, useTransform} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {getObjectPosition, type SanityImageWithPositioning, type PositionValue} from '@/lib/image-positioning'
import {textSizeMap, desktopSizeMap} from '@/lib/tailwind-maps'

interface HeroSlide {
  _key: string
  image: SanityImageWithPositioning | null
  mobileImage?: SanityImageWithPositioning | null
  alt: string | null
  desktopPosition?: string | null
  mobilePosition?: string | null
}

interface NextShow {
  startDateTime: string
  venue: string
  city?: string
  timezone?: string
}

interface HeroSliderProps {
  slides?: HeroSlide[]
  heading?: string
  subheading?: string
  tagline?: string
  buttonText?: string
  headingDesktopSize?: string
  headingMobileSize?: string
  headingTracking?: string
  headingLineHeight?: string
  subheadingTracking?: string
  subheadingLineHeight?: string
  nextShow?: NextShow | null
}

function formatShowDate(iso: string, timezone?: string): {weekday: string; day: string; time: string} {
  try {
    const d = new Date(iso)
    const tz = timezone || undefined
    const weekday = new Intl.DateTimeFormat('en-US', {weekday: 'short', timeZone: tz}).format(d).toUpperCase()
    const day = new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', timeZone: tz}).format(d).toUpperCase()
    const time = new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: '2-digit', timeZone: tz}).format(d)
    return {weekday, day, time}
  } catch {
    return {weekday: '', day: '', time: ''}
  }
}

export function HeroSlider({
  slides = [],
  heading = 'Kivett Bednar',
  subheading = 'Blues • Guitar • Portland',
  tagline = 'Gritty Texas Blues meets the heart of the Pacific Northwest',
  buttonText = 'See Live Shows',
  headingDesktopSize = 'text-8xl',
  headingMobileSize = 'text-5xl',
  headingTracking = 'tracking-tight',
  headingLineHeight = 'leading-none',
  subheadingTracking = 'tracking-normal',
  subheadingLineHeight = 'leading-normal',
  nextShow = null,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)

  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 400])

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 6000)
      return () => clearInterval(timer)
    }
  }, [slides.length])

  const trackingMap: Record<string, string> = {
    'tracking-tighter': 'tracking-tighter',
    'tracking-tight': 'tracking-tight',
    'tracking-normal': 'tracking-normal',
    'tracking-wide': 'tracking-wide',
    'tracking-wider': 'tracking-wider',
    'tracking-widest': 'tracking-widest',
  }

  const leadingMap: Record<string, string> = {
    'leading-none': 'leading-none',
    'leading-tight': 'leading-tight',
    'leading-snug': 'leading-snug',
    'leading-normal': 'leading-normal',
    'leading-relaxed': 'leading-relaxed',
  }

  const nextShowFormatted = nextShow?.startDateTime
    ? formatShowDate(nextShow.startDateTime, nextShow.timezone)
    : null
  const slideCount = slides.length
  const pad2 = (n: number) => String(n).padStart(2, '0')

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex overflow-hidden bg-background"
      style={{
        containIntrinsicSize: '100vh',
      }}
    >
      {/* Parallax Background Slider with Ken Burns effect */}
      {slides.length > 0 && slides.map((slide, index) => (
        <div
          key={slide._key || index}
          className={`absolute inset-0 ${
            index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'
          }`}
          style={{
            transition: 'opacity 1500ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <motion.div
            style={{y: backgroundY, willChange: 'transform'}}
            className="absolute inset-0 transform-gpu"
          >
            <div className="absolute inset-0 animate-ken-burns transform-gpu">
              {(() => {
                const activeImage = isMobile && slide.mobileImage?.asset?.url ? slide.mobileImage : slide.image
                const imageUrl = activeImage?.asset?.url
                const imageWithPosition = {
                  ...activeImage,
                  desktopPosition: slide.desktopPosition as PositionValue | undefined,
                  mobilePosition: slide.mobilePosition as PositionValue | undefined,
                }
                const desktopPos = getObjectPosition(imageWithPosition, false)
                const mobilePos = getObjectPosition(imageWithPosition, true)

                return imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={slide.alt || activeImage?.alt || 'Kivett Bednar'}
                    fill
                    className="object-cover responsive-object-position"
                    priority={index === 0}
                    quality={95}
                    sizes="100vw"
                    style={{'--obj-pos-desktop': desktopPos, '--obj-pos-mobile': mobilePos} as React.CSSProperties}
                  />
                ) : null
              })()}
            </div>
          </motion.div>
          {/* Vertical gradient: top darker for nav, bottom dark for lockup legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-10" />
          {/* Bottom-left spotlight scrim for name + tagline legibility */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                'radial-gradient(ellipse 60% 55% at 18% 82%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 70%)',
            }}
          />
        </div>
      ))}

      {/* Editorial grid overlay */}
      <div className="relative z-30 w-full h-full container mx-auto px-6 md:px-10 lg:px-14">
        {/* Top meta strip (top-left) */}
        <motion.div
          initial={{opacity: 0, y: -10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1]}}
          className="absolute top-8 md:top-10 left-6 md:left-10 lg:left-14 flex items-center gap-3"
        >
          <span className="h-px w-6 md:w-10 bg-accent-primary" />
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/75 font-medium">
            {subheading}
          </span>
        </motion.div>

        {/* Next show micro-card (top-right, desktop) */}
        {nextShowFormatted && nextShow && (
          <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1]}}
            className="hidden md:block absolute top-24 lg:top-28 right-10 lg:right-14"
          >
            <Link
              href="/shows"
              className="group block border border-white/15 hover:border-accent-primary/60 backdrop-blur-md bg-black/30 px-5 py-4 min-w-[220px] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-primary pulse-gold" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent-primary font-medium">
                  Next Show
                </span>
              </div>
              <div className="flex items-baseline gap-2 text-white">
                <span className="text-2xl font-bebas tracking-wide leading-none">
                  {nextShowFormatted.day}
                </span>
                <span className="text-xs text-white/60 tracking-wider">
                  {nextShowFormatted.weekday} · {nextShowFormatted.time}
                </span>
              </div>
              <div className="mt-1 text-sm text-white/85 font-display italic truncate">
                {nextShow.venue}
                {nextShow.city ? <span className="text-white/50 not-italic"> · {nextShow.city}</span> : null}
              </div>
            </Link>
          </motion.div>
        )}

        {/* Slide counter rail (right edge, desktop) */}
        {slideCount > 1 && (
          <div className="hidden md:flex absolute right-10 lg:right-14 bottom-24 flex-col items-end gap-3">
            {slides.map((_, idx) => {
              const active = idx === currentSlide
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="group flex items-center gap-3 cursor-pointer"
                >
                  <span
                    className={cn(
                      'h-px transition-all duration-500',
                      active ? 'w-10 bg-accent-primary' : 'w-4 bg-white/50 group-hover:w-6 group-hover:bg-white/80'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs tabular-nums tracking-widest transition-colors duration-300 drop-shadow',
                      active ? 'text-accent-primary' : 'text-white/70 group-hover:text-white'
                    )}
                  >
                    {pad2(idx + 1)}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Bottom-left lockup */}
        <div className="absolute left-6 md:left-10 lg:left-14 bottom-20 md:bottom-24 max-w-3xl">
          {/* Mobile slide counter (inline, above lockup) */}
          {slideCount > 1 && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.6, delay: 0.15}}
              className="md:hidden flex items-center gap-2 mb-5 text-[10px] tabular-nums tracking-[0.3em] text-white/60"
            >
              <span className="text-accent-primary">{pad2(currentSlide + 1)}</span>
              <span className="h-px w-6 bg-white/25" />
              <span>{pad2(slideCount)}</span>
            </motion.div>
          )}

          {/* Accent line above heading (left-aligned variant, per user pref) */}
          <motion.div
            initial={{opacity: 0, scaleX: 0}}
            animate={{opacity: 1, scaleX: 1}}
            transition={{duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1]}}
            className="flex items-center gap-4 mb-5 md:mb-6 origin-left"
          >
            <span className="text-accent-primary text-[10px] md:text-xs uppercase tracking-[0.35em] font-medium">
              Blues Guitarist
            </span>
            <span className="h-px w-12 md:w-20 bg-gradient-to-r from-accent-primary to-transparent" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{opacity: 0, y: 40, filter: 'blur(8px)'}}
            animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
            transition={{duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1]}}
            className={cn(
              'font-bebas text-white text-shadow-lg text-left',
              textSizeMap[headingMobileSize] || 'text-5xl',
              desktopSizeMap[headingDesktopSize] || 'md:text-8xl',
              trackingMap[headingTracking] || 'tracking-tight',
              leadingMap[headingLineHeight] || 'leading-none'
            )}
            style={{textWrap: 'balance'} as React.CSSProperties}
          >
            {heading}
          </motion.h1>

          {/* Gold hairline under heading */}
          <motion.div
            initial={{opacity: 0, scaleX: 0}}
            animate={{opacity: 1, scaleX: 1}}
            transition={{duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1]}}
            className="h-px w-16 md:w-20 bg-accent-primary mt-5 md:mt-6 mb-5 md:mb-7 origin-left"
          />

          {/* Tagline (Playfair italic) */}
          {tagline && (
            <motion.p
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1]}}
              className={cn(
                'font-display italic text-lg md:text-2xl lg:text-3xl max-w-xl leading-snug text-white/90 text-shadow-md mb-8 md:mb-10',
                trackingMap[subheadingTracking] || 'tracking-normal',
                leadingMap[subheadingLineHeight] || 'leading-snug'
              )}
            >
              {tagline}
            </motion.p>
          )}

          {/* CTA */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1]}}
          >
            <Link
              href="/shows"
              className="btn-primary inline-flex items-center gap-2 text-base md:text-lg px-7 md:px-9 py-4 group"
            >
              <span>{buttonText}</span>
              <span className="arrow-slide">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll hairline cue (bottom-center) */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 1.2, duration: 0.6}}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        >
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/50">
            Scroll
          </span>
          <span className="block h-10 w-px bg-accent-primary/80 animate-scroll-line" />
        </motion.div>
      </div>
    </section>
  )
}
