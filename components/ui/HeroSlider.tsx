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
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax effect: background moves at 50% speed
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 400])

  useEffect(() => {
    setIsLoaded(true)
    if (slides.length > 0) {
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

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
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
          {/* Optimal overlay for text readability while showing images */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/55 z-10" />
        </div>
      ))}

      {/* Animated Content */}
      <div className="relative z-30 container mx-auto px-4 text-center">
        {/* Decorative accent line */}
        <motion.div
          initial={{opacity: 0, scaleX: 0}}
          animate={{opacity: 1, scaleX: 1}}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-accent-primary" />
          <span className="text-accent-primary text-xs md:text-sm uppercase tracking-[0.3em] font-medium">
            Blues Guitarist
          </span>
          <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-accent-primary" />
        </motion.div>

        <motion.h1
          initial={{opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)'}}
          animate={{opacity: 1, y: 0, scale: 1, filter: 'blur(0px)'}}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn(
            'font-bebas text-white mb-6 text-shadow-lg',
            textSizeMap[headingMobileSize] || 'text-5xl',
            desktopSizeMap[headingDesktopSize] || 'md:text-8xl',
            trackingMap[headingTracking] || 'tracking-tight',
            leadingMap[headingLineHeight] || 'leading-none'
          )}
        >
          {heading}
        </motion.h1>
        <motion.p
          initial={{opacity: 0, y: 30, filter: 'blur(5px)'}}
          animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn(
            'text-2xl md:text-4xl lg:text-5xl mb-8 text-white text-elegant text-shadow-md',
            trackingMap[subheadingTracking] || 'tracking-normal',
            leadingMap[subheadingLineHeight] || 'leading-normal'
          )}
        >
          {subheading}
        </motion.p>
        {tagline && (
          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{
              duration: 0.6,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed text-white/95 font-light"
          >
            {tagline}
          </motion.p>
        )}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{
            duration: 0.6,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex justify-center"
        >
          <Link
            href="/shows"
            className="btn-primary text-xl px-10 py-5"
          >
            {buttonText}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 1.5, duration: 0.5}}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 hidden md:block"
      >
        <motion.div
          animate={{y: [0, 8, 0]}}
          transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
          className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2"
        >
          <motion.div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
