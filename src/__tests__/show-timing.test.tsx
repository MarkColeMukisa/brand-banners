import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdSlot } from "../components/AdSlot";
import { BrandBanners } from "../components/BrandBanners";
import { createExpiringStorage } from "../utils/storage";

const ads = [
  { id: "course", title: "Master React", cta: { label: "Enroll", href: "/course" } },
  { id: "brand", title: "Meet the brand", cta: { label: "Visit", href: "/brand" } },
];

const banner = () => document.querySelector(".bb-banner");

/** Give the page a scrollable height and scroll it to `y`. */
function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { configurable: true, value: y });
  fireEvent.scroll(window);
}

describe("when a slot shows", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    // jsdom lays nothing out; make the page 2000px tall in a 1000px viewport.
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  afterEach(() => {
    vi.useRealTimers();
    // Back to jsdom's own (prototype) values.
    delete (document.documentElement as { scrollHeight?: number }).scrollHeight;
  });

  it("shows at once with neither trigger set", () => {
    render(<BrandBanners ads={ads} />);
    expect(banner()).not.toBeNull();
  });

  it("showAfter delays the first appearance", () => {
    render(<BrandBanners ads={ads} showAfter={12_000} />);
    act(() => {
      vi.advanceTimersByTime(11_999);
    });
    expect(banner()).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText("Master React")).toBeInTheDocument();
  });

  it("showOnScroll waits until that share of the page is scrolled", () => {
    render(<BrandBanners ads={ads} showOnScroll={0.35} />);
    expect(banner()).toBeNull();
    act(() => scrollTo(300)); // 30%
    expect(banner()).toBeNull();
    act(() => scrollTo(350)); // 35%
    expect(banner()).not.toBeNull();
  });

  it("showOnScroll counts a page too short to scroll as read", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 800,
    });
    render(<BrandBanners ads={ads} showOnScroll={0.5} />);
    expect(banner()).not.toBeNull();
  });

  it("with both, the scroll wins when it comes first", () => {
    render(<BrandBanners ads={ads} showAfter={12_000} showOnScroll={0.35} />);
    act(() => scrollTo(700));
    expect(banner()).not.toBeNull();
  });

  it("with both, the delay wins when it comes first", () => {
    render(<BrandBanners ads={ads} showAfter={12_000} showOnScroll={0.35} />);
    act(() => {
      vi.advanceTimersByTime(12_000);
    });
    expect(banner()).not.toBeNull();
  });

  it("stays shown once it has appeared", () => {
    render(<BrandBanners ads={ads} showOnScroll={0.35} />);
    act(() => scrollTo(1000));
    act(() => scrollTo(0));
    expect(banner()).not.toBeNull();
  });

  it("a dismissed slot starts neither the timer nor the scroll listener", () => {
    createExpiringStorage({ days: 7 })!.setItem("bb-dismissed:slot", "1");
    const setTimeoutSpy = vi.spyOn(window, "setTimeout");
    const addListenerSpy = vi.spyOn(window, "addEventListener");

    render(<BrandBanners ads={ads} showAfter={1000} showOnScroll={0.35} />);

    expect(setTimeoutSpy.mock.calls.filter(([, ms]) => ms === 1000)).toHaveLength(0);
    expect(addListenerSpy.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(0);
    act(() => {
      vi.advanceTimersByTime(5000);
      scrollTo(2000);
    });
    expect(banner()).toBeNull();
    setTimeoutSpy.mockRestore();
    addListenerSpy.mockRestore();
  });

  it("removes the scroll listener once shown", () => {
    const removeListenerSpy = vi.spyOn(window, "removeEventListener");
    render(<BrandBanners ads={ads} showOnScroll={0.35} />);
    act(() => scrollTo(1000));
    expect(removeListenerSpy.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(1);
    removeListenerSpy.mockRestore();
  });

  it("rotation starts when the slot appears, not on mount", () => {
    render(<AdSlot ads={ads} rotate={{ interval: 1000 }} showAfter={5000} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Master React")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Meet the brand")).toBeInTheDocument();
  });

  it("reduced motion keeps the same timing", () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...matchMedia(query),
      matches: query.includes("reduce"),
    })) as typeof window.matchMedia;
    try {
      render(<BrandBanners ads={ads} showAfter={2000} />);
      expect(banner()).toBeNull();
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(banner()).not.toBeNull();
    } finally {
      window.matchMedia = matchMedia;
    }
  });
});
