'use client'

import {motion} from 'framer-motion'

const orbs = [
  {
    color: 'rgba(212, 175, 55, 0.07)',
    size: 500,
    initialX: '10%',
    initialY: '20%',
    animateX: ['0%', '15%', '0%'],
    animateY: ['0%', '15%', '0%'],
    duration: 25,
  },
  {
    color: 'rgba(232, 165, 77, 0.05)',
    size: 400,
    initialX: '70%',
    initialY: '60%',
    animateX: ['0%', '-15%', '0%'],
    animateY: ['0%', '-15%', '0%'],
    duration: 30,
  },
  {
    color: 'rgba(74, 158, 255, 0.04)',
    size: 350,
    initialX: '50%',
    initialY: '80%',
    animateX: ['0%', '-10%', '0%'],
    animateY: ['0%', '-15%', '0%'],
    duration: 22,
  },
]

export function AmbientOrbs() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 hidden md:block"
      style={{mixBlendMode: 'screen'}}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            left: orb.initialX,
            top: orb.initialY,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: orb.animateX,
            y: orb.animateY,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
