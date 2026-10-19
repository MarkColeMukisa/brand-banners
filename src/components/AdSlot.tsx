import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useInjectStyles } from "../hooks/useInjectStyles";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { SlotContext, type SlotContextValue } from "../primitives/slot-context";
import type { AdMeta, BannerConfig, Position, SizePreset, StorageAdapter } from "../types/ad";
import type { ThemeMode } from "../types/theme";
import { cn } from "../utils/cn";
import { DISMISSED_VALUE, slotDismissKey } from "../utils/dismissal";
import { computeLayout, type Corner } from "../utils/layout";
import { isInWindow } from "../utils/schedule";
import { BannerAd } from "./BannerAd";

export interface RotateOptions {
  /** Time between rotations, in milliseconds. */
  interval: number;
  /** Pause auto-advance when the user hovers over the slot. */
  pauseOnHover?: boolean;
  /** Pick the next ad randomly instead of cycling in order. */
  random?: boolean;
}

/**
 * Metadata fired once per full pass through `ads`. `lastAd` is the config
 * that just finished its display window; `nextAd` is the one about to mount.
 * For random rotation, `cycleCount` is not tracked — the callback never fires.
 */
export interface CycleCompleteMeta {
  /** How many full cycles have completed (1-based). */
  cycleCount: number;
  /** The ad that just finished displaying. */
  lastAd: AdMeta;
  /** The ad about to mount. Same as `lastAd` if rotation is paused. */
  nextAd?: AdMeta;
  /** Position context at the moment of cycle completion. */
  position: { corner?: Corner; offset?: number };
}

export interface AdSlotProps {
  /**
   * Stable name for this slot. Part of the dismiss storage key when
   * `dismissScope="slot"`, so give each slot its own when a page has several.
   */
  id?: string;
  /** Single ad configuration. Use this OR `children` OR `ads`. */
  ad?: BannerConfig;
  /** Multiple ads. When `rotate` is set, the slot cycles through them. */
  ads?: readonly BannerConfig[];
  /** Initial index. Default `0`. */
  initial?: number;
  /** Opt-in rotation. Off by default (static = show the first ad). */
  rotate?: RotateOptions;
  /** Position rules — same shape as `CustomBanner` props. */
  position?: Position;
  sticky?: boolean;
  /**
   * A single corner, or an array of corners. When an array is given the
   * slot advances to the next corner after every full pass through `ads`,
   * synced to AdSlot's internal rotation timer (no external `setInterval`
   * needed, no drift possible).
   */
  corner?: Corner | readonly Corner[];
  offset?: number;
  width?: string;
  /**
   * Storage adapter applied to every child ad's dismissal. Per-ad `config`
   * cannot carry a function, so this is the standard way to share one
   * adapter (e.g. `createExpiringStorage({ days: 7 })`) across a rotating
   * slot of self-promo banners. Banners rendered through
   * `children-as-function` inherit it too, unless they pass their own.
   */
  storage?: StorageAdapter;
  /**
   * Optional namespace prefix. When set, each child ad's dismiss key
   * becomes `${storageKey}:bb-dismissed:${ad.id}` — useful when one app
   * has multiple slots writing to the same `localStorage`.
   */
  storageKey?: string;
  /**
   * Slot-level default for `dismissible`. Each ad's `config.dismissible`
   * still wins per-ad — so you can set `dismissible` once on the slot and
   * mark a specific ad `dismissible: false` to make it permanent.
   */
  dismissible?: boolean;
  /**
   * What the close button dismisses.
   * - `"ad"` *(default)*: only the ad on screen. The slot moves straight on
   *   to the next ad and skips the dismissed one from then on.
   * - `"slot"`: the whole slot. Nothing shows again until the stored
   *   dismissal expires (or ever, depending on `storage`).
   */
  dismissScope?: "ad" | "slot";
  /**
   * What the server renders.
   * - `"defer"` *(default)*: nothing. The slot appears on the client once
   *   its stored dismissals have been read, so a banner the visitor closed is
   *   never painted, not even for a frame. Server and first client render
   *   agree (both empty), so there is no hydration mismatch.
   * - `"render"`: the first ad, in the server HTML. A dismissed slot then
   *   shows until hydration hides it, and `startsAt` / `endsAt` only apply
   *   after hydration.
   */
  ssr?: "defer" | "render";
  /**
   * Milliseconds to wait, once the slot could show, before it does. With
   * `showOnScroll`, whichever comes first. Unset with `showOnScroll` unset:
   * shows at once.
   */
  showAfter?: number;
  /**
   * Show once this fraction (0–1) of the page has been scrolled. A page too
   * short to scroll counts as read. With `showAfter`, whichever comes first.
   */
  showOnScroll?: number;
  /**
   * Slot-level default for `layout`. Cascades into every child ad's config
   * unless the ad sets its own. Useful when one rotating slot of
   * `BrandedBanner` ads should all use the same layout (e.g. `"image-right"`).
   */
  layout?: "image-left" | "image-right" | "image-bg";
  /** Slot-level default for `size`. Per-ad `config.size` still wins. */
  size?: SizePreset;
  /** Slot-level default for `theme`. Per-ad `config.theme` still wins. */
  theme?: ThemeMode;
  /**
   * Fires once each time rotation wraps from the last ad back to the first.
   * Useful for analytics ("how many cycles did this reader see?") or for
   * mirroring AdSlot's cycle tick in your own UI without a racing
   * `setInterval`. Not fired for random rotation (no defined cycle).
   */
  onCycleComplete?: (meta: CycleCompleteMeta) => void;
  className?: string;
  style?: CSSProperties;
  /**
   * Either:
   *  - A render function `(config, index) => ReactNode` used when `ads` is given.
   *    Receives a config already merged with the slot's cascaded defaults
   *    (`dismissible`, `width`, `layout`, `size`, `theme`).
   *  - A single banner element (`<BannerAd …/>`) when neither `ad` nor `ads` is set.
   */
  children?: ReactNode | ((config: BannerConfig, index: number) => ReactNode);
}

