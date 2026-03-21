export type OrderItem = {
  productId: string
  productTitle: string
  productSlug: string
  quantity: number
  priceCents: number
  options?: string
  gelatoProductUid?: string
  imageUrl?: string
}

export type OrderAddress = {
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
}

export type OrderData = {
  _id?: string
  stripeSessionId?: string
  email?: string | null
  name?: string | null
  items: OrderItem[]
  totalCents: number
  currency?: string
  status?: string
  address?: OrderAddress | null
  createdAt?: string
}
