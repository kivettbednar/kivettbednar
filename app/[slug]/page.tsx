import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import PageBuilderPage from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {pageBySlugQuery, pagesSlugs} from '@/sanity/lib/queries'
import {PageBySlugQueryResult} from '@/sanity.types'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  try {
    const data = await client.fetch(
      pagesSlugs,
      {},
      {
        // Use the published perspective in generateStaticParams
        perspective: 'published',
        next: {revalidate: 60}
      }
    )
    return data
  } catch (error) {
    console.warn('Failed to fetch page slugs for static generation:', error)
    // Return empty array to allow build to continue
    // Pages will be generated on-demand instead
    return []
  }
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const page = await client.fetch(
    pageBySlugQuery,
    params,
    {
      // Metadata should never contain stega
      next: {revalidate: 60}
    }
  )

  return {
    title: page?.name,
    description: page?.heading,
  } satisfies Metadata
}

export default async function Page(props: Props) {
  const params = await props.params
  const [page] = await Promise.all([
    sanityFetch({query: pageBySlugQuery, params}).then((r) => r.data),
  ])

  if (!page?._id) {
    notFound()
  }

  return (
    <div className="my-12 lg:my-24">
      <div className="">
        <div className="container">
          <div className="pb-6 border-b border-gray-100">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
                {page.heading}
              </h2>
              <p className="mt-4 text-base lg:text-lg leading-relaxed text-gray-600 uppercase font-light">
                {page.subheading}
              </p>
            </div>
          </div>
        </div>
      </div>
      <PageBuilderPage page={page as PageBySlugQueryResult} />
    </div>
  )
}
