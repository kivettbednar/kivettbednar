import {termsOfServiceQuery} from '@/sanity/lib/queries'
import {
  LegalPageTemplate,
  buildLegalMetadata,
  type LegalPageContext,
} from '@/app/(site)/legal/legal-page-template'

const FALLBACK_DESCRIPTION = 'Terms and conditions for using our website and purchasing merchandise.'

function renderTermsFallback({contactEmail, siteUrl, storeName, processingTime}: LegalPageContext) {
  return (
    <>
      <section>
        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using {siteUrl} (the &ldquo;Site&rdquo;), you agree to be bound by these
          Terms of Service. If you do not agree, do not use the Site.
        </p>
      </section>

      <section>
        <h2>Products and Pricing</h2>
        <ul>
          <li>All prices are listed in US Dollars (USD) and are subject to change without notice.</li>
          <li>Product images are representative; slight variations may occur on print-on-demand items.</li>
          <li>We reserve the right to limit quantities, refuse orders, or cancel orders at our discretion.</li>
          <li>Applicable taxes and shipping costs are calculated at checkout and added to your total.</li>
        </ul>
      </section>

      <section>
        <h2>Orders and Payment</h2>
        <ul>
          <li>Placing an order constitutes an offer to purchase; we may accept or decline your order.</li>
          <li>Payment is processed securely through Stripe—we do not store credit card information.</li>
          <li>You will receive confirmation when your order is placed and when it ships.</li>
          <li>Orders are typically processed and shipped within {processingTime}.</li>
        </ul>
      </section>

      <section>
        <h2>Shipping</h2>
        <ul>
          <li>Orders are fulfilled by our print-on-demand partner and shipped directly to you.</li>
          <li>Delivery times vary by location and carrier.</li>
          <li>Shipping costs are calculated at checkout based on destination.</li>
          <li>We are not responsible for delays caused by carriers, customs, or events beyond our control.</li>
          <li>Risk of loss passes to you once items are delivered to the carrier.</li>
        </ul>
      </section>

      <section>
        <h2>Promo Codes</h2>
        <ul>
          <li>Promo codes are valid for a limited time and may have usage restrictions.</li>
          <li>Only one promo code may be applied per order.</li>
          <li>We reserve the right to revoke or modify promo codes at any time.</li>
        </ul>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          All content on this Site—including images, designs, logos, text, audio, and video—is the
          property of {storeName} or its licensors and is protected by copyright and trademark laws.
          You may not reproduce or create derivative works without written permission.
        </p>
      </section>

      <section>
        <h2>User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Site for any unlawful purpose</li>
          <li>Attempt to interfere with the Site&apos;s operation</li>
          <li>Submit false or misleading information</li>
          <li>Use automated tools to scrape or interact with the Site</li>
        </ul>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          {storeName} is provided &ldquo;as is.&rdquo; We disclaim all warranties to the fullest
          extent permitted by law and are not liable for indirect or consequential damages arising
          from your use of the Site or purchase of products. Our total liability shall not exceed
          the amount you paid for the product giving rise to the claim.
        </p>
      </section>

      <section>
        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of the United States and the State of Oregon.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions? Contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </section>
    </>
  )
}

export async function generateMetadata() {
  return buildLegalMetadata({
    query: termsOfServiceQuery,
    pageName: 'Terms of Service',
    fallbackDescription: FALLBACK_DESCRIPTION,
    canonicalPath: '/terms',
  })
}

export const revalidate = 60

export default async function TermsPage() {
  return LegalPageTemplate({
    query: termsOfServiceQuery,
    pageName: 'Terms of Service',
    fallbackDescription: FALLBACK_DESCRIPTION,
    fallbackBuilder: renderTermsFallback,
  })
}
