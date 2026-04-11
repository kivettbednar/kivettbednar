import {privacyPolicyQuery} from '@/sanity/lib/queries'
import {
  LegalPageTemplate,
  buildLegalMetadata,
  type LegalPageContext,
} from '@/app/(site)/legal/legal-page-template'

const FALLBACK_DESCRIPTION = 'How we collect, use, and protect your personal information.'

function renderPrivacyFallback({storeName, contactEmail, siteUrl}: LegalPageContext) {
  return (
    <>
      <section>
        <h2>What We Collect</h2>
        <p>
          When you make a purchase or interact with {storeName}, we collect information you
          provide directly:
        </p>
        <ul>
          <li>Name and email address</li>
          <li>Shipping address</li>
          <li>Order details and purchase history</li>
          <li>Contact form messages</li>
          <li>Newsletter subscription preferences</li>
        </ul>
        <p>
          We do <strong>not</strong> collect or store payment card details. All payment processing
          is handled securely by{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            Stripe
          </a>
          , our PCI-compliant payment processor.
        </p>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Respond to your questions and requests</li>
          <li>Send newsletter updates (only if you opted in)</li>
          <li>Improve our site and offerings</li>
        </ul>
        <p>We never sell, rent, or share your personal information for marketing purposes.</p>
      </section>

      <section>
        <h2>Third-Party Services</h2>
        <p>We use the following services to operate {siteUrl}:</p>
        <ul>
          <li>
            <strong>Stripe</strong> — payment processing. Subject to{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              Stripe&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Gelato</strong> — order fulfillment and shipping. Your name and shipping
            address are shared with Gelato to produce and deliver your order.
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery (order confirmations, shipping updates).
          </li>
          <li>
            <strong>Vercel</strong> — website hosting.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          This site uses essential cookies to maintain your shopping cart and session. We do not
          use advertising cookies or third-party tracking cookies. Your cart data stays in your
          browser until checkout.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Request a copy of the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Unsubscribe from marketing emails at any time</li>
          <li>Opt out of analytics tracking (may affect order processing)</li>
        </ul>
        <p>
          To exercise any of these rights, email us at{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </section>
    </>
  )
}

export async function generateMetadata() {
  return buildLegalMetadata({
    query: privacyPolicyQuery,
    pageName: 'Privacy Policy',
    fallbackDescription: FALLBACK_DESCRIPTION,
    canonicalPath: '/privacy-policy',
  })
}

export const revalidate = 60

export default async function PrivacyPolicyPage() {
  return LegalPageTemplate({
    query: privacyPolicyQuery,
    pageName: 'Privacy Policy',
    fallbackDescription: FALLBACK_DESCRIPTION,
    fallbackBuilder: renderPrivacyFallback,
  })
}
