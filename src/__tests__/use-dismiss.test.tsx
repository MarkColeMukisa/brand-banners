import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDismiss } from "../hooks/useDismiss";
import type { AdMeta, StorageAdapter } from "../types/ad";

const adMeta: AdMeta = { id: "ad1", type: "Test" };

function makeStorage(): StorageAdapter & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
  };
}

describe("useDismiss", () => {
  it("initializes as not dismissed", () => {
    const { result } = renderHook(() => useDismiss({ adMeta }));
    expect(result.current.dismissed).toBe(false);
  });

  it("dismiss() sets dismissed=true and fires onClose with adMeta", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useDismiss({ adMeta, onClose }));
    act(() => result.current.dismiss());
    expect(result.current.dismissed).toBe(true);
    expect(onClose).toHaveBeenCalledWith(adMeta);
  });

  it("persists dismissal to the storage adapter", () => {
    const storage = makeStorage();
    const { result } = renderHook(() => useDismiss({ adMeta, storage }));
    act(() => result.current.dismiss());
    expect(storage.store.get("bb-dismissed:ad1")).toBe("1");
  });

  it("rehydrates dismissed=true from storage on mount", () => {
    const storage = makeStorage();
    storage.setItem("bb-dismissed:ad1", "1");
    const { result } = renderHook(() => useDismiss({ adMeta, storage }));
    expect(result.current.dismissed).toBe(true);
  });

  it("uses a custom storageKey when provided", () => {
    const storage = makeStorage();
    const { result } = renderHook(() =>
      useDismiss({ adMeta, storage, storageKey: "my-custom-key" }),
    );
    act(() => result.current.dismiss());
    expect(storage.store.get("my-custom-key")).toBe("1");
  });

  it("accepts window.localStorage directly (Web Storage shape)", () => {
    const { result } = renderHook(() => useDismiss({ adMeta, storage: window.localStorage }));
    act(() => result.current.dismiss());
    expect(window.localStorage.getItem("bb-dismissed:ad1")).toBe("1");
    window.localStorage.removeItem("bb-dismissed:ad1");
  });

  it("does nothing when disabled", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useDismiss({ adMeta, onClose, enabled: false }));
    act(() => result.current.dismiss());
    expect(result.current.dismissed).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("swallows storage getItem/setItem errors without crashing", () => {
    const storage: StorageAdapter = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("quota");
      },
    };
    const onClose = vi.fn();
    const { result } = renderHook(() => useDismiss({ adMeta, storage, onClose }));
    expect(result.current.dismissed).toBe(false);
    act(() => result.current.dismiss());
    expect(result.current.dismissed).toBe(true);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
