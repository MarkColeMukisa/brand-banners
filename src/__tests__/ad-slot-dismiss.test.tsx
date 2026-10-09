import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdSlot } from "../components/AdSlot";
import { BrandedBanner } from "../components/BrandedBanner";

const ads = [
  { id: "1", title: "Ad One", cta: { label: "Go 1", href: "/1" } },
  { id: "2", title: "Ad Two", cta: { label: "Go 2", href: "/2" } },
  { id: "3", title: "Ad Three", cta: { label: "Go 3", href: "/3" } },
];

function memoryStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
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

const dismiss = () => fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));

describe("AdSlot dismissal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('dismissScope="ad" (default)', () => {
    it("moves straight on to the next ad when one is dismissed", () => {
      render(<AdSlot ads={ads} dismissible />);
      dismiss();
      expect(screen.queryByText("Ad One")).toBeNull();
      expect(screen.getByText("Ad Two")).toBeInTheDocument();
    });

    it("skips a dismissed ad for the rest of the rotation", () => {
      render(<AdSlot ads={ads} dismissible rotate={{ interval: 1000 }} />);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText("Ad Two")).toBeInTheDocument();
      dismiss();
      expect(screen.getByText("Ad Three")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText("Ad One")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText("Ad Three")).toBeInTheDocument();
    });

    it("skips ads whose dismissal was remembered from an earlier visit", () => {
      const storage = memoryStorage({ "bb-dismissed:1": "1" });
      render(<AdSlot ads={ads} dismissible storage={storage} />);
      expect(screen.queryByText("Ad One")).toBeNull();
      expect(screen.getByText("Ad Two")).toBeInTheDocument();
    });

    it("ignores a remembered dismissal for an ad that is no longer dismissible", () => {
      const storage = memoryStorage({ "bb-dismissed:1": "1" });
      const pinned = [{ ...ads[0]!, dismissible: false }, ads[1]!, ads[2]!];
      render(<AdSlot ads={pinned} dismissible storage={storage} />);
      expect(screen.getByText("Ad One")).toBeInTheDocument();
    });

    it("renders nothing, not an empty wrapper, once every ad is dismissed", () => {
      render(<AdSlot ads={ads.slice(0, 2)} dismissible position="corner" />);
      dismiss();
      dismiss();
      expect(document.querySelector(".bb-ad-slot")).toBeNull();
    });

    it("gives id-less ads a stable positional storage key", () => {
      const storage = memoryStorage();
      render(<AdSlot ads={[{ title: "No id" }, ads[1]!]} dismissible storage={storage} />);
      dismiss();
      expect(storage.store.get("bb-dismissed:idx-0")).toBe("1");
    });
  });

  describe('dismissScope="slot"', () => {
    it("hides the whole slot and keeps it hidden through the rotation", () => {
      render(<AdSlot ads={ads} dismissible dismissScope="slot" rotate={{ interval: 1000 }} />);
      dismiss();
      expect(document.querySelector(".bb-ad-slot")).toBeNull();
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(document.querySelector(".bb-ad-slot")).toBeNull();
    });

    it("stores one shared key, named after the slot id and storageKey prefix", () => {
      const storage = memoryStorage();
      render(
        <AdSlot
          id="promos"
          ads={ads}
          dismissible
          dismissScope="slot"
          storage={storage}
          storageKey="site"
        />,
      );
      dismiss();
      expect([...storage.store.keys()]).toEqual(["site:bb-dismissed:slot:promos"]);
    });

    it("stays hidden on the next visit, whichever ad was showing when it was closed", () => {
      const storage = memoryStorage();
      const first = render(
        <AdSlot ads={ads} dismissible dismissScope="slot" storage={storage} initial={1} />,
      );
      dismiss();
      first.unmount();

      render(<AdSlot ads={ads} dismissible dismissScope="slot" storage={storage} />);
      expect(document.querySelector(".bb-ad-slot")).toBeNull();
      expect(screen.queryByText("Ad One")).toBeNull();
    });

    it("works for banners rendered through children-as-function", () => {
      const storage = memoryStorage();
      render(
        <AdSlot ads={ads} dismissible dismissScope="slot" storage={storage}>
          {(config) => <BrandedBanner config={config} />}
        </AdSlot>,
      );
      dismiss();
      expect(document.querySelector(".bb-ad-slot")).toBeNull();
      expect(storage.store.get("bb-dismissed:slot")).toBe("1");
    });
  });

  it("fires onView for each ad as it rotates in, not just the first", () => {
    const onView = vi.fn();
    render(
      <AdSlot ads={ads} rotate={{ interval: 1000 }}>
        {(config) => <BrandedBanner config={config} onView={onView} />}
      </AdSlot>,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onView.mock.calls.map(([meta]) => meta.id)).toEqual(["1", "2"]);
  });

  it("still fires the banner's own onClose when the slot handles the dismissal", () => {
    const onClose = vi.fn();
    render(
      <AdSlot ads={ads} dismissible dismissScope="slot">
        {(config) => <BrandedBanner config={config} onClose={onClose} />}
      </AdSlot>,
    );
    dismiss();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0]![0].id).toBe("1");
  });
});
