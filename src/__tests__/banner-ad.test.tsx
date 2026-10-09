import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BannerAd } from "../components/BannerAd";

describe("BannerAd", () => {
  it("renders a polished strip from title + cta with zero styling props", () => {
    render(<BannerAd id="promo" title="Save 20%" cta={{ label: "Get it", href: "/course" }} />);
    const banner = screen.getByRole("complementary");
    expect(banner).toHaveAttribute("aria-label", "Advertisement");
    expect(banner).toHaveAttribute("data-bb-id", "promo");
    expect(banner).toHaveClass("bb-banner-ad");
    expect(screen.getByText("Save 20%")).toHaveClass("bb-banner__title");
    expect(screen.getByRole("link", { name: "Get it" })).toHaveAttribute("href", "/course");
  });

  it("text prop is treated as an alias for subtitle", () => {
    render(<BannerAd id="a" title="t" text="legacy text alias" />);
    expect(screen.getByText("legacy text alias")).toHaveClass("bb-banner__subtitle");
  });

  it("subtitle wins when both text and subtitle are provided", () => {
    render(<BannerAd id="a" title="t" subtitle="winning" text="loser" />);
    expect(screen.getByText("winning")).toBeInTheDocument();
    expect(screen.queryByText("loser")).toBeNull();
  });

  it("renders an eyebrow label above the title", () => {
    render(<BannerAd id="b" eyebrow="NEW" title="hi" />);
    expect(screen.getByText("NEW")).toHaveClass("bb-banner__eyebrow");
  });

  it("renders fine print under the body", () => {
    render(<BannerAd id="c" title="t" finePrint="Free delivery incl.*" />);
    expect(screen.getByText("Free delivery incl.*")).toHaveClass("bb-banner__fine-print");
  });

  it("bg='brand' applies the strong gradient variant class", () => {
    render(<BannerAd id="d" title="t" bg="brand" />);
    expect(screen.getByRole("complementary")).toHaveClass("bb-banner-ad--strong");
  });

  it("bg='gradient' is an alias for the strong variant", () => {
    render(<BannerAd id="d2" title="t" bg="gradient" />);
    expect(screen.getByRole("complementary")).toHaveClass("bb-banner-ad--strong");
  });

  it("custom bg color string passes through as inline background", () => {
    render(<BannerAd id="e" title="t" bg="#FF00FF" />);
    expect(screen.getByRole("complementary")).toHaveStyle({ background: "#FF00FF" });
  });

  it("defaults to size='md' but allows override", () => {
    const { rerender } = render(<BannerAd id="f" title="t" />);
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-size", "md");
    rerender(<BannerAd id="f" title="t" size="lg" />);
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-size", "lg");
  });

  it("dismissible renders the close button which removes the banner", () => {
    const onClose = vi.fn();
    render(<BannerAd id="g" title="dismiss me" dismissible onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ id: "g", type: "BannerAd" }));
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("populates from a config object alone (no direct props needed)", () => {
    render(
      <BannerAd
        id="h"
        config={{
          title: "From config",
          subtitle: "config sub",
          cta: { label: "Buy", href: "/x" },
        }}
      />,
    );
    expect(screen.getByText("From config")).toBeInTheDocument();
    expect(screen.getByText("config sub")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buy" })).toHaveAttribute("href", "/x");
  });

  it("explicit props override config", () => {
    render(
      <BannerAd id="i" title="From prop" config={{ title: "From config", subtitle: "kept" }} />,
    );
    expect(screen.getByText("From prop")).toBeInTheDocument();
    expect(screen.getByText("kept")).toBeInTheDocument();
  });

  it("forwards onView with type='BannerAd'", () => {
    const onView = vi.fn();
    render(<BannerAd id="j" title="t" onView={onView} />);
    expect(onView).toHaveBeenCalledOnce();
    expect(onView.mock.calls[0]?.[0]).toMatchObject({ id: "j", type: "BannerAd" });
  });
});
