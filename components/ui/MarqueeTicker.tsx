'use client'

import {useRef, useEffect} from 'react'

interface MarqueeItem {
  text: string
  style: 'anton' | 'playfair'
}

interface MarqueeTickerProps {
  topItems?: MarqueeItem[]
  bottomItems?: MarqueeItem[]
}

const defaultTopItems: MarqueeItem[] = [
  {text: 'BLUES', style: 'anton'},
  {text: 'Guitar', style: 'playfair'},
  {text: 'PORTLAND', style: 'anton'},
  {text: 'Live Shows', style: 'playfair'},
  {text: 'GRITTY TEXAS BLUES', style: 'anton'},
  {text: 'Authentic Sound', style: 'playfair'},
]

const defaultBottomItems: MarqueeItem[] = [
  {text: 'Pacific Northwest', style: 'playfair'},
  {text: 'ELECTRIC', style: 'anton'},
  {text: 'Soul & Grit', style: 'playfair'},
  {text: 'RHYTHM', style: 'anton'},
  {text: 'Handmade Music', style: 'playfair'},
  {text: 'STAGE PRESENCE', style: 'anton'},
]

function TickerItem({text, style}: MarqueeItem) {
  const isAnton = style === 'anton'
  return (
    <span className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
      <span
        className={
          isAnton
            ? 'font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest whitespace-nowrap uppercase text-accent-primary'
            : 'font-display italic text-xl sm:text-2xl md:text-3xl tracking-wide whitespace-nowrap text-gradient-gold'
        }
      >
        {text}
      </span>
      <span className="text-accent-primary/40 text-xs">◆</span>
    </span>
  )
}

function TickerRow({items, direction}: {items: MarqueeItem[]; direction: 'left' | 'right'}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(true)
  const speed = direction === 'left' ? -0.5 : 0.5

  useEffect(() => {
    const el = rowRef.current
    if (!el) return

    // Pause animation when off-screen for battery savings
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting },
      {threshold: 0}
    )
    observer.observe(el)

    const animate = () => {
      if (visibleRef.current) {
        posRef.current += speed
        const halfWidth = el.scrollWidth / 2
        if (direction === 'left' && posRef.current <= -halfWidth) {
          posRef.current += halfWidth
        } else if (direction === 'right' && posRef.current >= 0) {
          posRef.current -= halfWidth
        }
        el.style.transform = `translateX(${posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    // Initialize position after fonts are loaded to avoid layout jump
    document.fonts.ready.then(() => {
      if (direction === 'right') {
        posRef.current = -(el.scrollWidth / 2)
      }
      rafRef.current = requestAnimationFrame(animate)
    })
    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [speed, direction])

  const content = items.map((item, i) => <TickerItem key={i} {...item} />)

  return (
    <div
      ref={rowRef}
      className="flex gap-6 sm:gap-8 will-change-transform"
      style={{width: 'max-content'}}
    >
      {content}
      {content}
    </div>
  )
}

export function MarqueeTicker({topItems, bottomItems}: MarqueeTickerProps) {
  const top = topItems || defaultTopItems
  const bottom = bottomItems || defaultBottomItems

  return (
    <div
      className="relative overflow-hidden py-4 sm:py-5 bg-background/80 backdrop-blur-sm border-y border-accent-primary/10 marquee-mask"
      aria-hidden="true"
    >
      <div className="space-y-3">
        <TickerRow items={top} direction="left" />
        <TickerRow items={bottom} direction="right" />
      </div>
    </div>
  )
}
