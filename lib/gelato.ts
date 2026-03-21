/**
 * Gelato API Integration
 * Complete print-on-demand fulfillment integration
 * Handles orders, catalog fetching, and product management
 */

export type GelatoOrderItem = {
  productUid: string
  quantity: number
  attributes?: Record<string, string>
  files?: Array<{type: string; url: string}>
}

export type GelatoRecipient = {
  addressLine1: string
  addressLine2?: string
  city: string
  country: string
  postalCode: string
  state?: string
  name?: string
  email?: string
  phone?: string
  company?: string
}

export type GelatoOrder = {
  orderId: string
  id?: string
  status: string
  items: GelatoOrderItem[]
  recipient: GelatoRecipient
  createdAt?: string
}

export type GelatoProduct = {
  uid: string
  title: string
  description?: string
  productType: string
  variants?: Array<{
    uid: string
    attributes: Record<string, string>
    price?: {
      amount: number
      currency: string
    }
  }>
}

export type GelatoError = {
  message: string
  code: string
  details?: any
}

/**
 * Get Gelato API configuration
 * Returns null if API key is not configured (demo mode)
 */
function getGelatoConfig(): {apiKey: string; enabled: true} | {enabled: false} {
  const apiKey = process.env.GELATO_API_KEY
  if (!apiKey || apiKey === 'placeholder' || apiKey.startsWith('placeholder')) {
    return {enabled: false}
  }
  return {apiKey, enabled: true}
}

/**
 * Make authenticated request to Gelato API with retry logic
 */
async function gelatoFetch(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  const config = getGelatoConfig()
  if (!config.enabled) {
    throw new Error('Gelato API is not configured. Please add your GELATO_API_KEY to environment variables.')
  }

  const url = `https://order.gelatoapis.com/v4${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    'X-API-KEY': config.apiKey,
    ...options.headers,
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      const res = await fetch(url, {...options, headers, signal: controller.signal})

      // If successful or client error (4xx), return immediately
      if (res.ok || (res.status >= 400 && res.status < 500)) {
        return res
      }

      // Server error (5xx), retry
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        continue
      }

      return res
    } catch (error) {
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        continue
      }
      throw error
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new Error('Gelato API request failed after retries')
}

/**
 * Create an order in Gelato for fulfillment
 * Returns order details or null in demo mode
 */
export async function createGelatoOrder(params: {
  recipient: GelatoRecipient
  items: GelatoOrderItem[]
  marketplaceOrderId?: string
  currency?: string
  itemPrices?: Array<{itemIndex: number; priceCents: number}>
  metadata?: Record<string, string>
}): Promise<GelatoOrder | null> {
  const config = getGelatoConfig()

  // Demo mode - return mock order
  if (!config.enabled) {
    return {
      orderId: `DEMO-${Date.now()}`,
      status: 'pending',
      items: params.items,
      recipient: params.recipient,
      createdAt: new Date().toISOString(),
    }
  }

  try {
    const orderData = {
      orderReferenceId: params.marketplaceOrderId,
      customerReferenceId: params.marketplaceOrderId,
      preventDuplicate: true,
      ...(params.currency && {currency: params.currency}),
      items: params.items.map((item, index) => {
        const priceInfo = params.itemPrices?.find((p) => p.itemIndex === index)
        return {
          itemReferenceId: `${params.marketplaceOrderId || 'order'}-${index}-${item.productUid}`,
          productUid: item.productUid,
          quantity: item.quantity,
          files: item.files || [],
          ...(item.attributes && Object.keys(item.attributes).length > 0
            ? {attributes: item.attributes}
            : {}),
          ...(priceInfo && {retailPriceInclVat: {amount: priceInfo.priceCents / 100, currency: params.currency || 'USD'}}),
        }
      }),
      shippingAddress: (() => {
        const nameParts = (params.recipient.name || '').trim().split(/\s+/).filter(Boolean)
        const firstName = nameParts[0] || 'Customer'
        const lastName = nameParts.slice(1).join(' ') || firstName
        return {
          firstName,
          lastName,
          addressLine1: params.recipient.addressLine1,
          ...(params.recipient.addressLine2 && {addressLine2: params.recipient.addressLine2}),
          city: params.recipient.city,
          postCode: params.recipient.postalCode,
          country: params.recipient.country,
          ...(params.recipient.state && {stateCode: params.recipient.state}),
          ...(params.recipient.email && {email: params.recipient.email}),
          ...(params.recipient.phone && {phone: params.recipient.phone}),
          ...(params.recipient.company && {companyName: params.recipient.company}),
        }
      })(),
      orderType: 'order',
      ...(params.metadata && {metadata: params.metadata}),
    }

    const res = await gelatoFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({message: 'Unknown error'}))
      console.error('Gelato order creation failed:', res.status, error)
      throw new Error(`Gelato API error: ${error.message || res.statusText}`)
    }

    const data = await res.json()
    return {
      orderId: data.id || data.orderId,
      status: data.status || 'submitted',
      items: params.items,
      recipient: params.recipient,
      createdAt: data.createdAt || new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to create Gelato order:', error)
    throw error
  }
}

/**
 * Get order status from Gelato
 */
export async function getGelatoOrder(orderId: string): Promise<GelatoOrder | null> {
  const config = getGelatoConfig()
  if (!config.enabled) {
    return null
  }

  try {
    const res = await gelatoFetch(`/orders/${orderId}`)
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Gelato API error: ${res.statusText}`)
    }
    return res.json()
  } catch (error) {
    console.error('Failed to fetch Gelato order:', error)
    return null
  }
}

