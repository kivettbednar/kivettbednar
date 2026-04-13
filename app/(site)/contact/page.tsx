import {Metadata} from 'next'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {contactPageQuery, uiTextQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {AnimatedHero} from '@/components/ui/AnimatedHero'
import {StaggeredImageGrid} from '@/components/ui/StaggeredImageGrid'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {Mail, Calendar, Music, Instagram, Facebook, Youtube, MapPin, ChevronRight, ExternalLink, MessageSquare} from 'lucide-react'
import {ContactForm} from '@/components/ui/ContactForm'
import {getSiteSettings, isPageEnabled} from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [contactResult, siteSettings] = await Promise.all([
      sanityFetch({query: contactPageQuery}),
      getSiteSettings(),
    ])
    if (!isPageEnabled(siteSettings, 'contact')) {
      return {title: 'Page Unavailable | Kivett Bednar', robots: {index: false}}
    }
    const contactPage = contactResult?.data
    return {
      title: contactPage?.seoTitle || 'Contact | Kivett Bednar',
      description: contactPage?.seoDescription || 'Get in touch with Kivett Bednar for bookings, lessons, and inquiries',
      alternates: { canonical: `${baseUrl}/contact` },
    }
  } catch {
    return {
      title: 'Contact | Kivett Bednar',
      description: 'Get in touch',
    }
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

// Social platform icons mapping
const socialIcons: Record<string, React.ComponentType<{className?: string}>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
}

