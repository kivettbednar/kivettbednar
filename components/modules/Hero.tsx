'use client'

import Image from 'next/image'
import {urlFor} from '@/lib/image-positioning'
import {cn} from '@/lib/utils'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'

type HeroProps = {
  headline: string
  headlineDesktopSize?: string
  headlineMobileSize?: string
  subhead?: string
  subheadTracking?: string
  subheadLineHeight?: string
  mediaType?: 'image' | 'video'
  image?: SanityImageWithPositioning & {
    alt: string
  }
  video?: string
  ctas?: Array<{
    label: string
    href: string
    variant?: 'primary' | 'secondary' | 'outline'
  }>
  headlineTracking?: string
  headlineLineHeight?: string
  backgroundVariant?: string
  sectionPadding?: string
}

// Text size mapping for Tailwind JIT compiler
const textSizeMap: Record<string, string> = {
  'text-2xl': 'text-2xl',
  'text-3xl': 'text-3xl',
  'text-4xl': 'text-4xl',
  'text-5xl': 'text-5xl',
  'text-6xl': 'text-6xl',
  'text-7xl': 'text-7xl',
  'text-8xl': 'text-8xl',
  'text-9xl': 'text-9xl',
}

const desktopSizeMap: Record<string, string> = {
  'text-2xl': 'md:text-2xl',
  'text-3xl': 'md:text-3xl',
  'text-4xl': 'md:text-4xl',
  'text-5xl': 'md:text-5xl',
  'text-6xl': 'md:text-6xl',
  'text-7xl': 'md:text-7xl',
  'text-8xl': 'md:text-8xl',
  'text-9xl': 'md:text-9xl',
}

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

export function Hero({
  headline,
  headlineDesktopSize = 'text-7xl',
  headlineMobileSize = 'text-5xl',
  subhead,
  subheadTracking = 'tracking-normal',
  subheadLineHeight = 'leading-normal',
  mediaType = 'image',
  image,
  video,
  ctas,
  headlineTracking = 'tracking-tight',
  headlineLineHeight = 'leading-none',
  backgroundVariant = 'default',
  sectionPadding = 'lg',
}: HeroProps) {
  const isMobile = useIsMobile()

  const sectionPad = sectionPadding === 'none' ? 'py-0' : sectionPadding === 'sm' ? 'py-8' : sectionPadding === 'md' ? 'py-16' : sectionPadding === 'lg' ? 'py-24' : 'py-32'
  const sectionBg = backgroundVariant === 'surface' ? 'bg-surface' : backgroundVariant === 'surface-elevated' ? 'bg-surface-elevated' : backgroundVariant === 'dark-gradient' ? 'bg-gradient-to-b from-background via-surface to-surface-elevated' : ''

  return (
    <section className={cn('relative min-h-[70vh] flex items-center justify-center overflow-hidden', sectionPad, sectionBg)}>
      {/* Background Media */}
      {mediaType === 'image' && image?.asset && (
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(image.asset).url()}
            alt={image.alt || ''}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            style={{
              objectPosition: getObjectPosition(image, isMobile)
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>
      )}

      {mediaType === 'video' && video && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className={cn(
          'font-bold mb-6',
          textSizeMap[headlineMobileSize] || 'text-5xl',
          desktopSizeMap[headlineDesktopSize] || 'md:text-7xl',
          trackingMap[headlineTracking] || 'tracking-tight',
          leadingMap[headlineLineHeight] || 'leading-none'
        )}>
          {headline}
        </h1>
        {subhead && (
          <p className={cn('text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90', trackingMap[subheadTracking] || 'tracking-normal', leadingMap[subheadLineHeight] || 'leading-normal')}>
            {subhead}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {ctas.map((cta, idx) => (
              <a
                key={idx}
                href={cta.href}
                className={cn(
                  'px-8 py-3 rounded-md font-semibold transition-all',
                  cta.variant === 'primary' &&
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                  cta.variant === 'secondary' &&
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  cta.variant === 'outline' &&
                    'border-2 border-white text-white hover:bg-white hover:text-black',
                  !cta.variant &&
                    'bg-accent text-accent-foreground hover:bg-accent/90'
                )}
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
