'use client'

import {motion, useScroll, useSpring} from 'framer-motion'

export function ScrollProgress() {
  const {scrollYProgress} = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed left-0 right-0 h-[2px] z-toast origin-left pointer-events-none"
      style={{
        top: 'env(safe-area-inset-top, 0px)',
        scaleX,
        background: 'var(--gradient-progress)',
        boxShadow: 'var(--shadow-accent-glow)',
      }}
    />
  )
}
