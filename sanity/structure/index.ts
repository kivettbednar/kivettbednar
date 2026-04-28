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
  RocketIcon,
  PlugIcon,
  ArchiveIcon,
} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {IntegrationsInfo} from '@/sanity/components/IntegrationsInfo'

/**
 * Custom Studio structure. Designed for a non-technical site owner —
 * everything is grouped by editorial focus, with no document-list dumping
 * grounds. Top-level sections:
 *
 *   📄  Site Pages       Singletons that drive each route
 *   🛍️  Store            All ecommerce: products, orders, store config
 *   🎸  Events & Content Calendar items, lesson packages, songs
 *   👥  Subscribers      Newsletter list
 *   ⚙️  Settings         Site-wide settings, UI text, integrations info
 */
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
                .title('Contact Page')
                .id('contactPage')
                .child(S.document().schemaType('contactPage').documentId('contactPage'))
                .icon(EnvelopeIcon),
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

      // === STORE — everything ecommerce in one place ===
      S.listItem()
        .title('🛍️ Store')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Store')
            .items([
              // --- PRODUCTS ---
              S.listItem()
                .title('Active Products')
                .icon(PackageIcon)
                .child(
                  S.documentList()
                    .title('Active Products')
                    .filter('_type == "product" && !archived')
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
                            .filter('_type == "product" && category == "apparel" && !archived')
                        ),
                      S.listItem()
                        .title('Music')
                        .icon(PackageIcon)
                        .child(
                          S.documentList()
                            .title('Music Products')
                            .filter('_type == "product" && category == "music" && !archived')
                        ),
                      S.listItem()
                        .title('Accessories')
                        .icon(PackageIcon)
                        .child(
                          S.documentList()
                            .title('Accessories Products')
                            .filter('_type == "product" && category == "accessories" && !archived')
                        ),
                      S.listItem()
                        .title('Posters & Prints')
                        .icon(PackageIcon)
                        .child(
                          S.documentList()
                            .title('Posters & Prints')
                            .filter('_type == "product" && category == "prints" && !archived')
                        ),
                      S.listItem()
                        .title('Amps & Cases')
                        .icon(ComponentIcon)
                        .child(
                          S.documentList()
                            .title('Amps & Cases')
                            .filter('_type == "product" && category == "amps" && !archived')
                        ),
                    ])
                ),
              S.listItem()
                .title('Featured Products')
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title('Featured Products')
                    .filter('_type == "product" && featured == true && !archived')
                ),
              S.listItem()
                .title('Products on Sale')
                .icon(TagIcon)
                .child(
                  S.documentList()
                    .title('Products on Sale')
                    .filter('_type == "product" && onSale == true && !archived')
                ),
              S.listItem()
                .title('Low Stock')
                .icon(InfoOutlineIcon)
                .child(
                  S.documentList()
                    .title('Low Stock Items')
                    .filter(
                      '_type == "product" && trackInventory == true && inventoryQuantity <= lowStockThreshold && inventoryQuantity > 0 && !archived'
                    )
                ),
              S.listItem()
                .title('Out of Stock')
                .icon(InfoOutlineIcon)
                .child(
                  S.documentList()
                    .title('Out of Stock')
                    .filter('_type == "product" && trackInventory == true && inventoryQuantity == 0 && !archived')
                ),
              S.listItem()
                .title('Archived Products')
                .icon(ArchiveIcon)
                .child(
                  S.documentList()
                    .title('Archived Products')
                    .filter('_type == "product" && archived == true')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              S.divider(),

              // --- COLLECTIONS & PROMO ---
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
                        .title('Active')
                        .child(
                          S.documentList()
                            .title('Active Promo Codes')
                            .filter('_type == "promoCode" && active == true')
                        ),
                      S.listItem()
                        .title('Inactive')
                        .child(
                          S.documentList()
                            .title('Inactive Promo Codes')
                            .filter('_type == "promoCode" && active == false')
                        ),
                      S.listItem()
                        .title('All')
                        .child(
                          S.documentList()
                            .title('All Promo Codes')
                            .filter('_type == "promoCode"')
                        ),
                    ])
                ),
              S.divider(),

              // --- ORDERS ---
              S.listItem()
                .title('Orders')
                .icon(RocketIcon)
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
                      ...[
                        'pending',
                        'submitted',
                        'in_production',
                        'shipped',
                        'delivered',
                        'canceled',
                        'refunded',
                        'disputed',
                        'failed',
                        'gelato_failed',
                      ].map((status) =>
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

              // --- STORE CONFIG ---
              S.listItem()
                .title('Store Settings')
                .id('storeSettings')
                .child(S.document().schemaType('storeSettings').documentId('storeSettings'))
                .icon(CogIcon),
              S.listItem()
                .title('Checkout & Cart Copy')
                .id('checkoutSettings')
                .child(S.document().schemaType('checkoutSettings').documentId('checkoutSettings'))
                .icon(CreditCardIcon),
              S.listItem()
                .title('Order Confirmation Page')
                .id('orderConfirmationPage')
                .child(
                  S.document()
                    .schemaType('orderConfirmationPage')
                    .documentId('orderConfirmationPage')
                )
                .icon(CheckmarkCircleIcon),
            ])
        ),

      S.divider(),

      // === EVENTS & CONTENT ===
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
                            .filter('_type == "event" && startDateTime >= now() && !archived')
                            .defaultOrdering([{field: 'startDateTime', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Past Events')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('Past Events')
                            .filter('_type == "event" && startDateTime < now() && !archived')
                            .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('All Active Events')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('All Active Events')
                            .filter('_type == "event" && !archived')
                            .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('Canceled')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('Canceled Events')
                            .filter('_type == "event" && isCanceled == true && !archived')
                            .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('Sold Out')
                        .icon(CalendarIcon)
                        .child(
                          S.documentList()
                            .title('Sold Out Events')
                            .filter('_type == "event" && isSoldOut == true && isCanceled != true && !archived')
                            .defaultOrdering([{field: 'startDateTime', direction: 'asc'}])
                        ),
                      S.divider(),
                      S.listItem()
                        .title('Archived Events')
                        .icon(ArchiveIcon)
                        .child(
                          S.documentList()
                            .title('Archived Events')
                            .filter('_type == "event" && archived == true')
                            .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                        ),
                    ])
                ),
              S.listItem()
                .title('Lesson Packages')
                .icon(BookIcon)
                .child(
                  S.list()
                    .title('Lesson Packages')
                    .items([
                      S.listItem()
                        .title('Active Packages')
                        .icon(BookIcon)
                        .child(
                          S.documentList()
                            .title('Active Lesson Packages')
                            .filter('_type == "lessonPackage" && !archived')
                            .defaultOrdering([{field: 'order', direction: 'asc'}])
                        ),
                      S.listItem()
                        .title('Archived Packages')
                        .icon(ArchiveIcon)
                        .child(
                          S.documentList()
                            .title('Archived Lesson Packages')
                            .filter('_type == "lessonPackage" && archived == true')
                            .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                        ),
                    ])
                ),
              S.documentTypeListItem('song').title('Setlist Songs').icon(DocumentIcon),
            ])
        ),

      S.divider(),

      // === SUBSCRIBERS ===
      S.listItem()
        .title('👥 Subscribers')
        .icon(UserIcon)
        .child(S.documentTypeList('newsletterSubscriber').title('Newsletter Subscribers')),

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
                .title('Site Settings')
                .id('settings')
                .child(S.document().schemaType('settings').documentId('settings'))
                .icon(CogIcon),
              S.listItem()
                .title('UI Text & Labels')
                .id('uiText')
                .child(S.document().schemaType('uiText').documentId('uiText'))
                .icon(DocumentIcon),
              S.divider(),
              S.listItem()
                .title('External Integrations')
                .icon(PlugIcon)
                .child(
                  S.component(IntegrationsInfo)
                    .title('External Integrations')
                    .id('integrations-info')
                ),
            ])
        ),
    ])
