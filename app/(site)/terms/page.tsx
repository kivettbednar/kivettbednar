import {Metadata} from 'next'
import {getStoreSettings} from '@/lib/store-settings'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service | Kivett Bednar',
    description: 'Terms and conditions for using our website and purchasing merchandise.',
  }
}

export default async function TermsPage() {
  const settings = await getStoreSettings()
  const contactEmail = settings.adminEmail || 'contact@kivettbednar.com'
  const storeName = settings.storeName || 'Kivett Bednar Music'
  const siteUrl = settings.siteUrl || 'https://kivettbednar.com'

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-bebas text-5xl uppercase tracking-wide text-text-primary mb-2">
            Terms of Service
          </h1>
          <p className="text-text-muted text-sm mb-12">Last updated: March 2026</p>

          <div className="prose-custom space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Agreement to Terms
              </h2>
              <p>
                By accessing or using {siteUrl} (the &ldquo;Site&rdquo;), you agree to be bound
                by these Terms of Service. If you do not agree, please do not use the Site.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Products and Pricing
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All prices are listed in US Dollars (USD) and are subject to change without
                  notice.
                </li>
                <li>
                  Product images are representative. Because many items are print-on-demand,
                  slight variations in color and print placement may occur.
                </li>
                <li>
                  We reserve the right to limit quantities, refuse orders, or cancel orders at our
                  discretion (for example, if a pricing error occurs or if we suspect fraud).
                </li>
                <li>
                  Applicable taxes and shipping costs are calculated at checkout and added to your
                  order total.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Orders and Payment
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Placing an order constitutes an offer to purchase. We may accept or decline your
                  order at our discretion.
                </li>
                <li>
                  Payment is processed securely through Stripe. We do not store your credit card
                  information.
                </li>
                <li>
                  You will receive an email confirmation when your order is placed and again when
                  it ships.
                </li>
                <li>
                  Orders are typically processed and shipped within{' '}
                  {settings.processingTime || '2-5 business days'}.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Shipping
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Orders are fulfilled by our print-on-demand partner and shipped directly to you.
                </li>
                <li>
                  Delivery times vary by location. Domestic US orders typically arrive within 5-10
                  business days. International orders may take 10-20 business days.
                </li>
                <li>
                  Shipping costs are calculated at checkout based on your location.
                </li>
                <li>
                  We are not responsible for delays caused by carriers, customs, or events beyond
                  our control.
                </li>
                <li>
                  Risk of loss passes to you upon delivery to the carrier.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Promo Codes
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Promo codes are valid for a limited time and may have usage restrictions.</li>
                <li>Only one promo code can be applied per order.</li>
                <li>
                  We reserve the right to revoke or modify promo codes at any time without notice.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Intellectual Property
              </h2>
              <p>
                All content on this Site — including images, designs, logos, text, audio, and
                video — is the property of {storeName} or its licensors and is protected by
                copyright and trademark laws. You may not reproduce, distribute, or create
                derivative works from any content without written permission.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                User Conduct
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Use the Site for any unlawful purpose</li>
                <li>Attempt to interfere with the Site&apos;s operation</li>
                <li>Submit false or misleading information</li>
                <li>Use automated tools to scrape or interact with the Site</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Limitation of Liability
              </h2>
              <p>
                {storeName} is provided &ldquo;as is.&rdquo; To the fullest extent permitted by
                law, we disclaim all warranties, express or implied. We shall not be liable for
                any indirect, incidental, or consequential damages arising from your use of the
                Site or purchase of products. Our total liability shall not exceed the amount you
                paid for the product giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Governing Law
              </h2>
              <p>
                These Terms are governed by the laws of the State of Oregon, United States,
                without regard to conflict of law principles. Any dispute shall be resolved in the
                courts of Oregon.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Changes to These Terms
              </h2>
              <p>
                We may update these Terms at any time. Changes take effect when posted. Your
                continued use of the Site after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Contact
              </h2>
              <p>
                Questions? Email us at{' '}
                <a href={`mailto:${contactEmail}`}
                  className="text-accent-primary hover:underline">{contactEmail}</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
