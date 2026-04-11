import {defineQuery} from 'next-sanity'

/**
 * GROQ queries for Kivett Bednar site
 */

// Settings & Navigation
export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  _id,
  title,
  description,
  ogImage{
    asset->,
    alt,
    metadataBase
  },
  contactEmail,
  bookingUrl,
  socialLinks[]{
    platform,
    url
  },
  showShowsPage,
  showLessonsPage,
  showSetlistPage,
  showMerchPage,
  showContactPage
}`)

// Store Settings (admin-controlled operational config)
export const storeSettingsQuery = defineQuery(`*[_type == "storeSettings"][0]{
  storeEnabled,
  storeName,
  siteUrl,
  currency,
  adminEmail,
  emailFromName,
  emailFromAddress,
  orderConfirmationSubject,
  shippingUpdateSubject,
  shippingCountries,
  processingTime,
  returnPolicyDays,
  returnPolicyNotes
}`)

// UI Text & Labels
export const uiTextQuery = defineQuery(`*[_type == "uiText"][0]{
  _id,
  siteName,
  siteTagline,
  navShows,
  navLessons,
  navSetlist,
  navMerch,
  navContact,
  footerNavigationHeading,
  footerConnectHeading,
  footerCopyrightText,
  formLabelName,
  formLabelEmail,
  formLabelSubject,
  formLabelMessage,
  formButtonSubmit,
  formButtonSending,
  formSuccessMessage,
  buttonViewSetlist,
  buttonScheduleLesson,
  buttonBookLesson,
  buttonEmailMe,
  buttonGetInTouch,
  linkSeeAllShows,
  linkUpcomingShows,
  linkGuitarLessons,
  linkBluesSetlist,
  showsCountSingular,
  showsCountPlural,
  upcomingPrefix,
  setlistSubtitleSuffix,
  socialFacebook,
  socialInstagram
}`)

export const navigationQuery = defineQuery(`*[_type == "navigation"][0]{
  _id,
  main[]{
    title,
    href,
    docRef->{
      _type,
      "slug": slug.current
    }
  },
  footer[]{
    title,
    href,
    docRef->{
      _type,
      "slug": slug.current
    }
  }
}`)

// Home Page
export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  heroSlides[]{
    _key,
    image{
      asset->{_id, url},
      hotspot,
      crop,
      alt
    },
    mobileImage{
      asset->{_id, url},
      hotspot,
      crop,
      alt
    },
    alt,
    desktopPosition,
    mobilePosition
  },
  heroHeading,
  heroHeadingDesktopSize,
  heroHeadingMobileSize,
  heroHeadingTracking,
  heroHeadingLineHeight,
  heroSubheadingTracking,
  heroSubheadingLineHeight,
  heroSubheading,
  heroTagline,
  heroButtonText,
  marqueeTopItems[]{text, style},
  marqueeBottomItems[]{text, style},
  aboutHeading,
  aboutText,
  aboutVerticalLabel,
  aboutImage{
    asset->{_id, url},
    hotspot,
    crop,
    desktopPosition,
    mobilePosition,
    alt
  },
  albumTitle,
  albumYear,
  albumFormat,
  albumDescription,
  albumImage{
    asset->{_id, url},
    hotspot,
    crop,
    desktopPosition,
    mobilePosition,
    alt
  },
  albumFeatures,
  ctaLessonsHeading,
  ctaLessonsText,
  parallaxHeading,
  parallaxSubheading,
  parallaxImages[]{
    _key,
    image{
      asset->{_id, url},
      hotspot,
      crop,
      desktopPosition,
      mobilePosition,
      alt
    },
    alt,
    position,
    offset
  },
  performanceSectionHeading,
  performanceImage{
    asset->{_id, url},
    hotspot,
    crop,
    desktopPosition,
    mobilePosition,
    alt
  },
  gallerySectionHeading,
  gallerySectionSubheading,
  galleryImages[]{
    _key,
    image{
      asset->{_id, url},
      hotspot,
      crop,
      desktopPosition,
      mobilePosition,
      alt
    },
    alt,
    width,
    height
  },
  upcomingShowsHeading,
  seeAllShowsLinkText,
  aboutButtonText,
  ctaLessonsButtonText,
  featuredVideoHeading,
  featuredVideoSubheading,
  featuredVideoUrl,
  featuredVideoTitle,
  bookingSectionHeading,
  bookingSectionIntro,
  bookingInquiriesHeading,
  bookingInquiriesText,
  bookingInquiryListHeading,
  bookingInquiryItems,
  bookingPerfectForHeading,
  bookingEventTypes,
  bookingTestimonialQuote,
  bookingTestimonialAttribution,
  studioSectionHeading,
  studioSectionSubheading,
  studioVideo1Url,
  studioVideo2Url,
  studioVideo1Title,
  studioVideo2Title,
  newsletterHeading,
  newsletterText,
  showAboutSection,
  showAlbumSection,
  showUpcomingShows,
  showLessonsSection,
  showBookingSection,
  showGallerySection,
  showStudioVideos,
  showNewsletterSection,
  seoTitle,
  seoDescription
}`)

