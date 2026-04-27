import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {productBySlugQuery, relatedProductsByCategoryQuery, merchPageQuery} from '@/sanity/lib/queries'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {ProductPageContent} from './ProductPageContent'
import {urlFor} from '@/sanity/lib/image'
import {formatPrice, formatCurrency} from '@/lib/format'
import {getSiteSettings, isPageEnabled} from '@/lib/site-settings'

type Props = {
  params: Promise<{slug: string}>
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  let product = null

  try {
    const [productData, siteSettings] = await Promise.all([
      sanityFetch({query: productBySlugQuery, params: {slug}}).then((r) => r.data),
      getSiteSettings(),
    ])
    product = productData
    if (!isPageEnabled(siteSettings, 'merch')) {
      return {title: 'Page Unavailable', robots: {index: false}}
    }
  } catch (error) {
    console.warn(`Failed to fetch product metadata for slug: ${slug}`, error)
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  const canonicalUrl = `${baseUrl}/merch/${slug}`
  const ogImageUrl = product?.seo?.ogImage?.asset?.url
    || (product?.images?.[0]?.asset?.url ? urlFor(product.images[0].asset).width(1200).height(630).url() : undefined)

  return {
    title: product?.seo?.title || (product?.title ? `${product.title}` : 'Product'),
    description: product?.seo?.description || 'Product details',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product?.seo?.title || product?.title || 'Product',
      description: product?.seo?.description || 'Product details',
      url: canonicalUrl,
      type: 'website',
      ...(ogImageUrl && {
        images: [{url: ogImageUrl, width: 1200, height: 630, alt: product?.title || 'Product'}],
      }),
    },
    twitter: {
      card: ogImageUrl ? 'summary_large_image' : 'summary',
      title: product?.seo?.title || product?.title || 'Product',
      description: product?.seo?.description || 'Product details',
      ...(ogImageUrl && {images: [ogImageUrl]}),
    },
  }
}

export default async function ProductPage({params}: Props) {
  const {slug} = await params

  // Fetch product and settings
  const [product, siteSettings] = await Promise.all([
    sanityFetch({query: productBySlugQuery, params: {slug}}).then((r) => r.data),
    getSiteSettings(),
  ])

  if (!isPageEnabled(siteSettings, 'merch')) {
    return <PageUnavailable pageName="Merch" />
  }

  if (!product) {
    notFound()
  }

  let relatedProducts: unknown[] = []
  try {
    if ((product.relatedProducts as any)?.length > 0) {
      relatedProducts = product.relatedProducts as any
    } else if (product.category) {
      relatedProducts = await sanityFetch({
        query: relatedProductsByCategoryQuery,
        params: {category: product.category, excludeId: product._id, limit: 4},
      }).then((r) => r.data || [])
    }
  } catch { /* related products are non-critical */ }

  const priceValue = typeof product.priceCents === 'number' ? formatPrice(product.priceCents) : '0.00'
  const priceFormatted = formatCurrency(product.priceCents || 0, product.currency || 'USD')

  const productSlug: string = (product.slug as any)?.current || product.slug || '';

  // Build image URLs on server
  const mainImageUrl = product.images?.[0]?.asset
    ? urlFor(product.images[0].asset).width(800).height(800).url()
    : undefined

  const thumbnailImages = product.images && product.images.length > 1
    ? product.images.slice(1, 5).map((img: any) => ({
        url: img.asset ? urlFor(img.asset).width(200).height(200).url() : '',
        alt: img.alt || ''
      }))
    : undefined

  // Build all images for lightbox (larger resolution)
  const allImages = product.images
    ? product.images.map((img: any) => ({
        url: img.asset ? urlFor(img.asset).width(1600).height(1600).url() : '',
        alt: img.alt || product.title || 'Product image'
      }))
    : []

  // Generate JSON-LD structured data for product
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: mainImageUrl,
    description: product.seo?.description || product.title,
    offers: {
      '@type': 'Offer',
      price: priceValue,
      priceCurrency: product.currency || 'USD',
      availability: 'https://schema.org/InStock',
    },
    brand: {
      '@type': 'Brand',
      name: 'Kivett Bednar',
    },
  }

  // Fetch merch page settings for trust badges
  let merchPage = null
  try {
    merchPage = await sanityFetch({query: merchPageQuery}).then((r) => r.data)
  } catch (e) {
    // Trust badges are non-critical, fallback to defaults
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(productJsonLd)}}
      />
      <ProductPageContent
        product={product as any}
        priceFormatted={priceFormatted}
        productSlug={productSlug}
        mainImageUrl={mainImageUrl}
        thumbnailImages={thumbnailImages}
        allImages={allImages}
        relatedProducts={relatedProducts as import('@/types/product').ProductListItem[]}
        trustBadges={
          merchPage?.trustBadges
            ?.filter((b) => !!b.title && !!b.description && !!b.icon)
            .map((b) => ({
              title: b.title as string,
              description: b.description as string,
              icon: b.icon as string,
            })) || undefined
        }
      />
    </>
  )
}
