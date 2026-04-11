import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {lessonsPageQuery, settingsQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {AnimatedHero} from '@/components/ui/AnimatedHero'
import {SplitScreenImage} from '@/components/ui/SplitScreenImage'
import {AnimatedCounter} from '@/components/ui/AnimatedCounter'
import {Guitar, Music, Mic2, BookOpen, Users, Award, Sparkles, ChevronRight} from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [{data: lessonsPage}, {data: siteSettings}] = await Promise.all([
      sanityFetch({query: lessonsPageQuery}),
      sanityFetch({query: settingsQuery}),
    ])
    if ((siteSettings?.showLessonsPage as boolean | null) === false) {
      return {title: 'Page Unavailable | Kivett Bednar', robots: {index: false}}
    }
    return {
      title: lessonsPage?.seoTitle || 'Lessons | Kivett Bednar',
      description: lessonsPage?.seoDescription || 'Guitar and blues music lessons with Kivett Bednar - all skill levels welcome',
      alternates: { canonical: `${baseUrl}/lessons` },
    }
  } catch {
    return {
      title: 'Lessons | Kivett Bednar',
      description: 'Guitar and blues music lessons',
    }
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

// Icon mapping for learning items
const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  guitar: Guitar,
  music: Music,
  mic: Mic2,
  book: BookOpen,
  users: Users,
  award: Award,
}

