'use client'

import {motion} from 'framer-motion'
import {staggerContainer} from '@/lib/animations'
import {ProductCard} from './ProductCard'
import type {SanityImageWithPositioning} from '@/lib/image-positioning'

type Product = {
  _id: string
  title: string
  slug: string
  images: Array<SanityImageWithPositioning & {alt: string}>
  priceCents: number
  currency: string
}

export function ProductGrid({products}: {products: Product[]}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </motion.div>
  )
}
