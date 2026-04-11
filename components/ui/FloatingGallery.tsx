'use client'

import {motion, useScroll, useTransform, MotionValue} from 'framer-motion'
import Image from 'next/image'
import {useRef} from 'react'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'

interface GalleryImage {
  src: SanityImageWithPositioning | string
  alt: string
  width: number
  height: number
}

interface FloatingGalleryProps {
  images: GalleryImage[]
}

interface FloatingImageProps {
  image: GalleryImage
  index: number
  scrollYProgress: MotionValue<number>
  isMobile: boolean
}

function FloatingImage({image, index, scrollYProgress, isMobile}: FloatingImageProps) {
  // Create parallax effect for this image
  const yOffset = index % 2 === 0 ? [0, -50] : [0, 50]
  const y = useTransform(scrollYProgress, [0, 1], yOffset)

  // More pronounced rotation for Polaroid effect
  const rotateOffset = index % 3 === 0 ? [-4, 3] : index % 3 === 1 ? [3, -4] : [-2, 2]
  const rotate = useTransform(scrollYProgress, [0, 1], rotateOffset)

  return (
    <motion.div
      style={{y, rotate}}
      className="group relative"
      initial={{opacity: 0, scale: 0.9, rotate: rotateOffset[0]}}
      whileInView={{opacity: 1, scale: 1}}
      viewport={{once: true, margin: '-100px'}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        scale: 1.08,
        rotate: 0,
        zIndex: 10,
        transition: {duration: 0.3}
      }}
    >
      {/* Polaroid-style frame */}
      <div className="polaroid-frame relative">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-background">
          {/* Subtle grain overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-overlay vintage-grain" />

          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/10 via-transparent to-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

          {/* Image */}
          <Image
            src={typeof image.src === 'string' ? image.src : image.src.asset?.url || ''}
            alt={image.alt}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{
              objectPosition: typeof image.src === 'string'
                ? 'center center'
                : getObjectPosition(image.src, isMobile)
            }}
          />

          {/* Floating overlay */}
          <motion.div
            className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
            initial={{y: 20}}
            whileHover={{y: 0}}
          >
            <p className="text-text-primary font-light text-sm tracking-wide" style={{fontFamily: 'var(--font-display)'}}>
              {image.alt}
            </p>
          </motion.div>
        </div>

        {/* Handwritten-style caption area (Polaroid bottom space) - optional text can go here */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="w-full px-4">
            {/* Could add handwritten captions here if needed */}
          </div>
        </div>
      </div>

      {/* Enhanced shadow beneath */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[95%] h-12 bg-background/30 blur-2xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500"
        style={{zIndex: -1}}
      />
    </motion.div>
  )
}

export function FloatingGallery({images}: FloatingGalleryProps) {
  const isMobile = useIsMobile()

  const containerRef = useRef<HTMLDivElement>(null)
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  return (
    <div ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Floating background elements — deterministic positions to avoid hydration mismatch */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          {left: 12, top: 8, xDrift: 10, dur: 9, delay: 0.2},
          {left: 35, top: 65, xDrift: -12, dur: 10, delay: 0.8},
          {left: 58, top: 22, xDrift: 8, dur: 11, delay: 0.4},
          {left: 80, top: 75, xDrift: -14, dur: 8.5, delay: 1.2},
          {left: 20, top: 45, xDrift: 6, dur: 10.5, delay: 0.6},
          {left: 68, top: 90, xDrift: -8, dur: 9.5, delay: 1.6},
          {left: 45, top: 55, xDrift: 12, dur: 11.5, delay: 0.1},
          {left: 90, top: 35, xDrift: -10, dur: 8, delay: 1.0},
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-surface-elevated/50"
            style={{left: `${orb.left}%`, top: `${orb.top}%`}}
            animate={{
              y: [0, -50, 0],
              x: [0, orb.xDrift, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: orb.dur,
              repeat: Infinity,
              delay: orb.delay,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {images.map((image, index) => (
            <FloatingImage
              key={index}
              image={image}
              index={index}
              scrollYProgress={scrollYProgress}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
