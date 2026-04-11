import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {upcomingEventsQuery, pastEventsQuery, showsPageQuery, settingsQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {EventCard} from '@/components/ui/EventCard'
import {AnimatedHero} from '@/components/ui/AnimatedHero'
import {StaggeredImageGrid} from '@/components/ui/StaggeredImageGrid'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {AnimatedCounter} from '@/components/ui/AnimatedCounter'
import {Calendar, MapPin, Music} from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [{data: showsPage}, {data: siteSettings}] = await Promise.all([
      sanityFetch({query: showsPageQuery}),
      sanityFetch({query: settingsQuery}),
    ])
    if ((siteSettings?.showShowsPage as boolean | null) === false) {
      return {title: 'Page Unavailable | Kivett Bednar', robots: {index: false}}
    }
    return {
      title: showsPage?.seoTitle || 'Shows | Kivett Bednar',
      description: showsPage?.seoDescription || 'Upcoming concerts and performances by Kivett Bednar - authentic blues in the Pacific Northwest',
      alternates: { canonical: `${baseUrl}/shows` },
    }
  } catch {
    return {
      title: 'Shows | Kivett Bednar',
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
  let settings = null

  try {
    ;[showsPage, events, pastEvents, settings] = await Promise.all([
      sanityFetch({query: showsPageQuery}).then((r) => r.data),
      sanityFetch({
        query: upcomingEventsQuery,
        params: {now: new Date().toISOString(), limit: 50},
      }).then((r) => r.data),
      sanityFetch({
        query: pastEventsQuery,
        params: {now: new Date().toISOString(), offset: 0, limit: 12},
      }).then((r) => r.data),
      sanityFetch({query: settingsQuery}).then((r) => r.data),
    ])
  } catch (error) {
    console.warn('Failed to fetch shows page data, using fallback content:', error)
  }

  if ((settings?.showShowsPage as boolean | null) === false) {
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

      {/* Stats Banner */}
      <section className="relative bg-gradient-to-r from-surface via-surface-elevated to-surface py-8 border-y border-accent-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            <AnimatedSection animation="fadeIn" delay={0.1}>
              <div className="flex flex-col items-center group cursor-default">
                <span className="text-4xl md:text-5xl font-bebas text-accent-primary">
                  <AnimatedCounter value={events?.length || 0} />
                </span>
                <span className="text-xs uppercase tracking-widest text-text-muted mt-1 group-hover:text-accent-primary/70 transition-colors">{showsPage?.statsLabel1 || 'Upcoming Shows'}</span>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <div className="flex items-center gap-3 group cursor-default">
                <Music className="w-6 h-6 text-accent-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm uppercase tracking-widest text-text-muted group-hover:text-accent-primary/70 transition-colors">{showsPage?.statsLabel2 || 'Live Blues'}</span>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeIn" delay={0.3}>
              <div className="flex items-center gap-3 group cursor-default">
                <MapPin className="w-6 h-6 text-accent-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm uppercase tracking-widest text-text-muted group-hover:text-accent-primary/70 transition-colors">{showsPage?.statsLabel3 || 'Pacific Northwest'}</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Performance Photo Grid */}
      <section className="bg-gradient-to-b from-background to-surface py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <h2 className="text-5xl font-bold text-center text-text-primary mb-4">
                {showsPage?.performanceGalleryHeading || 'Live Performances'}
              </h2>
              <p className="text-xl text-center text-text-secondary mb-16">
                {showsPage?.performanceGallerySubheading || 'Moments from the stage'}
              </p>
            </AnimatedSection>
            {showsPage?.performanceImages && showsPage.performanceImages.length > 0 && (
              <StaggeredImageGrid
                images={showsPage.performanceImages
                  .filter((img: {image?: {asset?: {url?: string | null} | null; alt?: string | null} | null; alt?: string | null; caption?: string | null}) => img.image?.asset?.url)
                  .map((img: {image?: {asset?: {url?: string | null} | null; alt?: string | null} | null; alt?: string | null; caption?: string | null}) => ({
                    src: img.image!.asset!.url!,
                    alt: img.alt || img.image?.alt || 'Performance photo',
                    caption: img.caption || '',
                  }))
                }
                columns={3}
              />
            )}
          </div>
        </div>
      </section>

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
                    <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary mb-4">
                      {showsPage?.upcomingShowsHeading || 'Upcoming Shows'}
                    </h2>
                    <p className="text-text-secondary text-lg">
                      <span className="text-accent-primary font-bold">{events.length}</span>{showsPage?.showCountPrefix || ' upcoming'} {events.length === 1 ? (showsPage?.showSingular || 'show') : (showsPage?.showPlural || 'shows')}
                    </p>
                  </div>
                </AnimatedSection>
                <div className="grid gap-8">
                  {events.map((event, index: number) => (
                    <AnimatedSection key={event._id} animation="fadeUp" delay={0.1 * index}>
                      <EventCard event={event as unknown as import('@/types/event').Event} />
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
