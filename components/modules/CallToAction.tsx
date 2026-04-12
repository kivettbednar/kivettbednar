import ResolvedLink from '@/app/components/ResolvedLink'
import {CallToAction} from '@/sanity.types'

export function CallToActionModule({heading, text, buttonText, link}: CallToAction) {
  if (!heading && !text) {
    return null
  }

  return (
    <section className="container mx-auto px-4">
      <div className="relative overflow-hidden border border-border bg-surface-elevated px-8 py-10 md:py-14 shadow-layer">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-accent-primary/10 via-transparent to-accent-primary/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            {heading && (
              <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-text-primary uppercase">
                {heading}
              </h2>
            )}
            {text && <p className="mt-3 text-lg text-text-secondary">{text}</p>}
          </div>
          {buttonText && link && (
            <ResolvedLink
              link={link}
              className="inline-flex items-center justify-center gap-3 border-2 border-accent-primary px-6 py-3 font-bold uppercase tracking-wider text-accent-primary transition hover:bg-accent-primary hover:text-black"
            >
              {buttonText}
            </ResolvedLink>
          )}
        </div>
      </div>
    </section>
  )
}
