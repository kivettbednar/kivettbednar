'use client'

import {useState, useCallback, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {cn} from '@/lib/utils'
import {AnimatedSection} from '@/components/animations/AnimatedSection'

export interface LiveVideo {
  url: string
  title?: string
  subtitle?: string
}

interface LiveVideoSliderProps {
  videos: LiveVideo[]
  eyebrow?: string
  heading?: string
  subheading?: string
}

function getYouTubeId(urlOrId: string): string {
  if (!urlOrId) return ''
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = urlOrId.match(p)
    if (m) return m[1]
  }
  return urlOrId
}

export function LiveVideoSlider({videos, eyebrow = 'Live', heading = 'Live Performance', subheading}: LiveVideoSliderProps) {
  const [index, setIndex] = useState(0)
  const total = videos.length
  const pad2 = (n: number) => String(n).padStart(2, '0')

  const go = useCallback((next: number) => {
    if (total === 0) return
    setIndex(((next % total) + total) % total)
  }, [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(index - 1)
      if (e.key === 'ArrowRight') go(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go])

  if (total === 0) return null
  const current = videos[index]
  const videoId = getYouTubeId(current.url)

  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-surface overflow-hidden">
      {/* Ambient gold accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 80% 20%, rgba(212,175,55,0.08), transparent 60%)',
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
            <div>
              <AnimatedSection animation="fadeUp">
                <span className="inline-flex items-center gap-3 mb-4">
                  <span className="h-px w-10 bg-accent-primary" />
                  <span className="text-[11px] uppercase tracking-[0.35em] text-accent-primary font-medium">
                    {eyebrow}
                  </span>
                </span>
              </AnimatedSection>
              <AnimatedSection animation="fadeUp" delay={0.1}>
                <h2 className="font-bebas text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-none text-text-primary">
                  {heading}
                </h2>
              </AnimatedSection>
              {subheading && (
                <AnimatedSection animation="fadeUp" delay={0.2}>
                  <p className="font-display italic text-lg md:text-xl text-text-secondary mt-4 max-w-xl">
                    {subheading}
                  </p>
                </AnimatedSection>
              )}
            </div>

            {/* Counter + controls */}
            <AnimatedSection animation="fadeIn" delay={0.3} className="flex items-center gap-6">
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="font-bebas text-3xl md:text-4xl text-accent-primary tracking-wide">
                  {pad2(index + 1)}
                </span>
                <span aria-hidden="true" className="text-white/50">/</span>
                <span className="text-white/60 text-sm tracking-widest">
                  {pad2(total)}
                </span>
              </div>
              {total > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    aria-label="Previous video"
                    className="w-11 h-11 border border-white/20 hover:border-accent-primary hover:text-accent-primary text-white/80 flex items-center justify-center transition-colors"
                  >
                    <span aria-hidden>←</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    aria-label="Next video"
                    className="w-11 h-11 border border-white/20 hover:border-accent-primary hover:text-accent-primary text-white/80 flex items-center justify-center transition-colors"
                  >
                    <span aria-hidden>→</span>
                  </button>
                </div>
              )}
            </AnimatedSection>
          </div>

          {/* Video stage */}
          <AnimatedSection animation="fadeUp" delay={0.35} className="relative">
            {/* Gold accent frame */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-accent-primary/40 via-transparent to-accent-primary/20 pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.div
                key={videoId || index}
                initial={{opacity: 0, scale: 0.98}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.98}}
                transition={{duration: 0.5, ease: [0.22, 1, 0.36, 1]}}
                className="relative aspect-video overflow-hidden shadow-2xl film-grain bg-black"
              >
                {videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={current.title || 'Live performance video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                    Video unavailable
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </AnimatedSection>

          {/* Caption + dot navigation */}
          <AnimatedSection animation="fadeUp" delay={0.5} className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`caption-${index}`}
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -6}}
                transition={{duration: 0.35}}
                className="min-h-[2.5rem]"
              >
                {current.title && (
                  <p className="font-bebas text-2xl md:text-3xl uppercase tracking-wide text-text-primary">
                    {current.title}
                  </p>
                )}
                {current.subtitle && (
                  <p className="text-text-secondary text-sm mt-1">{current.subtitle}</p>
                )}
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <div className="flex items-center gap-2">
                {videos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to video ${i + 1}`}
                    className={cn(
                      'h-px transition-all duration-500',
                      i === index ? 'w-10 bg-accent-primary' : 'w-5 bg-white/30 hover:bg-white/60'
                    )}
                  />
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
