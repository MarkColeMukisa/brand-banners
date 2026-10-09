import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomBanner } from "../primitives/CustomBanner";

describe("CustomBanner layout props", () => {
  it("position='top' + sticky=true sets sticky data attributes", () => {
    render(
      <CustomBanner id="a" position="top" sticky>
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    const b = screen.getByRole("complementary");
    expect(b).toHaveAttribute("data-bb-position", "top");
    expect(b).toHaveAttribute("data-bb-sticky", "true");
  });

  it("position='corner' applies corner offsets inline", () => {
    render(
      <CustomBanner id="b" position="corner" corner="top-left" offset={30}>
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    const b = screen.getByRole("complementary");
    expect(b).toHaveAttribute("data-bb-position", "corner");
    expect(b).toHaveAttribute("data-bb-corner", "top-left");
    expect(b).toHaveStyle({ top: "30px", left: "30px" });
  });

  it("default corner offset is 20px to the bottom-right", () => {
    render(
      <CustomBanner id="c" position="corner">
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    const b = screen.getByRole("complementary");
    expect(b).toHaveStyle({ bottom: "20px", right: "20px" });
  });

  it("width='full' maps to 100%, other widths pass through", () => {
    const { rerender } = render(
      <CustomBanner id="d" width="full">
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    expect(screen.getByRole("complementary")).toHaveStyle({ width: "100%" });
    rerender(
      <CustomBanner id="d" width="80%">
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    expect(screen.getByRole("complementary")).toHaveStyle({ width: "80%" });
  });

  it("size preset sets data-bb-size", () => {
    render(
      <CustomBanner id="e" size="leaderboard">
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-size", "leaderboard");
  });

  it("align prop sets data-bb-align", () => {
    render(
      <CustomBanner id="f" align="center">
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-align", "center");
  });

  it("mediaPosition prop sets data-bb-media-pos", () => {
    render(
      <CustomBanner id="g" mediaPosition="background">
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    expect(screen.getByRole("complementary")).toHaveAttribute("data-bb-media-pos", "background");
  });

  it("inline `style` prop wins over computed layout style", () => {
    render(
      <CustomBanner id="h" position="corner" style={{ bottom: "5px" }}>
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    // Both the layout style and user style merge; user style is spread last and wins.
    expect(screen.getByRole("complementary")).toHaveStyle({ bottom: "5px" });
  });

  it("config object positioning is applied; explicit prop wins", () => {
    render(
      <CustomBanner id="i" config={{ position: "top", sticky: true, size: "md" }} size="lg">
        <CustomBanner.Title>t</CustomBanner.Title>
      </CustomBanner>,
    );
    const b = screen.getByRole("complementary");
    expect(b).toHaveAttribute("data-bb-position", "top");
    expect(b).toHaveAttribute("data-bb-sticky", "true");
    expect(b).toHaveAttribute("data-bb-size", "lg");
  });
});
