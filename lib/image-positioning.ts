/**
 * Client-safe image positioning utilities
 * Can be used in both client and server components
 */

import createImageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

type ImageSource = SanityImageSource | {url?: string | null; [key: string]: unknown}

// Client-safe configuration from public env vars
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

const builder = createImageUrlBuilder({projectId, dataset})

/**
 * Client-safe URL builder for Sanity images
 * Uses public environment variables only
 * Also handles external URLs (like Unsplash) for demo products
 */
export function urlFor(source: ImageSource | null | undefined) {
  // Handle external URLs directly (for demo products)
  if (typeof source === 'object' && source !== null && 'url' in source && typeof source.url === 'string' && source.url.startsWith('http')) {
    const externalUrl = source.url
    const chainable = {
      url: () => externalUrl,
      width: (w: number) => chainable,
      height: (h: number) => chainable,
      fit: (mode: string) => chainable,
      format: (fmt: string) => chainable,
    }
    return chainable
  }

  // Handle Sanity image references normally
  return builder.image(source as SanityImageSource)
}

/**
 * Type definitions for Sanity image data
 */
export interface SanityHotspot {
  x?: number  // 0-1, horizontal focal point
  y?: number  // 0-1, vertical focal point
  width?: number
  height?: number
}

export interface SanityCrop {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export type PositionValue =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface SanityImageWithPositioning {
  asset?: {
    url?: string | null
    _id?: string
  } | null
  hotspot?: SanityHotspot | null
  crop?: SanityCrop | null
  desktopPosition?: PositionValue | null
  mobilePosition?: PositionValue | null
  alt?: string | null
}

/**
 * Convert position value to CSS objectPosition
 */
function positionValueToCSS(position: PositionValue): string {
  const map: Record<PositionValue, string> = {
    'top-left': '0% 0%',
    'top-center': '50% 0%',
    'top-right': '100% 0%',
    'center-left': '0% 50%',
    'center': '50% 50%',
    'center-right': '100% 50%',
    'bottom-left': '0% 100%',
    'bottom-center': '50% 100%',
    'bottom-right': '100% 100%',
  }
  return map[position] || '50% 50%'
}

/**
 * Convert Sanity hotspot to CSS objectPosition
 * Hotspot x/y are 0-1 values representing the focal point
 */
function hotspotToObjectPosition(hotspot: SanityHotspot): string {
  const x = Math.round((hotspot.x ?? 0.5) * 100)
  const y = Math.round((hotspot.y ?? 0.5) * 100)
  return `${x}% ${y}%`
}

/**
 * Get CSS objectPosition from image data
 * Priority: explicit position override → hotspot → fallback
 *
 * @param image - Sanity image object with optional positioning data
 * @param isMobile - Whether to use mobile-specific positioning
 * @returns CSS objectPosition string (e.g., "50% 30%")
 */
export function getObjectPosition(
  image: SanityImageWithPositioning | null | undefined,
  isMobile = false
): string {
  if (!image) return '50% 50%'

  // Priority 1: Explicit position override
  const positionOverride = isMobile
    ? image.mobilePosition
    : image.desktopPosition

  if (positionOverride) {
    return positionValueToCSS(positionOverride)
  }

  // Priority 2: Hotspot data
  if (image.hotspot) {
    return hotspotToObjectPosition(image.hotspot)
  }

  // Fallback: center center
  return '50% 50%'
}
