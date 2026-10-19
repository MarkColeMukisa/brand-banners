import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdSlot } from "../components/AdSlot";
import { BrandBanners } from "../components/BrandBanners";
import type { BannerConfig } from "../types/ad";
import { isInWindow } from "../utils/schedule";

const at = (local: string) => new Date(local).getTime();

describe("isInWindow", () => {
  it("is always in with no window", () => {
    expect(isInWindow({}, at("2026-10-19T12:00:00"))).toBe(true);
  });

  it("a bare startsAt date means the start of that day, local time", () => {
    const ad = { startsAt: "2026-11-01" };
    expect(isInWindow(ad, at("2026-10-31T23:59:59"))).toBe(false);
    expect(isInWindow(ad, at("2026-11-01T00:00:00"))).toBe(true);
  });

  it("a bare endsAt date means the end of that day, local time", () => {
    const ad = { endsAt: "2026-11-30" };
    expect(isInWindow(ad, at("2026-11-30T23:59:59"))).toBe(true);
    expect(isInWindow(ad, at("2026-12-01T00:00:00"))).toBe(false);
  });

  it("date-times are exact", () => {
    const ad = { startsAt: "2026-11-01T09:00:00Z", endsAt: "2026-11-01T17:00:00Z" };
    expect(isInWindow(ad, Date.parse("2026-11-01T08:59:59Z"))).toBe(false);
    expect(isInWindow(ad, Date.parse("2026-11-01T12:00:00Z"))).toBe(true);
    expect(isInWindow(ad, Date.parse("2026-11-01T17:00:01Z"))).toBe(false);
  });

  it("ignores a value that doesn't parse", () => {
    expect(isInWindow({ endsAt: "soon" }, at("2026-10-19T12:00:00"))).toBe(true);
  });
});

describe("startsAt / endsAt in a slot", () => {
  const ads: BannerConfig[] = [
    { id: "past", title: "Closed intake", endsAt: "2026-10-01" },
    { id: "now", title: "Open intake", startsAt: "2026-10-01", endsAt: "2026-10-31" },
    { id: "future", title: "Next intake", startsAt: "2026-11-01" },
    { id: "always", title: "Always on" },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-19T12:00:00"));
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("leaves ads outside their window out of the rotation", () => {
    render(<AdSlot ads={ads} rotate={{ interval: 1000 }} />);
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      seen.add(document.querySelector(".bb-banner")!.textContent!);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
    expect([...seen].sort()).toEqual(["Always on", "Open intake"]);
  });

  it("renders nothing, and fires no onView, when no ad is in its window", () => {
    const onView = vi.fn();
    render(<BrandBanners ads={ads.slice(0, 1).concat(ads[2]!)} onView={onView} />);
    expect(document.querySelector(".bb-ad-slot")).toBeNull();
    expect(onView).not.toHaveBeenCalled();
  });

  it("onView only fires for in-window ads", () => {
    const onView = vi.fn();
    render(<BrandBanners ads={ads} onView={onView} />);
    expect(screen.getByText("Open intake")).toBeInTheDocument();
    expect(onView.mock.calls.map(([meta]) => meta.id)).toEqual(["now"]);
  });

  it("keeps positional keys of id-less ads stable when one drops out", () => {
    const idless: BannerConfig[] = [
      { title: "Expired", endsAt: "2026-10-01" },
      { title: "Current", dismissible: true },
    ];
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    render(<AdSlot ads={idless} storage={storage} />);
    act(() => {
      screen.getByRole("button", { name: "Dismiss ad" }).click();
    });
    expect([...store.keys()]).toEqual(["bb-dismissed:idx-1"]);
  });
});
