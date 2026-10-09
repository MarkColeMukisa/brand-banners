import { createContext, useContext } from "react";
import type { AdMeta, StorageAdapter } from "../types/ad";

/**
 * Slot-level cascade carrier for values that can't ride along inside a
 * serializable `BannerConfig` (like the `storage` adapter function). Any
 * `CustomBanner` rendered as a descendant of an `<AdSlot>` reads from
 * this context as a fallback when its own `storage`/`storageKey` prop is
 * undefined — so children-as-function consumers like
 * `<AdSlot storage={s}>{(c) => <BrandedBanner config={c} />}</AdSlot>`
 * inherit the slot's adapter without re-stating it on every banner.
 *
 * Per-banner props always win when set.
 */
export interface SlotContextValue {
  storage?: StorageAdapter;
  /**
   * Pre-resolved storage key (already includes the slot's prefix): one key
   * per ad, or one key shared by every ad when the slot dismisses as a whole.
   */
  storageKey?: string;
  /** Tells the slot a banner inside it was dismissed, so it can react. */
  onDismiss?: (adMeta: AdMeta) => void;
}

export const SlotContext = createContext<SlotContextValue | null>(null);

/** Read the slot context if present, `null` otherwise (banner used standalone). */
export function useSlotContext(): SlotContextValue | null {
  return useContext(SlotContext);
}
