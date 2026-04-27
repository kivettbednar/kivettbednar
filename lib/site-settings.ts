import 'server-only'

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

// In-memory cache for non-draft renders. The TTL matches Next.js fetch
// revalidate so we don't double-cache. Draft mode bypasses this entirely
// (sanityFetch handles live updates itself) and falls back to the empty
// settings object on error so visibility flags default to "show".
let cachedSettings: SiteSettings | null = null
let cachedAt = 0
const SETTINGS_TTL = 60_000

export async function getSiteSettings(): Promise<SiteSettings> {
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
