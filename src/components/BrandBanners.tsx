import { useMemo, type CSSProperties } from "react";
import type { BannerConfig, OnClick, OnClose, OnView, Position } from "../types/ad";
import type { ThemeMode } from "../types/theme";
import type { Corner } from "../utils/layout";
import { createExpiringStorage } from "../utils/storage";
import { AdSlot } from "./AdSlot";
import { BrandedBanner } from "./BrandedBanner";

const DEFAULT_INTERVAL_MS = 10_000;
const DEFAULT_DISMISS_DAYS = 7;
const DEFAULT_OFFSET = 24;
const DEFAULT_CORNERS: readonly Corner[] = ["bottom-right", "bottom-left"];

export interface BrandBannersProps {
  /**
   * Your promo lineup — courses, products, brands. Each entry is a plain
   * `BannerConfig` (`title`, `subtitle`, `eyebrow`, `cta`, `image`,
   * `brandColors`), so it can live in code, a JSON file or a CMS.
   */
  ads: readonly BannerConfig[];
  /** Name for this slot. Set it when a page mounts more than one. */
  id?: string;
  /** Milliseconds each ad stays up. `0` shows the first ad only. Default `10000`. */
  interval?: number;
  /**
   * How long closing the banner hides it, in days. `0` hides it for the
   * current page view only; `false` removes the close button. Default `7`.
   */
  dismissDays?: number | false;
  /** Where the slot sits. Default `"corner"` (a floating card). */
  position?: Position;
  /**
   * Corner to dock to, or several to move between: the slot steps to the
   * next one after each full pass through `ads`. Default alternates
   * bottom-right and bottom-left.
   */
  corner?: Corner | readonly Corner[];
  /** Gap from the viewport edges, in pixels. Default `24`. */
  offset?: number;
  /** Any CSS width. Default: 520px, shrinking to fit small screens. */
  width?: string;
  /** Which side the artwork sits on. Default `"image-right"`. */
  layout?: "image-left" | "image-right" | "image-bg";
  /** Theme for every ad. Falls back to `ThemeProvider`, then `"system"`. */
  theme?: ThemeMode;
  /** Fires each time an ad becomes at least half visible. */
  onView?: OnView;
  /** Fires when an ad's call-to-action is activated. */
  onClick?: OnClick;
  /** Fires when the visitor closes the banner. */
  onClose?: OnClose;
  className?: string;
  style?: CSSProperties;
}

/**
 * The whole integration in one component: a rotating, dismissible promo card
 * for your own products. Mount it once near the root of the app.
 *
 * ```tsx
 * <BrandBanners ads={ADS} />
 * ```
 *
 * Built from `AdSlot` + `BrandedBanner`; reach for those directly when you
 * need a layout this doesn't cover.
 */
export function BrandBanners(props: BrandBannersProps) {
  const {
    ads,
    id,
    interval = DEFAULT_INTERVAL_MS,
    dismissDays = DEFAULT_DISMISS_DAYS,
    position = "corner",
    corner = DEFAULT_CORNERS,
    offset = DEFAULT_OFFSET,
    width,
    layout = "image-right",
    theme,
    onView,
    onClick,
    onClose,
    className,
    style,
  } = props;

  // `undefined` on the server and for 0 days, which leaves the dismissal in
  // memory only: gone for this page view, back on the next.
  const storage = useMemo(
    () => (dismissDays ? createExpiringStorage({ days: dismissDays }) : undefined),
    [dismissDays],
  );

  // Stable identity, so re-renders of the host don't restart the timer.
  const rotate = useMemo(
    () => (interval > 0 ? { interval, pauseOnHover: true } : undefined),
    [interval],
  );

  const resolvedWidth =
    width ?? (position === "corner" ? `min(520px, calc(100vw - ${offset * 2}px))` : undefined);

  return (
    <AdSlot
      id={id}
      ads={ads}
      rotate={rotate}
      position={position}
      corner={corner}
      offset={offset}
      width={resolvedWidth}
      storage={storage}
      dismissible={dismissDays !== false}
      dismissScope="slot"
      layout={layout}
      size="card"
      theme={theme}
      className={className}
      style={style}
    >
      {(config) => (
        <BrandedBanner config={config} onView={onView} onClick={onClick} onClose={onClose} />
      )}
    </AdSlot>
  );
}
BrandBanners.displayName = "BrandBanners";