const NONE_HIDDEN: ReadonlySet<string> = new Set();

/** The ad's own `id`, or a positional fallback so id-less ads still get a stable key. */
function adIdentityOf(config: BannerConfig, index: number): string {
  return config.id ?? `idx-${index}`;
}

function buildAdMeta(config: BannerConfig, fallbackIndex: number): AdMeta {
  return {
    id: adIdentityOf(config, fallbackIndex),
    type: "Ad",
    config,
  };
}

/** First ad at or after `from` (wrapping) that isn't hidden; `-1` if none. */
function firstVisibleIndex(
  list: readonly BannerConfig[],
  hidden: ReadonlySet<string>,
  from: number,
): number {
  for (let step = 0; step < list.length; step++) {
    const i = (from + step) % list.length;
    if (!hidden.has(adIdentityOf(list[i]!, i))) return i;
  }
  return -1;
}

/** Cascade slot-level defaults into the active config. Per-ad config always wins. */
function cascadeIntoConfig(
  activeConfig: BannerConfig,
  cascade: {
    dismissible?: boolean;
    width?: string;
    layout?: "image-left" | "image-right" | "image-bg";
    size?: SizePreset;
    theme?: ThemeMode;
  },
): BannerConfig {
  const patch: Partial<BannerConfig> = {};
  if (cascade.dismissible !== undefined && activeConfig.dismissible === undefined)
    patch.dismissible = cascade.dismissible;
  if (cascade.width !== undefined && activeConfig.width === undefined) patch.width = cascade.width;
  if (cascade.layout !== undefined && activeConfig.layout === undefined)
    patch.layout = cascade.layout;
  if (cascade.size !== undefined && activeConfig.size === undefined) patch.size = cascade.size;
  if (cascade.theme !== undefined && activeConfig.theme === undefined) patch.theme = cascade.theme;
  return Object.keys(patch).length === 0 ? activeConfig : { ...activeConfig, ...patch };
}

