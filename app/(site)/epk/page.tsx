import {Metadata} from 'next'
import Image from 'next/image'
import type {PortableTextBlock} from 'next-sanity'
import {sanityFetch} from '@/sanity/lib/live'
import {epkPageQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {LegalPortableText} from '@/components/ui/LegalPortableText'
import {getSiteSettings, isPageEnabled} from '@/lib/site-settings'
import {Mail, Phone, Download, ExternalLink, Calendar, MapPin, Quote} from 'lucide-react'

type EpkData = {
  _id: string
  heroImage: {asset?: {url?: string}; alt?: string} | null
  pageIntro: string | null
  genres: string[] | null
  influencedBy: string[] | null
  shortBio: string | null
  longBio: PortableTextBlock[] | null
  bookingContactName: string | null
  bookingContactEmail: string | null
  bookingContactPhone: string | null
  bookingNotes: string | null
  pressPhotos: Array<{
    _key: string
    asset?: {url?: string}
    alt?: string
    caption?: string
    credit?: string
  }> | null
  videos: Array<{
    _key: string
    title: string
    url: string
    description?: string
  }> | null
  pressQuotes: Array<{
    _key: string
    quote: string
    source: string
    sourceUrl?: string
    logo?: {asset?: {url?: string}; alt?: string}
  }> | null
  notableShows: Array<{
    _key: string
    venue: string
    city?: string
    date?: string
    event?: string
  }> | null
  stagePlotPdf: {asset?: {url?: string; originalFilename?: string}} | null
  techRiderPdf: {asset?: {url?: string; originalFilename?: string}} | null
  fullPressKitPdf: {asset?: {url?: string; originalFilename?: string}} | null
  onesheet: {asset?: {url?: string; originalFilename?: string}} | null
  seoTitle: string | null
  seoDescription: string | null
} | null

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [{data: rawData}, siteSettings] = await Promise.all([
      sanityFetch({query: epkPageQuery}),
      getSiteSettings(),
    ])
    if (!isPageEnabled(siteSettings, 'epk')) {
      return {title: 'Page Unavailable | Kivett Bednar', robots: {index: false}}
    }
    const data = rawData as EpkData
    return {
      title: data?.seoTitle || 'Press Kit | Kivett Bednar',
      description: data?.seoDescription || 'Electronic Press Kit for Kivett Bednar — booking, photos, videos, and press materials.',
      alternates: {canonical: `${baseUrl}/epk`},
    }
  } catch {
    return {
      title: 'Press Kit | Kivett Bednar',
      description: 'Electronic Press Kit for Kivett Bednar',
    }
  }
}

export const revalidate = 60

// Convert YouTube/Vimeo URLs to embed URLs
function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    // YouTube
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      let videoId = ''
      if (u.hostname.includes('youtu.be')) {
        videoId = u.pathname.slice(1)
      } else if (u.searchParams.has('v')) {
        videoId = u.searchParams.get('v') || ''
      } else if (u.pathname.startsWith('/embed/')) {
        videoId = u.pathname.replace('/embed/', '')
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const videoId = u.pathname.split('/').filter(Boolean).pop()
      if (videoId) return `https://player.vimeo.com/video/${videoId}`
    }
    return null
  } catch {
    return null
  }
}

function downloadFilename(url: string, filename?: string): string {
  return filename || url.split('/').pop() || 'download'
}

