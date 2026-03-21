'use client'

import {motion} from 'framer-motion'
import Image from 'next/image'
import {useState} from 'react'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'

interface StaggeredImageGridProps {
  images: {
    src: SanityImageWithPositioning | string
    alt: string
    caption?: string
    width?: number
    height?: number
  }[]
  columns?: 2 | 3 | 4
}

export function StaggeredImageGrid({images, columns = 3}: StaggeredImageGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const isMobile = useIsMobile()

  return (
    <div
      className={`grid gap-6 ${
        columns === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : columns === 3
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}
    >
      {images.map((image, index) => {
        // Random rotation for natural Polaroid scatter effect
        const initialRotation = index % 3 === 0 ? -3 : index % 3 === 1 ? 3 : -2

        return (
          <motion.div
            key={index}
            initial={{opacity: 0, y: 50, rotate: initialRotation}}
            whileInView={{opacity: 1, y: 0, rotate: initialRotation}}
            viewport={{once: true}}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: 'easeOut',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative group cursor-pointer"
            style={{
              marginTop: index % 2 === 0 ? '0' : '3rem',
            }}
          >
            <motion.div
              className="polaroid-frame relative"
              whileHover={{
                scale: 1.05,
                rotate: 0,
                zIndex: 10,
                transition: {duration: 0.3}
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-background">
                {/* Vintage grain texture */}
                <div className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-overlay vintage-grain" />

                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/10 via-transparent to-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                <Image
                  src={typeof image.src === 'string' ? image.src : image.src.asset?.url || ''}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
                  sizes={`(max-width: 768px) 100vw, ${100 / columns}vw`}
                  style={{
                    objectPosition: typeof image.src === 'string'
                      ? 'center center'
                      : getObjectPosition(image.src, isMobile)
                  }}
                />

                {/* Hover Overlay */}
                <motion.div
                  initial={{opacity: 0}}
                  whileHover={{opacity: 1}}
                  className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end p-6 z-20"
                >
                  {image.caption && (
                    <p className="text-text-primary text-lg font-semibold" style={{fontFamily: 'var(--font-display)'}}>
                      {image.caption}
                    </p>
                  )}
                </motion.div>

                {/* Border glow on hover */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute inset-0 border-2 border-accent-primary/30"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.2}}
                  />
                )}
              </div>

              {/* Polaroid caption area */}
              <div className="absolute bottom-2 left-0 right-0 px-4 flex justify-center">
                {/* Could add handwritten-style captions here if needed */}
              </div>
            </motion.div>

            {/* Enhanced shadow */}
            <motion.div
              className="absolute -inset-2 bg-background/20 rounded-xl blur-xl -z-10"
              animate={{
                opacity: hoveredIndex === index ? 0.7 : 0.3,
              }}
              transition={{duration: 0.3}}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
