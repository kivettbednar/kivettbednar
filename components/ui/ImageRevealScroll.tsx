'use client'

import {useRef} from 'react'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {motion, useScroll, useTransform} from 'framer-motion'
import Image from 'next/image'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'

interface ImageRevealScrollProps {
  imageSrc: SanityImageWithPositioning | string
  imageAlt: string
  direction?: 'left' | 'right' | 'up' | 'down'
  children?: React.ReactNode
}

export function ImageRevealScroll({
  imageSrc,
  imageAlt,
  direction = 'right',
  children,
}: ImageRevealScrollProps) {
  const isMobile = useIsMobile()

  const containerRef = useRef<HTMLDivElement>(null)
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'start 0.3'],
  })

  // Different reveal directions
  const isHorizontal = direction === 'left' || direction === 'right'
  const translateStart = direction === 'left' || direction === 'up' ? -100 : 100

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    isHorizontal ? [translateStart, 0] : [0, 0]
  )
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    !isHorizontal ? [translateStart, 0] : [0, 0]
  )
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className="relative py-12">
      <motion.div
        style={{x, y, opacity}}
        className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl"
      >
        <Image
          src={typeof imageSrc === 'string' ? imageSrc : imageSrc.asset?.url || ''}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          style={{
            objectPosition: typeof imageSrc === 'string'
              ? 'center center'
              : getObjectPosition(imageSrc, isMobile)
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

        {/* Border Glow Effect */}
        <motion.div
          className="absolute inset-0 border-2 border-accent-primary rounded-2xl"
          animate={{
            boxShadow: [
              '0 0 20px rgba(240, 196, 25, 0.3)',
              '0 0 40px rgba(240, 196, 25, 0.5)',
              '0 0 20px rgba(240, 196, 25, 0.3)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Optional Content Overlay */}
      {children && (
        <motion.div
          style={{opacity}}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          <div className="text-center text-text-primary drop-shadow-2xl">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  )
}
