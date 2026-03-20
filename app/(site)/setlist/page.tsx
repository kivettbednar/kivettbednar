import {Metadata} from 'next'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {setlistPageQuery, allSongsQuery} from '@/sanity/lib/queries'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {AnimatedHero} from '@/components/ui/AnimatedHero'
import {ImageRevealScroll} from '@/components/ui/ImageRevealScroll'
import {AnimatedCounter} from '@/components/ui/AnimatedCounter'
import {Music, Disc3, Guitar, ChevronRight} from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const {data: setlistPage} = await sanityFetch({query: setlistPageQuery})
    return {
      title: setlistPage?.seoTitle || 'Blues Set List | Kivett Bednar',
      description: setlistPage?.seoDescription || 'A collection of classic blues songs performed by Kivett Bednar',
      alternates: { canonical: `${baseUrl}/setlist` },
    }
  } catch {
    return {
      title: 'Blues Set List | Kivett Bednar',
      description: 'A collection of classic blues songs',
    }
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

type Song = {_id: string; title: string | null; key: string | null; artist?: string | null; notes?: string | null; order?: number | null}

export default async function SetlistPage() {
  let setlistPage = null
  let songs = null

  try {
    ;[setlistPage, songs] = await Promise.all([
      sanityFetch({query: setlistPageQuery}).then((r) => r.data),
      sanityFetch({query: allSongsQuery}).then((r) => r.data),
    ])
  } catch (error) {
    console.warn('Failed to fetch setlist data, using fallback content:', error)
  }

  // Group songs by first letter for a more organized display
  const songsByLetter = songs?.reduce((acc: Record<string, Song[]>, song: Song) => {
    const letter = (song.title || '').charAt(0).toUpperCase() || '#'
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(song)
    return acc
  }, {}) || {}

  return (
    <div className="min-h-screen">
      {/* Animated Hero with Sheet Music */}
      <AnimatedHero
        title={setlistPage?.heroHeading || 'Blues Setlist'}
        subtitle={songs && songs.length > 0 ? `${songs.length}${setlistPage?.subtitleSuffix || ' timeless classics from the great American songbook'}` : undefined}
        variant="setlist"
        backgroundImage={setlistPage?.heroImage?.asset?.url || '/images/gallery/orpheum-performance.jpg'}
        backgroundAlt={setlistPage?.heroImage?.alt || 'Kivett Bednar performing blues classics'}
      />

      {/* Stats Banner */}
      <section className="relative bg-gradient-to-r from-surface via-surface-elevated to-surface py-8 border-y border-accent-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            <AnimatedSection animation="fadeIn" delay={0.1}>
              <div className="flex flex-col items-center group cursor-default">
                <span className="text-4xl md:text-5xl font-bebas text-accent-primary">
                  <AnimatedCounter value={songs?.length || 0} />
                </span>
                <span className="text-xs uppercase tracking-widest text-text-muted mt-1 group-hover:text-accent-primary/70 transition-colors">{setlistPage?.statsLabel1 || 'Songs'}</span>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <div className="flex items-center gap-3 group cursor-default">
                <Disc3 className="w-6 h-6 text-accent-primary animate-spin-slow group-hover:text-white transition-colors" />
                <span className="text-sm uppercase tracking-widest text-text-muted group-hover:text-accent-primary/70 transition-colors">{setlistPage?.statsLabel2 || 'Classic Blues'}</span>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeIn" delay={0.3}>
              <div className="flex flex-col items-center group cursor-default">
                <span className="text-4xl md:text-5xl font-bebas text-accent-primary animate-count">{setlistPage?.statsValue3 || 'Live'}</span>
                <span className="text-xs uppercase tracking-widest text-text-muted mt-1 group-hover:text-accent-primary/70 transition-colors">{setlistPage?.statsLabel3 || 'Performance Ready'}</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Image Reveal - Blues Performance */}
      <section className="bg-gradient-to-b from-surface to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ImageRevealScroll
              imageSrc={setlistPage?.performanceImage?.asset?.url || '/images/382702580_10225110781416892_2823231479166319016_n.jpg'}
              imageAlt={setlistPage?.performanceImage?.alt || 'Kivett performing blues classics'}
              direction="right"
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Intro text */}
            {setlistPage?.introText && (
              <div className="max-w-3xl mx-auto text-center mb-16">
                <AnimatedSection animation="fadeIn">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px bg-accent-primary w-12" />
                    <Music className="w-5 h-5 text-accent-primary" />
                    <div className="h-px bg-accent-primary w-12" />
                  </div>
                  <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
                    {setlistPage.introText}
                  </p>
                </AnimatedSection>
              </div>
            )}

            {/* Songs - Premium Card Grid */}
            {songs && songs.length > 0 && (
              <div className="space-y-12">
                <AnimatedSection animation="fadeIn">
                  <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-center text-text-primary mb-12">
                    {setlistPage?.repertoireHeading || 'The Repertoire'}
                  </h2>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {songs.map((song: Song, index: number) => (
                    <AnimatedSection
                      key={song._id}
                      animation="fadeUp"
                      delay={0.03 * Math.min(index, 15)}
                    >
                      <div className="group relative">
                        {/* Song Card */}
                        <div className="relative bg-surface-elevated border border-border hover:border-accent-primary/50 p-6 transition-all duration-500 overflow-hidden h-full">
                          {/* Hover glow */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/10 rounded-full blur-2xl" />
                          </div>

                          {/* Track number */}
                          <div className="absolute top-4 right-4 font-mono text-xs text-text-muted/50">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>

                          {/* Content */}
                          <div className="relative z-10">
                            {/* Musical note icon */}
                            <div className="w-10 h-10 border border-accent-primary/30 group-hover:border-accent-primary flex items-center justify-center mb-4 transition-all duration-300">
                              <Music className="w-5 h-5 text-accent-primary/70 group-hover:text-accent-primary transition-colors" />
                            </div>

                            {/* Song title */}
                            <h3 className="font-bebas text-xl uppercase tracking-wide text-text-primary group-hover:text-accent-primary transition-colors mb-2">
                              {song.title}
                            </h3>

                            {/* Key signature */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs uppercase tracking-widest text-text-muted">Key:</span>
                              <span className="font-mono text-sm font-bold text-accent-primary">
                                {song.key}
                              </span>
                            </div>

                            {/* Original artist if available */}
                            {song.artist && (
                              <p className="text-xs text-text-muted mt-2 italic">
                                Originally by {song.artist}
                              </p>
                            )}
                          </div>

                          {/* Bottom accent line */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>

                {/* Song count summary */}
                <AnimatedSection animation="fadeIn" delay={0.5}>
                  <div className="text-center mt-12 pt-12 border-t border-border">
                    <p className="text-text-muted">
                      <span className="text-accent-primary font-bold">{songs.length}</span>{setlistPage?.songCountSummaryText || ' songs ready for your event'}
                    </p>
                  </div>
                </AnimatedSection>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Reveal - Guitar */}
      <section className="bg-gradient-to-b from-background to-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ImageRevealScroll
              imageSrc={setlistPage?.guitarImage?.asset?.url || '/images/16487687_1351833004875154_191765266250731543_o.jpg'}
              imageAlt={setlistPage?.guitarImage?.alt || 'Kivett performing on stage'}
              direction="left"
            />
          </div>
        </div>
      </section>

      {/* Request a Song Section */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection animation="fadeUp">
              <div className="bg-surface-elevated border border-border p-8 md:p-12 text-center">
                <Guitar className="w-12 h-12 text-accent-primary mx-auto mb-6" />
                <h3 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-4">
                  {setlistPage?.requestHeading || 'Have a Special Request?'}
                </h3>
                <p className="text-text-secondary mb-6 max-w-xl mx-auto">
                  {setlistPage?.requestText || 'Looking for a specific blues classic not on the list? Get in touch and let\'s talk about adding it to the setlist for your event.'}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary/80 font-bold uppercase tracking-wider transition-colors"
                >
                  {setlistPage?.requestButtonText || 'Make a Request'}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {(setlistPage?.ctaHeading || setlistPage?.ctaText) && (
        <section className="relative bg-gradient-to-b from-surface to-background py-24 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-accent-primary blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-accent-primary blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="fadeUp">
                <div className="relative">
                  {/* Corner accents */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-accent-primary" />
                  <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-accent-primary" />
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-accent-primary" />
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-accent-primary" />

                  <div className="bg-surface-elevated border border-border p-12 md:p-16 text-center">
                    {setlistPage.ctaHeading && (
                      <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide mb-6 text-text-primary">
                        {setlistPage.ctaHeading}
                      </h2>
                    )}
                    {setlistPage.ctaText && (
                      <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                        {setlistPage.ctaText}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/lessons"
                        className="group inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold text-lg uppercase tracking-wider px-8 py-4 transition-all duration-300"
                      >
                        {setlistPage?.ctaBookLessonButtonText || 'Book a Lesson'}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href="/contact"
                        className="btn-secondary"
                      >
                        {setlistPage?.ctaContactButtonText || 'Get in Touch'}
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
