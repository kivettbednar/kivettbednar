import {Metadata} from 'next'
import Image from 'next/image'
import type {PortableTextBlock} from 'next-sanity'
import {client} from '@/sanity/lib/client'
import {bioQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {LegalPortableText} from '@/components/ui/LegalPortableText'
import {getSiteSettings, isPageEnabled} from '@/lib/site-settings'

type BioPageData = {
  _id: string
  pageTitle: string | null
  tagline: string | null
  lastUpdated: string | null
  seoDescription: string | null
  heroImage: {
    asset?: {url?: string}
    hotspot?: {x?: number; y?: number}
    alt?: string
  } | null
  content: PortableTextBlock[] | null
} | null

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [rawData, siteSettings] = await Promise.all([
      client.fetch(bioQuery, {}, {cache: 'no-store'}),
      getSiteSettings(),
    ])
    if (!isPageEnabled(siteSettings, 'bio')) {
      return {title: 'Page Unavailable', robots: {index: false}}
    }
    const data = rawData as BioPageData
    return {
      title: data?.pageTitle || 'Bio',
      description: data?.seoDescription || 'About Kivett Bednar — blues guitarist, amp builder, artist.',
      alternates: {canonical: `${baseUrl}/bio`},
    }
  } catch {
    return {
      title: 'Bio',
      description: 'About Kivett Bednar — blues guitarist, amp builder, artist.',
    }
  }
}

export const revalidate = 60

export default async function BioPage() {
  const [rawData, siteSettings] = await Promise.all([
    client.fetch(bioQuery, {}, {cache: 'no-store'}),
    getSiteSettings(),
  ])

  if (!isPageEnabled(siteSettings, 'bio')) {
    return <PageUnavailable pageName="Bio" />
  }

  const data = rawData as BioPageData
  const pageTitle = data?.pageTitle || 'Bio'
  const tagline = data?.tagline
  const heroImageUrl = data?.heroImage?.asset?.url
  const hs = data?.heroImage?.hotspot
  const heroObjectPosition = hs?.x != null && hs?.y != null
    ? `${(hs.x * 100).toFixed(2)}% ${(hs.y * 100).toFixed(2)}%`
    : 'center 25%'
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      {heroImageUrl ? (
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={heroImageUrl}
            alt={data?.heroImage?.alt || pageTitle}
            fill
            priority
            className="object-cover"
            style={{objectPosition: heroObjectPosition}}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
          <div className="absolute inset-0 flex items-end pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="font-bebas text-5xl md:text-7xl uppercase tracking-wide text-white mb-4">
                  {pageTitle}
                </h1>
                {tagline && (
                  <p className="text-xl md:text-2xl text-text-secondary">{tagline}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-32 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-bebas text-5xl md:text-6xl uppercase tracking-wide text-text-primary mb-4">
                {pageTitle}
              </h1>
              {tagline && <p className="text-xl text-text-secondary">{tagline}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {data?.content && data.content.length > 0 ? (
            <LegalPortableText value={data.content} />
          ) : (
            <div className="prose-custom space-y-6 text-text-secondary leading-relaxed text-lg">
              <p>
                Bio coming soon. Edit the Bio page in Sanity Studio to add your story,
                influences, and career highlights.
              </p>
            </div>
          )}

          {lastUpdated && (
            <p className="text-text-muted text-sm mt-12 pt-8 border-t border-border">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