export default async function EpkPage() {
  const [{data: rawData}, siteSettings] = await Promise.all([
    sanityFetch({query: epkPageQuery}),
    getSiteSettings(),
  ])

  if (!isPageEnabled(siteSettings, 'epk')) {
    return <PageUnavailable pageName="Press Kit" />
  }

  const data = rawData as EpkData
  const heroImageUrl = data?.heroImage?.asset?.url

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative">
        {heroImageUrl ? (
          <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
            <Image
              src={heroImageUrl}
              alt={data?.heroImage?.alt || 'Press kit hero'}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />
            <div className="absolute inset-0 flex items-end pb-12">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  <p className="text-accent-primary text-sm uppercase tracking-widest font-bold mb-3">
                    Electronic Press Kit
                  </p>
                  <h1 className="font-bebas text-5xl md:text-7xl uppercase tracking-wide text-white mb-4">
                    Press Kit
                  </h1>
                  {data?.genres && data.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-accent-primary/20 border border-accent-primary text-accent-primary text-xs uppercase tracking-wider"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-32 pb-12 bg-surface">
            <div className="container mx-auto px-4 text-center">
              <p className="text-accent-primary text-sm uppercase tracking-widest font-bold mb-3">
                Electronic Press Kit
              </p>
              <h1 className="font-bebas text-5xl md:text-6xl uppercase tracking-wide text-text-primary">
                Press Kit
              </h1>
            </div>
          </div>
        )}
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-20">
          {/* Booking Contact (top priority for press use) */}
          {(data?.bookingContactEmail || data?.bookingContactPhone) && (
            <section className="bg-surface-elevated border border-accent-primary/30 p-8 md:p-10">
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-accent-primary mb-6">
                Booking Contact
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {data.bookingContactName && (
                    <p className="text-xl font-bold text-text-primary">{data.bookingContactName}</p>
                  )}
                  {data.bookingContactEmail && (
                    <a
                      href={`mailto:${data.bookingContactEmail}`}
                      className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{data.bookingContactEmail}</span>
                    </a>
                  )}
                  {data.bookingContactPhone && (
                    <a
                      href={`tel:${data.bookingContactPhone.replace(/[^\d+]/g, '')}`}
                      className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{data.bookingContactPhone}</span>
                    </a>
                  )}
                </div>
                {data.bookingNotes && (
                  <div className="text-text-secondary leading-relaxed border-l border-border pl-6">
                    {data.bookingNotes}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Page intro / Short bio */}
          {(data?.pageIntro || data?.shortBio) && (
            <section>
              {data.pageIntro && (
                <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-6">
                  {data.pageIntro}
                </p>
              )}
              {data.shortBio && (
                <div className="bg-surface border-l-2 border-accent-primary p-6">
                  <p className="text-sm text-accent-primary uppercase tracking-widest font-bold mb-3">
                    Short Bio
                  </p>
                  <p className="text-text-secondary leading-relaxed">{data.shortBio}</p>
                </div>
              )}
            </section>
          )}

          {/* Press Photos */}
          {data?.pressPhotos && data.pressPhotos.length > 0 && (
            <section>
              <h2 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary mb-6">
                Press Photos
              </h2>
              <p className="text-text-muted text-sm mb-8">
                Click any photo to download in original resolution. Photo credit must be retained when used.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.pressPhotos.map((photo) => {
                  if (!photo.asset?.url) return null
                  const downloadName = (photo.caption || 'press-photo').replace(/[^a-z0-9-]/gi, '-').toLowerCase()
                  return (
                    <div key={photo._key} className="group relative bg-surface-elevated border border-border overflow-hidden">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={photo.asset.url}
                          alt={photo.alt || photo.caption || 'Press photo'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        {photo.caption && (
                          <p className="text-sm text-text-primary mb-1">{photo.caption}</p>
                        )}
                        {photo.credit && (
                          <p className="text-xs text-text-muted mb-3">Photo: {photo.credit}</p>
                        )}
                        <a
                          href={`${photo.asset.url}?dl=${downloadName}.jpg`}
                          download={`${downloadName}.jpg`}
                          className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary/80 text-xs uppercase tracking-wider font-bold transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Download Hi-Res
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Videos */}
          {data?.videos && data.videos.length > 0 && (
            <section>
              <h2 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary mb-8">
                Videos
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {data.videos.map((video) => {
                  const embedUrl = getEmbedUrl(video.url)
                  return (
                    <div key={video._key}>
                      {embedUrl ? (
                        <div className="relative aspect-video bg-surface-elevated border border-border overflow-hidden">
                          <iframe
                            src={embedUrl}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      ) : (
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block aspect-video bg-surface-elevated border border-border flex items-center justify-center hover:border-accent-primary transition-colors"
                        >
                          <ExternalLink className="w-8 h-8 text-text-muted" />
                        </a>
                      )}
                      <h3 className="font-bebas text-xl uppercase tracking-wide text-text-primary mt-4">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-text-secondary text-sm mt-2">{video.description}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Press Quotes */}
          {data?.pressQuotes && data.pressQuotes.length > 0 && (
            <section>
              <h2 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary mb-8">
                Press Quotes
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {data.pressQuotes.map((q) => (
                  <div key={q._key} className="bg-surface-elevated border border-border p-8 relative">
                    <Quote className="w-8 h-8 text-accent-primary/30 mb-4" />
                    <blockquote className="text-text-primary text-lg leading-relaxed mb-6 italic">
                      &ldquo;{q.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-accent-primary font-bold text-sm uppercase tracking-wider">
                          {q.source}
                        </p>
                        {q.sourceUrl && (
                          <a
                            href={q.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-text-muted hover:text-accent-primary inline-flex items-center gap-1 mt-1"
                          >
                            Read more <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {q.logo?.asset?.url && (
                        <div className="relative w-16 h-12 opacity-70">
                          <Image
                            src={q.logo.asset.url}
                            alt={q.logo.alt || q.source}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notable Shows */}
          {data?.notableShows && data.notableShows.length > 0 && (
            <section>
              <h2 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary mb-8">
                Notable Performances
              </h2>
              <div className="bg-surface-elevated border border-border divide-y divide-border">
                {data.notableShows.map((show) => (
                  <div key={show._key} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-bold text-text-primary">{show.venue}</p>
                      {show.event && (
                        <p className="text-accent-primary text-sm">{show.event}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                      {show.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {show.city}
                        </span>
                      )}
                      {show.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(show.date).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Long Bio */}
          {data?.longBio && data.longBio.length > 0 && (
            <section>
              <h2 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary mb-8">
                Full Bio
              </h2>
              <LegalPortableText value={data.longBio} />
            </section>
          )}

          {/* Influences */}
          {data?.influencedBy && data.influencedBy.length > 0 && (
            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-4">
                Influenced By
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.influencedBy.map((influence) => (
                  <span
                    key={influence}
                    className="px-3 py-1 bg-surface border border-border text-text-secondary text-sm"
                  >
                    {influence}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Tech Downloads */}
          {(data?.stagePlotPdf?.asset?.url || data?.techRiderPdf?.asset?.url) && (
            <section>
              <h2 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide text-text-primary mb-8">
                Technical Documents
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.stagePlotPdf?.asset?.url && (
                  <a
                    href={data.stagePlotPdf.asset.url}
                    download={downloadFilename(data.stagePlotPdf.asset.url, data.stagePlotPdf.asset.originalFilename)}
                    className="flex items-center justify-between bg-surface-elevated border border-border hover:border-accent-primary p-6 transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-text-primary">Stage Plot</p>
                      <p className="text-sm text-text-muted">PDF download</p>
                    </div>
                    <Download className="w-5 h-5 text-accent-primary group-hover:translate-y-0.5 transition-transform" />
                  </a>
                )}
                {data.techRiderPdf?.asset?.url && (
                  <a
                    href={data.techRiderPdf.asset.url}
                    download={downloadFilename(data.techRiderPdf.asset.url, data.techRiderPdf.asset.originalFilename)}
                    className="flex items-center justify-between bg-surface-elevated border border-border hover:border-accent-primary p-6 transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-text-primary">Tech Rider</p>
                      <p className="text-sm text-text-muted">PDF download</p>
                    </div>
                    <Download className="w-5 h-5 text-accent-primary group-hover:translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Press Kit Downloads */}
          {(data?.fullPressKitPdf?.asset?.url || data?.onesheet?.asset?.url) && (
            <section className="bg-accent-primary/5 border border-accent-primary/30 p-8 md:p-10">
              <h2 className="font-bebas text-2xl md:text-3xl uppercase tracking-wide text-text-primary mb-6">
                Download the Full Press Kit
              </h2>
              <div className="flex flex-wrap gap-4">
                {data.fullPressKitPdf?.asset?.url && (
                  <a
                    href={data.fullPressKitPdf.asset.url}
                    download={downloadFilename(data.fullPressKitPdf.asset.url, data.fullPressKitPdf.asset.originalFilename)}
                    className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold uppercase tracking-wider px-6 py-3 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Full Press Kit (PDF)
                  </a>
                )}
                {data.onesheet?.asset?.url && (
                  <a
                    href={data.onesheet.asset.url}
                    download={downloadFilename(data.onesheet.asset.url, data.onesheet.asset.originalFilename)}
                    className="inline-flex items-center gap-2 border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black font-bold uppercase tracking-wider px-6 py-3 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    One-Sheet (PDF)
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Empty state */}
          {!data && (
            <div className="text-center py-24">
              <h2 className="font-bebas text-3xl uppercase tracking-wide text-text-primary mb-4">
                Press Kit Coming Soon
              </h2>
              <p className="text-text-secondary">
                The press kit is being prepared. Please check back soon or contact directly for press inquiries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
