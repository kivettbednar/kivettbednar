'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useCart} from '@/components/ui/CartContext'
import {useToast} from '@/components/ui/Toast'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {Clock, Users, Monitor, MapPin, CheckCircle, ChevronRight, ChevronLeft, BookOpen} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all: 'All Levels',
}

const formatLabels: Record<string, string> = {
  in_person: 'In Person',
  online: 'Online',
  both: 'In Person & Online',
}

interface LessonPackageContentProps {
  pkg: {
    _id: string
    title: string
    slug: string
    tagline?: string
    image?: {asset?: {url?: string}; alt?: string}
    description?: any[]
    priceCents: number
    currency?: string
    duration?: string
    sessionsCount?: number
    sessionLength?: string
    level?: string
    format?: string
    features?: string[]
    includes?: string[]
    badge?: string
  }
  price: string | null
  comparePrice: string | null
}

export function LessonPackageContent({pkg, price, comparePrice}: LessonPackageContentProps) {
  const {addItem} = useCart()
  const {showToast} = useToast()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const handleBookPackage = () => {
    setIsAdding(true)
    addItem({
      productId: pkg._id,
      title: pkg.title,
      slug: pkg.slug,
      imageUrl: pkg.image?.asset?.url,
      priceCents: pkg.priceCents,
      currency: pkg.currency || 'USD',
      quantity: 1,
      options: {type: 'lesson'},
    })
    showToast(`Added "${pkg.title}" to cart!`, 'success')
    setTimeout(() => router.push('/checkout'), 500)
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Back link */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors text-sm uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Lessons
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <AnimatedSection animation="fadeIn">
              {pkg.image?.asset?.url ? (
                <div className="relative aspect-[4/3] bg-surface-elevated border border-border overflow-hidden">
                  <Image
                    src={pkg.image.asset.url}
                    alt={pkg.image.alt || pkg.title}
                    fill
                    className="object-cover"
                  />
                  {pkg.badge && (
                    <div className="absolute top-4 left-4 bg-accent-primary text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      {pkg.badge}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-surface-elevated border border-border flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-text-muted" />
                </div>
              )}
            </AnimatedSection>

            {/* Details */}
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <div className="space-y-6">
                {pkg.badge && (
                  <span className="inline-block bg-accent-primary/10 text-accent-primary text-xs font-bold uppercase tracking-wider px-3 py-1 border border-accent-primary/30">
                    {pkg.badge}
                  </span>
                )}

                <h1 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary">
                  {pkg.title}
                </h1>

                {pkg.tagline && (
                  <p className="text-xl text-text-secondary">{pkg.tagline}</p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  {price && (
                    <span className="text-4xl font-bold text-accent-primary">{price}</span>
                  )}
                  {comparePrice && (
                    <span className="text-xl text-text-muted line-through">{comparePrice}</span>
                  )}
                </div>

                {/* Quick details */}
                <div className="grid grid-cols-2 gap-4">
                  {pkg.duration && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock className="w-4 h-4 text-accent-primary" />
                      <span>{pkg.duration}</span>
                    </div>
                  )}
                  {pkg.sessionsCount && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <BookOpen className="w-4 h-4 text-accent-primary" />
                      <span>{pkg.sessionsCount} session{pkg.sessionsCount > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {pkg.sessionLength && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock className="w-4 h-4 text-accent-primary" />
                      <span>{pkg.sessionLength} each</span>
                    </div>
                  )}
                  {pkg.level && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Users className="w-4 h-4 text-accent-primary" />
                      <span>{levelLabels[pkg.level] || pkg.level}</span>
                    </div>
                  )}
                  {pkg.format && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      {pkg.format === 'online' ? <Monitor className="w-4 h-4 text-accent-primary" /> : <MapPin className="w-4 h-4 text-accent-primary" />}
                      <span>{formatLabels[pkg.format] || pkg.format}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <div>
                    <h3 className="font-bebas text-xl uppercase tracking-wide text-text-primary mb-3">What You&apos;ll Learn</h3>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-text-secondary">
                          <CheckCircle className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Includes */}
                {pkg.includes && pkg.includes.length > 0 && (
                  <div>
                    <h3 className="font-bebas text-xl uppercase tracking-wide text-text-primary mb-3">Includes</h3>
                    <ul className="space-y-2">
                      {pkg.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-text-secondary">
                          <CheckCircle className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Book button */}
                <button
                  onClick={handleBookPackage}
                  disabled={isAdding}
                  className="w-full group bg-accent-primary hover:bg-accent-primary/90 disabled:bg-accent-primary/50 text-black font-bold text-lg uppercase tracking-wider py-5 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isAdding ? 'Adding...' : 'Book This Package'}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}
