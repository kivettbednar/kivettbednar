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

## Stagger schedule (use this exact sequence)

For sibling content blocks inside one section, stagger with this schedule:

- Eyebrow / accent label: `delay={0}` (or omit)
- Heading: `delay={0.1}`
- Subheading / intro paragraph: `delay={0.2}`
- Primary content (image, embed, grid): `delay={0.35}`
- Tertiary content (links, secondary CTA): `delay={0.5}`

Don't go above `0.5` — past that it feels slow.

Between *sections* you do NOT need explicit delays — IntersectionObserver naturally triggers each as it scrolls in.

## Section rhythm (spacing scale)

**Section vertical padding:**
- Default content section: `py-16 md:py-20`
- Signature / featured moment (e.g. Listen, dedicated Booking section): `py-20 md:py-28`
- Never exceed `py-28`. Taller isn't louder — it's bloated.

**Internal gap scale (pick one per section, don't mix ad-hoc):**
- Tight related elements (eyebrow → heading, heading → subheading): `mb-3` / `mt-3`
- Within one content group: `mb-5` / `mt-5`
- Between content groups (heading block → embed/cta): `mb-10` / `mt-8`

**Container widths:**
- Dense grids (4+ items, event grids): `max-w-7xl`
- Editorial layouts (booking 2-col, merch grid): `max-w-6xl`
- Text-forward sections (bio, legal, philosophy): `max-w-3xl`
- Intimate modules (Spotify embed, newsletter form): `max-w-2xl`

If a section feels "bloated," the first thing to check is whether the container width matches the content's actual visual weight. A 352px-tall Spotify player in a 4xl container reads "iframe dropped in page" — same player in a 2xl container reads "intentional listening moment."

## TextReveal scoping

`TextReveal` does a character-by-character scroll-reveal that looks cinematic but conflicts visually if mixed with `AnimatedSection` siblings that don't share its timing. Rules:

- **Hero H1:** always uses TextReveal (or its equivalent in `HeroSlider`).
- **Signature sections (max 2 per page):** may use TextReveal for the heading. Must be paired with an `AnimatedSection animation="fadeUp" delay={0.15}` for the intro paragraph to land smoothly after the reveal.
- **Every other section heading:** uses the standard class string (`font-bebas text-4xl md:text-5xl uppercase tracking-wide text-text-primary`) wrapped in `AnimatedSection animation="fadeUp"`. Never a TextReveal next to a `fadeIn` subheading — those systems collide.

If in doubt, use the standard treatment. Reserve TextReveal for moments that genuinely warrant the extra drama.

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
- ❌ `TextReveal` heading next to a `fadeIn`-with-no-delay subheading — pick one timing system per section
- ❌ Arbitrary mixed gaps (`mb-6`, `mb-8`, `mt-4` all in one section) — follow the scale above
- ❌ Mobile-only horizontal scroll card list with no staggered entry — every card list, desktop or mobile, animates in with per-item stagger

## When in doubt

Look at how `app/(site)/shows/page.tsx` does it. That file is the reference implementation.
