'use client'

import Image from 'next/image'
import {urlFor} from '@/lib/image-positioning'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'

type ImageGalleryProps = {
  images: Array<SanityImageWithPositioning & {
    alt: string
    caption?: string
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

export function ImageGallery({images, backgroundVariant, sectionPadding}: ImageGalleryProps) {
  const isMobile = useIsMobile()

  if (!images || images.length === 0) return null

  return (
    <section className={`container mx-auto px-4 ${sectionClasses(backgroundVariant, sectionPadding)}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, idx) => (
          <div key={idx} className="group relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={urlFor(image.asset).width(800).height(600).url()}
              alt={image.alt || ''}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              style={{
                objectPosition: getObjectPosition(image, isMobile)
              }}
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
