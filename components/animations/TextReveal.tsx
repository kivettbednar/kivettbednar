'use client'

import {useRef, useState, useEffect} from 'react'
import {motion, useScroll, useTransform} from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
}

export function TextReveal({text, className = '', as: Tag = 'h2'}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const {scrollYProgress} = useScroll({
    target: containerRef,
    // Wider trigger: starts near bottom of viewport, completes at upper third
    offset: ['start 0.95', 'start 0.35'],
  })

  const words = text.split(' ')

  return (
    <div ref={containerRef}>
      <Tag className={className}>
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          )
        })}
      </Tag>
    </div>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number]
}) {
  const [blurEnabled, setBlurEnabled] = useState(false)
  const mountedRef = useRef(false)

  useEffect(() => {
    // Skip enabling blur on the very first render to avoid hydration flash
    if (!mountedRef.current) {
      mountedRef.current = true
      // Enable blur on next frame so the initial render has no blur
      requestAnimationFrame(() => {
        if (window.matchMedia('(min-width: 768px)').matches) {
          setBlurEnabled(true)
        }
      })
      return
    }
  }, [])

  // Higher base so text is readable before reveal animation completes
  const opacity = useTransform(progress, range, [0.25, 1])
  const y = useTransform(progress, range, [8, 0])
  // Blur only on desktop - expensive repaint on mobile GPUs
  const blur = useTransform(progress, range, [blurEnabled ? 4 : 0, 0])
  const filterBlur = useTransform(blur, (v) => v > 0 ? `blur(${v}px)` : 'none')

  return (
    <motion.span
      style={{opacity, y, filter: blurEnabled ? filterBlur : undefined}}
      className="inline-block mr-[0.25em]"
    >
      {children}
    </motion.span>
  )
}
