import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandedBanner } from "../components/BrandedBanner";

describe("BrandedBanner", () => {
  it("renders title + image + cta with zero styling props", () => {
    render(
      <BrandedBanner
        id="b1"
        title="Save 50% on ink"
        image="https://example.com/ink.png"
        cta={{ label: "Shop", href: "/ink" }}
      />,
    );
    const banner = screen.getByRole("complementary");
    expect(banner).toHaveClass("bb-banner-branded");
    expect(banner).toHaveAttribute("data-bb-size", "leaderboard");
    const img = document.querySelector<HTMLImageElement>(".bb-banner-branded__image");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("https://example.com/ink.png");
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/ink");
  });

  it("default layout is image-right (maps to mediaPosition=right)", () => {
    render(<BrandedBanner id="b2" title="t" />);
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-media-pos", "right");
  });

  it("layout=image-left maps to mediaPosition=left", () => {
    render(<BrandedBanner id="b3" title="t" layout="image-left" />);
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-media-pos", "left");
  });

  it("layout=image-bg maps to mediaPosition=background", () => {
    render(<BrandedBanner id="b4" title="t" layout="image-bg" />);
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-media-pos", "background");
  });

  it("accepts image as { src, alt } object", () => {
    render(<BrandedBanner id="b5" title="t" image={{ src: "/x.png", alt: "Product" }} />);
    expect(screen.getByRole("img", { name: "Product" })).toHaveAttribute("src", "/x.png");
  });

  it("brandColors override CSS variables via inline style", () => {
    render(
      <BrandedBanner
        id="b6"
        title="t"
        brandColors={{ bg: "#FF0000", accent: "#00FF00", text: "#FFFFFF" }}
      />,
    );
    const banner = screen.getByRole("complementary");
    const style = banner.getAttribute("style") ?? "";
    expect(style).toMatch(/--bb-brand-800:\s*#FF0000/);
    expect(style).toMatch(/--bb-accent-500:\s*#00FF00/);
    expect(style).toMatch(/--bb-on-brand:\s*#FFFFFF/);
  });

  it("componentType in adMeta is 'BrandedBanner'", () => {
    const calls: unknown[] = [];
    render(<BrandedBanner id="b7" title="t" onView={(m) => calls.push(m)} />);
    expect(calls[0]).toMatchObject({ id: "b7", type: "BrandedBanner" });
  });

  it("works from config object alone", () => {
    render(
      <BrandedBanner
        id="b8"
        config={{
          title: "From config",
          eyebrow: "NEW",
          cta: { label: "Buy", href: "/x" },
        }}
      />,
    );
    expect(screen.getByText("From config")).toBeInTheDocument();
    expect(screen.getByText("NEW")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buy" })).toHaveAttribute("href", "/x");
  });

  it("renders image from config.image (regression for #3)", () => {
    render(
      <BrandedBanner
        id="b9"
        config={{
          title: "From config",
          image: { src: "/envelope.png", alt: "Envelope" },
          cta: { label: "Send", href: "/x" },
        }}
      />,
    );
    const img = screen.getByRole("img", { name: "Envelope" });
    expect(img).toHaveAttribute("src", "/envelope.png");
  });

  it("config.image wins over config.media as the image source for BrandedBanner", () => {
    render(
      <BrandedBanner
        id="b10"
        config={{
          title: "T",
          image: { src: "/image.png", alt: "img-wins" },
          media: { type: "image", src: "/media.png", alt: "media-loses" },
        }}
      />,
    );
    expect(screen.getByRole("img", { name: "img-wins" })).toHaveAttribute("src", "/image.png");
  });

  it("explicit `image` prop wins over config.image", () => {
    render(
      <BrandedBanner
        id="b11"
        image={{ src: "/explicit.png", alt: "explicit" }}
        config={{ title: "T", image: { src: "/config.png", alt: "config" } }}
      />,
    );
    expect(screen.getByRole("img", { name: "explicit" })).toHaveAttribute("src", "/explicit.png");
  });

  it("forwards image.width and image.height to the rendered <img> (CLS prevention)", () => {
    render(
      <BrandedBanner
        id="b12"
        title="T"
        image={{ src: "/x.png", alt: "x", width: 320, height: 240 }}
      />,
    );
    const img = screen.getByRole("img", { name: "x" });
    expect(img.getAttribute("width")).toBe("320");
    expect(img.getAttribute("height")).toBe("240");
  });

  it("forwards image.fit and image.position as object-fit / object-position styles", () => {
    render(
      <BrandedBanner
        id="b13"
        title="T"
        image={{ src: "/x.png", alt: "x", fit: "cover", position: "top" }}
      />,
    );
    const img = screen.getByRole("img", { name: "x" });
    const style = img.getAttribute("style") ?? "";
    expect(style).toMatch(/object-fit:\s*cover/);
    expect(style).toMatch(/object-position:\s*top/);
  });
});