export default async function LessonsPage() {
  let lessonsPage = null
  let settings = null

  try {
    ;[lessonsPage, settings] = await Promise.all([
      sanityFetch({query: lessonsPageQuery}).then((r) => r.data),
      sanityFetch({query: settingsQuery}).then((r) => r.data),
    ])
  } catch (error) {
    console.warn('Failed to fetch lessons page data, using fallback content:', error)
  }

  if ((settings?.showLessonsPage as boolean | null) === false) {
    return <PageUnavailable pageName="Lessons" />
  }

  // Fallback if no content yet
  if (!lessonsPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="font-bebas text-4xl uppercase tracking-wide text-text-primary mb-4">Lessons Coming Soon</h1>
          <p className="text-text-secondary">Guitar and blues lessons information will be available shortly. Check back soon.</p>
        </div>
      </div>
    )
  }

  // Default icons for learning items if not specified
  const defaultIcons = ['guitar', 'music', 'mic', 'book', 'users', 'award']

  return (
    <div className="min-h-screen">
      {/* Animated Hero */}
      <AnimatedHero
        title={lessonsPage.heroHeading || 'Guitar & Blues Lessons'}
        subtitle={lessonsPage.heroSubheading || lessonsPage.credentials || undefined}
        variant="lessons"
        backgroundImage={lessonsPage.heroImage?.asset?.url || '/images/gallery/guitar-portrait.jpg'}
        backgroundAlt={lessonsPage.heroImage?.alt || 'Kivett Bednar with guitar'}
        desktopPosition={lessonsPage.heroImage?.desktopPosition || undefined}
        mobilePosition={lessonsPage.heroImage?.mobilePosition || undefined}
      />

      {/* Credentials Banner */}
      <section className="relative bg-gradient-to-r from-surface via-surface-elevated to-surface py-8 border-y border-accent-primary/20 overflow-hidden">
        {/* Animated gold line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {((lessonsPage.stats as any) && (lessonsPage.stats as any).length > 0
              ? (lessonsPage.stats as any)
              : [
                  {_key: 'default-1', label: 'Years Experience', value: '20', suffix: '+'},
                  {_key: 'default-2', label: 'Students Taught', value: '500', suffix: '+'},
                  {_key: 'default-3', label: 'Skill Levels', value: 'All', suffix: ''},
                ]
            ).map((stat: {_key?: string; label: string; value: string; suffix?: string}, index: number) => {
              const numericValue = parseInt(stat.value, 10)
              const isNumeric = !isNaN(numericValue)

              return (
                <AnimatedSection key={stat._key || index} animation="fadeIn" delay={0.1 * (index + 1)}>
                  <div className="flex flex-col items-center group cursor-default">
                    <span className="text-4xl md:text-5xl font-bebas text-accent-primary">
                      {isNumeric ? (
                        <AnimatedCounter value={numericValue} suffix={stat.suffix || ''} />
                      ) : (
                        <span className="animate-count">{stat.value}{stat.suffix || ''}</span>
                      )}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-text-muted mt-1 group-hover:text-accent-primary/70 transition-colors">
                      {stat.label}
                    </span>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy - Split Screen */}
      <SplitScreenImage
        imageSrc={lessonsPage.philosophyImage?.asset?.url || '/images/portraits/guild-shirt.jpg'}
        imageAlt={lessonsPage.philosophyImage?.alt || 'Kivett with Guild guitar'}
        imagePosition="right"
        darkBg={false}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-accent-primary w-12" />
          <span className="text-accent-primary text-sm uppercase tracking-wider font-bold">Teaching Philosophy</span>
        </div>
        <h2 className="font-bebas text-5xl md:text-6xl uppercase tracking-wide mb-8 text-text-primary">
          {lessonsPage.philosophyHeading}
        </h2>
        <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
          {lessonsPage.philosophyText?.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </SplitScreenImage>

      {/* What You'll Learn - Premium Cards */}
      {lessonsPage.learningItems && lessonsPage.learningItems.length > 0 && (
        <section className="relative bg-background py-24 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-accent-primary blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent-primary blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <AnimatedSection animation="fadeIn">
                <div className="text-center mb-16">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px bg-accent-primary w-12" />
                    <Sparkles className="w-5 h-5 text-accent-primary" />
                    <div className="h-px bg-accent-primary w-12" />
                  </div>
                  <h2 className="font-bebas text-5xl md:text-6xl uppercase tracking-wide text-text-primary">
                    {lessonsPage.learningItemsHeading || "What You'll Learn"}
                  </h2>
                </div>
              </AnimatedSection>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessonsPage.learningItems.map((item: any, index: number) => {
                  const iconKey = item.icon || defaultIcons[index % defaultIcons.length]
                  const IconComponent = iconMap[iconKey] || Guitar

                  return (
                    <AnimatedSection key={item._key || index} animation="fadeUp" delay={0.1 * index}>
                      <div className="group relative h-full">
                        {/* Card */}
                        <div className="relative h-full bg-surface-elevated border border-border hover:border-accent-primary/50 p-8 transition-all duration-500 overflow-hidden">
                          {/* Hover glow effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl" />
                          </div>

                          {/* Icon */}
                          <div className="relative mb-6">
                            <div className="w-16 h-16 border-2 border-accent-primary/30 group-hover:border-accent-primary flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-primary/20">
                              <IconComponent className="w-8 h-8 text-accent-primary" />
                            </div>
                          </div>

                          {/* Content */}
                          <h3 className="font-bebas text-2xl uppercase tracking-wide mb-3 text-text-primary group-hover:text-accent-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-text-secondary leading-relaxed">
                            {item.description}
                          </p>

                          {/* Bottom accent */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </AnimatedSection>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Box - Premium Design */}
      <section className="relative bg-surface py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection animation="fadeUp">
              <div className="relative">
                {/* Corner accents */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-accent-primary" />
                <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-accent-primary" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-accent-primary" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-accent-primary" />

                <div className="bg-surface-elevated border border-border p-12 md:p-16 text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Guitar className="w-8 h-8 text-accent-primary" />
                  </div>

                  <h3 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide mb-6 text-text-primary">
                    {lessonsPage.ctaBoxHeading}
                  </h3>
                  <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                    {lessonsPage.ctaBoxText}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {settings?.contactEmail && (
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="group inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold text-lg uppercase tracking-wider px-8 py-4 transition-all duration-300"
                      >
                        {lessonsPage.emailButtonText || 'Email Me'}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                    {settings?.bookingUrl && (
                      <a
                        href={settings.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        {lessonsPage.scheduleButtonText || 'Schedule a Lesson'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonial Quote Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fadeIn">
              <div className="relative">
                {/* Large quote marks */}
                <span className="absolute -top-8 left-0 text-8xl font-serif text-accent-primary/20 leading-none">&ldquo;</span>
                <blockquote className="relative z-10 font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary px-8 md:px-16">
                  {lessonsPage.testimonialQuote || "Music isn\u2019t just about the notes you play \u2014 it\u2019s about the story you tell and the feeling you share."}
                </blockquote>
                <span className="absolute -bottom-16 right-0 text-8xl font-serif text-accent-primary/20 leading-none">&rdquo;</span>
              </div>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="h-px bg-accent-primary/50 w-8" />
                <span className="text-accent-primary uppercase tracking-widest text-sm font-bold">{lessonsPage.testimonialAttribution || 'Kivett Bednar'}</span>
                <div className="h-px bg-accent-primary/50 w-8" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
