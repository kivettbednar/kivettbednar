'use client'

import {ReactNode, useRef, useEffect, useState} from 'react'
import {cn} from '@/lib/utils'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn'
  delay?: number
  duration?: number
}

const animationClasses: Record<string, string> = {
  fadeUp: 'translate-y-10 opacity-0',
  fadeIn: 'opacity-0',
  slideLeft: '-translate-x-14 opacity-0',
  slideRight: 'translate-x-14 opacity-0',
  scaleIn: 'scale-[0.8] opacity-0',
}

export function AnimatedSection({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {threshold: 0.05, rootMargin: '50px'},
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : animationClasses[animation],
        className,
      )}
      style={{transitionDelay: `${delay * 1000}ms`}}
    >
      {children}
    </div>
  )
}
