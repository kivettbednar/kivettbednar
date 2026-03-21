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
      className="fixed left-0 right-0 h-[2px] z-50 origin-left pointer-events-none"
      style={{
        top: 'env(safe-area-inset-top, 0px)',
        scaleX,
        background: 'linear-gradient(90deg, #D4AF37, #e9c84d, #D4AF37)',
        boxShadow: '0 0 8px rgba(212, 175, 55, 0.4), 0 0 16px rgba(212, 175, 55, 0.2)',
      }}
    />
  )
}
