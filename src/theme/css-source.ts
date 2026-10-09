/**
 * brand-banners — canonical stylesheet.
 *
 * Single source of truth for every style the package ships. Both the runtime
 * `injectStyles()` call (auto-injection for no-Tailwind apps) and the published
 * `dist/styles.css` (explicit import for SSR / consumers who prefer it) are
 * produced from this string. Edit here only.
 *
 * Every rule is scoped under `.bb-root` so styles never leak into the host app.
 * Tokens follow `design-style-guide.md` exactly.
 */
export const cssSource = String.raw`
.bb-root {
  /* — Brand / accent (theme-independent core) — */
  --bb-brand-900: #0B2E2A;
  --bb-brand-800: #0F3D38;
  --bb-brand-700: #14524B;
  --bb-brand-600: #1B6B61;
  --bb-accent-500: #B6F23D;
  --bb-accent-600: #9FDB2A;
  --bb-accent-300: #D6F98C;
  --bb-pop-500: #7C4DFF;
  --bb-pop-600: #6B3BEE;

  /* — Light theme (default) — */
  --bb-bg: #FFFFFF;
  --bb-surface: #F4F6F8;
  --bb-surface-2: #FFFFFF;
  --bb-text: #0E1726;
  --bb-text-muted: #5B6573;
  --bb-border: #E4E8EC;
  --bb-on-brand: #F3FBF7;
  --bb-on-accent: #0B2E2A;
  --bb-cta-bg: var(--bb-accent-500);
  --bb-cta-text: var(--bb-on-accent);
  --bb-cta-bg-hover: var(--bb-accent-600);
  --bb-focus-ring: #1B6B61;
  --bb-overlay: rgba(11, 46, 42, 0.55);
  --bb-brand-gradient: linear-gradient(105deg, var(--bb-brand-900) 0%, var(--bb-brand-800) 45%, var(--bb-brand-700) 100%);

  /* — Typography — */
  --bb-font-heading: "Inter", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
  --bb-font-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --bb-font-display: "Clash Display", "Inter", system-ui, sans-serif;
  --bb-fs-xs: 0.75rem;
  --bb-fs-sm: 0.875rem;
  --bb-fs-base: 1rem;
  --bb-fs-lg: 1.25rem;
  --bb-fs-xl: 1.75rem;
  --bb-fs-2xl: 2.25rem;
  --bb-fs-3xl: 3rem;
  --bb-fw-regular: 400;
  --bb-fw-medium: 500;
  --bb-fw-semibold: 600;
  --bb-fw-bold: 700;
  --bb-fw-black: 800;
  --bb-lh-tight: 1.05;
  --bb-lh-snug: 1.2;
  --bb-lh-normal: 1.5;
  --bb-ls-tight: -0.02em;
  --bb-ls-normal: 0;
  --bb-ls-wide: 0.04em;

  /* — Spacing scale (4px base) — */
  --bb-space-0: 0;
  --bb-space-1: 0.25rem;
  --bb-space-2: 0.5rem;
  --bb-space-3: 0.75rem;
  --bb-space-4: 1rem;
  --bb-space-5: 1.25rem;
  --bb-space-6: 1.5rem;
  --bb-space-8: 2rem;
  --bb-space-10: 2.5rem;
  --bb-space-12: 3rem;

  /* — Radii — */
  --bb-radius-sm: 6px;
  --bb-radius-md: 12px;
  --bb-radius-lg: 18px;
  --bb-radius-xl: 24px;
  --bb-radius-pill: 9999px;

  /* — Borders — */
  --bb-border-width: 1px;
  --bb-border-color: var(--bb-border);

  /* — Shadows / elevation — */
  --bb-shadow-sm: 0 1px 2px rgba(14, 23, 38, 0.06);
  --bb-shadow-md: 0 6px 20px rgba(14, 23, 38, 0.10);
  --bb-shadow-lg: 0 16px 40px rgba(14, 23, 38, 0.16);
  --bb-shadow-cta: 0 4px 14px rgba(159, 219, 42, 0.35);

  /* — Motion — */
  --bb-dur-fast: 120ms;
  --bb-dur-base: 220ms;
  --bb-dur-slow: 400ms;
  --bb-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --bb-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* — Z-index — */
  --bb-z-inline: 1;
  --bb-z-sticky: 1000;
  --bb-z-corner: 1100;
  --bb-z-overlay: 1200;

  /* Base typography for the scoped subtree. Inherited by all descendants. */
  font-family: var(--bb-font-body);
  color: var(--bb-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Box-sizing applies to the scoped subtree only. */
.bb-root,
.bb-root *,
.bb-root *::before,
.bb-root *::after {
  box-sizing: border-box;
}

/* — Explicit dark theme override — */
.bb-root[data-bb-theme="dark"] {
  --bb-bg: #0B0F14;
  --bb-surface: #11161D;
  --bb-surface-2: #161C24;
  --bb-text: #EAF0F2;
  --bb-text-muted: #9AA7B2;
  --bb-border: #232B34;
  --bb-on-brand: #F3FBF7;
  --bb-on-accent: #0B2E2A;
  --bb-cta-bg: var(--bb-accent-500);
  --bb-cta-text: var(--bb-on-accent);
  --bb-cta-bg-hover: var(--bb-accent-600);
  --bb-focus-ring: #B6F23D;
  --bb-overlay: rgba(0, 0, 0, 0.6);
}

/* — System theme: follow prefers-color-scheme — */
@media (prefers-color-scheme: dark) {
  .bb-root[data-bb-theme="system"] {
    --bb-bg: #0B0F14;
    --bb-surface: #11161D;
    --bb-surface-2: #161C24;
    --bb-text: #EAF0F2;
    --bb-text-muted: #9AA7B2;
    --bb-border: #232B34;
    --bb-on-brand: #F3FBF7;
    --bb-on-accent: #0B2E2A;
    --bb-cta-bg: var(--bb-accent-500);
    --bb-cta-text: var(--bb-on-accent);
    --bb-cta-bg-hover: var(--bb-accent-600);
    --bb-focus-ring: #B6F23D;
    --bb-overlay: rgba(0, 0, 0, 0.6);
  }
}

/* ── Banner component default styles ───────────────────────────────────────
   Every component selector is a .bb-root anchor + a :where() group, so
   specificity comes from the anchor alone and is the same for every rule
   of a kind:

   - the banner root:  .bb-root:where(…)           one class
   - parts inside it:  .bb-root.bb-root :where(…)  two classes

   The parts are real h2 / p / a / button / img elements, which is what host
   stylesheets go after (h2 { … }, a { … }, .content h2 { … }). Two classes
   beat those, so a banner looks the same on any page. The root stays at one
   class so a className passed to a banner still overrides it; to restyle a
   part, set the --bb-* tokens or write .your-class .bb-banner__title { … }.
   The style tag is prepended to <head>, so an equally specific consumer
   rule always comes later and wins.

   Rules of a kind tie with each other, so source order decides — later
   sections (variants, sizes, media queries) override earlier ones.
*/

.bb-root:where(.bb-banner) {
  display: flex;
  align-items: center;
  gap: var(--bb-space-6);
  padding: var(--bb-space-5) var(--bb-space-6);
  background: var(--bb-surface);
  color: var(--bb-text);
  border-radius: var(--bb-radius-lg);
  box-shadow: var(--bb-shadow-md);
  border: 0;
  font-family: var(--bb-font-body);
  line-height: var(--bb-lh-normal);
  position: relative;
  max-width: 100%;
}

.bb-root.bb-root :where(.bb-banner__media) {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Host pages often decorate bare img/video (borders, shadows, margins);
   banner artwork opts out. */
.bb-root.bb-root :where(.bb-banner__media img),
.bb-root.bb-root :where(.bb-banner__media video) {
  margin: 0;
  padding: 0;
  border: 0;
  box-shadow: none;
  background: none;
}

.bb-root.bb-root :where(.bb-banner__body) {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: var(--bb-space-1);
  min-width: 0;
}

.bb-root.bb-root :where(.bb-banner__eyebrow) {
  display: inline-block;
  font-size: var(--bb-fs-xs);
  font-weight: var(--bb-fw-semibold);
  letter-spacing: var(--bb-ls-wide);
  color: var(--bb-text-muted);
  text-transform: uppercase;
  margin-bottom: var(--bb-space-1);
}

.bb-root.bb-root :where(.bb-banner__title) {
  font-family: var(--bb-font-heading);
  font-size: var(--bb-fs-xl);
  font-weight: var(--bb-fw-bold);
  line-height: var(--bb-lh-tight);
  letter-spacing: var(--bb-ls-tight);
  color: var(--bb-text);
  margin: 0;
  /* Heading styles a host commonly sets that the banner never wants. */
  text-transform: none;
  opacity: 1;
}

.bb-root.bb-root :where(.bb-banner__subtitle) {
  font-size: var(--bb-fs-sm);
  color: var(--bb-text-muted);
  margin: 0;
}

.bb-root.bb-root :where(.bb-banner__fine-print) {
  font-size: var(--bb-fs-xs);
  color: var(--bb-text-muted);
  margin: 0;
}

.bb-root.bb-root :where(.bb-banner__cta) {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--bb-space-2);
  padding: var(--bb-space-3) var(--bb-space-5);
  background: var(--bb-cta-bg);
  color: var(--bb-cta-text);
  border-radius: var(--bb-radius-pill);
  border: 0;
  font-family: var(--bb-font-body);
  font-size: var(--bb-fs-sm);
  font-weight: var(--bb-fw-semibold);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--bb-shadow-cta);
  transition:
    transform var(--bb-dur-fast) var(--bb-ease-out),
    background var(--bb-dur-fast) var(--bb-ease-out);
  min-height: 40px;
}

.bb-root.bb-root :where(.bb-banner__cta:hover) {
  background: var(--bb-cta-bg-hover);
  transform: translateY(-1px);
}

.bb-root.bb-root :where(.bb-banner__cta:active) {
  transform: translateY(0);
}

.bb-root.bb-root :where(.bb-banner__cta:focus-visible) {
  outline: 2px solid var(--bb-focus-ring);
  outline-offset: 2px;
}

.bb-root.bb-root :where(.bb-banner__cta--secondary) {
  background: transparent;
  color: var(--bb-text);
  border: 1.5px solid var(--bb-border);
  box-shadow: none;
}

.bb-root.bb-root :where(.bb-banner__cta--secondary:hover) {
  background: var(--bb-surface);
}

.bb-root.bb-root :where(.bb-banner__close) {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: color-mix(in srgb, currentColor 10%, transparent);
  /* Inherit the banner's own text color so the × stays visible on brand
     gradients, not just on neutral surfaces. */
  color: inherit;
  border: 0;
  border-radius: var(--bb-radius-pill);
  cursor: pointer;
  transition: background var(--bb-dur-fast) var(--bb-ease-out);
}

.bb-root.bb-root :where(.bb-banner__close:hover) {
  background: color-mix(in srgb, currentColor 18%, transparent);
}

.bb-root.bb-root :where(.bb-banner__close:focus-visible) {
  outline: 2px solid var(--bb-focus-ring);
  outline-offset: 2px;
}

/* ── BannerAd (strip) variants ──────────────────────────────────────── */

.bb-root:where(.bb-banner-ad--strong) {
  background: var(--bb-brand-gradient);
  color: var(--bb-on-brand);
  border: 0;
}

.bb-root.bb-root :where(.bb-banner-ad--strong .bb-banner__title),
.bb-root.bb-root :where(.bb-banner-ad--strong .bb-banner__subtitle),
.bb-root.bb-root :where(.bb-banner-ad--strong .bb-banner__eyebrow),
.bb-root.bb-root :where(.bb-banner-ad--strong .bb-banner__fine-print) {
  color: var(--bb-on-brand);
}

.bb-root.bb-root :where(.bb-banner-ad--strong .bb-banner__subtitle),
.bb-root.bb-root :where(.bb-banner-ad--strong .bb-banner__fine-print) {
  opacity: 0.85;
}

.bb-root.bb-root :where(.bb-banner-ad--strong .bb-banner__eyebrow) {
  color: var(--bb-accent-500);
  opacity: 1;
}

/* ── BrandedBanner (premium) ──────────────────────────────────────────── */

.bb-root:where(.bb-banner-branded) {
  background: var(--bb-brand-gradient);
  color: var(--bb-on-brand);
  border-radius: var(--bb-radius-lg);
  border: 0;
  overflow: hidden;
}

.bb-root.bb-root :where(.bb-banner-branded .bb-banner__title),
.bb-root.bb-root :where(.bb-banner-branded .bb-banner__subtitle),
.bb-root.bb-root :where(.bb-banner-branded .bb-banner__eyebrow),
.bb-root.bb-root :where(.bb-banner-branded .bb-banner__fine-print) {
  color: var(--bb-on-brand);
}

.bb-root.bb-root :where(.bb-banner-branded .bb-banner__title) {
  font-size: var(--bb-fs-2xl);
}

.bb-root.bb-root :where(.bb-banner-branded[data-bb-size="banner"] .bb-banner__title) {
  font-size: var(--bb-fs-sm);
}

.bb-root.bb-root :where(.bb-banner-branded[data-bb-size="halfpage"] .bb-banner__title) {
  font-size: var(--bb-fs-2xl);
}

.bb-root.bb-root :where(.bb-banner-branded[data-bb-size="social"] .bb-banner__title) {
  font-size: var(--bb-fs-3xl);
}

.bb-root.bb-root :where(.bb-banner-branded .bb-banner__subtitle),
.bb-root.bb-root :where(.bb-banner-branded .bb-banner__fine-print) {
  opacity: 0.85;
}

.bb-root.bb-root :where(.bb-banner-branded .bb-banner__eyebrow) {
  color: var(--bb-accent-500);
  opacity: 1;
}

.bb-root.bb-root :where(.bb-banner-branded__image) {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* ── MediaBanner ──────────────────────────────────────────────────────── */

.bb-root.bb-root :where(.bb-banner-media .bb-banner__media) {
  width: 100%;
  max-width: 320px;
  border-radius: var(--bb-radius-md);
  overflow: hidden;
}

.bb-root.bb-root :where(.bb-banner-media__img),
.bb-root.bb-root :where(.bb-banner-media__video),
.bb-root.bb-root :where(.bb-banner-media__video-poster) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--bb-radius-md);
}

.bb-root.bb-root :where(.bb-banner-media__svg) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.bb-root.bb-root :where(.bb-banner-media__svg svg) {
  display: block;
  width: 100%;
  height: auto;
}

/* ── AdSlot wrapper ───────────────────────────────────────────────────── */

.bb-root:where(.bb-ad-slot) {
  display: contents;
}

.bb-root:where(.bb-ad-slot[data-bb-position]) {
  display: block;
}

.bb-root:where(.bb-ad-slot[data-bb-position="corner"]) {
  position: fixed;
  z-index: var(--bb-z-corner);
}

.bb-root:where(.bb-ad-slot[data-bb-position="top"][data-bb-sticky="true"]) {
  position: sticky;
  top: 0;
  z-index: var(--bb-z-sticky);
}

.bb-root:where(.bb-ad-slot[data-bb-position="bottom"][data-bb-sticky="true"]) {
  position: sticky;
  bottom: 0;
  z-index: var(--bb-z-sticky);
}

/* ── Position rules ─────────────────────────────────────────────────── */

.bb-root:where(.bb-banner[data-bb-position="top"][data-bb-sticky="true"]) {
  position: sticky;
  top: 0;
  z-index: var(--bb-z-sticky);
  border-radius: 0;
}

.bb-root:where(.bb-banner[data-bb-position="bottom"][data-bb-sticky="true"]) {
  position: sticky;
  bottom: 0;
  z-index: var(--bb-z-sticky);
  border-radius: 0;
  padding-bottom: max(var(--bb-space-5), env(safe-area-inset-bottom));
}

.bb-root:where(.bb-banner[data-bb-position="corner"]) {
  position: fixed;
  z-index: var(--bb-z-corner);
  box-shadow: var(--bb-shadow-lg);
  border-radius: var(--bb-radius-xl);
  max-width: calc(100vw - 40px);
}

.bb-root:where(.bb-banner[data-bb-position="inline"]),
.bb-root:where(.bb-banner[data-bb-position="custom"]) {
  /* No positioning — host controls placement. */
}

/* ── Size presets ───────────────────────────────────────────────────── */

.bb-root:where(.bb-banner[data-bb-size="sm"]) {
  min-height: 56px;
  padding: var(--bb-space-3) var(--bb-space-5);
  gap: var(--bb-space-4);
}

.bb-root:where(.bb-banner[data-bb-size="md"]) {
  min-height: 72px;
}

.bb-root:where(.bb-banner[data-bb-size="lg"]) {
  min-height: 96px;
  padding: var(--bb-space-6) var(--bb-space-8);
}

.bb-root:where(.bb-banner[data-bb-size="leaderboard"]) {
  width: 930px;
  max-width: 100%;
  height: 180px;
  aspect-ratio: 930 / 180;
}

.bb-root:where(.bb-banner[data-bb-size="social"]) {
  width: 1200px;
  max-width: 100%;
  aspect-ratio: 1200 / 628;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--bb-space-8);
}

.bb-root:where(.bb-banner[data-bb-size="halfpage"]) {
  width: 300px;
  max-width: 100%;
  height: 600px;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  padding: var(--bb-space-6);
}

.bb-root:where(.bb-banner[data-bb-size="banner"]) {
  width: 468px;
  max-width: 100%;
  min-height: 60px;
  padding: var(--bb-space-2) var(--bb-space-3);
  gap: var(--bb-space-3);
  font-size: var(--bb-fs-sm);
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="banner"] .bb-banner__title) {
  font-size: var(--bb-fs-sm);
}

.bb-root:where(.bb-banner[data-bb-size="fullwidth-strip"]) {
  width: 100%;
  max-width: none;
  min-height: 72px;
  border-radius: 0;
}

/* ── Text alignment ─────────────────────────────────────────────────── */

.bb-root.bb-root :where(.bb-banner[data-bb-align="center"] .bb-banner__body) {
  text-align: center;
  align-items: center;
}

.bb-root.bb-root :where(.bb-banner[data-bb-align="end"] .bb-banner__body) {
  text-align: end;
  align-items: flex-end;
}

/* ── Media layout variants ──────────────────────────────────────────── */

/* "left" is DOM order (media, body, CTA, close). "right" moves the media
   after the CTA and keeps the close button last, without touching the
   flex direction: reversing the row put the CTA and close button on the far
   left, and overrode the column direction of the tall presets. */
.bb-root.bb-root :where(.bb-banner[data-bb-media-pos="right"] > .bb-banner__media) {
  order: 1;
}

.bb-root.bb-root :where(.bb-banner[data-bb-media-pos="right"] > .bb-banner__close) {
  order: 2;
}

.bb-root:where(.bb-banner[data-bb-media-pos="background"]) {
  position: relative;
}

.bb-root.bb-root :where(.bb-banner[data-bb-media-pos="background"] .bb-banner__media) {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bb-root.bb-root :where(.bb-banner[data-bb-media-pos="background"] .bb-banner__body),
.bb-root.bb-root :where(.bb-banner[data-bb-media-pos="background"] .bb-banner__cta) {
  position: relative;
  z-index: 1;
}

/* Stack on small screens (mobile single-column). */
@media (max-width: 640px) {
  .bb-root:where(.bb-banner) {
    flex-wrap: wrap;
    padding: var(--bb-space-4);
  }
  .bb-root.bb-root :where(.bb-banner__body) {
    flex: 1 1 100%;
  }
  .bb-root.bb-root :where(.bb-banner__cta) {
    flex: 1 1 100%;
  }
  .bb-root:where(.bb-banner[data-bb-position="corner"]) {
    left: 12px !important;
    right: 12px !important;
    width: auto !important;
    max-width: calc(100vw - 24px);
  }
}

/* ── Card preset ────────────────────────────────────────────────────────
   Content-height promo card for corner slots and sidebars: the CTA stacks
   under the body, an optional square media column sits beside them, and the
   close button docks top-right. Height follows the content, so nothing clips
   at narrow widths the way the fixed-height IAB presets do.
*/

.bb-root:where(.bb-banner[data-bb-size="card"]) {
  --bb-card-media: 140px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "body" "cta";
  align-items: start;
  gap: var(--bb-space-3) var(--bb-space-4);
  width: 520px;
  max-width: 100%;
  height: auto;
  padding: var(--bb-space-4) var(--bb-space-5);
}

.bb-root:where(.bb-banner[data-bb-size="card"]:has(> .bb-banner__media)) {
  grid-template-columns: var(--bb-card-media) minmax(0, 1fr);
  grid-template-areas: "media body" "media cta";
}

.bb-root:where(.bb-banner[data-bb-size="card"][data-bb-media-pos="right"]:has(> .bb-banner__media)) {
  grid-template-columns: minmax(0, 1fr) var(--bb-card-media);
  grid-template-areas: "body media" "cta media";
}

.bb-root:where(.bb-banner[data-bb-size="card"][data-bb-media-pos="background"]) {
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "body" "cta";
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"]:not([data-bb-media-pos="background"]) > .bb-banner__media) {
  grid-area: media;
  align-self: center;
  width: var(--bb-card-media);
  max-width: none;
  height: var(--bb-card-media);
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"] .bb-banner-branded__image) {
  width: 100%;
  height: 100%;
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"] > .bb-banner__body) {
  grid-area: body;
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"] > .bb-banner__cta) {
  grid-area: cta;
  justify-self: start;
  align-self: end;
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"] > .bb-banner__close) {
  position: absolute;
  top: var(--bb-space-2);
  inset-inline-end: var(--bb-space-2);
  z-index: 2;
}

/* Keep text clear of the docked close button, unless the media column is
   the thing sitting under it. */
.bb-root.bb-root :where(.bb-banner[data-bb-size="card"]:has(> .bb-banner__close) > .bb-banner__body) {
  padding-inline-end: var(--bb-space-8);
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"][data-bb-media-pos="right"]:has(> .bb-banner__media) > .bb-banner__body) {
  padding-inline-end: 0;
}

/* On a branded card the close button overlaps artwork: give it a scrim so
   the × reads on any image. */
.bb-root.bb-root :where(.bb-banner-branded[data-bb-size="card"] > .bb-banner__close) {
  background: rgba(15, 23, 42, 0.3);
  color: var(--bb-on-brand);
}

.bb-root.bb-root :where(.bb-banner-branded[data-bb-size="card"] > .bb-banner__close:hover),
.bb-root.bb-root :where(.bb-banner-branded[data-bb-size="card"] > .bb-banner__close:focus-visible) {
  background: rgba(15, 23, 42, 0.5);
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"] .bb-banner__title) {
  font-size: var(--bb-fs-lg);
  line-height: 1.25;
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"] .bb-banner__subtitle) {
  font-size: var(--bb-fs-sm);
  line-height: 1.4;
}

.bb-root.bb-root :where(.bb-banner[data-bb-size="card"] .bb-banner__eyebrow) {
  font-size: 0.6875rem;
  margin-bottom: 0.125rem;
}

@media (max-width: 480px) {
  .bb-root:where(.bb-banner[data-bb-size="card"]) {
    --bb-card-media: 88px;
    gap: var(--bb-space-2) var(--bb-space-3);
    padding: var(--bb-space-3) 0.875rem;
  }
  .bb-root.bb-root :where(.bb-banner[data-bb-size="card"] .bb-banner__title) {
    font-size: var(--bb-fs-base);
  }
  .bb-root.bb-root :where(.bb-banner[data-bb-size="card"] .bb-banner__subtitle) {
    font-size: var(--bb-fs-xs);
  }
  .bb-root.bb-root :where(.bb-banner[data-bb-size="card"] > .bb-banner__cta) {
    font-size: 0.8125rem;
    padding: var(--bb-space-2) var(--bb-space-4);
  }
}

/* — Reduced motion: zero out transitions/animations inside the scope — */
@media (prefers-reduced-motion: reduce) {
  .bb-root *,
  .bb-root *::before,
  .bb-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`.trim();
