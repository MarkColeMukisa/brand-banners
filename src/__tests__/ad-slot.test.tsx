import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdSlot } from "../components/AdSlot";
import { BannerAd } from "../components/BannerAd";
import { BrandedBanner } from "../components/BrandedBanner";
import type { BannerConfig } from "../types/ad";

const ads = [
  { id: "1", title: "Ad One", cta: { label: "Go 1", href: "/1" } },
  { id: "2", title: "Ad Two", cta: { label: "Go 2", href: "/2" } },
  { id: "3", title: "Ad Three", cta: { label: "Go 3", href: "/3" } },
];

describe("AdSlot", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the first ad statically when no rotate is set", () => {
    render(<AdSlot ads={ads} />);
    expect(screen.getByText("Ad One")).toBeInTheDocument();
    expect(screen.queryByText("Ad Two")).toBeNull();
  });

  it("renders at the `initial` index when provided", () => {
    render(<AdSlot ads={ads} initial={1} />);
    expect(screen.getByText("Ad Two")).toBeInTheDocument();
  });

  it("advances ads on the rotate interval", () => {
    render(<AdSlot ads={ads} rotate={{ interval: 5000 }} />);
    expect(screen.getByText("Ad One")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Ad Two")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Ad Three")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Ad One")).toBeInTheDocument();
  });

  it("renders custom children-as-function when given", () => {
    render(
      <AdSlot ads={ads}>
        {(config) => <BannerAd config={config} className="custom-render" />}
      </AdSlot>,
    );
    expect(screen.getByRole("complementary")).toHaveClass("custom-render");
  });

  it("acts as a placement wrapper when given a single child element", () => {
    render(
      <AdSlot position="bottom" sticky>
        <BannerAd id="x" title="Single" cta={{ label: "Go", href: "/x" }} />
      </AdSlot>,
    );
    const slot = document.querySelector(".bb-ad-slot");
    expect(slot).toHaveAttribute("data-bb-position", "bottom");
    expect(slot).toHaveAttribute("data-bb-sticky", "true");
    expect(screen.getByText("Single")).toBeInTheDocument();
  });

  it("sets data-bb-rotating='true' when rotate is configured", () => {
    render(<AdSlot ads={ads} rotate={{ interval: 1000 }} />);
    expect(document.querySelector(".bb-ad-slot")).toHaveAttribute("data-bb-rotating", "true");
  });

  it("supports the BannerRotator alias", async () => {
    const { BannerRotator } = await import("../components/AdSlot");
    render(<BannerRotator ads={ads} />);
    expect(screen.getByText("Ad One")).toBeInTheDocument();
  });

  it("does not advance when ads has fewer than two entries", () => {
    render(<AdSlot ads={[ads[0]!]} rotate={{ interval: 1000 }} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Ad One")).toBeInTheDocument();
  });

  it("dismissible cascades to the default BannerAd renderer", () => {
    render(<AdSlot ads={ads} dismissible />);
    expect(screen.getByRole("button", { name: "Dismiss ad" })).toBeInTheDocument();
  });

  it("per-ad config.dismissible wins over slot.dismissible (false override)", () => {
    const overridden = [{ ...ads[0]!, dismissible: false }, ads[1]!, ads[2]!];
    render(<AdSlot ads={overridden} dismissible />);
    expect(screen.queryByRole("button", { name: "Dismiss ad" })).toBeNull();
  });

  it("storage prop cascades to the default BannerAd renderer", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    };
    render(<AdSlot ads={ads} dismissible storage={storage} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(store.get("bb-dismissed:1")).toBe("1");
  });

  it("storageKey acts as a per-slot namespace prefix on the resolved key", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    };
    render(<AdSlot ads={ads} dismissible storage={storage} storageKey="footer-slot" />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(store.get("footer-slot:bb-dismissed:1")).toBe("1");
    expect(store.get("bb-dismissed:1")).toBeUndefined();
  });

  it("children-as-function still receives the slot-merged dismissible default", () => {
    let seen: { id?: string; dismissible?: boolean } = {};
    render(
      <AdSlot ads={ads} dismissible>
        {(config) => {
          seen = config;
          return <div data-testid="rendered">{config.title}</div>;
        }}
      </AdSlot>,
    );
    expect(seen.dismissible).toBe(true);
    expect(seen.id).toBe("1");
  });

  it("width / layout / size / theme cascade into children-as-function config", () => {
    let seen: Partial<BannerConfig> = {};
    render(
      <AdSlot ads={ads} width="460px" layout="image-right" size="leaderboard" theme="dark">
        {(config) => {
          seen = config;
          return <div>{config.title}</div>;
        }}
      </AdSlot>,
    );
    expect(seen.width).toBe("460px");
    expect(seen.layout).toBe("image-right");
    expect(seen.size).toBe("leaderboard");
    expect(seen.theme).toBe("dark");
  });

  it("per-ad config wins over the slot-level cascade for width / layout / size / theme", () => {
    const overridden = [
      {
        ...ads[0]!,
        width: "300px",
        layout: "image-left" as const,
        size: "md" as const,
        theme: "light" as const,
      },
      ads[1]!,
    ];
    let seen: Partial<BannerConfig> = {};
    render(
      <AdSlot ads={overridden} width="460px" layout="image-right" size="leaderboard" theme="dark">
        {(config) => {
          seen = config;
          return <div>{config.title}</div>;
        }}
      </AdSlot>,
    );
    expect(seen.width).toBe("300px");
    expect(seen.layout).toBe("image-left");
    expect(seen.size).toBe("md");
    expect(seen.theme).toBe("light");
  });

  it("onCycleComplete fires once per full pass through ads", () => {
    const onCycleComplete = vi.fn();
    render(<AdSlot ads={ads} rotate={{ interval: 1000 }} onCycleComplete={onCycleComplete} />);
    // Cycle through all 3 ads — wraps from 2 → 0 on the 3rd tick.
    act(() => {
      vi.advanceTimersByTime(1000); // 0 → 1
    });
    expect(onCycleComplete).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1000); // 1 → 2
    });
    expect(onCycleComplete).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1000); // 2 → 0 (wrap — cycle complete)
    });
    expect(onCycleComplete).toHaveBeenCalledTimes(1);
    const meta = onCycleComplete.mock.calls[0]![0];
    expect(meta.cycleCount).toBe(1);
    expect(meta.lastAd.id).toBe("3");
    expect(meta.nextAd.id).toBe("1");
  });

  it("onCycleComplete does not fire for random rotation", () => {
    const onCycleComplete = vi.fn();
    render(
      <AdSlot
        ads={ads}
        rotate={{ interval: 1000, random: true }}
        onCycleComplete={onCycleComplete}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(onCycleComplete).not.toHaveBeenCalled();
  });

  it("corner array advances on each full cycle, synced to the rotation timer", () => {
    render(
      <AdSlot
        ads={ads}
        rotate={{ interval: 1000 }}
        position="corner"
        corner={["bottom-right", "bottom-left"]}
      />,
    );
    const slot = document.querySelector(".bb-ad-slot")!;
    expect(slot.getAttribute("data-bb-corner")).toBe("bottom-right");
    // Complete one full cycle (3 ticks for 3 ads).
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(slot.getAttribute("data-bb-corner")).toBe("bottom-left");
    // Complete a second full cycle — wraps back to the first corner.
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(slot.getAttribute("data-bb-corner")).toBe("bottom-right");
  });

  it("single-string corner still works (back-compat)", () => {
    render(<AdSlot ads={ads} position="corner" corner="top-left" />);
    expect(document.querySelector(".bb-ad-slot")!.getAttribute("data-bb-corner")).toBe("top-left");
  });

  it("storage cascades into BrandedBanner rendered via children-as-function (no re-stating)", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    };
    render(
      <AdSlot ads={ads} dismissible storage={storage}>
        {(config) => <BrandedBanner config={config} />}
      </AdSlot>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(store.get("bb-dismissed:1")).toBe("1");
  });

  it("storageKey prefix flows into the resolved key for children-as-function banners", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    };
    render(
      <AdSlot ads={ads} dismissible storage={storage} storageKey="footer-slot">
        {(config) => <BrandedBanner config={config} />}
      </AdSlot>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(store.get("footer-slot:bb-dismissed:1")).toBe("1");
    expect(store.get("bb-dismissed:1")).toBeUndefined();
  });

  it("explicit storage on the inner banner wins over the slot context", () => {
    const slotStore = new Map<string, string>();
    const slotStorage = {
      getItem: (k: string) => slotStore.get(k) ?? null,
      setItem: (k: string, v: string) => {
        slotStore.set(k, v);
      },
      removeItem: (k: string) => {
        slotStore.delete(k);
      },
    };
    const localStore = new Map<string, string>();
    const localStorage = {
      getItem: (k: string) => localStore.get(k) ?? null,
      setItem: (k: string, v: string) => {
        localStore.set(k, v);
      },
      removeItem: (k: string) => {
        localStore.delete(k);
      },
    };
    render(
      <AdSlot ads={ads} dismissible storage={slotStorage}>
        {(config) => <BrandedBanner config={config} storage={localStorage} />}
      </AdSlot>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(localStore.get("bb-dismissed:1")).toBe("1");
    expect(slotStore.size).toBe(0);
  });
});
