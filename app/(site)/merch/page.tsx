import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {merchPageQuery, allProductsQuery, allCollectionsQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {MerchPageContent} from './MerchPageContent'
import type {ProductListItem} from '@/types/product'
import {getSiteSettings, isPageEnabled} from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [merchResult, siteSettings] = await Promise.all([
      sanityFetch({query: merchPageQuery}),
      getSiteSettings(),
    ])
    if (!isPageEnabled(siteSettings, 'merch')) {
      return {title: 'Page Unavailable | Kivett Bednar', robots: {index: false}}
    }
    const merchPage = merchResult?.data
    return {
      title: merchPage?.seoTitle || 'Merch | Kivett Bednar',
      description: merchPage?.seoDescription || 'Official Kivett Bednar merchandise and music',
      alternates: { canonical: `${baseUrl}/merch` },
    }
  } catch {
    return {
      title: 'Merch | Kivett Bednar',
      description: 'Official merchandise and music',
    }
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export type CollectionData = {
  _id: string
  title: string | null
  slug: string | null
  description: string | null
  productSlugs: Array<string | null> | null
}

export default async function MerchPage() {
  let merchPage = null
  let products: ProductListItem[] = []
  let collections: CollectionData[] = []
  let siteSettings = null

  try {
    ;[merchPage, siteSettings] = await Promise.all([
      sanityFetch({query: merchPageQuery}).then((r) => r.data),
      getSiteSettings(),
    ])
  } catch (error) {
    console.warn('Failed to fetch merch page data, using fallback content:', error)
  }

  if (!isPageEnabled(siteSettings, 'merch')) {
    return <PageUnavailable pageName="Merch" />
  }

  try {
    // Fetch products and collections in parallel
    const [sanityProducts, sanityCollections] = await Promise.all([
      sanityFetch({query: allProductsQuery}).then((r) => r.data),
      sanityFetch({query: allCollectionsQuery}).then((r) => r.data).catch(() => []),
    ])
    if (sanityProducts && sanityProducts.length > 0) {
      products = sanityProducts as unknown as ProductListItem[]
    }
    if (sanityCollections && sanityCollections.length > 0) {
      collections = sanityCollections
    }
  } catch (error) {
    console.warn('Failed to fetch products from Sanity:', error)
  }

  return <MerchPageContent merchPage={merchPage} products={products} collections={collections} />
}
