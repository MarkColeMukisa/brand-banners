import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomBanner } from "../primitives/CustomBanner";

describe("CustomBanner", () => {
  it("renders the container with the correct ARIA role and label", () => {
    render(
      <CustomBanner id="ad-1">
        <CustomBanner.Body>
          <CustomBanner.Title>Hello</CustomBanner.Title>
        </CustomBanner.Body>
      </CustomBanner>,
    );
    const banner = screen.getByRole("complementary");
    expect(banner).toHaveAttribute("aria-label", "Advertisement");
    expect(banner).toHaveAttribute("data-bb-id", "ad-1");
    expect(banner).toHaveClass("bb-root");
    expect(banner).toHaveClass("bb-banner");
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("uses a custom aria-label override", () => {
    render(
      <CustomBanner id="ad-1b" ariaLabel="Sponsored — Save 20%">
        <CustomBanner.Title>Hi</CustomBanner.Title>
      </CustomBanner>,
    );
    expect(screen.getByRole("complementary")).toHaveAttribute("aria-label", "Sponsored — Save 20%");
  });

  it("composes slots into a full ad layout", () => {
    render(
      <CustomBanner id="ad-2">
        <CustomBanner.Media>img</CustomBanner.Media>
        <CustomBanner.Body>
          <CustomBanner.Eyebrow>NEW</CustomBanner.Eyebrow>
          <CustomBanner.Title>Save 20%</CustomBanner.Title>
          <CustomBanner.Subtitle>Limited time</CustomBanner.Subtitle>
        </CustomBanner.Body>
        <CustomBanner.CTA label="Get it" href="/course" />
      </CustomBanner>,
    );
    expect(screen.getByText("NEW")).toHaveClass("bb-banner__eyebrow");
    expect(screen.getByText("Save 20%")).toHaveClass("bb-banner__title");
    expect(screen.getByText("Limited time")).toHaveClass("bb-banner__subtitle");
    expect(screen.getByRole("link", { name: "Get it" })).toHaveAttribute("href", "/course");
  });

  it("CTA renders an anchor when href is present, button when only onClick", () => {
    const onClick = vi.fn();
    const { rerender } = render(<CustomBanner.CTA label="Go" href="/x" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/x");
    rerender(<CustomBanner.CTA label="Go" onClick={onClick} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("CTA with target=_blank auto-applies rel=noopener noreferrer", () => {
    render(<CustomBanner.CTA label="Open" href="/x" target="_blank" />);
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("CTA fires both banner onClick and CTA onClick when nested in a banner", () => {
    const bannerOnClick = vi.fn();
    const ctaOnClick = vi.fn();
    render(
      <CustomBanner id="ad-3" onClick={bannerOnClick}>
        <CustomBanner.CTA label="Click" onClick={ctaOnClick} />
      </CustomBanner>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(bannerOnClick).toHaveBeenCalledOnce();
    expect(ctaOnClick).toHaveBeenCalledOnce();
    expect(bannerOnClick.mock.calls[0]?.[0]).toMatchObject({
      id: "ad-3",
      type: "CustomBanner",
    });
  });

  it("renders Close button when dismissible and removes the banner on click", () => {
    const onClose = vi.fn();
    render(
      <CustomBanner id="ad-4" dismissible onClose={onClose}>
        <CustomBanner.Body>
          <CustomBanner.Title>Dismiss me</CustomBanner.Title>
        </CustomBanner.Body>
        <CustomBanner.Close />
      </CustomBanner>,
    );
    const close = screen.getByRole("button", { name: "Dismiss ad" });
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ id: "ad-4" }));
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("Close button is not rendered when not dismissible", () => {
    render(
      <CustomBanner id="ad-5">
        <CustomBanner.Title>x</CustomBanner.Title>
        <CustomBanner.Close />
      </CustomBanner>,
    );
    expect(screen.queryByRole("button", { name: "Dismiss ad" })).toBeNull();
  });

  it("fires onView once on mount (via IntersectionObserver mock)", () => {
    const onView = vi.fn();
    render(
      <CustomBanner id="ad-6" onView={onView}>
        <CustomBanner.Title>v</CustomBanner.Title>
      </CustomBanner>,
    );
    expect(onView).toHaveBeenCalledOnce();
    expect(onView.mock.calls[0]?.[0]).toMatchObject({ id: "ad-6", type: "CustomBanner" });
  });

  it("explicit theme prop sets data-bb-theme on the root", () => {
    render(
      <CustomBanner id="ad-7" theme="dark">
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-theme", "dark");
  });

  it("explicit prop overrides config (mergeConfigAndProps wiring)", () => {
    render(
      <CustomBanner
        id="ad-8"
        config={{ ariaLabel: "From config", theme: "light" }}
        ariaLabel="From prop"
        theme="dark"
      >
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    const banner = screen.getByRole("complementary");
    expect(banner).toHaveAttribute("aria-label", "From prop");
    expect(banner).toHaveAttribute("data-bb-theme", "dark");
  });
});
