import Link from 'next/link'
import {returnsPolicyQuery} from '@/sanity/lib/queries'
import {
  LegalPageTemplate,
  buildLegalMetadata,
  type LegalPageContext,
} from '@/app/(site)/legal/legal-page-template'

const FALLBACK_DESCRIPTION = 'Our return policy, refund process, and how to get help with your order.'

function renderReturnsFallback({contactEmail, returnPolicyDays, returnPolicyNotes}: LegalPageContext) {
  const allowReturns = returnPolicyDays > 0
  return (
    <>
      <section>
        <h2>Return Policy</h2>
        {allowReturns ? (
          <>
            <p>
              We want you to be happy with your purchase. If you&apos;re not satisfied, you may
              request a return within <strong>{returnPolicyDays} days</strong> of delivery.
            </p>
            <p className="mt-3">{returnPolicyNotes}</p>
          </>
        ) : (
          <p>
            All sales are final. Due to the custom nature of our products, we do not accept returns.
            However, if your item arrives damaged or defective, contact us and we&apos;ll make it right.
          </p>
        )}
      </section>

      <section>
        <h2>What Can Be Returned</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <div className="bg-surface-elevated border border-border p-4">
            <h3>Eligible</h3>
            <ul>
              <li>Defective or damaged items</li>
              <li>Wrong item shipped</li>
              <li>Significantly different from product listing</li>
            </ul>
          </div>
          <div className="bg-surface-elevated border border-border p-4">
            <h3>Not Eligible</h3>
            <ul>
              <li>Items worn, washed, or altered</li>
              <li>Items without original packaging</li>
              <li>Custom or personalized orders (unless defective)</li>
              <li>Digital products</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>How to Request a Return</h2>
        <ol>
          <li>
            <strong>Email us</strong> at{' '}
            <Link href={`mailto:${contactEmail}`} className="text-accent-primary hover:underline">
              {contactEmail}
            </Link>{' '}
            with your order number and reason for the return.
          </li>
          <li>
            <strong>Include photos</strong> if the item is damaged or defective.
          </li>
          <li>
            <strong>Wait for approval</strong>—we&apos;ll respond within 2 business days with instructions.
          </li>
          <li>
            <strong>Ship the item back</strong> using the provided instructions. Return shipping costs
            are the buyer&apos;s responsibility unless the item was defective or we made an error.
          </li>
        </ol>
      </section>

      <section>
        <h2>Refunds</h2>
        <ul>
          <li>Once we receive and inspect your return, we&apos;ll process your refund within 5-7 business days.</li>
          <li>Refunds are issued to the original payment method via Stripe.</li>
          <li>Original shipping costs are non-refundable unless the return is due to our error.</li>
          <li>You&apos;ll receive email confirmation when your refund is processed.</li>
        </ul>
      </section>

      <section>
        <h2>Exchanges</h2>
        <p>
          We do not offer direct exchanges. Please return the item for a refund and place a new order for
          the desired size or color.
        </p>
      </section>

      <section>
        <h2>Damaged or Defective Items</h2>
        <p>
          If your item arrives damaged or with a manufacturing defect, email us at{' '}
          <Link href={`mailto:${contactEmail}`} className="text-accent-primary hover:underline">
            {contactEmail}
          </Link>{' '}
          within 7 days of delivery with photos. We&apos;ll send a replacement or issue a full refund at no extra cost.
        </p>
      </section>

      <section>
        <h2>Lost Packages</h2>
        <p>
          If tracking shows delivered but you haven&apos;t received your order, check with neighbors and your local carrier.
          If the package is still missing after 48 hours, contact us and we&apos;ll work with the carrier to resolve it.
        </p>
      </section>
    </>
  )
}

export async function generateMetadata() {
  return buildLegalMetadata({
    query: returnsPolicyQuery,
    pageName: 'Returns & Refunds',
    fallbackDescription: FALLBACK_DESCRIPTION,
    canonicalPath: '/returns',
  })
}

export const revalidate = 60

export default async function ReturnsPage() {
  return LegalPageTemplate({
    query: returnsPolicyQuery,
    pageName: 'Returns & Refunds',
    fallbackDescription: FALLBACK_DESCRIPTION,
    fallbackBuilder: renderReturnsFallback,
  })
}
