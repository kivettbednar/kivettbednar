import {type ReactNode} from 'react'
import {sanityFetch} from '@/sanity/lib/live'
import {uiTextQuery} from '@/sanity/lib/queries'
import {Header} from '@/components/ui/Header'
import {CartProvider} from '@/components/ui/CartContext'
import {ToastProvider} from '@/components/ui/Toast'
import {Footer} from '@/components/ui/Footer'
import {getSiteSettings, isPageEnabled, type PageVisibilityKey} from '@/lib/site-settings'

export default async function SiteLayout({
  children,
}: {
  children: ReactNode
}) {
  let siteSettings = null
  let uiText = null

  try {
    ;[siteSettings, uiText] = await Promise.all([
      getSiteSettings(),
      sanityFetch({query: uiTextQuery}).then((r) => r.data),
    ])
  } catch (error) {
    console.warn('Failed to fetch layout data, using fallback content:', error)
  }

  const navConfig: Array<{key: PageVisibilityKey; title: string; href: string}> = [
    {key: 'shows', title: uiText?.navShows || 'Shows', href: '/shows'},
    {key: 'lessons', title: uiText?.navLessons || 'Lessons', href: '/lessons'},
    {key: 'setlist', title: uiText?.navSetlist || 'Setlist', href: '/setlist'},
    {key: 'amps', title: uiText?.navAmps || 'Amps', href: '/amps'},
    {key: 'merch', title: uiText?.navMerch || 'Merch', href: '/merch'},
    {key: 'contact', title: uiText?.navContact || 'Contact', href: '/contact'},
  ]

  const navigation = navConfig
    .filter(({key}) => isPageEnabled(siteSettings, key))
    .map(({key: _key, ...rest}) => rest)

  return (
    <ToastProvider>
      <CartProvider>
        <Header siteName={uiText?.siteName || undefined} navigation={navigation} />
        <main id="main-content">{children}</main>
        <Footer
          navigation={navigation}
          siteName={uiText?.siteName || undefined}
          siteTagline={uiText?.siteTagline || undefined}
          navigationHeading={uiText?.footerNavigationHeading || undefined}
          connectHeading={uiText?.footerConnectHeading || undefined}
          socialLinks={(siteSettings?.socialLinks?.filter((link) =>
            link.platform !== null && link.url !== null
          ) as Array<{platform: string; url: string}> | undefined) || undefined}
          socialFacebookLabel={uiText?.socialFacebook || undefined}
          socialInstagramLabel={uiText?.socialInstagram || undefined}
          copyrightText={uiText?.footerCopyrightText || undefined}
          bookingText={uiText?.footerBookingText || undefined}
          bioLabel={uiText?.footerBioLabel || undefined}
          epkLabel={uiText?.footerEpkLabel || undefined}
          showBio={isPageEnabled(siteSettings, 'bio')}
          showEpk={isPageEnabled(siteSettings, 'epk')}
        />
      </CartProvider>
    </ToastProvider>
  )
}
