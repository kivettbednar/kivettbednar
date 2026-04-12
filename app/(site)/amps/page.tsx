import {Metadata} from 'next'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {ampsPageQuery, ampsProductsQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {AnimatedHero} from '@/components/ui/AnimatedHero'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {SplitScreenImage} from '@/components/ui/SplitScreenImage'
import {ProductCard} from '@/components/ui/ProductCard'
import {getSiteSettings, isPageEnabled} from '@/lib/site-settings'
import type {ProductListItem} from '@/types/product'

type AmpsPageData = {
  heroHeading: string | null
  heroSubheading: string | null
  heroImage: {asset?: {url?: string}; alt?: string} | null
  showcaseHeading: string | null
  showcaseText: string | null
  craftsmanshipHeading: string | null
  craftsmanshipText: string | null
  craftsmanshipImage: {asset?: {url?: string}; alt?: string} | null
  shopHeading: string | null
  shopSubheading: string | null
  emptyStateHeading: string | null
  emptyStateText: string | null
  seoTitle: string | null
  seoDescription: string | null
} | null

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [ampsResult, siteSettings] = await Promise.all([
      sanityFetch({query: ampsPageQuery}),
      getSiteSettings(),
    ])
    if (!isPageEnabled(siteSettings, 'amps')) {
      return {title: 'Page Unavailable | Kivett Bednar', robots: {index: false}}
    }
    const ampsPage = ampsResult?.data as AmpsPageData
    return {
      title: ampsPage?.seoTitle || 'Custom Amps | Kivett Bednar',
      description: ampsPage?.seoDescription || 'Handcrafted artisan guitar amplifiers built with precision and soul.',
      alternates: {canonical: `${baseUrl}/amps`},
    }
  } catch {
    return {
      title: 'Custom Amps | Kivett Bednar',
      description: 'Handcrafted artisan guitar amplifiers',
    }
  }
}

export const revalidate = 60

export default async function AmpsPage() {
  let ampsPage: AmpsPageData = null
  let products: ProductListItem[] = []
  let siteSettings = null

  try {
    const [ampsResult, settings] = await Promise.all([
      sanityFetch({query: ampsPageQuery}),
      getSiteSettings(),
    ])
    ampsPage = ampsResult?.data as AmpsPageData
    siteSettings = settings
  } catch (error) {
    console.warn('Failed to fetch amps page data:', error)
  }

  if (!isPageEnabled(siteSettings, 'amps')) {
    return <PageUnavailable pageName="Amps" />
  }

  try {
    const result = await sanityFetch({query: ampsProductsQuery})
    if (result?.data) {
      products = result.data as unknown as ProductListItem[]
    }
  } catch (error) {
    console.warn('Failed to fetch amp products:', error)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <AnimatedHero
        title={ampsPage?.heroHeading || 'Custom Amps'}
        subtitle={ampsPage?.heroSubheading || undefined}
        backgroundImage={ampsPage?.heroImage?.asset?.url || undefined}
        backgroundAlt={ampsPage?.heroImage?.alt || 'Custom guitar amplifier'}
      />

      {/* Showcase Section */}
      {ampsPage?.showcaseHeading && (
        <section className="bg-gradient-to-b from-surface to-background py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection animation="fadeIn">
                <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary mb-6">
                  {ampsPage.showcaseHeading}
                </h2>
                {ampsPage.showcaseText && (
                  <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
                    {ampsPage.showcaseText}
                  </p>
                )}
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Craftsmanship Section — with image uses split-screen, without image uses centered layout */}
      {ampsPage?.craftsmanshipHeading && ampsPage?.craftsmanshipImage?.asset?.url ? (
        <SplitScreenImage
          imageSrc={ampsPage.craftsmanshipImage.asset.url}
          imageAlt={ampsPage.craftsmanshipImage.alt || 'Amp building process'}
          imagePosition="right"
        >
          <AnimatedSection animation="fadeUp">
            <h2 className="font-bebas text-4xl uppercase tracking-wide text-text-primary mb-6">
              {ampsPage.craftsmanshipHeading}
            </h2>
            {ampsPage.craftsmanshipText && (
              <p className="text-lg text-text-secondary leading-relaxed">
                {ampsPage.craftsmanshipText}
              </p>
            )}
          </AnimatedSection>
        </SplitScreenImage>
      ) : ampsPage?.craftsmanshipHeading || ampsPage?.craftsmanshipText ? (
        <section className="bg-surface py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <AnimatedSection animation="fadeUp">
                {ampsPage?.craftsmanshipHeading && (
                  <h2 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary mb-6">
                    {ampsPage.craftsmanshipHeading}
                  </h2>
                )}
                {ampsPage?.craftsmanshipText && (
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {ampsPage.craftsmanshipText}
                  </p>
                )}
              </AnimatedSection>
            </div>
          </div>
        </section>
      ) : null}

      {/* Products Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <div className="text-center mb-16">
                <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary mb-4">
                  {ampsPage?.shopHeading || 'Available Amps'}
                </h2>
                {ampsPage?.shopSubheading && (
                  <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                    {ampsPage.shopSubheading}
                  </p>
                )}
              </div>
            </AnimatedSection>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product._id} product={product} priority={index < 3} />
                ))}
              </div>
            ) : (
              <AnimatedSection animation="fadeIn">
                <div className="text-center py-16 bg-surface-elevated border border-border">
                  <h3 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-4">
                    {ampsPage?.emptyStateHeading || 'New Builds Coming Soon'}
                  </h3>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    {ampsPage?.emptyStateText || 'Custom amps are built to order. Get in touch to discuss your dream amp.'}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold text-lg uppercase tracking-wider px-8 py-4 transition-all duration-300"
                  >
                    Get in Touch
                  </Link>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
