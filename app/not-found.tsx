import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-surface border border-border p-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Page Not Found
          </h1>
          <p className="text-text-secondary mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-accent-primary text-black font-bold uppercase"
            >
              Go Home
            </Link>
            <Link
              href="/shows"
              className="px-6 py-3 border-2 border-border text-text-primary font-bold uppercase"
            >
              View Shows
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
