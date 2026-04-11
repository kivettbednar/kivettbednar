import {client} from '@/sanity/lib/client'
import {storeSettingsQuery} from '@/sanity/lib/queries'

export type StoreSettings = {
  storeEnabled: boolean | null
  storeName: string | null
  siteUrl: string | null
  currency: string | null
  adminEmail: string | null
  emailFromName: string | null
  emailFromAddress: string | null
  orderConfirmationSubject: string | null
  shippingUpdateSubject: string | null
  shippingCountries: string[] | null
  processingTime: string | null
  returnPolicyDays: number | null
  returnPolicyNotes: string | null
  contactFormSubject: string | null
  fulfillmentFailureSubject: string | null
  newOrderSubject: string | null
  emailSignature: string | null
}

let cached: StoreSettings | null = null
let cachedAt = 0
const TTL = 60_000 // 60 seconds

export async function getStoreSettings(): Promise<StoreSettings> {
  const now = Date.now()
  if (cached && now - cachedAt < TTL) return cached

  try {
    const data = await client.fetch(storeSettingsQuery, {}, {next: {revalidate: 60}})
    cached = data || {} as StoreSettings
    cachedAt = now
    return cached!
  } catch (e) {
    console.error('Failed to fetch store settings:', e)
    return cached || {} as StoreSettings
  }
}

/** Is the store checkout enabled? Checks Sanity first, falls back to env var. */
export async function isStoreEnabled(): Promise<boolean> {
  const settings = await getStoreSettings()
  if (settings.storeEnabled != null) return settings.storeEnabled
  return process.env.STRIPE_ENABLED === 'true'
}

/** Get the admin email. Sanity first, then env var. */
export async function getAdminEmail(): Promise<string> {
  const settings = await getStoreSettings()
  return settings.adminEmail || process.env.ADMIN_EMAIL || ''
}

/** Get the "from" address for outbound emails. Sanity first, then env var. */
export async function getEmailFrom(): Promise<string> {
  const settings = await getStoreSettings()
  const name = settings.emailFromName || 'Kivett Bednar Music'
  const address = settings.emailFromAddress || ''
  if (address) return `${name} <${address}>`
  return process.env.EMAIL_FROM || ''
}

/** Get the site base URL. Sanity first, then env var. */
export async function getSiteUrl(): Promise<string> {
  const settings = await getStoreSettings()
  return settings.siteUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://kivettbednar.com'
}

/** Get allowed shipping countries. Empty array = worldwide. */
export async function getShippingCountries(): Promise<string[]> {
  const settings = await getStoreSettings()
  return settings.shippingCountries || ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'JP']
}
