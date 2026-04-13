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
    <span className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-shrink-0 leading-[1.4]">
      <span
        className={
          isAnton
            ? 'font-bebas text-lg sm:text-2xl md:text-4xl tracking-wider sm:tracking-widest whitespace-nowrap uppercase text-accent-primary leading-[1.3]'
            : 'font-display italic text-base sm:text-xl md:text-3xl tracking-wide whitespace-nowrap text-gradient-gold leading-[1.5] pb-1'
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
  const lastTimeRef = useRef(0)
  const visibleRef = useRef(true)
  // pixels per second — consistent across all refresh rates (60Hz, 120Hz, etc.)
  const speed = direction === 'left' ? -30 : 30

  useEffect(() => {
    const el = rowRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      {threshold: 0},
    )
    observer.observe(el)

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp
      const delta = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      if (visibleRef.current && delta < 0.1) {
        posRef.current += speed * delta
        const halfWidth = el.scrollWidth / 2
        if (direction === 'left' && posRef.current <= -halfWidth) {
          posRef.current += halfWidth
        } else if (direction === 'right' && posRef.current >= 0) {
          posRef.current -= halfWidth
        }
        el.style.transform = `translate3d(${posRef.current}px, 0, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

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

export function MarqueeTicker({topItems}: MarqueeTickerProps) {
  const items = topItems || defaultTopItems

  return (
    <div
      className="relative overflow-hidden py-5 sm:py-6 bg-background/80 backdrop-blur-sm border-y border-accent-primary/10 marquee-mask"
      aria-hidden="true"
    >
      <TickerRow items={items} direction="left" />
    </div>
  )
}
