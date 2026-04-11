import 'server-only'

import type {SettingsQueryResult} from '@/sanity.types'
import {client} from '@/sanity/lib/client'
import {settingsQuery} from '@/sanity/lib/queries'

export type SiteSettings = SettingsQueryResult

const PAGE_FLAG_FIELDS = {
  shows: 'showShowsPage',
  lessons: 'showLessonsPage',
  setlist: 'showSetlistPage',
  amps: 'showAmpsPage',
  merch: 'showMerchPage',
  contact: 'showContactPage',
} as const

export type PageVisibilityKey = keyof typeof PAGE_FLAG_FIELDS
export const PAGE_VISIBILITY_KEYS = Object.keys(PAGE_FLAG_FIELDS) as PageVisibilityKey[]

let cachedSettings: SiteSettings | null = null
let cachedAt = 0
const SETTINGS_TTL = 60_000

export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now()
  if (cachedSettings && now - cachedAt < SETTINGS_TTL) {
    return cachedSettings
  }
  try {
    const data = await client.fetch(settingsQuery, {}, {next: {revalidate: 60}})
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
