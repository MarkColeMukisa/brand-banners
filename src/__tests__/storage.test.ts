import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createExpiringStorage,
  createForeverStorage,
  createSessionStorage,
} from "../utils/storage";
import type { StorageAdapter } from "../types/ad";

function makeBacking(): StorageAdapter & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => {
      store.set(k, v);
    },
    removeItem: (k) => {
      store.delete(k);
    },
  };
}

describe("createExpiringStorage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-05T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stores and retrieves a value before expiry", () => {
    const backing = makeBacking();
    const store = createExpiringStorage({ days: 7, backing })!;
    store.setItem("bb-dismissed:ad1", "1");
    expect(store.getItem("bb-dismissed:ad1")).toBe("1");
  });

  it("returns null after the TTL elapses, and cleans up the underlying entry", () => {
    const backing = makeBacking();
    const store = createExpiringStorage({ days: 1, backing })!;
    store.setItem("k", "v");
    vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 1);
    expect(store.getItem("k")).toBeNull();
    expect(backing.store.has("k")).toBe(false);
  });

  it("survives legacy plain-string values without crashing", () => {
    const backing = makeBacking();
    backing.setItem("bb-dismissed:legacy", "1");
    const store = createExpiringStorage({ days: 7, backing })!;
    expect(store.getItem("bb-dismissed:legacy")).toBe("1");
  });

  it("namespaces keys when configured", () => {
    const backing = makeBacking();
    const store = createExpiringStorage({ days: 7, backing, namespace: "site-promo" })!;
    store.setItem("ad1", "1");
    expect(backing.store.has("site-promo:ad1")).toBe(true);
    expect(backing.store.has("ad1")).toBe(false);
    expect(store.getItem("ad1")).toBe("1");
  });

  it("removeItem clears the namespaced key", () => {
    const backing = makeBacking();
    const store = createExpiringStorage({ days: 7, backing, namespace: "n" })!;
    store.setItem("k", "1");
    store.removeItem!("k");
    expect(backing.store.has("n:k")).toBe(false);
  });

  it("writes payloads as JSON with value + expiresAt", () => {
    const backing = makeBacking();
    const store = createExpiringStorage({ days: 7, backing })!;
    store.setItem("k", "1");
    const raw = backing.store.get("k")!;
    const parsed = JSON.parse(raw) as { value: string; expiresAt: number };
    expect(parsed.value).toBe("1");
    expect(parsed.expiresAt).toBeGreaterThan(Date.now());
  });

  it("falls back to window.localStorage when no backing is supplied", () => {
    const store = createExpiringStorage({ days: 1 })!;
    store.setItem("bb-test", "1");
    expect(window.localStorage.getItem("bb-test")).toContain('"value":"1"');
    window.localStorage.removeItem("bb-test");
  });
});

describe("createSessionStorage / createForeverStorage", () => {
  it("createSessionStorage wraps window.sessionStorage", () => {
    const store = createSessionStorage()!;
    store.setItem("session-key", "v");
    expect(window.sessionStorage.getItem("session-key")).toBe("v");
    window.sessionStorage.removeItem("session-key");
  });

  it("createForeverStorage wraps window.localStorage", () => {
    const store = createForeverStorage()!;
    store.setItem("forever-key", "v");
    expect(window.localStorage.getItem("forever-key")).toBe("v");
    window.localStorage.removeItem("forever-key");
  });

  it("createForeverStorage applies a namespace when given", () => {
    const store = createForeverStorage({ namespace: "ns" })!;
    store.setItem("k", "v");
    expect(window.localStorage.getItem("ns:k")).toBe("v");
    expect(window.localStorage.getItem("k")).toBeNull();
    window.localStorage.removeItem("ns:k");
  });

  it("createSessionStorage applies a namespace when given", () => {
    const store = createSessionStorage({ namespace: "s" })!;
    store.setItem("k", "v");
    expect(window.sessionStorage.getItem("s:k")).toBe("v");
    window.sessionStorage.removeItem("s:k");
  });
});