// Lessons Page
export const lessonsPageQuery = defineQuery(`*[_type == "lessonsPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  stats[]{
    _key,
    label,
    value,
    suffix
  },
  philosophyHeading,
  philosophyText,
  philosophyImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  learningItemsHeading,
  learningItems[]{
    _key,
    title,
    description
  },
  ctaBoxHeading,
  ctaBoxText,
  credentials,
  teachingImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  performanceImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  emailButtonText,
  scheduleButtonText,
  testimonialQuote,
  testimonialAttribution,
  seoTitle,
  seoDescription
}`)

// Contact Page
export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  portraitImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  portraitGallery[]{
    _key,
    image{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt}
  },
  formHeading,
  directContactHeading,
  directContactDescription,
  socialHeading,
  quickLinksHeading,
  aboutHeading,
  quickLinkShowsText,
  quickLinkLessonsText,
  quickLinkSetlistText,
  ctaSectionHeading,
  ctaSectionText,
  ctaSectionButtonText,
  locationMapQuery,
  connectHeading,
  bookingCardTitle,
  bookingCardDescription,
  bookingCardLinkText,
  lessonsCardTitle,
  lessonsCardDescription,
  lessonsCardLinkText,
  locationCardTitle,
  locationCardRegion,
  locationCardDescription,
  locationCardLinkText,
  socialSubheading,
  seoTitle,
  seoDescription
}`)

// Setlist Page
export const setlistPageQuery = defineQuery(`*[_type == "setlistPage"][0]{
  _id,
  heroHeading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  introText,
  performanceImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  guitarImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  ctaHeading,
  ctaText,
  ctaBookLessonButtonText,
  ctaContactButtonText,
  subtitleSuffix,
  repertoireHeading,
  songCountSummaryText,
  requestHeading,
  requestText,
  requestButtonText,
  statsLabel1,
  statsLabel2,
  statsLabel3,
  statsValue3,
  seoTitle,
  seoDescription
}`)

// Shows Page
export const showsPageQuery = defineQuery(`*[_type == "showsPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  heroMobileImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  performanceGalleryHeading,
  performanceGallerySubheading,
  performanceImages[]{
    _key,
    image{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
    alt,
    caption
  },
  upcomingShowsHeading,
  emptyStateHeading,
  emptyStateText,
  showCountPrefix,
  showSingular,
  showPlural,
  statsLabel1,
  statsLabel2,
  statsLabel3,
  eventDetailsLabel,
  dateTimeLabel,
  venueLabel,
  viewOnMapText,
  getTicketsText,
  soldOutText,
  backToShowsText,
  shareEventText,
  importantInfoText,
  canceledBadgeText,
  soldOutBadgeText,
  canceledMessageText,
  seoTitle,
  seoDescription,
  defaultEventImage{asset->{_id, url}, hotspot, crop, alt}
}`)

// Merch Page
export const merchPageQuery = defineQuery(`*[_type == "merchPage"][0]{
  _id,
  heroHeading,
  heroSubheading,
  heroImage{asset->{_id, url}, hotspot, crop, desktopPosition, mobilePosition, alt},
  emptyStateHeading,
  emptyStateText,
  emptyStateButton1Text,
  emptyStateButton1Link,
  emptyStateButton2Text,
  emptyStateButton2Link,
  contentHeading,
  contentSubheading,
  trustBadges[]{
    _key,
    title,
    description,
    icon
  },
  seoTitle,
  seoDescription
}`)

// Checkout Settings
export const checkoutSettingsQuery = defineQuery(`*[_type == "checkoutSettings"][0]{
  _id,
  trustBadges[]{
    _key,
    title,
    description,
    icon
  },
  deliveryEstimateText,
  secureCheckoutText,
  cartHeading,
  cartEmptyHeading,
  cartEmptyText,
  cartEmptyButtonText
}`)

// Order Confirmation Page
export const orderConfirmationPageQuery = defineQuery(`*[_type == "orderConfirmationPage"][0]{
  _id,
  thankYouHeading,
  orderConfirmedLabel,
  orderReceivedText,
  whatsNextHeading,
  nextStepEmail,
  nextStepShipping,
  nextStepTracking,
  continueShoppingText,
  viewShowsText,
  noOrderHeading,
  noOrderText
}`)

// Songs
export const allSongsQuery = defineQuery(`*[_type == "song"] | order(order asc){
  _id,
  title,
  key,
  artist,
  notes,
  order
}`)

// Module query fragment
const moduleFields = /* groq */ `
  _type,
  _key,
  _type == "hero" => {
    headline,
    headlineDesktopSize,
    headlineMobileSize,
    headlineTracking,
    headlineLineHeight,
    subhead,
    subheadTracking,
    subheadLineHeight,
    mediaType,
    image{asset->, hotspot, crop, alt},
    mobileImage{asset->, hotspot, crop, alt},
    desktopPosition,
    mobilePosition,
    video,
    backgroundVariant,
    sectionPadding,
    ctas[]{label, href, variant}
  },
  _type == "richText" => {
    content,
    backgroundVariant,
    sectionPadding
  },
  _type == "imageGallery" => {
    images[]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt, caption},
    backgroundVariant,
    sectionPadding
  },
  _type == "featureGrid" => {
    items[]{title, body, iconType, icon, image{asset->, hotspot, crop, desktopPosition, mobilePosition}},
    backgroundVariant,
    sectionPadding
  },
  _type == "ctaBanner" => {
    heading,
    headingTracking,
    headingLineHeight,
    body,
    backgroundVariant,
    sectionPadding,
    cta{label, href}
  },
  _type == "videoEmbed" => {
    provider,
    url,
    backgroundVariant,
    sectionPadding
  },
  _type == "musicEmbed" => {
    provider,
    url,
    backgroundVariant,
    sectionPadding
  },
  _type == "testimonials" => {
    heading,
    headingTracking,
    headingLineHeight,
    'items': coalesce(items, set->items),
    items[]{
      name,
      role,
      quote,
      image{asset->, hotspot, crop, alt}
    },
    backgroundVariant,
    sectionPadding
  },
  _type == "faq" => {
    heading,
    headingTracking,
    headingLineHeight,
    'items': coalesce(items, set->items),
    items[]{
      question,
      answer
    },
    backgroundVariant,
    sectionPadding
  },
  _type == "callToAction" => @,
  _type == "infoSection" => @
