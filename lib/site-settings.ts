import 'server-only'

import {draftMode} from 'next/headers'
import type {SettingsQueryResult} from '@/sanity.types'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'

export type SiteSettings = SettingsQueryResult

const PAGE_FLAG_FIELDS = {
  shows: 'showShowsPage',
  lessons: 'showLessonsPage',
  setlist: 'showSetlistPage',
  amps: 'showAmpsPage',
  merch: 'showMerchPage',
  contact: 'showContactPage',
  bio: 'showBioPage',
  epk: 'showEpkPage',
} as const

export type PageVisibilityKey = keyof typeof PAGE_FLAG_FIELDS
export const PAGE_VISIBILITY_KEYS = Object.keys(PAGE_FLAG_FIELDS) as PageVisibilityKey[]

// In-memory cache for production renders. TTL matches Next.js fetch
// revalidate so we don't double-cache. Draft mode bypasses this entirely
// (otherwise edits in Studio Presentation could lag by up to 60s).
// `sanityFetch` itself handles live updates in draft mode; here we only
// have to make sure we don't return a stale cached object before it gets
// the chance.
let cachedSettings: SiteSettings | null = null
let cachedAt = 0
const SETTINGS_TTL = 60_000

export async function getSiteSettings(): Promise<SiteSettings> {
  const {isEnabled: isDraftMode} = await draftMode()

  // Always go straight to sanityFetch in draft mode so the Presentation
  // iframe reflects edits immediately (page-visibility toggles, social
  // links, contact email, etc.).
  if (isDraftMode) {
    try {
      const {data} = await sanityFetch({query: settingsQuery})
      return data || ({} as SiteSettings)
    } catch (error) {
      console.error('Failed to fetch site settings (draft):', error)
      return ({} as SiteSettings)
    }
  }

  const now = Date.now()
  if (cachedSettings && now - cachedAt < SETTINGS_TTL) {
    return cachedSettings
  }
  try {
    const {data} = await sanityFetch({query: settingsQuery})
    cachedSettings = data || ({} as SiteSettings)
    cachedAt = now
    return cachedSettings
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return cachedSettings || ({} as SiteSettings)
  }
}

export function isPageEnabled(
  settings: SiteSettings | null | undefined,
  page: PageVisibilityKey,
): boolean {
  if (!settings) return true
  const flag = PAGE_FLAG_FIELDS[page]
  const value = (settings as Record<string, unknown>)[flag]
  return value !== false
}
