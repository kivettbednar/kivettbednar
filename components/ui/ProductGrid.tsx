import {ProductCard} from './ProductCard'
import type {SanityImageWithPositioning} from '@/lib/image-positioning'

type Product = {
  _id: string
  title: string
  slug: string
  image: (SanityImageWithPositioning & {alt?: string}) | null
  priceCents: number
  currency: string
  hasOptions?: boolean
}

export function ProductGrid({products}: {products: Product[]}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} priority={index < 3} />
      ))}
    </div>
  )
}
