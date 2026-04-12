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

  // Page content with hardcoded fallbacks so an empty CMS doc still looks good.
  // All values are editable in Sanity Studio > Site Pages > Amps Page.
  const heroHeading = ampsPage?.heroHeading || 'Custom Amps'
  const heroSubheading = ampsPage?.heroSubheading || 'Handcrafted artisan guitar amplifiers built with precision and soul.'
  const showcaseHeading = ampsPage?.showcaseHeading || 'The Craft'
  const showcaseText =
    ampsPage?.showcaseText ||
    'Every amp starts with a vision — a conversation about the sound you chase. From vintage tweed warmth to modern high-headroom cleans, each build is hand-wired from premium components selected for tone, reliability, and a century of service ahead.'
  const craftsmanshipHeading = ampsPage?.craftsmanshipHeading || 'Built by Hand, Built to Last'
  const craftsmanshipText =
    ampsPage?.craftsmanshipText ||
    'Point-to-point wiring. NOS-spec capacitors and resistors where it matters. Custom-wound transformers. Solid pine or baltic birch cabinets finished with real tweed, tolex, or leather. Each amp is signed, serial-numbered, and voiced on a Strat and a Tele before it leaves the bench.'
  const shopHeading = ampsPage?.shopHeading || 'Available Amps'
  const shopSubheading =
    ampsPage?.shopSubheading ||
    'Limited-run builds and one-of-a-kind commissions. Each amp includes a custom dovetail road case, a two-year warranty, and lifetime servicing.'
  const emptyStateHeading = ampsPage?.emptyStateHeading || 'Next Batch in Progress'
  const emptyStateText =
    ampsPage?.emptyStateText ||
    'All current builds are spoken for. New amps drop in small batches — reach out to get on the list or to commission a custom build tailored to your tone.'

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <AnimatedHero
        title={heroHeading}
        subtitle={heroSubheading}
        backgroundImage={ampsPage?.heroImage?.asset?.url || undefined}
        backgroundAlt={ampsPage?.heroImage?.alt || 'Custom guitar amplifier'}
      />

      {/* Showcase Section */}
      <section className="bg-gradient-to-b from-surface to-background py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fadeIn">
              <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary mb-6">
                {showcaseHeading}
              </h2>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
                {showcaseText}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section — with image uses split-screen, without image uses centered layout */}
      {ampsPage?.craftsmanshipImage?.asset?.url ? (
        <SplitScreenImage
          imageSrc={ampsPage.craftsmanshipImage.asset.url}
          imageAlt={ampsPage.craftsmanshipImage.alt || 'Amp building process'}
          imagePosition="right"
        >
          <AnimatedSection animation="fadeUp">
            <h2 className="font-bebas text-4xl uppercase tracking-wide text-text-primary mb-6">
              {craftsmanshipHeading}
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">{craftsmanshipText}</p>
          </AnimatedSection>
        </SplitScreenImage>
      ) : (
        <section className="bg-surface py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <AnimatedSection animation="fadeUp">
                <h2 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary mb-6">
                  {craftsmanshipHeading}
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed">{craftsmanshipText}</p>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary mb-4">
                  {shopHeading}
                </h2>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
                  {shopSubheading}
                </p>
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
                <div className="text-center py-16 px-6 bg-surface-elevated border border-border max-w-2xl mx-auto">
                  <h3 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-4">
                    {emptyStateHeading}
                  </h3>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
                    {emptyStateText}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold text-lg uppercase tracking-wider px-8 py-4 transition-all duration-300"
                  >
                    Commission a Build
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
