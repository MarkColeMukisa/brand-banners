import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaBanner } from "../components/MediaBanner";

describe("MediaBanner", () => {
  it("renders a <video> for media.type='video'", () => {
    render(
      <MediaBanner
        id="m1"
        title="Watch"
        media={{ type: "video", src: "/x.mp4", poster: "/poster.jpg" }}
      />,
    );
    const video = document.querySelector<HTMLVideoElement>("video");
    expect(video).not.toBeNull();
    expect(video?.getAttribute("src")).toBe("/x.mp4");
    expect(video?.getAttribute("poster")).toBe("/poster.jpg");
    expect(video?.loop).toBe(true);
    // React sets `muted` as a property, not an attribute, on <video>
    // to work around a Chrome muted-autoplay bug — check the property.
    expect(video?.muted).toBe(true);
    expect(video?.playsInline).toBe(true);
  });

  it("renders an <img> for media.type='image'", () => {
    render(<MediaBanner id="m2" title="t" media={{ type: "image", src: "/x.png", alt: "Hero" }} />);
    const img = screen.getByRole("img", { name: "Hero" });
    expect(img).toHaveAttribute("src", "/x.png");
  });

  it("renders an <img> for media.type='gif'", () => {
    render(<MediaBanner id="m3" title="t" media={{ type: "gif", src: "/x.gif", alt: "Loop" }} />);
    expect(screen.getByRole("img", { name: "Loop" })).toHaveAttribute("src", "/x.gif");
  });

  it("renders inline SVG when media.svg is provided", () => {
    render(
      <MediaBanner
        id="m4"
        title="t"
        media={{ type: "svg", svg: "<svg><circle cx='5' cy='5' r='4'/></svg>" }}
      />,
    );
    const span = document.querySelector(".bb-banner-media__svg");
    expect(span?.innerHTML).toContain("<svg>");
    expect(span?.innerHTML).toContain("circle");
  });

  it("renders SVG via src when no inline markup", () => {
    render(<MediaBanner id="m5" title="t" media={{ type: "svg", src: "/x.svg", alt: "Icon" }} />);
    expect(screen.getByRole("img", { name: "Icon" })).toHaveAttribute("src", "/x.svg");
  });

  it("componentType is 'MediaBanner'", () => {
    const calls: unknown[] = [];
    render(
      <MediaBanner
        id="m6"
        title="t"
        media={{ type: "image", src: "/x.png" }}
        onView={(m) => calls.push(m)}
      />,
    );
    expect(calls[0]).toMatchObject({ id: "m6", type: "MediaBanner" });
  });

  it("respects media.autoplay=false", () => {
    render(
      <MediaBanner id="m7" title="t" media={{ type: "video", src: "/x.mp4", autoplay: false }} />,
    );
    const video = document.querySelector<HTMLVideoElement>("video");
    expect(video?.autoplay).toBe(false);
  });
});
