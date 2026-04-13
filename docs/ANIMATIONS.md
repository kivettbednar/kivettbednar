# Universal Animation Pattern

Every page on this site must follow the same entrance-animation pattern. If a page doesn't match this, it feels amateur. No exceptions.

## The three primitives

| Primitive | File | Use for |
|-----------|------|---------|
| `AnimatedHero` | `components/ui/AnimatedHero.tsx` | Top-of-page hero with title, subtitle, background image (parallax + Ken Burns zoom) |
| `AnimatedSection` | `components/animations/AnimatedSection.tsx` | Any content block that should fade/slide in when scrolled into view |
| `TextReveal` | `components/animations/TextReveal.tsx` | Section headings that should reveal character-by-character |

Build every page out of these three. Do not hand-roll hero markup, do not skip the section wrapper, do not invent new animation primitives.

## Page skeleton (copy this for new pages)

```tsx
import {AnimatedHero} from '@/components/ui/AnimatedHero'
import {AnimatedSection} from '@/components/animations/AnimatedSection'
import {TextReveal} from '@/components/animations/TextReveal'

export default async function SomePage() {
  const data = await fetchFromSanity()

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero — ALWAYS use AnimatedHero, never raw <Image> */}
      <AnimatedHero
        title={data.heroHeading || 'Page Title'}
        subtitle={data.heroSubheading}
        variant="contact" // or 'shows' | 'lessons' | 'setlist'
        backgroundImage={data.heroImage?.asset?.url}
        backgroundAlt={data.heroImage?.alt || 'Page Title'}
      />

      {/* 2. Content sections — each wrapped in AnimatedSection */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection animation="fadeIn">
              <TextReveal
                text={data.sectionHeading || 'Section'}
                className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary mb-8"
              />
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.1}>
              <p className="text-lg text-text-secondary">{data.sectionBody}</p>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.2}>
              {/* subsequent content */}
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
```

## Section heading rule

Every section heading uses **exactly** this class string:

```
font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary
```

The only place you go bigger is the editorial TextReveal variant on home sections (`text-5xl md:text-6xl lg:text-7xl`). Never `text-display-lg`, never `text-display-xl`, never an ad-hoc `text-9xl`. If you find one in the codebase, cap it.

## Stagger delays

For sibling content blocks inside one section, use 0.1s increments on the `delay` prop:

- First block: `delay={0}` (or omit)
- Second block: `delay={0.1}`
- Third block: `delay={0.2}`
- ...

Don't go above `0.5` — past that it feels slow.

Between *sections* you do NOT need explicit delays — IntersectionObserver naturally triggers each as it scrolls in.

## Loading states (Suspense)

**Do not write skeleton `loading.tsx` files.** They flash briefly, don't convey real progress, and are an eyesore. Every page must be SSR with `export const revalidate = N`. The page itself has staggered entrance animations, so the user perceives the load as intentional.

If you find a `loading.tsx` in this repo, delete it unless it's doing something specific and well-justified.

## Hero variants

`AnimatedHero` takes a `variant` prop (`'shows' | 'lessons' | 'contact' | 'setlist'`) which controls gradient overlays. Pick whichever fits the mood of the page. Default to `'contact'` for bio/epk/amps — it's the subtlest overlay.

## Anti-patterns (do not do)

- ❌ Raw `<Image fill />` + custom absolute-positioned overlay for the hero — use `AnimatedHero`
- ❌ Section heading sized by `text-display-lg` — kills visual hierarchy (newsletter hero bug from April 2026)
- ❌ `framer-motion` `whileHover: scale(1.02)` on buttons — reads mechanical; use color/fill transitions
- ❌ Skeleton placeholder UI in `loading.tsx` — flashes and looks worse than nothing
- ❌ Double "Kivett Bednar" in page titles — root `app/layout.tsx` has the template; children return just the page name
- ❌ Hand-rolled scroll fade with binary opacity toggle — if you need scroll-driven fade, compute a numeric `scrollY / threshold` value

## When in doubt

Look at how `app/(site)/shows/page.tsx` does it. That file is the reference implementation.