/**
 * Get Gelato product catalog
 * Used for browsing available products and their variants
 */
export async function getGelatoCatalog(): Promise<GelatoProduct[]> {
  const config = getGelatoConfig()
  if (!config.enabled) {
    return []
  }

  try {
    const res = await gelatoFetch('/products')
    if (!res.ok) {
      throw new Error(`Gelato API error: ${res.statusText}`)
    }
    const data = await res.json()
    return data.products || []
  } catch (error) {
    console.error('Failed to fetch Gelato catalog:', error)
    return []
  }
}

/**
 * Get specific product details from Gelato
 */
export async function getGelatoProduct(productUid: string): Promise<GelatoProduct | null> {
  const config = getGelatoConfig()
  if (!config.enabled) {
    return null
  }

  try {
    const res = await gelatoFetch(`/products/${productUid}`)
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Gelato API error: ${res.statusText}`)
    }
    return res.json()
  } catch (error) {
    console.error('Failed to fetch Gelato product:', error)
    return null
  }
}

/**
 * Quote a Gelato order — returns shipping options and production costs
 * Same payload as createGelatoOrder but uses the quote endpoint
 */
export async function quoteGelatoOrder(params: {
  recipient: GelatoRecipient
  items: GelatoOrderItem[]
  currency?: string
}): Promise<{
  shippingMethods: Array<{
    uid: string
    name: string
    price: {amount: number; currency: string}
    minDeliveryDays: number
    maxDeliveryDays: number
  }>
  itemCosts: Array<{productUid: string; price: {amount: number; currency: string}}>
} | null> {
  const config = getGelatoConfig()
  if (!config.enabled) return null

  try {
    const nameParts = (params.recipient.name || '').trim().split(/\s+/).filter(Boolean)
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts.slice(1).join(' ') || firstName

    const quoteData = {
      ...(params.currency && {currency: params.currency}),
      items: params.items.map((item, index) => ({
        itemReferenceId: `quote-${index}-${item.productUid}`,
        productUid: item.productUid,
        quantity: item.quantity,
        files: item.files || [],
        ...(item.attributes && Object.keys(item.attributes).length > 0
          ? {attributes: item.attributes}
          : {}),
      })),
      shippingAddress: {
        firstName,
        lastName,
        addressLine1: params.recipient.addressLine1,
        ...(params.recipient.addressLine2 && {addressLine2: params.recipient.addressLine2}),
        city: params.recipient.city,
        postCode: params.recipient.postalCode,
        country: params.recipient.country,
        ...(params.recipient.state && {stateCode: params.recipient.state}),
        ...(params.recipient.email && {email: params.recipient.email}),
      },
    }

    const res = await gelatoFetch('/orders:quote', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({message: 'Unknown error'}))
      throw new Error(`Gelato quote error: ${error.message || res.statusText}`)
    }

    const data = await res.json()
    return {
      shippingMethods: (data.shipmentMethods || []).map((sm: Record<string, any>) => ({
        uid: sm.uid || sm.shipmentMethodUid,
        name: sm.name || sm.type || sm.uid,
        price: sm.price || {amount: 0, currency: params.currency || 'USD'},
        minDeliveryDays: sm.minDeliveryDays || sm.estimatedDeliveryDays?.min || 0,
        maxDeliveryDays: sm.maxDeliveryDays || sm.estimatedDeliveryDays?.max || 0,
      })),
      itemCosts: (data.items || []).map((item: Record<string, any>) => ({
        productUid: item.productUid,
        price: item.price || {amount: 0, currency: params.currency || 'USD'},
      })),
    }
  } catch (error) {
    console.error('Failed to quote Gelato order:', error)
    throw error
  }
}

/**
 * Cancel a Gelato order (only works before production starts)
 */
export async function cancelGelatoOrder(orderId: string): Promise<{success: boolean; error?: string}> {
  const config = getGelatoConfig()
  if (!config.enabled) {
    return {success: false, error: 'Gelato API not configured'}
  }

  try {
    const res = await gelatoFetch(`/orders/${orderId}:cancel`, {
      method: 'POST',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({message: 'Unknown error'}))
      return {success: false, error: error.message || `HTTP ${res.status}`}
    }

    return {success: true}
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Failed to cancel Gelato order:', error)
    return {success: false, error: message}
  }
}

/**
 * Get available shipping methods for a destination country
 */
export async function getGelatoShippingMethods(country: string): Promise<Array<{
  uid: string
  name: string
  type: string
}>> {
  const config = getGelatoConfig()
  if (!config.enabled) return []

  try {
    const res = await gelatoFetch(`/shipment-methods?country=${encodeURIComponent(country)}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.shipmentMethods || data || []).map((sm: Record<string, any>) => ({
      uid: sm.uid || sm.shipmentMethodUid,
      name: sm.name || sm.uid,
      type: sm.type || 'standard',
    }))
  } catch (error) {
    console.error('Failed to fetch Gelato shipping methods:', error)
    return []
  }
}

