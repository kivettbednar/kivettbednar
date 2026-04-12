import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'
import {InfoSection as InfoSectionType} from '@/sanity.types'

export function InfoSectionModule({heading, subheading, content}: InfoSectionType) {
  if (!heading && !subheading && !content?.length) {
    return null
  }

  return (
    <section className="container mx-auto px-4">
      <div className="max-w-4xl">
        {heading && (
          <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mt-3 text-text-secondary text-lg tracking-wide uppercase">
            {subheading}
          </p>
        )}
        {content?.length ? (
          <div className="mt-6 prose prose-invert max-w-none">
            <PortableText value={content as PortableTextBlock[]} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
