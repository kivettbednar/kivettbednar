'use client'
/* eslint-disable @next/next/no-img-element */

import {useIsMobile} from '@/lib/hooks/useIsMobile'

export function VideoBackground({
  videoSrc,
  posterSrc,
  overlayOpacity = 0.5,
  videoAlt = 'Background video'
}: {
  videoSrc: string
  posterSrc: string
  overlayOpacity?: number
  videoAlt?: string
}) {
  const isMobile = useIsMobile()

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!isMobile && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          className="absolute w-full h-full object-cover"
          aria-label={videoAlt}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      {isMobile && (
        <img
          src={posterSrc}
          alt={videoAlt}
          className="absolute w-full h-full object-cover"
        />
      )}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  )
}
