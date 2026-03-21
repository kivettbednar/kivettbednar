'use client'

import Image from 'next/image'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'
import {useIsMobile} from '@/lib/hooks/useIsMobile'

type TestimonialItem = {
  _key: string
  name?: string
  role?: string
  quote?: string
  image?: (SanityImageWithPositioning & {alt?: string}) | null
}

type TestimonialsProps = {
  heading?: string
  headingTracking?: string
  headingLineHeight?: string
  backgroundVariant?: string
  sectionPadding?: string
  items?: TestimonialItem[]
}

function sectionClasses(variant?: string, pad?: string) {
  const bg =
    variant === 'surface' ? 'bg-surface' :
    variant === 'surface-elevated' ? 'bg-surface-elevated' :
    variant === 'dark-gradient' ? 'bg-gradient-to-b from-background via-surface to-surface-elevated' :
    ''
  const py =
    pad === 'none' ? 'py-0' :
    pad === 'sm' ? 'py-8' :
    pad === 'md' ? 'py-16' :
    pad === 'lg' ? 'py-24' :
    pad === 'xl' ? 'py-32' :
    'py-16'
  return `${bg} ${py}`.trim()
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

export function Testimonials({heading, headingTracking = 'tracking-tight', headingLineHeight = 'leading-tight', backgroundVariant, sectionPadding, items = []}: TestimonialsProps) {
  const isMobile = useIsMobile()

  if (!items || items.length === 0) return null

  return (
    <section className={`container mx-auto px-4 ${sectionClasses(backgroundVariant, sectionPadding)}`}>
      {heading && (
        <h2 className={`text-4xl font-bold text-center mb-12 text-text-primary ${trackingMap[headingTracking] || ''} ${leadingMap[headingLineHeight] || ''}`}>{heading}</h2>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((t, idx) => (
          <div key={t._key || idx} className="bg-surface rounded-xl p-6 border-2 border-accent-primary/20 shadow">
            {t.image?.asset?.url && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4">
                <Image
                  src={t.image.asset.url}
                  alt={t.image.alt || t.name || 'Testimonial'}
                  fill
                  className="object-cover"
                  sizes="64px"
                  style={{objectPosition: getObjectPosition(t.image, isMobile)}}
                />
              </div>
            )}
            {t.quote && (
              <blockquote className="text-text-primary italic mb-4">“{t.quote}”</blockquote>
            )}
            <div className="text-text-secondary text-sm">
              {t.name && <div className="font-semibold text-text-primary">{t.name}</div>}
              {t.role && <div>{t.role}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )}
