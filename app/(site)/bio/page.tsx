import {Metadata} from 'next'
import type {PortableTextBlock} from 'next-sanity'
import {client} from '@/sanity/lib/client'
import {bioQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {LegalPortableText} from '@/components/ui/LegalPortableText'
import {AnimatedHero} from '@/components/ui/AnimatedHero'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
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
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
    : null

  return (
    <div className="min-h-screen bg-background">
      <AnimatedHero
        title={pageTitle}
        subtitle={tagline || undefined}
        variant="contact"
        backgroundImage={heroImageUrl || undefined}
        backgroundAlt={data?.heroImage?.alt || pageTitle}
      />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection animation="fadeUp">
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
          </AnimatedSection>

          {lastUpdated && (
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <p className="text-text-muted text-sm mt-12 pt-8 border-t border-border">
                Last updated: {lastUpdated}
              </p>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  )
}
