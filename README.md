# brand-banners

> Promo banners for your own courses, products and brands. One React component, no ad network, no tracking.

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![types: TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](#typescript)

`brand-banners` puts a rotating promo card in the corner of your site: a course you sell, a product you built, a brand you want people to visit. You pass it an array of ads and mount it once. It rotates them, lets visitors close it, remembers that for a week, and looks the same on any page it is dropped into.

It is a fork of [beautiful-banner-ads](https://github.com/MUKE-coder/beautiful-banner-ads) by MUKE JOHNBAPTIST, reworked so that integrating it takes one component and no CSS. See [Credits](#credits).

---

## Install

```bash
npm install brand-banners
```

Needs `react` and `react-dom` 18 or newer (19 supported). No other dependencies.

## Quickstart

```tsx
import { BrandBanners, type BannerConfig } from "brand-banners";

const ADS: BannerConfig[] = [
  {
    id: "course-nextjs",
    eyebrow: "LEARN",
    title: "Master Next.js, project by project",
    subtitle: "Practical courses for shipping real apps.",
    cta: { label: "Start learning", href: "https://example.com/course" },
    image: { src: "/promos/course.png", alt: "" },
    brandColors: { bg: "#27272A", primary: "#000000", accent: "#38BDF8", text: "#FAFAFA" },
  },
  {
    id: "brand-payments",
    eyebrow: "PAYMENTS",
    title: "Accept Mobile Money in your app",
    subtitle: "One API for MoMo, Airtel and cards.",
    cta: { label: "Try it", href: "https://example.com/pay" },
    image: { src: "/promos/payments.png", alt: "" },
    brandColors: { bg: "#7C3AED", primary: "#4C1D95", accent: "#C4B5FD", text: "#F5F3FF" },
  },
];

export function Promos() {
  return <BrandBanners ads={ADS} />;
}
```

Mount `<Promos />` once, near the root of the app. That is the whole integration. The stylesheet is injected automatically when the first banner mounts.

With no other props you get:

- a 520px card docked bottom-right, shrinking to fit phones;
- a new ad every 10 seconds, paused while the pointer or keyboard focus is on it;
- the card moving to the opposite bottom corner after each full pass;
- a close button that hides the whole slot for 7 days;
- no rotation for visitors who ask for reduced motion.

### Where to mount it

| Stack | Where |
| --- | --- |
| **Vite / CRA** | In `App`, next to your routes. |
| **Next.js App Router** | In `app/layout.tsx`, inside `<body>` after `{children}`. The package is already marked `"use client"`, so it can be imported from a server component. Keep the `ADS` array in the same file or a plain data module. |
| **Next.js Pages Router** | In `pages/_app.tsx`. |
| **Remix / React Router** | In the root route component. |

Callbacks (`onView`, `onClick`, `onClose`) are functions, so in the App Router put the component that passes them in a file that starts with `"use client"`.

To avoid a flash of unstyled banner in server-rendered apps, import the stylesheet once in your root layout:

```tsx
import "brand-banners/styles.css";
```

On a server-rendered page the card is not in the HTML. It appears on the client once the stored dismissal has been read, so a card the visitor closed never flashes on load. `ssr="render"` puts the first ad in the server HTML instead, at the cost of that flash.

### `BrandBanners` props

| Prop | Default | What it does |
| --- | --- | --- |
| `ads` | required | Your lineup. Each entry is a [`BannerConfig`](#an-ad). |
| `interval` | `10000` | Milliseconds per ad. `0` shows the first ad only. |
| `dismissDays` | `7` | Days closing the card hides it. `0` hides it for this page view only; `false` removes the close button. |
| `corner` | `["bottom-right", "bottom-left"]` | One corner, or several to step through after each full pass. |
| `offset` | `24` | Gap from the viewport edges, in pixels. |
| `width` | `min(520px, 100vw − 2 × offset)` | Any CSS width. |
| `layout` | `"image-right"` | `"image-left"`, `"image-right"` or `"image-bg"`. |
| `position` | `"corner"` | `"inline"` renders the card in the page flow, for a sidebar. |
| `id` | none | Names the slot. Set it if a page mounts more than one, so their dismissals stay separate. |
| `theme` | `"system"` | `"light"`, `"dark"` or `"system"`. |
| `showAfter` | none | Milliseconds to wait before the card appears. See [When it shows](#when-it-shows). |
| `showOnScroll` | none | Show once this fraction (0–1) of the page has been scrolled. |
| `ssr` | `"defer"` | `"defer"` keeps the card out of the server HTML; `"render"` includes the first ad. |
| `onView`, `onClick`, `onClose` | none | [Analytics callbacks](#analytics). |
| `className`, `style` | none | Applied to the slot wrapper. |

### When it shows

```tsx
<BrandBanners
  ads={ADS}
  showAfter={12_000}   // 12 s after the page loads…
  showOnScroll={0.35}  // …or once 35% of it is read, whichever comes first
/>
```

- With neither set, the card shows as soon as the page has loaded.
- A page too short to scroll counts as read for `showOnScroll`.
- A closed card starts neither, and rotation starts when the card appears.
- Reduced motion doesn't change the timing.

To keep the card off some pages, don't render it there. In the Next.js App Router:

```tsx
"use client";
import { usePathname } from "next/navigation";

const QUIET_ON = ["/start-project", "/checkout"];

export function Promos() {
  const pathname = usePathname();
  if (QUIET_ON.some((page) => pathname.startsWith(page))) return null;
  return <BrandBanners ads={ADS} />;
}
```

### An ad

```ts
interface BannerConfig {
  id?: string;          // stable name; used in analytics callbacks
  eyebrow?: string;     // small label above the title
  title?: string;
  subtitle?: string;
  finePrint?: string;
  cta?: { label: string; href?: string; target?: "_blank" | "_self"; variant?: "primary" | "secondary" };
  image?: string | { src: string; alt?: string; width?: number; height?: number; fit?: "contain" | "cover" };
  brandColors?: { bg?: string; primary?: string; accent?: string; text?: string };
  startsAt?: string;    // ISO date or date-time; left out of the rotation before it
  endsAt?: string;      // left out after it
}
```

It is plain data, so the lineup can come from a JSON file or a CMS.

`startsAt` and `endsAt` take an ad out of the rotation outside its window, for an intake or a sale that should end by itself. A date alone (`"2026-11-30"`) means the start or the end of that day in the visitor's time zone. The window is checked in the browser when the card mounts, so the server's clock doesn't matter. With no ad in its window, nothing is shown. Transparent square images (PNG or SVG) look best. `brandColors.bg` to `primary` makes the background gradient, `accent` colours the CTA and eyebrow, and `text` colours the copy.

---

## Building your own placement

`BrandBanners` is a preset over the lower-level components. Use them directly for anything else:

| Component | Use it for |
| --- | --- |
| `BannerAd` | A full-width strip: announcement bar, sticky footer promo. |
| `BrandedBanner` | One branded ad with a product image, in any size preset. |
| `MediaBanner` | A banner led by a video, GIF, image or inline SVG. |
| `CustomBanner` | A headless shell with slots (`.Media`, `.Body`, `.Title`, `.CTA`, `.Close`, …) for your own creative. |
| `AdSlot` | Placement and rotation for any of the above. `BrandBanners` is an `AdSlot` of `BrandedBanner`s. |

```tsx
// Sticky announcement strip
<BannerAd
  id="launch"
  title="The spring cohort opens Monday"
  cta={{ label: "Join the waitlist", href: "/waitlist" }}
  bg="brand"
  position="top"
  sticky
  dismissible
  storage={createExpiringStorage({ days: 3 })}
/>

// A rotating slot you compose yourself
<AdSlot ads={ADS} rotate={{ interval: 8000, pauseOnHover: true }} dismissible dismissScope="ad" size="card">
  {(config) => (config.media ? <MediaBanner config={config} /> : <BrandedBanner config={config} />)}
</AdSlot>
```

Every banner accepts `position` (`"top"`, `"bottom"`, `"inline"`, `"corner"`), `sticky`, `corner`, `offset`, `width`, `theme`, `dismissible`, `storage`, the three callbacks, and a serialisable `config` object whose values explicit props override.

### Size presets

| `size` | Dimensions |
| --- | --- |
| `card` | 520px wide, height follows the content. CTA under the text, optional square image beside it. For corners and sidebars. |
| `sm` / `md` / `lg` | Content width, minimum height 56 / 72 / 96px. |
| `leaderboard` | 930 × 180 |
| `banner` | 468 × 60 |
| `halfpage` | 300 × 600 |
| `social` | 1200 × 628 |
| `fullwidth-strip` | 100% wide, minimum 72px, square corners. |

`BrandedBanner` defaults to `leaderboard`, which has a fixed height. At narrow widths use `card`, which never clips.

---

## Dismissal

Banners only show a close button when `dismissible` is set (`BrandBanners` sets it for you).

Persistence is a storage adapter you pass in; the package never writes to storage on its own:

```ts
createExpiringStorage({ days: 7 })  // comes back after 7 days
createSessionStorage()              // comes back in a new tab
createForeverStorage()              // never comes back
window.localStorage                 // any object with getItem / setItem works
```

All three helpers return `undefined` on the server, so they are safe to call during render.

In an `AdSlot`, `dismissScope` decides what the close button means:

- `"ad"` (default): only the ad on screen. The slot moves straight to the next ad and leaves the dismissed one out of the rotation. When every ad has been dismissed the slot renders nothing.
- `"slot"`: the whole slot, whichever ad was showing. This is what `BrandBanners` uses.

Storage keys are `bb-dismissed:<ad id>` per ad and `bb-dismissed:slot[:<slot id>]` per slot. `storageKey` on an `AdSlot` adds a prefix.

To ask whether a slot has been closed, without depending on the key format:

```ts
import { createExpiringStorage, isSlotDismissed } from "brand-banners";

isSlotDismissed({ storage: createExpiringStorage({ days: 7 }) });     // BrandBanners
isSlotDismissed({ id: "promos", storage, storageKey: "site" });      // an AdSlot with id + storageKey
```

It returns `false` when `storage` is `undefined`, as it is on the server, so call it after mount.

## Analytics

Callbacks only. Nothing is sent anywhere unless you send it.

```tsx
<BrandBanners
  ads={ADS}
  onView={({ id }) => track("promo_view", { id })}
  onClick={({ id }) => track("promo_click", { id })}
  onClose={({ id }) => track("promo_dismiss", { id })}
/>
```

- `onView` fires when an ad is at least half visible, once each time that ad is shown. In a rotating slot that means once per ad per pass.
- `onClick` fires when the CTA is activated by mouse or keyboard.
- `onClose` fires when the visitor closes the banner.

Each receives `{ id, type, config }`.

## Theming and restyling

Banners follow the visitor's light or dark preference by default. Set `theme` on a banner, or wrap a subtree:

```tsx
<ThemeProvider mode="dark">…</ThemeProvider>
```

For a branded ad, `brandColors` is usually all you need. Beyond that, every value is a CSS custom property on `.bb-root`, so restyle with ordinary CSS:

```css
.bb-root {
  --bb-accent-500: #ff5c00;   /* CTA colour */
  --bb-radius-lg: 12px;
  --bb-font-heading: "Clash Display", sans-serif;
}

/* A specific part */
.my-promos .bb-banner__title { letter-spacing: 0; }
```

### How the styles coexist with yours

The package's rules are strong enough that a host page's `h2 { … }`, `a { … }`, `button { … }` or `.content h2 { … }` cannot repaint a banner, and weak enough that the two patterns above always win. Two consequences:

- A `className` on a banner overrides the banner's own box (background, padding, radius), but not the title, CTA or other parts inside it. Use a descendant selector or a token for those.
- In Tailwind v4, utilities live in a cascade layer and lose to any unlayered stylesheet, including this one. Add the important modifier (`rounded-none!`) or use the tokens.

A Tailwind v3-style preset is included for using the tokens as utilities (`bg-bb-surface`, `text-bb-on-brand`, `rounded-bb-lg`):

```ts
import bbPreset from "brand-banners/tailwind-preset";
export default { presets: [bbPreset] };
```

## Accessibility

- Each banner is a `complementary` landmark labelled "Advertisement" (`ariaLabel` changes it).
- The close button is a real, labelled `<button>`; the CTA is an `<a>` when it has an `href` and a `<button>` otherwise. Both have visible focus rings and a 40px minimum target.
- `target="_blank"` links get `rel="noopener noreferrer"`.
- With `prefers-reduced-motion`, rotation stops, transitions are removed and videos show their poster instead of autoplaying.

## Security note

`MediaBanner` with `media: { type: "svg", svg: "<svg…>" }` injects that markup as HTML. Only pass SVG you wrote or trust; for anything from a CMS or user input, use `src` instead.

## TypeScript

All types are exported from the package root: `BannerConfig`, `BrandBannersProps`, `AdSlotProps`, `CTA`, `BrandColors`, `ImageInput`, `MediaSpec`, `StorageAdapter`, `AdMeta`, `OnView`, `OnClick`, `OnClose`, `SizePreset`, `Position`, `ThemeMode`.

---

## Coming from beautiful-banner-ads

The component API is a superset, so imports keep working after renaming the package. What changed:

| | beautiful-banner-ads 0.4 | brand-banners |
| --- | --- | --- |
| CSS prefix | `bba-` (`.bba-root`, `--bba-*`, `data-bba-*`) | `bb-` |
| Storage keys | `bba-dismissed:<id>` | `bb-dismissed:<id>` (earlier dismissals are not carried over) |
| Tailwind utilities | `bg-bba-*` | `bg-bb-*` |
| Corner card | CSS overrides on the leaderboard preset | `size="card"`, or just `<BrandBanners>` |
| Closing a rotating slot | Hid the slot until reload, then showed it again until rotation reached the closed ad | `dismissScope`: `"ad"` skips that ad, `"slot"` hides everything |
| `onView` in a rotating slot | Fired for the first ad only | Fires for each ad shown |
| Close button on dark banners | Page text colour, often invisible | Inherits the banner's text colour |
| `layout="image-right"` | Reversed the whole row (CTA and close button far left) | Text, CTA, image, close button |
| Host page styles | Any `h2`/`a`/`button` rule restyled the banner | Banner keeps its look |

If you wrote CSS overrides against `.bba-*` class names, you can most likely delete them.

## Development

```bash
npm install
npm test            # vitest
npm run typecheck
npm run lint
npm run build       # dist/ (ESM, CJS, types, styles.css)

cd examples/playground && npm install && npm run dev
# http://localhost:5173/              every component
# http://localhost:5173/?demo=corner  the BrandBanners drop-in on a page with hostile host CSS
```

## Credits

`brand-banners` builds on [beautiful-banner-ads](https://github.com/MUKE-coder/beautiful-banner-ads) by **MUKE JOHNBAPTIST**, who designed the components, the token system and the original implementation. This fork is maintained by **Mark Cole MUKISA**.

## License

[MIT](./LICENSE) © MUKE JOHNBAPTIST, Mark Cole MUKISA
