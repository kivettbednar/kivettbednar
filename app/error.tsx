'use client'

import Link from 'next/link'
import {useEffect} from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-surface border border-border p-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Something Went Wrong
          </h1>
          <p className="text-text-secondary mb-8">
            Something went wrong. Please try refreshing the page.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-accent-primary text-black font-bold uppercase"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 border-2 border-border text-text-primary font-bold uppercase"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
