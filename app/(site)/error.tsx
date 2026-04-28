'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {clientBrowser} from '@/sanity/lib/client-browser'
import {uiTextQuery} from '@/sanity/lib/queries'

type ErrorCopy = {
  heading?: string
  body?: string
  retry?: string
  home?: string
}

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  const [copy, setCopy] = useState<ErrorCopy>({})

  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  // Try to fetch editable error copy from Sanity. Wrapped in its own
  // try/catch and Promise so a Sanity outage during the error boundary
  // doesn't compound the failure — the hardcoded fallbacks below are the
  // backstop.
  useEffect(() => {
    clientBrowser
      .fetch(uiTextQuery)
      .then((res: any) => {
        if (!res) return
        setCopy({
          heading: res.errorPageHeading || undefined,
          body: res.errorPageBody || undefined,
          retry: res.errorPageRetryButton || undefined,
          home: res.errorPageHomeButton || undefined,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-surface border border-border p-12 shadow-2xl">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 border-4 border-accent-red rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-accent-red"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <h1 className="font-bebas text-5xl md:text-6xl uppercase tracking-wider text-text-primary mb-4">
            {copy.heading || 'Something Went Wrong'}
          </h1>

          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            {copy.body ||
              "We encountered an unexpected error. Don't worry, it's not your fault."}
          </p>

          {/* Error Details (dev mode only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-background/50 border border-border p-4 mb-8 text-left">
              <p className="font-mono text-sm text-accent-red break-all">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent-primary text-black font-bold uppercase tracking-wider hover:bg-accent-primary/90 transition-all duration-300"
            >
              {copy.retry || 'Try Again'}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-border text-text-primary font-bold uppercase tracking-wider hover:border-accent-primary hover:text-accent-primary transition-all duration-300"
            >
              {copy.home || 'Go Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
