/**
 * Root loading UI shown during route transitions before SSR streams in.
 * Pure CSS — no JS hydration cost. Mounts instantly on click.
 *
 * Top hairline progress bar (gold), centered brand wordmark with
 * a slow opacity pulse. Solid background matches the site theme so
 * there is no white flash between routes.
 */
export default function RootLoading() {
  return (
    <div
      className="fixed inset-0 z-toast flex items-center justify-center"
      style={{backgroundColor: 'var(--color-background)'}}
      aria-busy="true"
      aria-label="Loading"
    >
      {/* Top progress hairline */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div
          className="h-full w-1/3 bg-accent-primary"
          style={{
            animation: 'route-progress 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.6)',
          }}
        />
      </div>

      {/* Centered wordmark with slow pulse */}
      <div className="flex flex-col items-center gap-3">
        <span
          className="font-bebas text-xl md:text-2xl uppercase tracking-[0.4em] text-text-primary/80"
          style={{animation: 'route-pulse 1.6s ease-in-out infinite'}}
        >
          Kivett Bednar
        </span>
        <span
          className="block h-px w-12 bg-accent-primary"
          style={{
            animation: 'route-bar 1.6s ease-in-out infinite',
            transformOrigin: 'left',
          }}
        />
      </div>

      <style>{`
        @keyframes route-progress {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes route-pulse {
          0%, 100% { opacity: 0.55; letter-spacing: 0.4em; }
          50%      { opacity: 1;    letter-spacing: 0.45em; }
        }
        @keyframes route-bar {
          0%, 100% { transform: scaleX(0.4); opacity: 0.6; }
          50%      { transform: scaleX(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
