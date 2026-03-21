import {MetadataRoute} from 'next'
import {client} from '@/sanity/lib/client'
import {sitemapQuery} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

type SitemapEntry = {
  _type: string
  slug: string
  _updatedAt?: string
  startDateTime?: string
  isCanceled?: boolean
}

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more about sitemaps in Next.js here: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * Be sure to update the `changeFrequency` and `priority` values to match your application's content.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let allPostsAndPages = null
  try {
    allPostsAndPages = await client.fetch(sitemapQuery, {}, {next: {revalidate: 60}})
  } catch (error) {
    console.warn('Failed to fetch content for sitemap, returning static pages only:', error)
  }

  const headersList = await headers()
  const sitemap: MetadataRoute.Sitemap = []
  const host = headersList.get('host') || ''
  const envBase = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '')
  const baseUrl = envBase || (host ? `https://${host}` : '')

  // Homepage
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
  })

  // Static pages
  const staticPages = [
    {path: '/shows', priority: 0.9, changeFrequency: 'daily' as const},
    {path: '/merch', priority: 0.8, changeFrequency: 'weekly' as const},
    {path: '/lessons', priority: 0.7, changeFrequency: 'monthly' as const},
    {path: '/setlist', priority: 0.6, changeFrequency: 'monthly' as const},
    {path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const},
  ]

  staticPages.forEach(({path, priority, changeFrequency}) => {
    sitemap.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      priority,
      changeFrequency,
    })
  })

  // Dynamic pages from Sanity
  if (allPostsAndPages != null && allPostsAndPages.length != 0) {
    let priority: number
    let changeFrequency:
      | 'monthly'
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'yearly'
      | 'never'
      | undefined
    let url: string

    for (const p of allPostsAndPages as SitemapEntry[]) {
      switch (p._type) {
        case 'page':
          priority = 0.8
          changeFrequency = 'monthly'
          url = `${baseUrl}/${p.slug}`
          break
        case 'post':
          priority = 0.5
          changeFrequency = 'never'
          url = `${baseUrl}/posts/${p.slug}`
          break
        case 'product':
          priority = 0.8
          changeFrequency = 'weekly'
          url = `${baseUrl}/merch/${p.slug}`
          break
        case 'event': {
          // Skip canceled events from sitemap
          if (p.isCanceled) continue
          // Lower priority for past events
          const eventDate = p.startDateTime ? new Date(p.startDateTime) : null
          const isPast = eventDate && eventDate < new Date()
          priority = isPast ? 0.3 : 0.8
          changeFrequency = isPast ? 'never' : 'weekly'
          url = `${baseUrl}/shows/${p.slug}`
          break
        }
        default:
          continue
      }
      sitemap.push({
        lastModified: p._updatedAt || new Date(),
        priority,
        changeFrequency,
        url,
      })
    }
  }

  return sitemap
}
