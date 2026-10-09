import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { CustomBanner, type CustomBannerProps } from "../primitives/CustomBanner";
import type { CTA, MediaSpec } from "../types/ad";
import { cn } from "../utils/cn";

export interface MediaBannerProps extends Omit<CustomBannerProps, "children" | "componentType"> {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  finePrint?: string;
  cta?: CTA;
  /** Hero media — image, video, GIF, or inline/external SVG. Required. */
  media: MediaSpec;
}

function isDev(): boolean {
  return typeof process !== "undefined" && process.env?.["NODE_ENV"] !== "production";
}

function MediaRenderer({ media }: { media: MediaSpec }): ReactNode {
  const reducedMotion = usePrefersReducedMotion();

  if (media.type === "svg") {
    if (media.svg) {
      return (
        <span
          className="bb-banner-media__svg"
          aria-hidden={media.alt ? undefined : true}
          {...(media.alt ? { role: "img", "aria-label": media.alt } : {})}
          dangerouslySetInnerHTML={{ __html: media.svg }}
        />
      );
    }
    if (media.src) {
      return (
        <img
          src={media.src}
          alt={media.alt ?? ""}
          className="bb-banner-media__svg"
          loading="lazy"
        />
      );
    }
    if (isDev()) {
      console.warn(
        "[brand-banners] <MediaBanner> media.type='svg' needs either `svg` (inline markup) or `src`.",
      );
    }
    return null;
  }

  if (media.type === "image" || media.type === "gif") {
    if (!media.src) {
      if (isDev()) {
        console.warn(`[brand-banners] <MediaBanner> media.type='${media.type}' requires \`src\`.`);
      }
      return null;
    }
    return (
      <img src={media.src} alt={media.alt ?? ""} className="bb-banner-media__img" loading="lazy" />
    );
  }

  if (media.type === "video") {
    if (!media.src) {
      if (isDev()) {
        console.warn("[brand-banners] <MediaBanner> media.type='video' requires `src`.");
      }
      return null;
    }
    if (reducedMotion && media.poster) {
      return (
        <img
          src={media.poster}
          alt={media.alt ?? ""}
          className="bb-banner-media__video-poster"
          loading="lazy"
        />
      );
    }
    return (
      <video
        src={media.src}
        poster={media.poster}
        autoPlay={!reducedMotion && (media.autoplay ?? true)}
        loop={media.loop ?? true}
        muted={media.muted ?? true}
        playsInline
        className="bb-banner-media__video"
        {...(media.alt ? { "aria-label": media.alt } : { "aria-hidden": true })}
      />
    );
  }

  return null;
}

function MediaBannerInner(props: MediaBannerProps, forwardedRef: ForwardedRef<HTMLDivElement>) {
  const { title, subtitle, eyebrow, finePrint, cta, media, config, className, ...customProps } =
    props;

  const mergedTitle = title ?? config?.title;
  const mergedSubtitle = subtitle ?? config?.subtitle;
  const mergedEyebrow = eyebrow ?? config?.eyebrow;
  const mergedCta = cta ?? config?.cta;
  const mergedFinePrint = finePrint ?? config?.finePrint;
  const mergedMedia = media ?? config?.media;

  if (!mergedMedia && isDev()) {
    console.warn("[brand-banners] <MediaBanner> requires a `media` prop (or config.media).");
  }

  return (
    <CustomBanner
      ref={forwardedRef}
      componentType="MediaBanner"
      config={config}
      className={cn("bb-banner-media", className)}
      {...customProps}
    >
      {mergedMedia && (
        <CustomBanner.Media>
          <MediaRenderer media={mergedMedia} />
        </CustomBanner.Media>
      )}
      <CustomBanner.Body>
        {mergedEyebrow && <CustomBanner.Eyebrow>{mergedEyebrow}</CustomBanner.Eyebrow>}
        {mergedTitle && <CustomBanner.Title>{mergedTitle}</CustomBanner.Title>}
        {mergedSubtitle && <CustomBanner.Subtitle>{mergedSubtitle}</CustomBanner.Subtitle>}
        {mergedFinePrint && <CustomBanner.FinePrint>{mergedFinePrint}</CustomBanner.FinePrint>}
      </CustomBanner.Body>
      {mergedCta && <CustomBanner.CTA {...mergedCta} />}
      <CustomBanner.Close />
    </CustomBanner>
  );
}

const MediaBanner = forwardRef<HTMLDivElement, MediaBannerProps>(MediaBannerInner);
MediaBanner.displayName = "MediaBanner";

export { MediaBanner };
