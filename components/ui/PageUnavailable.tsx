import Link from 'next/link'

interface PageUnavailableProps {
  pageName?: string
}

export function PageUnavailable({pageName}: PageUnavailableProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary mb-4">
          {pageName ? `${pageName} is Currently Unavailable` : 'Page Unavailable'}
        </h1>
        <p className="text-text-secondary mb-8">
          This page is not available right now. Please visit our home page for more information.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold text-lg uppercase tracking-wider px-8 py-4 transition-all duration-300"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  )
}
