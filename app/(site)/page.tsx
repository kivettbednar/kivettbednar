import {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {sanityFetch} from '@/sanity/lib/live'
import {upcomingEventsQuery, homePageQuery, uiTextQuery} from '@/sanity/lib/queries'
import {EventCard} from '@/components/ui/EventCard'
import {HeroSlider} from '@/components/ui/HeroSlider'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {TextReveal} from '@/components/animations/TextReveal'
import {FloatingGallery} from '@/components/ui/FloatingGallery'
import {SplitScreenImage} from '@/components/ui/SplitScreenImage'
import {NewsletterForm} from '@/components/ui/NewsletterForm'
import {MarqueeTicker} from '@/components/ui/MarqueeTicker'
import {AmbientOrbs} from '@/components/ui/AmbientOrbs'
import {ScrollProgress} from '@/components/ui/ScrollProgress'
import {LiveVideoSlider} from '@/components/ui/LiveVideoSlider'

// Helper function to extract YouTube video ID from URL or return ID as-is
function getYouTubeId(urlOrId: string): string {
  if (!urlOrId) return '75M50Bfksa0' // Default fallback

  // If it's already just an ID (11 characters, alphanumeric), return it
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId
  }

  // Try to extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern)
    if (match) return match[1]
  }

  // If no pattern matches, return the input (might be just an ID)
  return urlOrId
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [homeResult, siteSettings] = await Promise.all([
      sanityFetch({query: homePageQuery}),
      getSiteSettings(),
    ])
    const homePage = homeResult?.data
    return {
      title: homePage?.seoTitle || 'Kivett Bednar | Blues Guitarist & Musician',
      description: homePage?.seoDescription || 'Gritty Texas Blues meets the heart of the Pacific Northwest',
      alternates: {canonical: baseUrl},
      openGraph: {
        title: homePage?.seoTitle || 'Kivett Bednar | Blues Guitarist & Musician',
        description: homePage?.seoDescription || 'Gritty Texas Blues meets the heart of the Pacific Northwest',
        url: baseUrl,
        images: siteSettings?.ogImage?.asset?.url ? [{url: siteSettings.ogImage.asset.url}] : [],
      },
    }
  } catch {
    return {
      title: 'Kivett Bednar | Blues Guitarist & Musician',
      description: 'Gritty Texas Blues meets the heart of the Pacific Northwest',
    }
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function HomePage() {
  let homePage = null
  let events = null
  let uiText = null
  let siteSettings = null

  try {
    // Fetch home page content and upcoming shows using live-enabled queries
    ;[homePage, events, uiText, siteSettings] = await Promise.all([
      sanityFetch({query: homePageQuery}).then((r) => r.data),
      sanityFetch({
        query: upcomingEventsQuery,
        params: {now: new Date().toISOString(), limit: 3},
      }).then((r) => r.data),
      sanityFetch({query: uiTextQuery}).then((r) => r.data),
      getSiteSettings(),
    ])
  } catch (error) {
    console.warn('Failed to fetch homepage data, using fallback content:', error)
  }

  // Fallback if no content in Sanity yet
  if (!homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading content from Sanity Studio...</p>
      </div>
    )
  }

  // Get first hero slide image for newsletter background
  const newsletterBgImage = homePage.heroSlides?.[0]?.image?.asset?.url

  return (
    <div className="min-h-screen relative">
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Ambient Gradient Orbs */}
      <AmbientOrbs />

      {/* Hero Slider */}
      <HeroSlider
        slides={homePage.heroSlides || undefined}
        heading={homePage.heroHeading || undefined}
        subheading={homePage.heroSubheading || undefined}
        headingTracking={homePage.heroHeadingTracking || undefined}
        headingLineHeight={homePage.heroHeadingLineHeight || undefined}
        tagline={homePage.heroTagline || 'Gritty Texas Blues meets the heart of the Pacific Northwest'}
        buttonText={homePage.heroButtonText || undefined}
        headingDesktopSize={homePage.heroHeadingDesktopSize || undefined}
        headingMobileSize={homePage.heroHeadingMobileSize || undefined}
        subheadingTracking={homePage.heroSubheadingTracking ?? undefined}
        subheadingLineHeight={homePage.heroSubheadingLineHeight ?? undefined}
        nextShow={events?.[0] ? {
          startDateTime: (events[0] as any).startDateTime,
          venue: (events[0] as any).venue,
          city: (events[0] as any).city,
          timezone: (events[0] as any).timezone,
        } : null}
      />

      {/* Marquee Ticker Band */}
      <MarqueeTicker
        topItems={(homePage.marqueeTopItems as any)?.length ? (homePage.marqueeTopItems as any) : undefined}
        bottomItems={(homePage.marqueeBottomItems as any)?.length ? (homePage.marqueeBottomItems as any) : undefined}
      />

      {/* Listen / Music Section */}
      {homePage.showMusicSection !== false && homePage.spotifyArtistId && (
        <section className="bg-background py-16 md:py-20 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="fadeIn">
                <div className="text-center mb-8">
                  <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary">
                    {homePage.musicSectionHeading || 'Listen'}
                  </h2>
                  {homePage.musicSectionSubheading && (
                    <p className="text-text-secondary mt-2">{homePage.musicSectionSubheading}</p>
                  )}
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fadeUp" delay={0.1}>
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    title="Spotify player"
                    src={`https://open.spotify.com/embed/${homePage.spotifyEmbedType || 'artist'}/${homePage.spotifyPlaylistId || homePage.spotifyArtistId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </AnimatedSection>
              {(homePage.appleMusicUrl || homePage.bandcampUrl) && (
                <AnimatedSection animation="fadeIn" delay={0.2}>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm uppercase tracking-[0.2em] text-text-muted">
                    {homePage.appleMusicUrl && (
                      <a href={homePage.appleMusicUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary transition-colors">
                        Apple Music
                      </a>
                    )}
                    {homePage.bandcampUrl && (
                      <a href={homePage.bandcampUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary transition-colors">
                        Bandcamp
                      </a>
                    )}
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Live Videos Slider — merges former Featured Video + Studio videos */}
      {(() => {
        const rawVideos = [
          {url: homePage.featuredVideoUrl || '', title: homePage.featuredVideoTitle || undefined, subtitle: homePage.featuredVideoSubheading || undefined},
          {url: homePage.studioVideo1Url || '', title: homePage.studioVideo1Title || undefined},
          {url: homePage.studioVideo2Url || '', title: homePage.studioVideo2Title || undefined},
        ].filter((v) => v.url && v.url.trim() !== '')
        if (rawVideos.length === 0) return null
        return (
          <LiveVideoSlider
            videos={rawVideos}
            heading={homePage.featuredVideoHeading || 'Live Performance'}
            subheading={homePage.featuredVideoSubheading || undefined}
          />
        )
      })()}

      {/* About Section - Split Screen with Image */}
      {homePage.showAboutSection !== false && homePage.aboutImage?.asset?.url && (
        <SplitScreenImage
          imageSrc={homePage.aboutImage.asset.url}
          imageAlt={homePage.aboutImage?.alt || "Kivett Bednar with guitar - blues musician and performer"}
          imagePosition="left"
          verticalLabel={homePage.aboutVerticalLabel || 'ABOUT THE ARTIST'}
        >
        <AnimatedSection animation="fadeUp">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-text-primary">
            {homePage.aboutHeading}
          </h2>
        </AnimatedSection>
        <AnimatedSection animation="fadeUp" delay={0.15}>
          <p className="text-xl mb-6 leading-relaxed text-text-secondary">
            {homePage.aboutText}
          </p>
        </AnimatedSection>
        <AnimatedSection animation="fadeUp" delay={0.3}>
          <div className="flex gap-4">
            <Link
              href="/bio"
              className="btn-primary"
            >
              {homePage.aboutButtonText || 'Read Full Bio'}
              <span>→</span>
            </Link>
          </div>
        </AnimatedSection>
        </SplitScreenImage>
      )}

      {/* Upcoming Shows Section — editorial grid */}
      {homePage.showUpcomingShows !== false && events && events.length > 0 && (
        <section className="py-16 sm:py-20 md:py-28 bg-background section-overlap-diagonal">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
                <div>
                  <AnimatedSection animation="fadeUp">
                    <span className="flex items-center gap-3 mb-4">
                      <span className="h-px w-10 bg-accent-primary" />
                      <span className="text-[11px] uppercase tracking-[0.35em] text-accent-primary font-medium">
                        Live Dates
                      </span>
                    </span>
                  </AnimatedSection>
                  <TextReveal
                    text={homePage.upcomingShowsHeading || 'Upcoming Shows'}
                    className="font-bebas text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-none text-text-primary"
                  />
                </div>
                <Link
                  href="/shows"
                  className="group inline-flex items-center gap-2 text-accent-primary text-sm uppercase tracking-[0.25em] font-semibold hover:gap-3 transition-all self-start md:self-auto"
                >
                  <span>{homePage.seeAllShowsLinkText || 'See all shows'}</span>
                  <span className="arrow-slide">→</span>
                </Link>
              </div>

              {/* Desktop: clean 3-column grid, no row-span, no dashed ghost */}
              <div className="hidden md:grid md:grid-cols-3 gap-6">
                {events.slice(0, 3).map((event, index: number) => (
                  <AnimatedSection
                    key={event._id}
                    animation="fadeUp"
                    delay={0.1 * index}
                    className="h-full"
                  >
                    <EventCard event={event as unknown as import('@/types/event').Event} />
                  </AnimatedSection>
                ))}
              </div>

              {/* Mobile: horizontal scroll */}
              <div className="md:hidden flex overflow-x-auto scroll-snap-x gap-4 pb-4 -mx-4 px-4">
                {events.slice(0, 6).map((event) => (
                  <div key={event._id} className="min-w-[85vw] snap-center-child flex-shrink-0">
                    <EventCard event={event as unknown as import('@/types/event').Event} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Section — Editorial Cinematic */}
      {homePage.showBookingSection !== false && (
      <section className="relative py-20 sm:py-24 md:py-32 bg-background film-grain overflow-hidden">
        {/* Ambient accent */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(ellipse 55% 45% at 15% 20%, rgba(212,175,55,0.09), transparent 65%)',
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            {/* Header row */}
            <div className="max-w-3xl mb-14 md:mb-20">
              <AnimatedSection animation="fadeUp">
                <span className="inline-flex items-center gap-3 mb-5">
                  <span className="h-px w-10 bg-accent-primary" />
                  <span className="text-[11px] uppercase tracking-[0.35em] text-accent-primary font-medium">
                    Booking
                  </span>
                </span>
              </AnimatedSection>
              <TextReveal
                text={homePage.bookingSectionHeading || 'Book Kivett for Your Event'}
                className="font-bebas text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.95] text-text-primary"
              />
              <AnimatedSection animation="fadeUp" delay={0.15}>
                <p className="font-display italic text-xl md:text-2xl text-text-secondary mt-6 leading-snug">
                  {homePage.bookingSectionIntro || 'Available for festivals, private events, and venue bookings. Professional blues performance with authentic Texas style meets Pacific Northwest soul.'}
                </p>
              </AnimatedSection>
            </div>

            {/* Two-column editorial: checklist + contact rail */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
              {/* Left: what to include */}
              <AnimatedSection animation="fadeUp" delay={0.2} className="md:col-span-7">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.35em] text-accent-primary font-medium mb-5">
                    {homePage.bookingInquiryListHeading || 'Include in Your Inquiry'}
                  </h3>
                  <ol className="divide-y divide-white/5 border-y border-white/5">
                    {(homePage.bookingInquiryItems || [
                      'Event date and location',
                      'Type of event (festival, private party, venue, etc.)',
                      'Expected audience size',
                      'Performance duration needed',
                    ]).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-baseline gap-5 py-4 md:py-5 group">
                        <span className="font-bebas text-xl md:text-2xl text-accent-primary tabular-nums tracking-wide">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 text-text-primary text-base md:text-lg leading-snug">
                          {item}
                        </span>
                        <span className="text-accent-primary/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </AnimatedSection>

              {/* Right: contact rail */}
              <AnimatedSection animation="fadeUp" delay={0.3} className="md:col-span-5 md:sticky md:top-24">
                <div className="bg-surface/80 backdrop-blur-sm border border-white/10 p-6 md:p-8">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-accent-primary font-medium mb-2">
                    {homePage.bookingInquiriesHeading || 'Direct Inquiries'}
                  </p>
                  <p className="font-display italic text-lg text-text-secondary mb-6 leading-snug">
                    {homePage.bookingInquiriesText || 'Reach out directly — responses within 48 hours.'}
                  </p>
                  <a
                    href={`mailto:${siteSettings?.contactEmail || 'kivettbednar@gmail.com'}`}
                    className="group inline-flex items-center gap-3 font-bebas text-xl md:text-2xl tracking-wide text-accent-primary border-b border-accent-primary/40 hover:border-accent-primary pb-1 transition-colors"
                    style={{overflowWrap: 'anywhere'}}
                  >
                    <span>{siteSettings?.contactEmail || 'kivettbednar@gmail.com'}</span>
                    <span className="arrow-slide text-base">→</span>
                  </a>
                </div>
              </AnimatedSection>
            </div>

            {/* Testimonial — elegant moment */}
            <AnimatedSection animation="fadeUp" delay={0.4}>
              <figure className="max-w-3xl mx-auto text-center mt-20 md:mt-28 relative">
                <span className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 text-7xl md:text-8xl font-display italic text-accent-primary/25 leading-none select-none pointer-events-none" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="font-display italic text-2xl md:text-3xl text-text-primary leading-snug relative">
                  {homePage.bookingTestimonialQuote || 'Kivett brings authentic blues energy that connects with every audience. His performance at our festival was unforgettable.'}
                </blockquote>
                <figcaption className="mt-8 inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-accent-primary" />
                  <span className="text-xs uppercase tracking-[0.3em] text-accent-primary font-semibold">
                    {homePage.bookingTestimonialAttribution || '— Festival Organizer'}
                  </span>
                  <span className="h-px w-8 bg-accent-primary" />
                </figcaption>
              </figure>
            </AnimatedSection>
          </div>
        </div>
      </section>

      )}

      {/* Floating Image Gallery with Parallax */}
      {homePage.showGallerySection !== false && (
      <section className="bg-gradient-to-b from-background via-surface to-surface-elevated py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 mb-16">
          <TextReveal
            text={homePage.gallerySectionHeading || 'Gallery'}
            className="text-5xl font-bold text-center text-text-primary mb-4"
          />
          <AnimatedSection animation="fadeIn">
            <p className="text-xl text-center text-text-secondary">
              {homePage.gallerySectionSubheading || 'Moments from the stage and studio'}
            </p>
          </AnimatedSection>
        </div>
        {homePage.galleryImages && homePage.galleryImages.length > 0 && (
          <FloatingGallery
            images={homePage.galleryImages
              .filter((img: any) => img.image?.asset?.url)
              .map((img: any) => ({
                src: img.image!.asset!.url!,
                alt: img.alt || img.image?.alt || 'Gallery image',
                width: img.width || 1200,
                height: img.height || 800,
              }))
            }
          />
        )}
      </section>

      )}

      {/* Newsletter Signup - Full-Bleed Cinematic CTA */}
      {homePage.showNewsletterSection !== false && (
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* Background image from hero */}
        {newsletterBgImage && (
          <Image
            src={newsletterBgImage}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        )}
        {/* Heavy dark overlay + blur */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fadeUp">
              <h2 className="text-display-lg text-text-primary mb-6">
                {homePage.newsletterHeading || 'Stay Connected'}
              </h2>
              <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
                {homePage.newsletterText || 'Get the latest show announcements, new music releases, and exclusive content delivered to your inbox.'}
              </p>
              <NewsletterForm
                buttonText={uiText?.newsletterButtonText || undefined}
                successText={uiText?.newsletterSuccessText || undefined}
                placeholder={uiText?.newsletterPlaceholder || undefined}
                disclaimer={uiText?.newsletterDisclaimer || undefined}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>
      )}
    </div>
  )
}
import {getSiteSettings} from '@/lib/site-settings'
