'use client'

import Image from 'next/image'
import Link from 'next/link'
import {formatInTimeZone} from 'date-fns-tz'
import {urlFor} from '@/lib/image-positioning'
import {useState} from 'react'
import {useIsMobile} from '@/lib/hooks/useIsMobile'
import {motion} from 'framer-motion'
import {getObjectPosition, type SanityImageWithPositioning} from '@/lib/image-positioning'
import {MapPin, Calendar, Clock} from 'lucide-react'

type Event = {
  _id: string
  title: string
  slug?: string
  startDateTime: string
  timezone: string
  venue: string
  city: string
  state?: string
  ticketUrl?: string
  coverImage?: SanityImageWithPositioning & {
    alt?: string
  }
  isCanceled?: boolean
  isSoldOut?: boolean
}

export function EventCard({event, index = 0, fallbackImage}: {event: Event; index?: number; fallbackImage?: string}) {
  const isMobile = useIsMobile()
  const [imageError, setImageError] = useState(false)

  const hasCoverImage = !!event.coverImage?.asset
  const fallbackImageUrl = fallbackImage && !hasCoverImage ? fallbackImage : null

  const eventDate = formatInTimeZone(
    new Date(event.startDateTime),
    event.timezone,
    'MMM d, yyyy'
  )
  const eventTime = formatInTimeZone(
    new Date(event.startDateTime),
    event.timezone,
    'h:mm a'
  )

  // Use slug if available, otherwise fallback to _id for events without slugs
  const eventLink = event.slug ? `/shows/${event.slug}` : event._id ? `/shows/${event._id}` : null

  // Log warning in development for events missing slugs
  if (!event.slug && event._id && process.env.NODE_ENV === 'development') {
    console.warn(`Event "${event.title}" (${event._id}) is missing a slug. Using ID as fallback. Please generate a slug in Sanity Studio.`)
  }

  const cardContent = (
    <>
      {/* Image Section */}
      {event.coverImage?.asset && !imageError ? (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={urlFor(event.coverImage.asset).width(600).height(400).url()}
            alt={event.coverImage.alt || event.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            sizes="(min-width: 1024px) 800px, (min-width: 768px) 700px, 100vw"
            onError={() => setImageError(true)}
            style={{
              objectPosition: getObjectPosition(event.coverImage, isMobile)
            }}
          />

          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

          {/* Subtle gold accent on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/0 via-transparent to-accent-primary/0 group-hover:from-accent-primary/10 group-hover:to-accent-primary/5 transition-all duration-500" />

          {/* Canceled overlay */}
          {event.isCanceled && (
            <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-20 backdrop-blur-sm">
              <span className="text-white text-3xl font-bebas tracking-[0.2em] uppercase border-2 border-white/30 px-6 py-2">
                CANCELED
              </span>
            </div>
          )}

          {/* Sold Out badge - premium styling */}
          {event.isSoldOut && !event.isCanceled && (
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-accent-primary text-black px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase shadow-lg shadow-accent-primary/30">
                SOLD OUT
              </div>
            </div>
          )}
        </div>
      ) : fallbackImageUrl ? (
        /* Fallback to default event image from showsPage settings */
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={fallbackImageUrl}
            alt={event.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 800px, (min-width: 768px) 700px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 group-hover:from-black/90 transition-all duration-500" />
          {event.isCanceled && (
            <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-20 backdrop-blur-sm">
              <span className="text-white text-3xl font-bebas tracking-[0.2em] uppercase border-2 border-white/30 px-6 py-2">
                CANCELED
              </span>
            </div>
          )}
          {event.isSoldOut && !event.isCanceled && (
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-accent-primary text-black px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase shadow-lg shadow-accent-primary/30">
                SOLD OUT
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No-image state — solid surface, content below carries the card */
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-surface-elevated via-surface to-background">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content Section */}
      <div className="relative p-4 sm:p-6 bg-surface-elevated">
        {/* Date/Time Row with icons - stacks on very small screens */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-medium text-accent-primary mb-4 tracking-wider uppercase">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">{eventDate}</span>
          </span>
          <span className="hidden sm:block w-px h-3 bg-accent-primary/30" />
          <span className="text-accent-primary/50 sm:hidden">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">{eventTime}</span>
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-2xl font-bebas uppercase tracking-wide mb-3 text-white group-hover:text-accent-primary transition-colors duration-300">
          {event.title}
        </h3>

        {/* Venue Info with icon */}
        <div className="text-text-secondary mb-6">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-text-primary">{event.venue}</p>
              <p className="text-sm text-text-muted">{event.city}{event.state && `, ${event.state}`}</p>
            </div>
          </div>
        </div>

        {/* View Details indicator - premium arrow */}
        {eventLink && !event.isCanceled && (
          <div className="inline-flex items-center gap-2 text-accent-primary font-medium text-sm uppercase tracking-wider group/link">
            <span>View Details</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>
    </>
  )

  const cardClasses = "group relative overflow-hidden bg-surface border border-border hover:border-accent-primary/50 transition-all duration-500 card-elevate border-glow"

  if (eventLink) {
    return (
      <motion.article
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, margin: '-50px'}}
        transition={{duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1]}}
        whileHover={{y: -4}}
        className={cardClasses}
        style={{
          boxShadow: 'none',
        }}
      >
        <Link href={eventLink} className="block">
          {cardContent}
        </Link>
        {/* Ambient glow on hover */}
        <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent, rgba(212, 175, 55, 0.05))',
          }}
        />
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1]}}
      whileHover={{y: -4}}
      className={cardClasses}
    >
      {cardContent}
    </motion.article>
  )
}
