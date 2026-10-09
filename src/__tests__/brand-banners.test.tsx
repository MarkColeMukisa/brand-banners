import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrandBanners } from "../components/BrandBanners";

const ads = [
  {
    id: "course",
    eyebrow: "LEARN",
    title: "Master React",
    cta: { label: "Enroll", href: "/course" },
    image: "/course.png",
    brandColors: { bg: "#27272A", text: "#FAFAFA" },
  },
  { id: "brand", title: "Meet the brand", cta: { label: "Visit", href: "/brand" } },
];

const SLOT_KEY = "bb-dismissed:slot";
const DAY_MS = 24 * 60 * 60 * 1000;

describe("BrandBanners", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the first ad as a branded card docked in a corner, with only `ads` given", () => {
    render(<BrandBanners ads={ads} />);
    expect(screen.getByText("Master React")).toBeInTheDocument();

    const slot = document.querySelector(".bb-ad-slot")!;
    expect(slot.getAttribute("data-bb-position")).toBe("corner");
    expect(slot.getAttribute("data-bb-corner")).toBe("bottom-right");

    const banner = document.querySelector(".bb-banner")!;
    expect(banner).toHaveClass("bb-banner-branded");
    expect(banner.getAttribute("data-bb-size")).toBe("card");
    expect(banner.getAttribute("data-bb-media-pos")).toBe("right");
  });

  it("rotates every 10 seconds by default and alternates bottom corners per pass", () => {
    render(<BrandBanners ads={ads} />);
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByText("Meet the brand")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByText("Master React")).toBeInTheDocument();
    expect(document.querySelector(".bb-ad-slot")!.getAttribute("data-bb-corner")).toBe(
      "bottom-left",
    );
  });

  it("interval={0} keeps the first ad up", () => {
    render(<BrandBanners ads={ads} interval={0} />);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByText("Master React")).toBeInTheDocument();
  });

  it("closing hides the slot and remembers it for 7 days by default", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const first = render(<BrandBanners ads={ads} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(document.querySelector(".bb-ad-slot")).toBeNull();

    const entry = JSON.parse(window.localStorage.getItem(SLOT_KEY)!);
    expect(entry.expiresAt - Date.now()).toBe(7 * DAY_MS);
    first.unmount();

    // Day 6: still hidden. Day 8: back.
    vi.setSystemTime(new Date("2026-01-07T00:00:00Z"));
    const second = render(<BrandBanners ads={ads} />);
    expect(document.querySelector(".bb-ad-slot")).toBeNull();
    second.unmount();

    vi.setSystemTime(new Date("2026-01-09T00:00:00Z"));
    render(<BrandBanners ads={ads} />);
    expect(screen.getByText("Master React")).toBeInTheDocument();
  });

  it("dismissDays={0} hides it for this page view without touching storage", () => {
    render(<BrandBanners ads={ads} dismissDays={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(document.querySelector(".bb-ad-slot")).toBeNull();
    expect(window.localStorage.length).toBe(0);
  });

  it("dismissDays={false} removes the close button", () => {
    render(<BrandBanners ads={ads} dismissDays={false} />);
    expect(screen.queryByRole("button", { name: "Dismiss ad" })).toBeNull();
  });

  it("the slot id keeps two slots' dismissals apart", () => {
    render(<BrandBanners id="courses" ads={ads} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(window.localStorage.getItem("bb-dismissed:slot:courses")).not.toBeNull();
    expect(window.localStorage.getItem(SLOT_KEY)).toBeNull();
  });

  it("forwards onView / onClick / onClose with the ad's id", () => {
    const onView = vi.fn();
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(<BrandBanners ads={ads} onView={onView} onClick={onClick} onClose={onClose} />);
    expect(onView).toHaveBeenCalledWith(expect.objectContaining({ id: "course" }));

    fireEvent.click(screen.getByRole("link", { name: "Enroll" }));
    expect(onClick.mock.calls[0]![0]).toMatchObject({ id: "course", type: "BrandedBanner" });

    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ id: "course" }));
  });

  it("sizes the corner card to shrink on small screens, keeping the offset as margin", () => {
    render(<BrandBanners ads={ads} offset={16} />);
    const slot = document.querySelector<HTMLElement>(".bb-ad-slot")!;
    // jsdom re-serializes `min()` loosely, so check the parts, not the string.
    expect(slot.style.width).toMatch(/^min\(520px/);
    expect(slot.style.width).toContain("calc(100vw - 32px)");
    expect(slot.style.bottom).toBe("16px");
  });
});
