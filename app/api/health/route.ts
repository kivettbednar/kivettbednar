import {NextResponse} from 'next/server'
import {getSiteSettings, isPageEnabled, PAGE_VISIBILITY_KEYS, type PageVisibilityKey} from '@/lib/site-settings'

export async function GET() {
  let sanity: {ok: boolean; error?: string} = {ok: true}
  let siteSettings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  try {
    siteSettings = await getSiteSettings()
  } catch (err: unknown) {
    sanity = {ok: false, error: err instanceof Error ? err.message : 'Sanity fetch failed'}
  }

  const pageVisibility = PAGE_VISIBILITY_KEYS.reduce(
    (acc, key) => {
      acc[key] = isPageEnabled(siteSettings, key)
      return acc
    },
    {} as Record<PageVisibilityKey, boolean>,
  )

  return NextResponse.json({
    status: 'ok',
    sanity,
    pageVisibility,
    time: Date.now(),
  })
}
