import type { StorageAdapter } from "../types/ad";

/** The value every dismissal writes under its key. */
export const DISMISSED_VALUE = "1";

/** Storage key for a slot-wide dismissal: `[storageKey:]bb-dismissed:slot[:id]`. */
export function slotDismissKey(id?: string, storageKey?: string): string {
  return `${storageKey ? `${storageKey}:` : ""}bb-dismissed:slot${id ? `:${id}` : ""}`;
}

export interface IsSlotDismissedOptions {
  /** The slot's `id`, if it has one. */
  id?: string;
  /**
   * The adapter the slot persists to. For `BrandBanners`, any
   * `createExpiringStorage({ days })`: the expiry is stored with the entry.
   * `undefined` (as on the server) always reads as not dismissed.
   */
  storage: StorageAdapter | undefined;
  /** The slot's `storageKey` prefix, if it has one. */
  storageKey?: string;
}

/**
 * Whether a slot's close button has been used, and the stored dismissal is
 * still in force. Reads the same key `AdSlot` / `BrandBanners` write with
 * `dismissScope="slot"`, so a host that gates its own render doesn't have to
 * know the key format.
 *
 * ```ts
 * isSlotDismissed({ storage: createExpiringStorage({ days: 7 }) })
 * ```
 */
export function isSlotDismissed({ id, storage, storageKey }: IsSlotDismissedOptions): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(slotDismissKey(id, storageKey)) === DISMISSED_VALUE;
  } catch {
    return false;
  }
}
