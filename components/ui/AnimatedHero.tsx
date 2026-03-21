'use client'

import {motion, useScroll, useTransform} from 'framer-motion'
import {useEffect, useState, useRef} from 'react'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import Image from 'next/image'
import {getObjectPosition, type SanityImageWithPositioning, type PositionValue} from '@/lib/image-positioning'

interface AnimatedHeroProps {
  title: string
  subtitle?: string
  variant?: 'lessons' | 'shows' | 'contact' | 'setlist'
  backgroundImage?: SanityImageWithPositioning | string
  backgroundAlt?: string
  desktopPosition?: string
  mobilePosition?: string
}

export function AnimatedHero({title, subtitle, variant = 'shows', backgroundImage, backgroundAlt, desktopPosition, mobilePosition}: AnimatedHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax effect: background moves at 50% speed
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 300])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Combine image with position overrides for positioning
  const imageWithPosition = typeof backgroundImage !== 'string' && backgroundImage ? {
    ...backgroundImage,
    desktopPosition: desktopPosition as PositionValue | undefined,
    mobilePosition: mobilePosition as PositionValue | undefined
  } : backgroundImage

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-background"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '70vh',
      }}
    >
      {/* Parallax Background Image (if provided) */}
      {backgroundImage && (
        <motion.div
          style={{y: backgroundY}}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 animate-ken-burns-hero">
            <Image
              src={typeof imageWithPosition === 'string' ? imageWithPosition : (imageWithPosition?.asset?.url || '')}
              alt={backgroundAlt || title}
              fill
              className="object-cover object-center"
              priority
              quality={95}
              sizes="100vw"
              style={{
                objectPosition: typeof imageWithPosition === 'string'
                  ? 'center 40%'
                  : (imageWithPosition ? getObjectPosition(imageWithPosition, isMobile) : 'center center')
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Optimal overlay for text readability while showing images */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/55 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.h1
          initial={{opacity: 0, y: 50, scale: 0.95}}
          whileInView={{opacity: 1, y: 0, scale: 1}}
          viewport={{once: true, amount: 0.3}}
          transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white"
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            transition={{duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1]}}
            className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto leading-relaxed text-white/95 font-light"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

    </section>
  )
}
