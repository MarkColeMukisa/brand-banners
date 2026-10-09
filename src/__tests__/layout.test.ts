import { describe, expect, it } from "vitest";
import { computeLayout } from "../utils/layout";

describe("computeLayout", () => {
  it("returns empty result when no props are provided", () => {
    const result = computeLayout({});
    expect(result.style).toEqual({});
    expect(result.dataAttrs).toEqual({});
  });

  it("sets data-bb-position for any explicit position", () => {
    expect(computeLayout({ position: "top" }).dataAttrs["data-bb-position"]).toBe("top");
    expect(computeLayout({ position: "corner" }).dataAttrs["data-bb-position"]).toBe("corner");
    expect(computeLayout({ position: "inline" }).dataAttrs["data-bb-position"]).toBe("inline");
  });

  it("sets data-bb-sticky only for top/bottom + sticky=true", () => {
    expect(computeLayout({ position: "top", sticky: true }).dataAttrs["data-bb-sticky"]).toBe(
      "true",
    );
    expect(computeLayout({ position: "bottom", sticky: true }).dataAttrs["data-bb-sticky"]).toBe(
      "true",
    );
    expect(
      computeLayout({ position: "corner", sticky: true }).dataAttrs["data-bb-sticky"],
    ).toBeUndefined();
    expect(
      computeLayout({ position: "top", sticky: false }).dataAttrs["data-bb-sticky"],
    ).toBeUndefined();
  });

  it("applies corner offsets via inline style", () => {
    const r = computeLayout({ position: "corner", corner: "bottom-right", offset: 30 });
    expect(r.style.bottom).toBe("30px");
    expect(r.style.right).toBe("30px");
    expect(r.dataAttrs["data-bb-corner"]).toBe("bottom-right");
  });

  it("defaults corner to bottom-right and offset to 20", () => {
    const r = computeLayout({ position: "corner" });
    expect(r.style.bottom).toBe("20px");
    expect(r.style.right).toBe("20px");
    expect(r.dataAttrs["data-bb-corner"]).toBe("bottom-right");
  });

  it("supports all four corners", () => {
    expect(computeLayout({ position: "corner", corner: "top-left" }).style).toMatchObject({
      top: "20px",
      left: "20px",
    });
    expect(computeLayout({ position: "corner", corner: "top-right" }).style).toMatchObject({
      top: "20px",
      right: "20px",
    });
    expect(computeLayout({ position: "corner", corner: "bottom-left" }).style).toMatchObject({
      bottom: "20px",
      left: "20px",
    });
  });

  it("maps width='full' to 100% and passes other values through", () => {
    expect(computeLayout({ width: "full" }).style.width).toBe("100%");
    expect(computeLayout({ width: "80%" }).style.width).toBe("80%");
    expect(computeLayout({ width: "600px" }).style.width).toBe("600px");
    expect(computeLayout({ width: "min(900px, 100%)" }).style.width).toBe("min(900px, 100%)");
  });
});
