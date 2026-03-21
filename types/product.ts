export type SanityImageAsset = {
  _id: string
  url: string
} | null

export type SanityImage = {
  asset: SanityImageAsset
  hotspot?: {x: number; y: number; width: number; height: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  desktopPosition?: import('@/lib/image-positioning').PositionValue | null
  mobilePosition?: import('@/lib/image-positioning').PositionValue | null
  alt?: string
}

export type ProductVariant = {
  optionValues?: Array<{key?: string; value?: string; _key: string}>
  priceCents?: number
  sku?: string
}

export function variantOptionValuesToRecord(
  optionValues?: Array<{key?: string; value?: string; _key: string}>
): Record<string, string> {
  const record: Record<string, string> = {}
  for (const entry of optionValues || []) {
    if (entry.key && entry.value) record[entry.key] = entry.value
  }
  return record
}

export type ProductOption = {
  name: string
  values: string[]
}

export type Product = {
  _id: string
  title: string
  slug: string
  description?: Array<{_type: string; _key: string; [key: string]: unknown}>
  images: SanityImage[]
  priceCents: number
  compareAtPriceCents?: number
  onSale?: boolean
  currency: string
  category?: string
  stockStatus?: string
  featured?: boolean
  badges?: string[]
  tags?: string[]
  inventoryQuantity?: number
  trackInventory?: boolean
  lowStockThreshold?: number
  availableDate?: string
  materials?: string
  careInstructions?: string
  dimensions?: string
  options?: ProductOption[]
  variants?: ProductVariant[]
  gelatoProductUid?: string
  printAreas?: Array<{areaName?: string; artwork?: {asset?: {url?: string}}}>
  shippingNotes?: string
}

export type ProductListItem = Pick<
  Product,
  | '_id'
  | 'title'
  | 'slug'
  | 'images'
  | 'priceCents'
  | 'compareAtPriceCents'
  | 'onSale'
  | 'currency'
  | 'category'
  | 'stockStatus'
  | 'featured'
  | 'badges'
  | 'tags'
  | 'inventoryQuantity'
  | 'trackInventory'
  | 'lowStockThreshold'
>
