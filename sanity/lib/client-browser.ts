import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'

/**
 * Lightweight Sanity client for use in client components (no server-only restriction).
 * Uses the CDN for read-only public data fetching.
 */
export const clientBrowser = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})