`

// Pages
export const pageBySlugQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  name,
  heading,
  subheading,
  modules[]{
    ${moduleFields}
  },
  seo{
    title,
    description,
    ogImage{asset->}
  }
}`)

export const pagesSlugs = defineQuery(`*[_type == "page" && defined(slug.current)]{
  "slug": slug.current
}`)

// Events
export const upcomingEventsQuery = defineQuery(`*[_type == "event" && startDateTime >= $now && !isCanceled] | order(startDateTime asc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  startDateTime,
  endDateTime,
  timezone,
  venue,
  address,
  city,
  state,
  country,
  ticketUrl,
  description,
  coverImage{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  isCanceled,
  isSoldOut
}`)

export const pastEventsQuery = defineQuery(`*[_type == "event" && startDateTime < $now] | order(startDateTime desc)[$offset...$limit]{
  _id,
  title,
  startDateTime,
  timezone,
  venue,
  city,
  state,
  country,
  coverImage{asset->, hotspot, crop, desktopPosition, mobilePosition, alt}
}`)

export const eventsByMonthQuery = defineQuery(`*[_type == "event" && dateTime(startDateTime) >= dateTime($startOfMonth) && dateTime(startDateTime) < dateTime($endOfMonth)] | order(startDateTime asc){
  _id,
  title,
  startDateTime,
  timezone,
  venue,
  city,
  ticketUrl,
  isCanceled,
  isSoldOut
}`)

