// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdSlot } from "../components/AdSlot";
import { BrandBanners } from "../components/BrandBanners";
import { isSlotDismissed } from "../utils/dismissal";

const ads = [
  { id: "course", title: "Master React", cta: { label: "Enroll", href: "/course" } },
  { id: "brand", title: "Meet the brand", cta: { label: "Visit", href: "/brand" } },
];

// A real server: no `window`, so no storage and no clock-dependent filtering.
describe("server render", () => {
  it("runs without a window", () => {
    expect(typeof window).toBe("undefined");
  });

  it("BrandBanners renders no banner by default", () => {
    const html = renderToString(<BrandBanners ads={ads} />);
    expect(html).not.toContain("Master React");
    expect(html).not.toContain("bb-ad-slot");
  });

  it("AdSlot renders no banner by default", () => {
    const html = renderToString(<AdSlot ads={ads} />);
    expect(html).not.toContain("Master React");
  });

  it('ssr="render" keeps the first ad in the server HTML', () => {
    expect(renderToString(<BrandBanners ads={ads} ssr="render" />)).toContain("Master React");
    expect(renderToString(<AdSlot ads={ads} ssr="render" />)).toContain("Master React");
  });

  it("showAfter / showOnScroll still render nothing on the server", () => {
    const html = renderToString(
      <BrandBanners ads={ads} ssr="render" showAfter={1000} showOnScroll={0.5} />,
    );
    expect(html).not.toContain("Master React");
  });

  it("isSlotDismissed reads as not dismissed without storage", () => {
    expect(isSlotDismissed({ storage: undefined })).toBe(false);
  });
});
