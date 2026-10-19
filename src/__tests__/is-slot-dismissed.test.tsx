import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AdSlot } from "../components/AdSlot";
import { BrandBanners } from "../components/BrandBanners";
import { isSlotDismissed } from "../utils/dismissal";
import { createExpiringStorage } from "../utils/storage";

const ads = [{ id: "course", title: "Master React", cta: { label: "Enroll", href: "/course" } }];
const dismiss = () => fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));

describe("isSlotDismissed", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reads what BrandBanners writes", () => {
    const storage = createExpiringStorage({ days: 7 });
    expect(isSlotDismissed({ storage })).toBe(false);
    render(<BrandBanners ads={ads} />);
    dismiss();
    expect(isSlotDismissed({ storage })).toBe(true);
  });

  it("honours the slot id", () => {
    const storage = createExpiringStorage({ days: 7 });
    render(<BrandBanners id="courses" ads={ads} />);
    dismiss();
    expect(isSlotDismissed({ id: "courses", storage })).toBe(true);
    expect(isSlotDismissed({ storage })).toBe(false);
  });

  it("honours an AdSlot's storageKey prefix", () => {
    const storage = window.localStorage;
    render(
      <AdSlot
        id="promos"
        ads={ads}
        storage={storage}
        storageKey="site"
        dismissible
        dismissScope="slot"
      />,
    );
    dismiss();
    expect(isSlotDismissed({ id: "promos", storage, storageKey: "site" })).toBe(true);
    expect(isSlotDismissed({ id: "promos", storage })).toBe(false);
  });

  it("reads an expired dismissal as not dismissed", () => {
    window.localStorage.setItem(
      "bb-dismissed:slot",
      JSON.stringify({ value: "1", expiresAt: Date.now() - 1 }),
    );
    expect(isSlotDismissed({ storage: createExpiringStorage({ days: 7 }) })).toBe(false);
  });

  it("reads a throwing storage as not dismissed", () => {
    const storage = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {},
    };
    expect(isSlotDismissed({ storage })).toBe(false);
  });
});
