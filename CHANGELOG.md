# Changelog

All notable changes to `brand-banners` are documented here. Format adapted from [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [SemVer](https://semver.org/).

## [0.1.0] — unreleased

First release under the `brand-banners` name. Forked from `beautiful-banner-ads` 0.4.0 by MUKE JOHNBAPTIST.

### Added

- **`BrandBanners`**: the whole integration in one component. A rotating, dismissible corner card built from `AdSlot` + `BrandedBanner`, with `interval`, `dismissDays`, `corner`, `offset`, `width`, `layout`, `position` and the analytics callbacks as its only options.
- **`size="card"`**: a content-height preset (CTA under the text, optional square image column, close button docked top-right) for corner slots and sidebars. Nothing clips at narrow widths.
- **`dismissScope` on `AdSlot`**: `"ad"` skips the closed ad and carries on; `"slot"` hides the whole slot. Plus an `id` prop that names the slot in its storage key.
- The published bundle is marked `"use client"`, so it imports directly into a Next.js App Router server component.

### Changed

- **CSS prefix is `bb-`** (was `bba-`): classes, `--bb-*` tokens, `data-bb-*` attributes, Tailwind utilities and `bb-dismissed:*` storage keys. Both packages can now be on one page without sharing a style tag.
- **Styles hold up against host CSS.** Rules for the banner root weigh one class and rules for the parts inside weigh two, instead of zero, so a host page's `h2`, `a`, `button`, `img` or `.content h2` rules no longer restyle banners. A consumer `className` on the banner and `.your-class .bb-banner__*` selectors still override.
- `onView` fires for every ad a rotating slot shows, not only the first.
- `layout="image-right"` orders the row as text, CTA, image, close button. It no longer reverses the row or overrides the column direction of `halfpage` / `social`.
- An already-dismissed banner is hidden before first paint in client-rendered apps (the storage lookup moved to a layout effect).
- Ads without an `id` get a stable positional storage key (`bb-dismissed:idx-0`) inside an `AdSlot`.
- `VERSION` is injected from `package.json` at build time.

### Fixed

- Closing one ad in a rotating slot hid the slot for the rest of the page view but only remembered that one ad, so the slot reappeared on the next visit until rotation reached it.
- The close button used the page theme's text colour and disappeared on dark brand gradients; it now inherits the banner's text colour.
- A fully dismissed `AdSlot` left an empty positioned wrapper in the page.

---

# History before the fork (`beautiful-banner-ads`)

## [0.1.0] — 2026-06-05

The initial public release. Everything in `project-description.md` §14's Definition of Done for v1 is implemented:

### Added

- **5 React components**: `BannerAd`, `BrandedBanner`, `MediaBanner`, `CustomBanner` (headless + slots), `AdSlot` (with `BannerRotator` alias and opt-in rotation).
- **Themed**: light / dark / system modes via CSS custom properties; `ThemeProvider`, `useTheme`, `useSystemTheme`, `useResolvedTheme` hooks.
- **Tailwind dual-mode**: scoped stylesheet auto-injects in no-Tailwind apps; a `beautiful-banner-ads/tailwind-preset` export mirrors every token as `theme.extend` entries via `var(--bba-*)` references.
- **Full layout / sizing control**: `position` (`top` / `bottom` / `inline` / `corner` / `custom`), `sticky`, `corner`, `offset`, `width`, plus named ad-size presets (`leaderboard` 930×180, `social` 1200×628, `halfpage` 300×600, `banner` 468×60, `fullwidth-strip`, and `sm`/`md`/`lg`).
- **Props + JSON `config`**: every component accepts a serializable `BannerConfig` object; explicit props always override.
- **Callback-only analytics**: `onView` (50% IntersectionObserver, fires once), `onClick`, `onClose`. Receive `adMeta: { id, type, config }`.
- **Optional dismiss persistence** via a developer-supplied `StorageAdapter`. The package never touches storage on its own.
- **Accessibility**: `role="complementary"` + labelled close button + visible focus rings; respects `prefers-reduced-motion` (no autoplay video, no rotation auto-advance) and `prefers-color-scheme`.
- **SSR-safe**: no `window` / `document` at module top level; matchMedia / IntersectionObserver only touched in effects.
- **Tree-shakeable**: ESM-first, `sideEffects: ["./dist/styles.css", "**/*.css"]`, no top-level imports drag in unused components.
- **Build output**: ESM + CJS + `.d.ts` / `.d.cts` for both `import` and `require`, sourcemaps, `dist/styles.css`. Total tarball ≈ 86 KB packed.
- **MIT licensed** © MUKE JOHNBAPTIST.

### Tests

114 passing across 17 files (Vitest + Testing Library + jsdom): config-merge precedence, dismiss + storage adapter, inView fires once, CTA element switching, theme resolution, banner integration for all 5 components, layout/positioning, size presets, rotation cycling, pause-on-hover.

### Intentionally NOT in v1

No ad server, no hosted dashboard, no third-party demand, no built-in tracking, no A/B engine, no weighted rotation, no non-React framework adapters. See `project-description.md` §6.