// Event detail pages
// Note: This query handles both slugs and IDs as fallback for events without slugs
export const eventBySlugQuery = defineQuery(`*[_type == "event" && (slug.current == $slug || _id == $slug)][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  startDateTime,
  endDateTime,
  timezone,
  venue,
  address,
  city,
  state,
  country,
  ticketUrl,
  description,
  coverImage{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  heroImage{asset->, hotspot, crop, desktopPosition, alt},
  heroImageMobile{asset->, hotspot, crop, mobilePosition, alt},
  lineup[]{name, role, bio},
  specialNotes,
  isCanceled,
  isSoldOut
}`)

// Returns slugs for events that have them, and _id as fallback for events without slugs
export const eventsSlugs = defineQuery(`*[_type == "event"]{
  "slug": coalesce(slug.current, _id)
}`)

// Products
export const allProductsQuery = defineQuery(`*[_type == "product"] | order(_createdAt desc){
  _id,
  title,
  "slug": slug.current,
  images[]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  featured,
  badges,
  tags,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold
}`)

export const productBySlugQuery = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  images[]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  featured,
  badges,
  tags,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold,
  availableDate,
  materials,
  careInstructions,
  dimensions,
  options[]{name, values},
  variants[]{optionValues, priceCents, sku},
  gelatoProductUid,
  printAreas[]{areaName, artwork{asset->}},
  shippingNotes,
  relatedProducts[]->{
    _id,
    title,
    "slug": slug.current,
    images[0]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
    priceCents,
    compareAtPriceCents,
    onSale,
    currency,
    category,
    badges
  },
  seo{title, description, ogImage{asset->}}
}`)

export const productSlugsQuery = defineQuery(`*[_type == "product" && defined(slug.current)]{
  "slug": slug.current
}`)

export const relatedProductsByCategoryQuery = defineQuery(`*[_type == "product" && category == $category && _id != $excludeId] | order(_createdAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  images[]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  stockStatus,
  badges,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold
}`)

export const featuredProductsQuery = defineQuery(`*[_type == "product" && featured == true] | order(_createdAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  images[0]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  featured,
  badges,
  tags,
  inventoryQuantity,
  trackInventory,
  lowStockThreshold
}`)

// Product search
export const productSearchQuery = defineQuery(`*[_type == "product" && (
  title match $searchTerm
  || category match $searchTerm
  || tags[] match $searchTerm
)] | order(_score desc, _createdAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  images[0]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  priceCents,
  compareAtPriceCents,
  onSale,
  currency,
  category,
  stockStatus,
  badges,
  tags
}`)

// Collections
export const allCollectionsQuery = defineQuery(`*[_type == "productCollection"] | order(displayOrder asc, _createdAt desc){
  _id,
  title,
  "slug": slug.current,
  description,
  image{asset->, alt},
  featured,
  displayOrder,
  "productSlugs": products[]->slug.current
}`)

export const collectionBySlugQuery = defineQuery(`*[_type == "productCollection" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  image{asset->, alt},
  "products": products[]->{
    _id,
    title,
    "slug": slug.current,
    images[]{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
    priceCents,
    compareAtPriceCents,
    onSale,
    currency,
    category,
    stockStatus,
    featured,
    badges,
    tags,
    inventoryQuantity,
    trackInventory,
    lowStockThreshold
  }
}`)

// Promo codes
export const promoCodeByCodeQuery = defineQuery(`*[_type == "promoCode" && code == $code && active == true][0]{
  _id,
  code,
  description,
  discountType,
  discountValue,
  minimumPurchaseCents,
  maxUses,
  currentUses,
  validFrom,
  validUntil,
  applicableProducts[]->{_id, title},
  applicableCategories
}`)

// Posts (blog functionality - template remnant)
export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  content,
  date,
  coverImage{asset->, hotspot, crop, desktopPosition, mobilePosition, alt},
  author->{firstName, lastName, picture{asset->}}
}`)

export const postPagesSlugs = defineQuery(`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
}`)

export const allPostsQuery = defineQuery(`*[_type == "post"] | order(date desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  date,
  author->{firstName, lastName}
}`)

export const morePostsQuery = defineQuery(`*[_type == "post" && _id != $skip] | order(date desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  date,
  author->{firstName, lastName}
}`)

// Sitemap
export const sitemapQuery = defineQuery(`*[_type in ["page", "product", "post", "event"] && defined(slug.current)] | order(_type asc){
  "slug": slug.current,
  _type,
  _updatedAt,
  _type == "event" => {
    startDateTime,
    isCanceled
  }
}`)
