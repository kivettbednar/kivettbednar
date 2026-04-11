import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {lessonPackageBySlugQuery} from '@/sanity/lib/queries'
import {getSiteSettings, isPageEnabled} from '@/lib/site-settings'
import {PageUnavailable} from '@/components/ui/PageUnavailable'
import {LessonPackageContent} from './LessonPackageContent'
import {formatCurrency} from '@/lib/format'

type Props = {
  params: Promise<{slug: string}>
}

export const revalidate = 60

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
  try {
    const [{data: pkg}, siteSettings] = await Promise.all([
      sanityFetch({query: lessonPackageBySlugQuery, params: {slug}}),
      getSiteSettings(),
    ])
    if (!isPageEnabled(siteSettings, 'lessons')) {
      return {title: 'Page Unavailable | Kivett Bednar', robots: {index: false}}
    }
    const p = pkg as any
    return {
      title: p?.seoTitle || (p?.title ? `${p.title} | Lessons | Kivett Bednar` : 'Lesson Package | Kivett Bednar'),
      description: p?.seoDescription || p?.tagline || 'Guitar lesson package details',
      alternates: {canonical: `${baseUrl}/lessons/${slug}`},
    }
  } catch {
    return {
      title: 'Lesson Package | Kivett Bednar',
      description: 'Guitar lesson package details',
    }
  }
}

export default async function LessonPackagePage({params}: Props) {
  const {slug} = await params
  const [{data: rawPkg}, siteSettings] = await Promise.all([
    sanityFetch({query: lessonPackageBySlugQuery, params: {slug}}),
    getSiteSettings(),
  ])

  if (!isPageEnabled(siteSettings, 'lessons')) {
    return <PageUnavailable pageName="Lessons" />
  }

  const pkg = rawPkg as any
  if (!pkg) {
    notFound()
  }

  const price = pkg.priceCents ? formatCurrency(pkg.priceCents, pkg.currency || 'USD') : null
  const comparePrice = pkg.compareAtPriceCents ? formatCurrency(pkg.compareAtPriceCents, pkg.currency || 'USD') : null

  return (
    <LessonPackageContent
      pkg={pkg}
      price={price}
      comparePrice={comparePrice}
    />
  )
}
