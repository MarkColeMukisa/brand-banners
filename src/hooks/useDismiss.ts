import { useCallback, useState } from "react";
import type { AdMeta, OnClose, StorageAdapter } from "../types/ad";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

interface UseDismissOptions {
  adMeta: AdMeta;
  /** Optional storage adapter. If provided, dismissals persist across reloads. */
  storage?: StorageAdapter;
  /** Storage key. Defaults to `bb-dismissed:${adMeta.id}`. */
  storageKey?: string;
  onClose?: OnClose;
  /** Whether dismissal is allowed at all. */
  enabled?: boolean;
}

interface UseDismissResult {
  dismissed: boolean;
  dismiss: () => void;
}

const DISMISSED_VALUE = "1";

/**
 * Manage banner dismissal state with optional persistence.
 *
 * Initial render always returns `dismissed: false` to avoid SSR hydration
 * mismatches — the prior-dismissal lookup runs in a layout effect, so a
 * client-rendered app hides an already-dismissed banner before first paint.
 * Server-rendered HTML still contains the banner until hydration; gate the
 * render in the host if that flash matters.
 */
export function useDismiss({
  adMeta,
  storage,
  storageKey,
  onClose,
  enabled = true,
}: UseDismissOptions): UseDismissResult {
  const [dismissed, setDismissed] = useState(false);
  const key = storageKey ?? `bb-dismissed:${adMeta.id}`;

  useIsomorphicLayoutEffect(() => {
    if (!enabled || !storage) return;
    try {
      if (storage.getItem(key) === DISMISSED_VALUE) {
        setDismissed(true);
      }
    } catch {
      /* ignore storage errors (quota, security, etc.) */
    }
  }, [enabled, storage, key]);

  const dismiss = useCallback(() => {
    if (!enabled) return;
    setDismissed(true);
    if (storage) {
      try {
        storage.setItem(key, DISMISSED_VALUE);
      } catch {
        /* ignore storage errors */
      }
    }
    onClose?.(adMeta);
  }, [enabled, storage, key, onClose, adMeta]);

  return { dismissed, dismiss };
}
