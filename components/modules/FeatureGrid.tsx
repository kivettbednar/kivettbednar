'use client'

import Image from 'next/image'
import {urlFor} from '@/lib/image-positioning'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'

type FeatureGridProps = {
  items: Array<{
    title: string
    body?: string
    iconType?: 'image' | 'icon'
    icon?: string
    image?: SanityImageWithPositioning
  }>
  backgroundVariant?: string
  sectionPadding?: string
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

export function FeatureGrid({items, backgroundVariant, sectionPadding}: FeatureGridProps) {
  const isMobile = useIsMobile()

  if (!items || items.length === 0) return null

  return (
    <section className={`container mx-auto px-4 ${sectionClasses(backgroundVariant, sectionPadding)}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="text-center p-6">
            {item.iconType === 'image' && item.image?.asset && (
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <Image
                  src={urlFor(item.image.asset).width(64).height(64).url()}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="64px"
                  style={{
                    objectPosition: getObjectPosition(item.image, isMobile)
                  }}
                />
              </div>
            )}
            {item.iconType === 'icon' && item.icon && (
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-accent">
                <span className="text-4xl">{item.icon}</span>
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            {item.body && <p className="text-muted-foreground">{item.body}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
