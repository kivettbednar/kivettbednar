import {ReactNode} from 'react'
import {AnimatedSection} from '@/components/animations/AnimatedSection'

interface PageSectionProps {
  children: ReactNode
  className?: string
  /** Viewport-entry animation — defaults to fadeUp */
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn'
  /** Optional stagger delay in seconds */
  delay?: number
}

/**
 * Universal section primitive.
 * Renders a semantic <section> with a standard viewport-entry animation wrapper.
 * Use this for every content section on every page — see docs/ANIMATIONS.md.
 */
export function PageSection({children, className, animation = 'fadeUp', delay = 0}: PageSectionProps) {
  return (
    <section className={className}>
      <AnimatedSection animation={animation} delay={delay}>
        {children}
      </AnimatedSection>
    </section>
  )
}
