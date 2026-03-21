import type {SanityImageAsset} from './product'

export type Event = {
  _id: string
  title: string
  slug?: string
  startDateTime: string
  endDateTime?: string
  timezone: string
  venue: string
  city: string
  state?: string
  ticketUrl?: string
  coverImage?: {
    asset: SanityImageAsset
    alt?: string
  }
  isCanceled?: boolean
  isSoldOut?: boolean
  description?: unknown[]
}
