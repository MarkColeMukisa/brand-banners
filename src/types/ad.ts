import type { ThemeMode } from "./theme";

/** Where the ad sits in the page. Phase 3 implements positioning logic. */
export type Position = "top" | "bottom" | "inline" | "corner" | "custom";

/** Named size preset. Phase 3 maps these to dimensions. */
export type SizePreset =
  | "sm"
  | "md"
  | "lg"
  | "leaderboard"
  | "social"
  | "halfpage"
  | "banner"
  | "fullwidth-strip"
  | "card";

/** Optional brand-color palette for `BrandedBanner`. */
export interface BrandColors {
  primary?: string;
  accent?: string;
  bg?: string;
  text?: string;
}

/**
 * Transparent product image used by `BrandedBanner`. Accept a URL string
 * for the simplest case, or an object when you need alt text, intrinsic
 * dimensions (for CLS prevention), or `object-fit`/`object-position` control.
 */
export type ImageInput =
  | string
  | {
      src: string;
      alt?: string;
      /** Intrinsic width in pixels — reserves aspect-ratio space and prevents CLS. */
      width?: number;
      /** Intrinsic height in pixels — pair with `width` to reserve aspect-ratio space. */
      height?: number;
      /** Maps to CSS `object-fit`. Default `"contain"`. */
      fit?: "contain" | "cover" | "scale-down" | "fill" | "none";
      /** Maps to CSS `object-position`. Default `"center"`. */
      position?: "center" | "top" | "bottom" | "left" | "right";
    };

/** Hero media for `MediaBanner` — image, video, GIF, or SVG. */
export interface MediaSpec {
  type: "image" | "video" | "gif" | "svg";
  /** URL for image/video/gif; ignored for inline `svg` strings. */
  src?: string;
  /** Poster shown before video plays / when reduced-motion is requested. */
  poster?: string;
  /** Alt text. Required for non-decorative images. */
  alt?: string;
  /** Video-only options. */
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** Inline SVG markup, used when `type: "svg"` and no `src`. */
  svg?: string;
}

/**
 * Call-to-action shape — anchor when `href` is present, button otherwise.
 * Either way, the handler receives the underlying DOM event.
 */
export interface CTA {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
  target?: "_self" | "_blank" | "_parent" | "_top";
  /** Override the auto-applied `noopener noreferrer` when `target="_blank"`. */
  rel?: string;
  /** Visual variant. `secondary` = outline; default is the lime pill. */
  variant?: "primary" | "secondary";
}

/**
 * Synchronous storage adapter for dismissal persistence. The package never
 * touches storage itself — pass this in if you want dismissals remembered.
 *
 * The shape matches the Web Storage API (`getItem`/`setItem`/`removeItem`),
 * so `window.localStorage`, `window.sessionStorage`, or any object that
 * implements those three methods can be passed directly.
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

/**
 * Metadata about an ad, passed to every callback. Use `id` to identify it
 * in your analytics; `type` distinguishes the component (`"CustomBanner"`,
 * `"BannerAd"`, `"BrandedBanner"`, `"MediaBanner"`).
 */
export interface AdMeta {
  id: string;
  type: string;
  config?: BannerConfig | undefined;
}

export type OnView = (adMeta: AdMeta) => void;
export type OnClick = (adMeta: AdMeta, event: MouseEvent | KeyboardEvent) => void;
export type OnClose = (adMeta: AdMeta) => void;

/**
 * Serializable config shared across components. Every component also accepts
 * these as direct props; **explicit props always override** values in `config`
 * (per project-description.md §9). Function handlers attach in code.
 */
export interface BannerConfig {
  id?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  eyebrow?: string;
  finePrint?: string;
  cta?: CTA;
  media?: MediaSpec;
  /**
   * Transparent product image used by `BrandedBanner`. Distinct from
   * `media` (which is the richer `MediaBanner` shape supporting video/gif/svg).
   * When both are present, `image` wins for BrandedBanner rendering.
   */
  image?: ImageInput;
  position?: Position;
  size?: SizePreset;
  /** Any CSS width value: `"full"`, `"80%"`, `"600px"`, etc. */
  width?: string;
  theme?: ThemeMode;
  dismissible?: boolean;
  /** Visual layout — used by `BrandedBanner` and `MediaBanner`. */
  layout?: "image-left" | "image-right" | "image-bg";
  brandColors?: BrandColors;
  /** Solid color or gradient for `BannerAd`. */
  bg?: string;
  /** Sticky-position behavior for `top`/`bottom`. */
  sticky?: boolean;
  /** Which corner when `position === "corner"`. */
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Edge offset in pixels for corner / custom positioning. */
  offset?: number;
  /** Override the accessible label. Defaults to `"Advertisement"`. */
  ariaLabel?: string;
}
