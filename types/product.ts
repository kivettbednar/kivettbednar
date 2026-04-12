export type SanityImageAsset = {
  _id: string
  url: string
  metadata?: {
    lqip?: string
    dimensions?: {width: number; height: number; aspectRatio: number}
  }
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

// ProductListItem — shape returned by allProductsQuery / ampsProductsQuery.
// Uses a single `image` (first image only with LQIP) instead of `images[]` to keep the grid payload slim.
// hasOptions is precomputed server-side to avoid fetching full options/variants arrays.
export type ProductListItem = Pick<
  Product,
  | '_id'
  | 'title'
  | 'slug'
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
> & {
  image: SanityImage | null
  hasOptions?: boolean
}
