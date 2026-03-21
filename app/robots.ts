import {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/', '/cart/', '/checkout/', '/order-confirmation/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
