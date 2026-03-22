/** Z-index scale — reference for the stacking order used across the site.
 *  Use z-[N] in Tailwind classes to match these values. */
export const Z_INDEX = {
  mobileOverlay: 90,   // Header.tsx mobile backdrop
  header: 100,         // Header.tsx sticky nav
  cartDrawer: 200,     // CartDrawer.tsx
  searchModal: 300,    // SearchModal.tsx
  lightbox: 400,       // ImageLightbox.tsx
  grain: 9997,         // GrainOverlay.tsx
  toast: 9999,         // Toast.tsx
} as const