/**
 * Get Gelato production cost for a product (useful for margin tracking)
 */
export async function getGelatoProductPrices(productUid: string, currency = 'USD'): Promise<Array<{
  quantity: number
  price: number
  currency: string
}>> {
  const config = getGelatoConfig()
  if (!config.enabled) return []

  try {
    const url = `https://product.gelatoapis.com/v3/products/${encodeURIComponent(productUid)}/prices?currency=${currency}`
    const res = await fetch(url, {
      headers: {
        'X-API-KEY': config.apiKey,
      },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.prices || []).map((p: Record<string, any>) => ({
      quantity: p.quantity || 1,
      price: p.price || p.amount || 0,
      currency: p.currency || currency,
    }))
  } catch (error) {
    console.error('Failed to fetch Gelato product prices:', error)
    return []
  }
}

/**
 * Check if Gelato integration is enabled and configured
 */
export function isGelatoEnabled(): boolean {
  return getGelatoConfig().enabled
}

/**
 * Get Gelato API status for admin/debugging
 */
export async function getGelatoStatus(): Promise<{
  enabled: boolean
  apiKeyConfigured: boolean
  apiReachable?: boolean
  error?: string
}> {
  const config = getGelatoConfig()

  if (!config.enabled) {
    return {
      enabled: false,
      apiKeyConfigured: false,
    }
  }

  try {
    // Try to fetch catalog as a health check
    const res = await gelatoFetch('/products?limit=1')
    return {
      enabled: true,
      apiKeyConfigured: true,
      apiReachable: res.ok,
    }
  } catch (error: any) {
    return {
      enabled: true,
      apiKeyConfigured: true,
      apiReachable: false,
      error: error.message,
    }
  }
}
