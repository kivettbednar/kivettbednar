import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {merchPageQuery, allProductsQuery} from '@/sanity/lib/queries'
import {MerchPageContent} from './MerchPageContent'
import type {ProductListItem} from '@/types/product'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const {data: merchPage} = await sanityFetch({query: merchPageQuery})
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

export default async function MerchPage() {
  let merchPage = null
  let products: ProductListItem[] = []

  try {
    // Fetch merch page content from Sanity
    merchPage = await sanityFetch({query: merchPageQuery}).then((r) => r.data)
  } catch (error) {
    console.warn('Failed to fetch merch page data, using fallback content:', error)
  }

  try {
    // Fetch products from Sanity
    const sanityProducts = await sanityFetch({query: allProductsQuery}).then((r) => r.data)
    if (sanityProducts && sanityProducts.length > 0) {
      products = sanityProducts
    }
  } catch (error) {
    console.warn('Failed to fetch products from Sanity:', error)
  }

  return <MerchPageContent merchPage={merchPage} products={products} />
}
