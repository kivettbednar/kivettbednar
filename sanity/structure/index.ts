import {
  CogIcon,
  HomeIcon,
  CalendarIcon,
  BookIcon,
  EnvelopeIcon,
  DocumentIcon,
  ComponentIcon,
  UserIcon,
  BasketIcon,
  PackageIcon,
  TagIcon,
  StarIcon,
  TagsIcon,
  InfoOutlineIcon,
  CreditCardIcon,
  CheckmarkCircleIcon,
} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Enhanced Structure builder for professional ecommerce CMS
 * Organizes content by type with dedicated sections for store management
 */

// Singleton document types that should not appear in the document list
const SINGLETON_TYPES = [
  'settings',
  'homePage',
  'showsPage',
  'lessonsPage',
  'contactPage',
  'setlistPage',
  'merchPage',
  'navigation',
  'uiText',
  'checkoutSettings',
  'storeSettings',
  'orderConfirmationPage',
  'privacyPolicy',
  'termsOfService',
  'returnsPolicy',
  'ampsPage',
  'bio',
  'epkPage',
  'assist.instruction.context',
]

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content Management')
    .items([
      // === SITE PAGES ===
      S.listItem()
        .title('📄 Site Pages')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Site Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .id('homePage')
                .child(S.document().schemaType('homePage').documentId('homePage'))
                .icon(HomeIcon),

              S.listItem()
                .title('Shows Page')
                .id('showsPage')
                .child(S.document().schemaType('showsPage').documentId('showsPage'))
                .icon(CalendarIcon),

              S.listItem()
                .title('Lessons Page')
                .id('lessonsPage')
                .child(S.document().schemaType('lessonsPage').documentId('lessonsPage'))
                .icon(BookIcon),

              S.listItem()
                .title('Contact Page')
                .id('contactPage')
                .child(S.document().schemaType('contactPage').documentId('contactPage'))
                .icon(EnvelopeIcon),

              S.listItem()
                .title('Setlist Page')
                .id('setlistPage')
                .child(S.document().schemaType('setlistPage').documentId('setlistPage'))
                .icon(DocumentIcon),

              S.listItem()
                .title('Merch Page')
                .id('merchPage')
                .child(S.document().schemaType('merchPage').documentId('merchPage'))
                .icon(BasketIcon),

              S.listItem()
                .title('Amps Page')
                .id('ampsPage')
                .child(S.document().schemaType('ampsPage').documentId('ampsPage'))
                .icon(ComponentIcon),

              S.listItem()
                .title('Bio')
                .id('bio')
                .child(S.document().schemaType('bio').documentId('bio'))
                .icon(UserIcon),

              S.listItem()
                .title('EPK (Press Kit)')
                .id('epkPage')
                .child(S.document().schemaType('epkPage').documentId('epkPage'))
                .icon(DocumentIcon),

              S.listItem()
                .title('Order Confirmation Page')
                .id('orderConfirmationPage')
                .child(S.document().schemaType('orderConfirmationPage').documentId('orderConfirmationPage'))
                .icon(CheckmarkCircleIcon),

              S.divider(),

              S.listItem()
                .title('Privacy Policy')
                .id('privacyPolicy')
                .child(S.document().schemaType('privacyPolicy').documentId('privacyPolicy'))
                .icon(DocumentIcon),

              S.listItem()
                .title('Terms of Service')
                .id('termsOfService')
                .child(S.document().schemaType('termsOfService').documentId('termsOfService'))
                .icon(DocumentIcon),

              S.listItem()
                .title('Returns & Refunds')
                .id('returnsPolicy')
                .child(S.document().schemaType('returnsPolicy').documentId('returnsPolicy'))
                .icon(DocumentIcon),
            ])
        ),

      S.divider(),

      // === ECOMMERCE SECTION ===
      S.listItem()
        .title('🛍️ Store Management')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Store Management')
            .items([
              // Products by category
              S.listItem()
                .title('All Products')
                .icon(PackageIcon)
                .child(
                  S.documentList()
                    .title('All Products')
                    .filter('_type == "product"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),

              S.listItem()
                .title('Products by Category')
                .icon(TagsIcon)
                .child(
                  S.list()
                    .title('Products by Category')
                    .items([
                      S.listItem()
                        .title('Apparel')
                        .icon(PackageIcon)
                        .child(
                          S.documentList()
                            .title('Apparel Products')
                            .filter('_type == "product" && category == "apparel"')
                        ),
                      S.listItem()
                        .title('Music')
                        .icon(PackageIcon)
                        .child(
                          S.documentList()
                            .title('Music Products')
                            .filter('_type == "product" && category == "music"')
                        ),
                      S.listItem()
                        .title('Accessories')
                        .icon(PackageIcon)
                        .child(
                          S.documentList()
                            .title('Accessories Products')
                            .filter('_type == "product" && category == "accessories"')
                        ),
                      S.listItem()
                        .title('Posters & Prints')
                        .icon(PackageIcon)
                        .child(
                          S.documentList()
                            .title('Posters & Prints')
                            .filter('_type == "product" && category == "prints"')
                        ),
                      S.listItem()
                        .title('Amps & Cases')
                        .icon(ComponentIcon)
                        .child(
                          S.documentList()
                            .title('Amps & Cases')
                            .filter('_type == "product" && category == "amps"')
                        ),
                    ])
                ),

              S.listItem()
                .title('Featured Products')
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title('Featured Products')
                    .filter('_type == "product" && featured == true')
                ),

              S.listItem()
                .title('Products on Sale')
                .icon(TagIcon)
                .child(
                  S.documentList()
                    .title('Products on Sale')
                    .filter('_type == "product" && onSale == true')
                ),

              S.listItem()
                .title('Low Stock Items')
                .icon(InfoOutlineIcon)
                .child(
                  S.documentList()
                    .title('Low Stock Items')
                    .filter(
                      '_type == "product" && trackInventory == true && inventoryQuantity <= lowStockThreshold && inventoryQuantity > 0'
                    )
                ),

              S.listItem()
                .title('Out of Stock')
                .icon(InfoOutlineIcon)
                .child(
                  S.documentList()
                    .title('Out of Stock')
                    .filter(
                      '_type == "product" && trackInventory == true && inventoryQuantity == 0'
                    )
                ),

              S.divider(),

              S.listItem()
                .title('Product Collections')
                .icon(TagsIcon)
                .child(
                  S.documentList()
                    .title('Product Collections')
                    .filter('_type == "productCollection"')
                    .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
                ),

              S.listItem()
                .title('Promo Codes')
                .icon(TagIcon)
                .child(
                  S.list()
                    .title('Promo Codes')
                    .items([
                      S.listItem()
                        .title('Active Codes')
                        .child(
                          S.documentList()
                            .title('Active Promo Codes')
                            .filter('_type == "promoCode" && active == true')
                        ),
                      S.listItem()
                        .title('Inactive Codes')
                        .child(
                          S.documentList()
                            .title('Inactive Promo Codes')
                            .filter('_type == "promoCode" && active == false')
                        ),
                      S.listItem()
                        .title('All Codes')
                        .child(
                          S.documentList()
                            .title('All Promo Codes')
                            .filter('_type == "promoCode"')
                        ),
                    ])
                ),

              S.divider(),

              S.listItem()
                .title('Checkout Settings')
                .id('checkoutSettings')
                .child(S.document().schemaType('checkoutSettings').documentId('checkoutSettings'))
                .icon(CreditCardIcon),
            ])
        ),

      S.divider(),

      // === ORDERS ===
      S.listItem()
        .title('📦 Orders')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Orders by Status')
            .items([
              S.listItem()
                .title('All Orders')
                .child(
                  S.documentList()
                    .title('All Orders')
                    .filter('_type == "order"')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                ),
              S.divider(),
              ...['pending', 'submitted', 'in_production', 'shipped', 'delivered', 'canceled', 'refunded', 'disputed', 'failed', 'gelato_failed'].map(
                (status) =>
                  S.listItem()
                    .title(
                      status
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    )
                    .child(
                      S.documentList()
                        .title(`Orders: ${status}`)
                        .filter('_type == "order" && status == $status')
                        .params({status})
                        .defaultOrdering([{field: 'createdAt', direction: 'desc'}])
                    )
              ),
            ])
        ),

      S.divider(),

      // === CONTENT ===
      S.listItem()
        .title('🎸 Events & Content')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Events & Content')
            .items([
              S.listItem()
                .title('Events')
                .icon(CalendarIcon)
                .child(
                  S.list()
                    .title('Events')
                    .items([
                      S.listItem()
                        .title('Upcoming Events')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('Upcoming Events')
                            .filter('_type == "event" && startDateTime >= now()')
                            .defaultOrdering([{field: 'startDateTime', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Past Events')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('Past Events')
                            .filter('_type == "event" && startDateTime < now()')
                            .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('All Events')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('All Events')
                            .filter('_type == "event"')
                            .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('Canceled')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('Canceled Events')
                            .filter('_type == "event" && isCanceled == true')
                            .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('Sold Out')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('Sold Out Events')
                            .filter('_type == "event" && isSoldOut == true && isCanceled != true')
                            .defaultOrdering([{field: 'startDateTime', direction: 'asc'}])
                        ),
                    ])
                ),
              S.documentTypeListItem('lessonPackage').title('Lesson Packages').icon(BookIcon),
              S.documentTypeListItem('song').title('Setlist Songs').icon(DocumentIcon),
              S.documentTypeListItem('page').title('Custom Pages').icon(DocumentIcon),
              S.documentTypeListItem('post').title('Blog Posts').icon(DocumentIcon),
            ])
        ),

      S.divider(),

      // === PEOPLE & SUBSCRIBERS ===
      S.listItem()
        .title('👥 People & Subscribers')
        .icon(UserIcon)
        .child(
          S.list()
            .title('People & Subscribers')
            .items([
              S.documentTypeListItem('person').title('People').icon(UserIcon),
              S.documentTypeListItem('newsletterSubscriber')
                .title('Newsletter Subscribers')
                .icon(EnvelopeIcon),
            ])
        ),

      S.divider(),

      // === REUSABLE CONTENT ===
      S.listItem()
        .title('📝 Reusable Content')
        .icon(ComponentIcon)
        .child(
          S.list()
            .title('Reusable Content')
            .items([
              S.documentTypeListItem('testimonialsSet')
                .title('Testimonials Sets')
                .icon(StarIcon),
              S.documentTypeListItem('faqSet').title('FAQ Sets').icon(InfoOutlineIcon),
            ])
        ),

      S.divider(),

      // === SETTINGS ===
      S.listItem()
        .title('⚙️ Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Store Settings')
                .id('storeSettings')
                .child(S.document().schemaType('storeSettings').documentId('storeSettings'))
                .icon(BasketIcon),

              S.listItem()
                .title('Site Settings')
                .id('siteSettings')
                .child(S.document().schemaType('settings').documentId('siteSettings'))
                .icon(CogIcon),

              S.listItem()
                .title('Navigation')
                .id('navigation')
                .child(S.document().schemaType('navigation').documentId('navigation'))
                .icon(ComponentIcon),

              S.listItem()
                .title('UI Text')
                .id('uiText')
                .child(S.document().schemaType('uiText').documentId('uiText'))
                .icon(DocumentIcon),
            ])
        ),
    ])
