'use client'

import {useRef} from 'react'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {motion, useScroll, useTransform} from 'framer-motion'
import Image from 'next/image'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'

interface SplitScreenImageProps {
  imageSrc: SanityImageWithPositioning | string
  imageAlt: string
  imagePosition?: 'left' | 'right'
  children: React.ReactNode
  darkBg?: boolean
  verticalLabel?: string
}

export function SplitScreenImage({
  imageSrc,
  imageAlt,
  imagePosition = 'left',
  children,
  darkBg = false,
  verticalLabel = 'ABOUT THE ARTIST',
}: SplitScreenImageProps) {
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Reduced parallax on mobile to avoid jank
  const imageY = useTransform(scrollYProgress, [0, 1], isMobile ? [20, -20] : [50, -50])
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [-30, 30])
  // Clip-path reveal: starts inset, opens to full on scroll
  const clipInset = useTransform(scrollYProgress, [0.05, 0.4], [8, 0])
  const clipPath = useTransform(clipInset, (v) => `inset(${v}%)`)

  const isLeft = imagePosition === 'left'


  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${
        darkBg ? 'bg-gradient-to-br from-background to-surface-elevated' : 'bg-surface'
      }`}
    >
      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Column - responsive height */}
          <motion.div
            style={{y: imageY}}
            className={`relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] ${isLeft ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <motion.div
              className="relative w-full h-full overflow-hidden shadow-2xl"
              style={{clipPath}}
            >
              {/* Gold border on left edge */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent-primary z-10" />

              <Image
                src={typeof imageSrc === 'string' ? imageSrc : imageSrc.asset?.url || ''}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectPosition: typeof imageSrc === 'string'
                    ? 'center 40%'
                    : getObjectPosition(imageSrc, isMobile)
                }}
              />
              {/* Stronger gradient overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>

            {/* Vertical text label along image edge */}
            <div
              className="absolute top-1/2 -left-3 hidden lg:block"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg) translateY(-50%)',
              }}
            >
              <span className="text-accent-primary text-xs font-medium tracking-[0.2em] uppercase whitespace-nowrap opacity-70">
                {verticalLabel}
              </span>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            style={{y: contentY}}
            className={`${isLeft ? 'lg:order-2' : 'lg:order-1'} text-text-primary`}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
