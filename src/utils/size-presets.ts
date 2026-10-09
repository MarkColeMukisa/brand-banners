import type { SizePreset } from "../types/ad";

/**
 * Dimensions for each named ad-size preset. Width × height in pixels, plus a
 * default flex direction (vertical for tall presets like `halfpage`).
 *
 * Sources:
 *  - `leaderboard`: IAB 930×180 (super-leaderboard, the inkwell large size)
 *  - `social`: 1200×628 (Open Graph / LinkedIn share image standard)
 *  - `halfpage`: IAB 300×600 (skyscraper / half-page)
 *  - `banner`: IAB 468×60 (classic banner)
 *  - `fullwidth-strip`: 100% × 72px (sticky promo bar)
 *  - `card`: 520px wide, content height (corner slots, sidebars)
 *  - `sm | md | lg`: content-driven min-heights
 */
export interface SizeMeta {
  width?: string;
  height?: string;
  minHeight?: string;
  flexDirection?: "row" | "column";
  /** Whether the preset implies a fixed corner-radius (e.g. `fullwidth-strip` → 0). */
  borderRadius?: string;
}

export const SIZE_PRESETS: Readonly<Record<SizePreset, SizeMeta>> = {
  sm: { minHeight: "56px" },
  md: { minHeight: "72px" },
  lg: { minHeight: "96px" },
  leaderboard: { width: "930px", height: "180px" },
  social: { width: "1200px", height: "628px", flexDirection: "column" },
  halfpage: { width: "300px", height: "600px", flexDirection: "column" },
  banner: { width: "468px", minHeight: "60px" },
  "fullwidth-strip": {
    width: "100%",
    minHeight: "72px",
    borderRadius: "0",
  },
  card: { width: "520px" },
} as const;

export function getSizeMeta(preset: SizePreset | undefined): SizeMeta | undefined {
  if (!preset) return undefined;
  return SIZE_PRESETS[preset];
}
