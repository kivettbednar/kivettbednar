import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {upcomingEventsQuery, pastEventsQuery, showsPageQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {EventCard} from '@/components/ui/EventCard'
import {AnimatedHero} from '@/components/ui/AnimatedHero'
import {StaggeredImageGrid} from '@/components/ui/StaggeredImageGrid'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {Calendar} from 'lucide-react'
import {getSiteSettings, isPageEnabled} from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [showsResult, siteSettings] = await Promise.all([
      sanityFetch({query: showsPageQuery}),
      getSiteSettings(),
    ])
    if (!isPageEnabled(siteSettings, 'shows')) {
      return {title: 'Page Unavailable ', robots: {index: false}}
    }
    const showsPage = showsResult?.data
    return {
      title: showsPage?.seoTitle || 'Shows ',
      description: showsPage?.seoDescription || 'Upcoming concerts and performances by Kivett Bednar - authentic blues in the Pacific Northwest',
      alternates: { canonical: `${baseUrl}/shows` },
    }
  } catch {
    return {
      title: 'Shows ',
      description: 'Upcoming concerts and performances',
    }
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function ShowsPage() {
  let showsPage = null
  let events = null
  let pastEvents = null
  let siteSettings = null

  try {
    ;[showsPage, events, pastEvents, siteSettings] = await Promise.all([
      sanityFetch({query: showsPageQuery}).then((r) => r.data),
      sanityFetch({
        query: upcomingEventsQuery,
        params: {now: new Date().toISOString(), limit: 50},
      }).then((r) => r.data),
      sanityFetch({
        query: pastEventsQuery,
        params: {now: new Date().toISOString(), offset: 0, limit: 12},
      }).then((r) => r.data),
      getSiteSettings(),
    ])
  } catch (error) {
    console.warn('Failed to fetch shows page data, using fallback content:', error)
  }

  if (!isPageEnabled(siteSettings, 'shows')) {
    return <PageUnavailable pageName="Shows" />
  }

  // Generate JSON-LD structured data for events
  const eventsJsonLd = events?.map((event: {title: string | null; startDateTime: string | null; venue: string | null; city: string | null; ticketUrl?: string | null; isSoldOut?: boolean | null; isCanceled?: boolean | null}) => ({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: event.title,
    startDate: event.startDateTime,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
      },
    },
    performer: {
      '@type': 'MusicGroup',
      name: 'Kivett Bednar',
    },
    offers: event.ticketUrl
      ? {
          '@type': 'Offer',
          url: event.ticketUrl,
          availability: event.isSoldOut
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/InStock',
        }
      : undefined,
    eventStatus: event.isCanceled
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
  }))

  return (
    <>
      {eventsJsonLd && eventsJsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(eventsJsonLd)}}
        />
      )}

      {/* Animated Hero with Spotlight Effect */}
      <AnimatedHero
        title={showsPage?.heroHeading || 'Live Shows'}
        subtitle={showsPage?.heroSubheading || 'Catch authentic blues performances across the Pacific Northwest'}
        variant="shows"
        backgroundImage={showsPage?.heroImage?.asset?.url || undefined}
        backgroundAlt={showsPage?.heroImage?.alt || 'Kivett Bednar performing live blues'}
      />

      {/* Performance Photo Grid — render only if Sanity has images */}
      {(() => {
        const validImages = (showsPage?.performanceImages || [])
          .filter((img: {image?: {asset?: {url?: string | null} | null; alt?: string | null} | null; alt?: string | null; caption?: string | null}) => img.image?.asset?.url)
          .map((img: {image?: {asset?: {url?: string | null} | null; alt?: string | null} | null; alt?: string | null; caption?: string | null}) => ({
            src: img.image!.asset!.url!,
            alt: img.alt || img.image?.alt || 'Performance photo',
            caption: img.caption || '',
          }))
        if (validImages.length === 0) return null
        return (
          <section className="bg-gradient-to-b from-background to-surface py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <AnimatedSection animation="fadeIn">
                  <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-center text-text-primary mb-4">
                    {showsPage?.performanceGalleryHeading || 'Live Performances'}
                  </h2>
                  <p className="text-lg text-center text-text-secondary mb-16">
                    {showsPage?.performanceGallerySubheading || 'Moments from the stage'}
                  </p>
                </AnimatedSection>
                <StaggeredImageGrid images={validImages} columns={3} />
              </div>
            </div>
          </section>
        )
      })()}

      {/* Shows Content */}
      <div className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {events && events.length > 0 ? (
              <>
                <AnimatedSection animation="fadeIn">
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="h-px bg-accent-primary w-12" />
                      <Calendar className="w-5 h-5 text-accent-primary" />
                      <div className="h-px bg-accent-primary w-12" />
                    </div>
                    <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary">
                      {showsPage?.upcomingShowsHeading || 'Upcoming Shows'}
                    </h2>
                  </div>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {events.map((event, index: number) => (
                    <AnimatedSection key={event._id} animation="fadeUp" delay={0.05 * index}>
                      <EventCard
                        event={event as unknown as import('@/types/event').Event}
                        fallbackImage={(showsPage?.defaultEventImage as any)?.asset?.url || undefined}
                      />
                    </AnimatedSection>
                  ))}
                </div>
              </>
            ) : (
              <AnimatedSection animation="fadeIn">
                <h2 className="text-4xl font-bold mb-8 text-text-primary">
                  {showsPage?.upcomingShowsHeading || 'Upcoming Shows'}
                </h2>
                <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-surface">
                  <div className="text-4xl md:text-6xl mb-4">🎸</div>
                  <p className="text-text-primary text-2xl font-semibold mb-2">
                    {showsPage?.emptyStateHeading || 'No upcoming shows scheduled'}
                  </p>
                  <p className="text-text-secondary mt-2">
                    {showsPage?.emptyStateText || 'Check back soon for new dates! Follow on social media for announcements.'}
                  </p>
                </div>
              </AnimatedSection>
            )}

            {/* Past Shows */}
            {pastEvents && pastEvents.length > 0 && (
              <AnimatedSection animation="fadeUp" delay={0.2}>
                <div className="mt-20 pt-16 border-t border-border">
                  <h2 className="text-4xl font-bold mb-8 text-text-primary">
                    Past Shows
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastEvents.map((event: {_id: string; title: string | null; startDateTime: string | null; venue: string | null; city: string | null; state: string | null}) => {
                      const date = event.startDateTime ? new Date(event.startDateTime) : null
                      return (
                        <div key={event._id} className="bg-surface-elevated border border-border p-4 opacity-80">
                          <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
                            {date ? date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'TBD'}
                          </div>
                          <div className="font-bold text-text-primary text-sm">
                            {event.title}
                          </div>
                          <div className="text-xs text-text-secondary mt-1">
                            {[event.venue, event.city, event.state].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
