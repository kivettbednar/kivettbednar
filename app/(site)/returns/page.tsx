import {Metadata} from 'next'
import Link from 'next/link'
import {getStoreSettings} from '@/lib/store-settings'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Returns & Refunds | Kivett Bednar',
    description: 'Our return policy, refund process, and how to get help with your order.',
  }
}

export default async function ReturnsPage() {
  const settings = await getStoreSettings()
  const contactEmail = settings.adminEmail || 'contact@kivettbednar.com'
  const storeName = settings.storeName || 'Kivett Bednar Music'
  const returnDays = settings.returnPolicyDays ?? 30
  const returnNotes = settings.returnPolicyNotes ||
    'Items must be unused and in original packaging. Custom/print-on-demand items are final sale unless defective.'

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-bebas text-5xl uppercase tracking-wide text-text-primary mb-2">
            Returns & Refunds
          </h1>
          <p className="text-text-muted text-sm mb-12">Last updated: March 2026</p>

          <div className="prose-custom space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Return Policy
              </h2>
              {returnDays > 0 ? (
                <>
                  <p>
                    We want you to be happy with your purchase. If you&apos;re not satisfied, you
                    may request a return within <strong className="text-text-primary">{returnDays} days</strong> of
                    delivery.
                  </p>
                  <p className="mt-3">{returnNotes}</p>
                </>
              ) : (
                <p>
                  All sales are final. Due to the custom nature of our products, we do not accept
                  returns. However, if your item arrives damaged or defective, please contact us
                  and we will make it right.
                </p>
              )}
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                What Can Be Returned
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <div className="bg-surface-elevated border border-border p-4">
                  <h3 className="text-text-primary font-bold text-sm uppercase tracking-wide mb-2">
                    Eligible for Return
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Defective or damaged items</li>
                    <li>Wrong item shipped</li>
                    <li>Significantly different from product listing</li>
                  </ul>
                </div>
                <div className="bg-surface-elevated border border-border p-4">
                  <h3 className="text-text-primary font-bold text-sm uppercase tracking-wide mb-2">
                    Not Eligible
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Items worn, washed, or altered</li>
                    <li>Items without original packaging</li>
                    <li>Custom or personalized orders (unless defective)</li>
                    <li>Digital products</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                How to Request a Return
              </h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong className="text-text-primary">Email us</strong> at{' '}
                  <a href={`mailto:${contactEmail}`}
                    className="text-accent-primary hover:underline">{contactEmail}</a>{' '}
                  with your order number and reason for the return.
                </li>
                <li>
                  <strong className="text-text-primary">Include photos</strong> if the item is
                  damaged or defective.
                </li>
                <li>
                  <strong className="text-text-primary">Wait for approval</strong> — we&apos;ll
                  respond within 2 business days with instructions.
                </li>
                <li>
                  <strong className="text-text-primary">Ship the item back</strong> using the
                  provided instructions. Return shipping costs are the responsibility of the
                  buyer unless the item was defective or we made an error.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Refunds
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Once we receive and inspect your return, we&apos;ll process your refund within
                  5-7 business days.
                </li>
                <li>
                  Refunds are issued to the original payment method via Stripe.
                </li>
                <li>
                  Shipping costs from the original order are non-refundable unless the return is
                  due to our error.
                </li>
                <li>
                  You&apos;ll receive an email confirmation when your refund is processed.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Exchanges
              </h2>
              <p>
                We do not offer direct exchanges at this time. If you need a different size or
                color, please return the original item for a refund and place a new order.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Damaged or Defective Items
              </h2>
              <p>
                If your item arrives damaged or with a manufacturing defect, email us at{' '}
                <a href={`mailto:${contactEmail}`}
                  className="text-accent-primary hover:underline">{contactEmail}</a>{' '}
                within 7 days of delivery with photos. We&apos;ll send a replacement or issue a
                full refund at no extra cost to you.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Lost Packages
              </h2>
              <p>
                If your tracking shows delivered but you haven&apos;t received your order, please
                check with neighbors and your local carrier first. If the package is still
                missing after 48 hours, contact us and we&apos;ll work with the carrier to
                resolve the issue.
              </p>
            </section>

            <section>
              <h2 className="font-bebas text-2xl uppercase tracking-wide text-text-primary mb-3">
                Questions?
              </h2>
              <p>
                Reach out at{' '}
                <a href={`mailto:${contactEmail}`}
                  className="text-accent-primary hover:underline">{contactEmail}</a>{' '}
                or use our{' '}
                <Link href="/contact" className="text-accent-primary hover:underline">contact form</Link>.
                We&apos;re here to help.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
