import type { CSSProperties } from "react";
import type { Position } from "../types/ad";

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface LayoutOptions {
  position?: Position;
  sticky?: boolean;
  corner?: Corner;
  /** Edge offset in pixels for corner / custom positioning. Default 20. */
  offset?: number;
  /** Any CSS width value, e.g. `"full"`, `"80%"`, `"600px"`. */
  width?: string;
}

interface LayoutResult {
  /** Inline style overrides (corner positioning, width). */
  style: CSSProperties;
  /** `data-bb-*` attributes for CSS attribute selectors. */
  dataAttrs: Record<string, string | undefined>;
}

const DEFAULT_CORNER: Corner = "bottom-right";
const DEFAULT_OFFSET = 20;

/**
 * Compute layout styles + data attributes from positioning props.
 *
 * The CSS in `css-source.ts` reads `data-bb-position`, `data-bb-sticky`,
 * and `data-bb-corner` to apply the matching position rules (sticky,
 * fixed, etc.). Corner offsets and `width` are applied inline so consumers
 * can pass any CSS value.
 */
export function computeLayout({
  position,
  sticky,
  corner,
  offset,
  width,
}: LayoutOptions): LayoutResult {
  const style: CSSProperties = {};
  const dataAttrs: Record<string, string | undefined> = {};

  if (position) dataAttrs["data-bb-position"] = position;

  if (sticky && (position === "top" || position === "bottom")) {
    dataAttrs["data-bb-sticky"] = "true";
  }

  if (position === "corner") {
    const c = corner ?? DEFAULT_CORNER;
    const o = `${offset ?? DEFAULT_OFFSET}px`;
    dataAttrs["data-bb-corner"] = c;
    switch (c) {
      case "top-left":
        style.top = o;
        style.left = o;
        break;
      case "top-right":
        style.top = o;
        style.right = o;
        break;
      case "bottom-left":
        style.bottom = o;
        style.left = o;
        break;
      case "bottom-right":
        style.bottom = o;
        style.right = o;
        break;
    }
  }

  if (width) {
    style.width = width === "full" ? "100%" : width;
  }

  return { style, dataAttrs };
}