export function AdSlot(props: AdSlotProps) {
  const {
    id,
    ad,
    ads,
    initial = 0,
    rotate,
    position,
    sticky,
    corner,
    offset,
    width,
    storage,
    storageKey,
    dismissible,
    dismissScope = "ad",
    ssr = "defer",
    showAfter,
    showOnScroll,
    layout,
    size,
    theme,
    onCycleComplete,
    className,
    style,
    children,
  } = props;

  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(initial);
  const [cycleCount, setCycleCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(NONE_HIDDEN);
  const [slotDismissed, setSlotDismissed] = useState(false);
  // When the slot mounted on the client. `undefined` on the server and on
  // the first client render, which is what keeps them in agreement.
  const [mountedAt, setMountedAt] = useState<number | undefined>(undefined);
  const [triggered, setTriggered] = useState(showAfter === undefined && showOnScroll === undefined);

  // Refs avoid stale closures inside the rotation `setInterval` AND keep the
  // effect from re-running every time a callback identity changes. Side
  // effects live outside the `setIndex` updater so React Strict Mode's
  // double-invoke of updaters can't fire the callback twice per tick.
  const onCycleCompleteRef = useRef(onCycleComplete);
  const cycleCountRef = useRef(0);
  const indexRef = useRef(initial);
  const hiddenIdsRef = useRef(NONE_HIDDEN);
  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete;
  });

  useInjectStyles();

  const list = useMemo(() => ads ?? (ad ? [ad] : undefined), [ads, ad]);

  const keyPrefix = storageKey ? `${storageKey}:` : "";
  const slotStorageKey = slotDismissKey(id, storageKey);

  // Pick up dismissals remembered from earlier visits. A layout effect, so a
  // client-rendered app never paints an ad the visitor already closed.
  useIsomorphicLayoutEffect(() => {
    if (!storage || !list) return;
    try {
      if (dismissScope === "slot") {
        if (storage.getItem(slotStorageKey) === DISMISSED_VALUE) setSlotDismissed(true);
        return;
      }
      const stored: string[] = [];
      list.forEach((config, i) => {
        if (!(config.dismissible ?? dismissible)) return;
        const adId = adIdentityOf(config, i);
        if (storage.getItem(`${keyPrefix}bb-dismissed:${adId}`) === DISMISSED_VALUE) {
          stored.push(adId);
        }
      });
      // Returning `prev` when nothing is new keeps an inline `ads`/`storage`
      // prop (new identity every render) from looping.
      setDismissedIds((prev) =>
        stored.every((adId) => prev.has(adId)) ? prev : new Set([...prev, ...stored]),
      );
    } catch {
      /* ignore storage errors (quota, security, etc.) */
    }
  }, [storage, list, dismissScope, dismissible, slotStorageKey, keyPrefix]);

  // Runs in the same commit as the storage read above, so with `ssr="defer"`
  // the first frame the slot can paint already knows what was dismissed.
  useIsomorphicLayoutEffect(() => {
    setMountedAt((prev) => prev ?? Date.now());
  }, []);
  const settled = ssr === "render" || mountedAt !== undefined;

  // Dismissed ads and ads outside their `startsAt` / `endsAt` window both
  // drop out of the rotation. Skipping them, rather than filtering `list`,
  // keeps the positional keys of id-less ads stable.
  const hiddenIds = useMemo(() => {
    if (!list || mountedAt === undefined) return dismissedIds;
    const outOfWindow: string[] = [];
    list.forEach((config, i) => {
      if (!isInWindow(config, mountedAt)) outOfWindow.push(adIdentityOf(config, i));
    });
    return outOfWindow.length === 0 ? dismissedIds : new Set([...dismissedIds, ...outOfWindow]);
  }, [list, mountedAt, dismissedIds]);

  // The ad actually on screen: `index`, or the next one along if that ad
  // is hidden. `-1` once every ad is gone.
  const activeIndex =
    list && list.length > 0
      ? firstVisibleIndex(list, hiddenIds, Math.min(index, list.length - 1))
      : -1;
  useEffect(() => {
    indexRef.current = activeIndex >= 0 ? activeIndex : index;
    hiddenIdsRef.current = hiddenIds;
  });

  // Nothing to show, so no `showAfter` / `showOnScroll` trigger is started.
  const blocked = slotDismissed || (list !== undefined && list.length > 0 && activeIndex < 0);

  useEffect(() => {
    if (triggered || !settled || blocked) return;
    const show = () => setTriggered(true);
    const cleanups: (() => void)[] = [];
    if (showAfter !== undefined) {
      const timer = setTimeout(show, showAfter);
      cleanups.push(() => clearTimeout(timer));
    }
    if (showOnScroll !== undefined) {
      const check = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable <= 0 || window.scrollY / scrollable >= showOnScroll) show();
      };
      check();
      window.addEventListener("scroll", check, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", check));
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [triggered, settled, blocked, showAfter, showOnScroll]);

  const visible = settled && triggered;

  // Resolve corner: array form advances with cycleCount; single value passes through.
  const cornerArray = useMemo<readonly Corner[] | undefined>(
    () => (Array.isArray(corner) ? (corner as readonly Corner[]) : undefined),
    [corner],
  );
  const resolvedCorner: Corner | undefined = cornerArray
    ? (cornerArray[cycleCount % cornerArray.length] ?? cornerArray[0])
    : (corner as Corner | undefined);

  // Snapshot the resolved position info into a ref so the cycle-complete
  // callback always reports the corner that was active at the wrap moment.
  const positionRef = useRef({ corner: resolvedCorner, offset });
  useEffect(() => {
    positionRef.current = { corner: resolvedCorner, offset };
  });

  useEffect(() => {
    if (!visible || !list || !rotate || list.length <= 1) return;
    if (reducedMotion) return;
    if (rotate.pauseOnHover && isHovering) return;

    const timer = setInterval(() => {
      const i = indexRef.current;
      // Hidden ads drop out of the rotation.
      const others: number[] = [];
      list.forEach((config, n) => {
        if (n !== i && !hiddenIdsRef.current.has(adIdentityOf(config, n))) others.push(n);
      });
      if (others.length === 0) return;

      if (rotate.random) {
        // Random rotation has no defined cycle — onCycleComplete is intentionally
        // not fired and corner arrays don't advance.
        const next = others[Math.floor(Math.random() * others.length)]!;
        indexRef.current = next;
        setIndex(next);
        return;
      }

      const next = others.find((n) => n > i) ?? others[0]!;
      indexRef.current = next;
      setIndex(next);

      if (next < i) {
        cycleCountRef.current += 1;
        const newCount = cycleCountRef.current;
        setCycleCount(newCount);
        const meta: CycleCompleteMeta = {
          cycleCount: newCount,
          lastAd: buildAdMeta(list[i]!, i),
          nextAd: buildAdMeta(list[next]!, next),
          position: positionRef.current,
        };
        onCycleCompleteRef.current?.(meta);
      }
    }, rotate.interval);
    return () => clearInterval(timer);
  }, [visible, list, rotate, reducedMotion, isHovering]);

  const activeConfig = list && activeIndex >= 0 ? list[activeIndex] : undefined;
  const activeIdentity = activeConfig ? adIdentityOf(activeConfig, activeIndex) : undefined;
  const handleDismiss = useCallback(() => {
    if (dismissScope === "slot") {
      setSlotDismissed(true);
    } else if (activeIdentity !== undefined) {
      setDismissedIds((prev) => new Set(prev).add(activeIdentity));
    }
  }, [dismissScope, activeIdentity]);

  const layoutStyles = computeLayout({
    position,
    sticky,
    corner: resolvedCorner,
    offset,
    width,
  });

  // Deferred until mount, or waiting on `showAfter` / `showOnScroll`.
  if (!visible) return null;

  let content: ReactNode = null;
  if (list && list.length > 0) {
    // The whole slot was dismissed, or every ad in it was: render nothing,
    // not an empty positioned wrapper.
    if (slotDismissed || !activeConfig || activeIdentity === undefined) return null;

    const mergedConfig = cascadeIntoConfig(activeConfig, {
      dismissible,
      width,
      layout,
      size,
      theme,
    });

    // One key per ad, or one shared key when the slot dismisses as a whole.
    const resolvedStorageKey =
      dismissScope === "slot" ? slotStorageKey : `${keyPrefix}bb-dismissed:${activeIdentity}`;

    const inner =
      typeof children === "function" ? (
        children(mergedConfig, activeIndex)
      ) : (
        <BannerAd config={mergedConfig} storage={storage} storageKey={resolvedStorageKey} />
      );

    // Provide storage + the resolved storageKey to any descendant
    // `CustomBanner` so children-as-function renderers don't have to
    // re-thread these props on the inner banner. Per-banner props win.
    const slotValue: SlotContextValue = {
      storage,
      storageKey: resolvedStorageKey,
      onDismiss: handleDismiss,
    };
    // Keyed by ad so each one mounts fresh: its own dismissed state and its
    // own `onView` impression, instead of inheriting the previous ad's.
    content = (
      <SlotContext.Provider key={activeIdentity} value={slotValue}>
        {inner}
      </SlotContext.Provider>
    );
  } else if (children && typeof children !== "function") {
    const onlyChild = Children.only(children);
    if (isValidElement(onlyChild)) {
      content = onlyChild;
    } else {
      content = onlyChild;
    }
  }

  const handlers = rotate?.pauseOnHover
    ? {
        onMouseEnter: () => setIsHovering(true),
        onMouseLeave: () => setIsHovering(false),
        onFocus: () => setIsHovering(true),
        onBlur: () => setIsHovering(false),
      }
    : {};

  return (
    <div
      className={cn("bb-root", "bb-ad-slot", className)}
      style={{ ...layoutStyles.style, ...style }}
      data-bb-rotating={list && rotate ? "true" : undefined}
      {...layoutStyles.dataAttrs}
      {...handlers}
    >
      {content}
    </div>
  );
}
AdSlot.displayName = "AdSlot";

/** Alias — `BannerRotator` is sometimes a clearer name when rotation is the point. */
export const BannerRotator = AdSlot;
