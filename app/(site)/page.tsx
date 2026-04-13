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

      {/* Featured Video Section - Cinematic Split Layout */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-background to-surface relative z-10 section-overlap-up">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Heading column */}
              <AnimatedSection animation="slideLeft">
                <div className="hidden lg:block">
                  {(() => {
                    const words = (homePage.featuredVideoHeading || 'Live Performance').split(' ')
                    const firstWord = words[0]
                    const rest = words.slice(1).join(' ')
                    return (
                      <p className="text-outline-gold text-display-xl leading-[0.85] mb-6">
                        {firstWord}<br />{rest}
                      </p>
                    )
                  })()}
                </div>
                <div className="lg:hidden">
                  <TextReveal
                    text={homePage.featuredVideoHeading || 'Live Performance'}
                    className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 text-center"
                  />
                </div>
                <p className="text-xl text-text-secondary max-w-md text-center lg:text-left mx-auto lg:mx-0 mb-8 lg:mb-0">
                  {homePage.featuredVideoSubheading || 'Experience the authentic blues sound'}
                </p>
              </AnimatedSection>
              {/* Right: Video with cinematic treatment */}
              <AnimatedSection animation="fadeUp" delay={0.2}>
                <div className="relative border-l-2 md:border-l-4 border-accent-primary pl-0">
                  <div className="aspect-video relative overflow-hidden rounded-lg shadow-2xl film-grain transition-transform duration-500 hover:rotate-0" style={{transform: 'rotate(0.5deg)'}}>
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(homePage.featuredVideoUrl || '')}`}
                      title={homePage.featuredVideoTitle || 'Kivett Bednar Live Performance'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

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

      {/* Upcoming Shows Section - Bento Grid + Horizontal Mobile Scroll */}
      {homePage.showUpcomingShows !== false && events && events.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 bg-background section-overlap-diagonal">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-12">
                <TextReveal
                  text={homePage.upcomingShowsHeading || 'Upcoming Shows'}
                  className="text-5xl font-bold text-text-primary"
                />
                <Link
                  href="/shows"
                  className="text-accent-primary font-semibold hover:text-accent-primary/80 transition-colors hidden md:block"
                >
                  {homePage.seeAllShowsLinkText || 'See all shows →'}
                </Link>
              </div>

              {/* Desktop: Bento grid layout */}
              <div className="hidden md:grid gap-6" style={{gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto'}}>
                {events.slice(0, 6).map((event, index: number) => (
                  <AnimatedSection
                    key={event._id}
                    animation="fadeUp"
                    delay={0.1 * index}
                    className={index === 0 ? 'row-span-2' : ''}
                  >
                    <div className={index === 0 ? 'h-full' : ''}>
                      <EventCard event={event as unknown as import('@/types/event').Event} />
                    </div>
                  </AnimatedSection>
                ))}
                {/* Ghost "See All" card */}
                <AnimatedSection animation="fadeUp" delay={0.1 * Math.min(events.length, 6)}>
                  <Link
                    href="/shows"
                    className="flex items-center justify-center h-full min-h-[200px] border-2 border-dashed border-accent-primary/30 rounded-lg hover:border-accent-primary/60 hover:bg-accent-primary/5 transition-all group"
                  >
                    <span className="text-accent-primary text-2xl font-bold group-hover:scale-105 transition-transform">
                      {homePage.seeAllShowsLinkText || 'See all shows →'}
                    </span>
                  </Link>
                </AnimatedSection>
              </div>

              {/* Mobile: Horizontal scroll */}
              <div className="md:hidden flex overflow-x-auto scroll-snap-x gap-4 pb-4 -mx-4 px-4">
                {events.slice(0, 6).map((event) => (
                  <div key={event._id} className="min-w-[85vw] snap-center-child flex-shrink-0">
                    <EventCard event={event as unknown as import('@/types/event').Event} />
                  </div>
                ))}
                {/* Ghost "See All" card */}
                <Link
                  href="/shows"
                  className="min-w-[85vw] snap-center-child flex-shrink-0 flex items-center justify-center border-2 border-dashed border-accent-primary/30 rounded-lg"
                >
                  <span className="text-accent-primary text-xl font-bold">
                    {homePage.seeAllShowsLinkText || 'See all shows →'}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Section - Editorial Layout */}
      {homePage.showBookingSection !== false && (
      <section className="py-12 sm:py-16 md:py-24 bg-surface relative film-grain">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Left-aligned heading with gold rule */}
            <AnimatedSection animation="fadeUp">
              <div className="mb-12">
                <div className="w-16 h-1 bg-accent-primary mb-6" />
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-4">
                  {homePage.bookingSectionHeading || 'Book Kivett for Your Event'}
                </h2>
                <p className="text-xl text-text-secondary max-w-2xl">
                  {homePage.bookingSectionIntro || 'Available for festivals, private events, and venue bookings. Professional blues performance with authentic Texas style meets Pacific Northwest soul.'}
                </p>
              </div>
            </AnimatedSection>

            {/* Main booking card - full width horizontal layout */}
            <AnimatedSection animation="fadeUp" delay={0.15}>
              <div className="bg-gradient-to-br from-surface to-surface-elevated p-5 sm:p-6 md:p-8 lg:p-10 shadow-lg text-text-primary mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-accent-primary">
                      {homePage.bookingInquiriesHeading || 'Booking Inquiries'}
                    </h3>
                    <p className="text-lg text-text-secondary mb-4">
                      {homePage.bookingInquiriesText || 'For booking inquiries, please contact Kivett directly via email:'}
                    </p>
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-bold text-accent-primary mb-3 text-sm tracking-widest uppercase">
                        {homePage.bookingInquiryListHeading || 'Include in Your Inquiry:'}
                      </h4>
                      <ul className="space-y-2 text-text-secondary">
                        {(homePage.bookingInquiryItems || [
                          'Event date and location',
                          'Type of event (festival, private party, venue, etc.)',
                          'Expected audience size',
                          'Performance duration needed',
                        ]).map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-accent-primary mt-1">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="md:flex-shrink-0">
                    <a
                      href={`mailto:${siteSettings?.contactEmail || 'kivettbednar@gmail.com'}`}
                      className="btn-primary w-full md:w-auto text-center text-base sm:text-lg"
                      style={{overflowWrap: 'anywhere'}}
                    >
                      {siteSettings?.contactEmail || 'kivettbednar@gmail.com'}
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Testimonial — full-width, single moment */}
            <AnimatedSection animation="fadeUp" delay={0.25}>
              <figure className="max-w-3xl mx-auto text-center mt-4">
                <blockquote className="font-display italic text-2xl md:text-3xl text-text-primary leading-snug">
                  &ldquo;{homePage.bookingTestimonialQuote || 'Kivett brings authentic blues energy that connects with every audience. His performance at our festival was unforgettable.'}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm uppercase tracking-[0.2em] text-accent-primary font-bold">
                  {homePage.bookingTestimonialAttribution || '— Festival Organizer'}
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

      {/* Studio Video Section - Stacked Cinematic Panels */}
      {homePage.showStudioVideos !== false && (
      <section className="py-12 sm:py-16 md:py-24 bg-surface section-overlap-diagonal">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <TextReveal
              text={homePage.studioSectionHeading || 'In The Studio'}
              className="text-5xl font-bold text-text-primary mb-4 text-center"
            />
            <AnimatedSection animation="fadeIn">
              <p className="text-xl text-text-secondary text-center mb-12">
                {homePage.studioSectionSubheading || 'Behind the scenes of creating authentic Texas blues'}
              </p>
            </AnimatedSection>

            {/* Two videos, clean side-by-side */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <AnimatedSection animation="fadeUp" delay={0.2}>
                <div className="aspect-video relative overflow-hidden shadow-xl film-grain">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(homePage.studioVideo1Url || '')}`}
                    title={homePage.studioVideo1Title || 'Kivett Bednar Studio Session 1'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fadeUp" delay={0.35}>
                <div className="aspect-video relative overflow-hidden shadow-xl film-grain">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(homePage.studioVideo2Url || '')}`}
                    title={homePage.studioVideo2Title || 'Kivett Bednar Studio Session 2'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
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
