import {ReactNode} from 'react'
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {getStoreSettings, type StoreSettings} from '@/lib/store-settings'
import {LegalPortableText} from '@/components/ui/LegalPortableText'

type LegalCmsData = {
  _id: string
  pageTitle: string | null
  lastUpdated: string | null
  seoDescription: string | null
  content: import('next-sanity').PortableTextBlock[] | null
} | null

export type LegalPageContext = {
  storeName: string
  contactEmail: string
  siteUrl: string
  returnPolicyDays: number
  returnPolicyNotes: string
  processingTime: string
}

type LegalPageTemplateProps = {
  query: string
  pageName: string
  fallbackDescription: string
  fallbackBuilder: (ctx: LegalPageContext) => ReactNode
}

type LegalMetadataProps = {
  query: string
  pageName: string
  fallbackDescription: string
  canonicalPath: string
}

const DEFAULT_EMAIL = 'contact@kivettbednar.com'
const DEFAULT_SITE = 'https://kivettbednar.com'
const DEFAULT_RETURN_NOTES =
  'Items must be unused and in original packaging. Custom/print-on-demand items are final sale unless defective.'
const DEFAULT_PROCESSING = '2-5 business days'

function toLastUpdated(value?: string | null) {
  if (!value) {
    return new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
  }
  return new Date(value).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
}

function buildContext(settings: StoreSettings): LegalPageContext {
  return {
    storeName: settings.storeName || 'Kivett Bednar Music',
    contactEmail: settings.adminEmail || DEFAULT_EMAIL,
    siteUrl: settings.siteUrl || DEFAULT_SITE,
    returnPolicyDays: settings.returnPolicyDays ?? 30,
    returnPolicyNotes: settings.returnPolicyNotes || DEFAULT_RETURN_NOTES,
    processingTime: settings.processingTime || DEFAULT_PROCESSING,
  }
}

export async function buildLegalMetadata({
  query,
  pageName,
  fallbackDescription,
  canonicalPath,
}: LegalMetadataProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_SITE
  try {
    const {data: raw} = await sanityFetch({query})
    const data = raw as LegalCmsData
    if (data) {
      return {
        title: `${data.pageTitle || pageName} | Kivett Bednar`,
        description: data.seoDescription || fallbackDescription,
        alternates: {canonical: `${baseUrl}${canonicalPath}`},
      }
    }
  } catch {
    // ignore
  }
  return {
    title: `${pageName} | Kivett Bednar`,
    description: fallbackDescription,
    alternates: {canonical: `${baseUrl}${canonicalPath}`},
  }
}

export async function LegalPageTemplate({
  query,
  pageName,
  fallbackDescription,
  fallbackBuilder,
}: LegalPageTemplateProps) {
  const settings = await getStoreSettings()
  const context = buildContext(settings)

  let cmsData: LegalCmsData = null
  try {
    const {data} = await sanityFetch({query})
    cmsData = data as LegalCmsData
  } catch (error) {
    console.warn(`Failed to fetch ${pageName} content:`, error)
  }

  const pageTitle = cmsData?.pageTitle || pageName
  const lastUpdated = toLastUpdated(cmsData?.lastUpdated)

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-bebas text-5xl uppercase tracking-wide text-text-primary mb-2">
            {pageTitle}
          </h1>
          <p className="text-text-muted text-sm mb-12">Last updated: {lastUpdated}</p>

          {cmsData?.content && cmsData.content.length > 0 ? (
            <LegalPortableText value={cmsData.content} />
          ) : (
            <div className="prose-custom space-y-8 text-text-secondary leading-relaxed">
              <p>{fallbackDescription}</p>
              {fallbackBuilder(context)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
