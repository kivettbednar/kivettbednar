import {Metadata} from 'next'
import {getStoreSettings} from '@/lib/store-settings'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | Kivett Bednar',
    description: 'How we collect, use, and protect your personal information.',
  }
}

export default async function PrivacyPolicyPage() {
  const settings = await getStoreSettings()
  const contactEmail = settings.adminEmail || 'contact@kivettbednar.com'
  const storeName = settings.storeName || 'Kivett Bednar Music'
  const siteUrl = settings.siteUrl || 'https://kivettbednar.com'

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-bebas text-5xl uppercase tracking-wide text-text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-text-muted text-sm mb-12">Last updated: March 2026</p>

          <div className="prose-custom space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                What We Collect
              </h2>
              <p>
                When you make a purchase or interact with {storeName}, we collect information you
                provide directly:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Name and email address</li>
                <li>Shipping address</li>
                <li>Order details and purchase history</li>
                <li>Contact form messages</li>
                <li>Newsletter subscription preferences</li>
              </ul>
              <p className="mt-3">
                We do <strong className="text-text-primary">not</strong> collect or store payment
                card details. All payment processing is handled securely by{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-accent-primary hover:underline">Stripe</a>,
                our PCI-compliant payment processor.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to your questions and requests</li>
                <li>Send newsletter updates (only if you opted in)</li>
                <li>Improve our site and offerings</li>
              </ul>
              <p className="mt-3">
                We will never sell, rent, or share your personal information with third parties
                for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Third-Party Services
              </h2>
              <p>We use the following services to operate our store:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  <strong className="text-text-primary">Stripe</strong> — payment processing.
                  Subject to{' '}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
                    className="text-accent-primary hover:underline">Stripe&apos;s Privacy Policy</a>.
                </li>
                <li>
                  <strong className="text-text-primary">Gelato</strong> — order fulfillment and
                  shipping. Your name and shipping address are shared with Gelato to produce and
                  deliver your order.
                </li>
                <li>
                  <strong className="text-text-primary">Resend</strong> — transactional email
                  delivery (order confirmations, shipping updates).
                </li>
                <li>
                  <strong className="text-text-primary">Vercel</strong> — website hosting.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Cookies
              </h2>
              <p>
                This site uses essential cookies to maintain your shopping cart and session. We do
                not use advertising cookies or third-party tracking cookies. Your cart data is
                stored locally in your browser and is not sent to our servers until checkout.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Request a copy of the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Unsubscribe from marketing emails at any time</li>
                <li>Opt out of data collection (note: this may affect order processing)</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at{' '}
                <a href={`mailto:${contactEmail}`}
                  className="text-accent-primary hover:underline">{contactEmail}</a>.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Data Retention
              </h2>
              <p>
                We retain order data for as long as necessary for business and legal purposes
                (typically 7 years for tax records). Newsletter subscriber data is retained until
                you unsubscribe. Contact form messages are retained for 1 year.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Security
              </h2>
              <p>
                We protect your data with industry-standard measures including HTTPS encryption,
                secure payment processing via Stripe, and restricted access to personal data. No
                method of transmission over the internet is 100% secure, but we take reasonable
                steps to protect your information.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Changes to This Policy
              </h2>
              <p>
                We may update this policy from time to time. Changes will be posted on this page
                with an updated revision date. Continued use of the site after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Contact
              </h2>
              <p>
                Questions about this policy? Contact us at{' '}
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