export default async function ContactPage() {
  let contactPage = null
  let uiText = null

  try {
    ;[contactPage, uiText] = await Promise.all([
      sanityFetch({query: contactPageQuery}).then((r) => r.data),
      sanityFetch({query: uiTextQuery}).then((r) => r.data),
    ])
  } catch (error) {
    console.warn('Failed to fetch contact page data, using fallback content:', error)
  }

  const siteSettings = await getSiteSettings()

  if (!isPageEnabled(siteSettings, 'contact')) {
    return <PageUnavailable pageName="Contact" />
  }

  return (
    <div className="min-h-screen">
      {/* Animated Hero */}
      <AnimatedHero
        title={contactPage?.heroHeading || 'Get in Touch'}
        subtitle={contactPage?.heroSubheading || undefined}
        variant="contact"
        backgroundImage={contactPage?.heroImage?.asset?.url || undefined}
        backgroundAlt={contactPage?.heroImage?.alt || 'Kivett Bednar on stage'}
      />

      {/* Contact Cards Section */}
      <section className="bg-gradient-to-b from-surface via-surface-elevated to-surface py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <AnimatedSection animation="fadeIn">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px bg-accent-primary w-12" />
                  <Mail className="w-5 h-5 text-accent-primary" />
                  <div className="h-px bg-accent-primary w-12" />
                </div>
                <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary">
                  {contactPage?.connectHeading || "Let's Connect"}
                </h2>
              </div>
            </AnimatedSection>

            {/* Contact Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Email Card */}
              {siteSettings?.contactEmail && (
                <AnimatedSection animation="fadeUp" delay={0.1}>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="group block h-full"
                  >
                    <div className="relative h-full bg-surface-elevated border border-border hover:border-accent-primary/50 p-8 transition-all duration-500 overflow-hidden">
                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl" />
                      </div>

                      {/* Icon */}
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-2 border-accent-primary/30 group-hover:border-accent-primary flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-primary/20">
                          <Mail className="w-8 h-8 text-accent-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-bebas text-2xl uppercase tracking-wide mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
                        {contactPage?.directContactHeading || 'Email Me'}
                      </h3>
                      <p className="text-accent-primary font-mono text-lg mb-4 break-all">
                        {siteSettings.contactEmail}
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {contactPage?.directContactDescription || "Whether you're booking a show, inquiring about lessons, or just want to say hello — I'd love to hear from you."}
                      </p>

                      {/* Arrow indicator */}
                      <div className="absolute bottom-6 right-6 w-8 h-8 border border-accent-primary/30 group-hover:border-accent-primary group-hover:bg-accent-primary flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-accent-primary group-hover:text-black transition-colors" />
                      </div>

                      {/* Bottom accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </a>
                </AnimatedSection>
              )}

              {/* Booking Card */}
              <AnimatedSection animation="fadeUp" delay={0.2}>
                <Link
                  href="/shows"
                  className="group block h-full"
                >
                  <div className="relative h-full bg-surface-elevated border border-border hover:border-accent-primary/50 p-8 transition-all duration-500 overflow-hidden">
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl" />
                    </div>

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-2 border-accent-primary/30 group-hover:border-accent-primary flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-primary/20">
                        <Calendar className="w-8 h-8 text-accent-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-bebas text-2xl uppercase tracking-wide mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
                      {contactPage?.bookingCardTitle || 'Book a Show'}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {contactPage?.bookingCardDescription || 'Looking for live blues at your venue or private event? Check out upcoming shows or reach out to discuss booking.'}
                    </p>
                    <span className="text-accent-primary font-bold text-sm uppercase tracking-wider">
                      {contactPage?.bookingCardLinkText || 'View Shows →'}
                    </span>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-6 right-6 w-8 h-8 border border-accent-primary/30 group-hover:border-accent-primary group-hover:bg-accent-primary flex items-center justify-center transition-all duration-300">
                      <ChevronRight className="w-4 h-4 text-accent-primary group-hover:text-black transition-colors" />
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </AnimatedSection>

              {/* Lessons Card */}
              <AnimatedSection animation="fadeUp" delay={0.3}>
                <Link
                  href="/lessons"
                  className="group block h-full"
                >
                  <div className="relative h-full bg-surface-elevated border border-border hover:border-accent-primary/50 p-8 transition-all duration-500 overflow-hidden">
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl" />
                    </div>

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-2 border-accent-primary/30 group-hover:border-accent-primary flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-primary/20">
                        <Music className="w-8 h-8 text-accent-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-bebas text-2xl uppercase tracking-wide mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
                      {contactPage?.lessonsCardTitle || 'Guitar Lessons'}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {contactPage?.lessonsCardDescription || 'Learn blues guitar from decades of experience. All skill levels welcome — from beginners to advanced players.'}
                    </p>
                    <span className="text-accent-primary font-bold text-sm uppercase tracking-wider">
                      {contactPage?.lessonsCardLinkText || 'Learn More →'}
                    </span>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-6 right-6 w-8 h-8 border border-accent-primary/30 group-hover:border-accent-primary group-hover:bg-accent-primary flex items-center justify-center transition-all duration-300">
                      <ChevronRight className="w-4 h-4 text-accent-primary group-hover:text-black transition-colors" />
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </AnimatedSection>

              {/* Location Card - Interactive */}
              <AnimatedSection animation="fadeUp" delay={0.4}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactPage?.locationMapQuery || 'Portland Oregon')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <div className="relative h-full bg-surface-elevated border border-border hover:border-accent-primary/50 p-8 overflow-hidden transition-all duration-500">
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl" />
                    </div>

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-2 border-accent-primary/30 group-hover:border-accent-primary flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-primary/20">
                        <MapPin className="w-8 h-8 text-accent-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-bebas text-2xl uppercase tracking-wide mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
                      {contactPage?.locationCardTitle || 'Based In'}
                    </h3>
                    <p className="text-accent-primary font-bold text-lg mb-4">
                      {contactPage?.locationCardRegion || 'Pacific Northwest'}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {contactPage?.locationCardDescription || 'Gritty Texas Blues meets the heart of the Pacific Northwest. Available for shows and events throughout the region.'}
                    </p>
                    <span className="text-accent-primary font-bold text-sm uppercase tracking-wider">
                      {contactPage?.locationCardLinkText || 'View on Map →'}
                    </span>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-6 right-6 w-8 h-8 border border-accent-primary/30 group-hover:border-accent-primary group-hover:bg-accent-primary flex items-center justify-center transition-all duration-300">
                      <ChevronRight className="w-4 h-4 text-accent-primary group-hover:text-black transition-colors" />
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </a>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px bg-accent-primary w-12" />
                  <MessageSquare className="w-5 h-5 text-accent-primary" />
                  <div className="h-px bg-accent-primary w-12" />
                </div>
                <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary mb-3">
                  Send a Message
                </h2>
                <p className="text-text-secondary">
                  Have a question or want to get in touch? Fill out the form below.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <ContactForm
                successHeading={uiText?.formSuccessHeading || undefined}
                successMessage={uiText?.formSuccessMessage || undefined}
                sendAnotherText={uiText?.formSendAnotherText || undefined}
                placeholderName={uiText?.formPlaceholderName || undefined}
                placeholderEmail={uiText?.formPlaceholderEmail || undefined}
                placeholderSubject={uiText?.formPlaceholderSubject || undefined}
                placeholderMessage={uiText?.formPlaceholderMessage || undefined}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      {siteSettings?.socialLinks && siteSettings.socialLinks.length > 0 && (
        <section className="bg-background py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="fadeIn">
                <div className="text-center mb-12">
                  <h2 className="font-bebas text-4xl uppercase tracking-wide text-text-primary mb-4">
                    {contactPage?.socialHeading || 'Follow the Journey'}
                  </h2>
                  <p className="text-text-secondary">
                    {contactPage?.socialSubheading || 'Stay connected for show updates, behind-the-scenes content, and more'}
                  </p>
                </div>
              </AnimatedSection>

              <div className="flex flex-wrap justify-center gap-4">
                {siteSettings.socialLinks.map((link: {platform: string | null; url: string | null}, index: number) => {
                  const IconComponent = socialIcons[link.platform?.toLowerCase() ?? ''] || ExternalLink
                  return (
                    <AnimatedSection key={link.url || index} animation="fadeUp" delay={0.1 * index}>
                      <a
                        href={link.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-6 py-4 bg-surface-elevated border border-border hover:border-accent-primary/50 transition-all duration-300"
                      >
                        <IconComponent className="w-6 h-6 text-accent-primary" />
                        <span className="font-bold uppercase tracking-wider text-text-primary group-hover:text-accent-primary transition-colors">
                          {link.platform}
                        </span>
                        <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" />
                      </a>
                    </AnimatedSection>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Portrait Gallery */}
      {(() => {
        const validImages = contactPage?.portraitGallery
          ?.filter((img: {image?: {asset?: {url?: string | null} | null; alt?: string | null} | null; alt?: string | null; caption?: string | null}) => img.image?.asset?.url)
          .map((img: {image?: {asset?: {url?: string | null} | null; alt?: string | null} | null; alt?: string | null; caption?: string | null}) => ({
            src: img.image!.asset!.url!,
            alt: img.alt || img.image?.alt || 'Portrait photo',
            caption: img.caption || '',
          })) || []

        return validImages.length > 0 ? (
          <section className="bg-surface py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <AnimatedSection animation="fadeIn">
                  <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="h-px bg-accent-primary w-12" />
                      <span className="text-accent-primary text-sm uppercase tracking-wider font-bold">Gallery</span>
                      <div className="h-px bg-accent-primary w-12" />
                    </div>
                    <h2 className="font-bebas text-5xl uppercase tracking-wide text-text-primary">
                      {contactPage?.aboutHeading || 'Behind the Music'}
                    </h2>
                  </div>
                </AnimatedSection>
                <StaggeredImageGrid
                  images={validImages}
                  columns={2}
                />
              </div>
            </div>
          </section>
        ) : null
      })()}

      {/* Final CTA */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection animation="fadeUp">
              <h3 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide mb-6 text-text-primary">
                {contactPage?.ctaSectionHeading || 'Ready to Experience Live Blues?'}
              </h3>
              <p className="text-lg text-text-secondary mb-10">
                {contactPage?.ctaSectionText || 'Check out upcoming shows and experience gritty Texas Blues meets the heart of the Pacific Northwest.'}
              </p>
              <Link
                href="/shows"
                className="group inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold text-lg uppercase tracking-wider px-8 py-4 transition-all duration-300"
              >
                {contactPage?.ctaSectionButtonText || 'View Upcoming Shows'}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
