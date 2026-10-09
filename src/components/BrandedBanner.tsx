import { forwardRef, type CSSProperties, type ForwardedRef } from "react";
import { CustomBanner, type CustomBannerProps } from "../primitives/CustomBanner";
import type { BrandColors, CTA, ImageInput } from "../types/ad";
import { cn } from "../utils/cn";

export type { ImageInput } from "../types/ad";

export interface BrandedBannerProps extends Omit<
  CustomBannerProps,
  "children" | "componentType" | "mediaPosition"
> {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  finePrint?: string;
  cta?: CTA;
  /**
   * Transparent product image. Pass a URL or
   * `{ src, alt?, width?, height?, fit?, position? }`. Supplying both
   * `width` and `height` reserves aspect-ratio space and prevents CLS.
   */
  image?: ImageInput;
  /** Brand palette — primary/accent/bg/text. Each is optional. */
  brandColors?: BrandColors;
  /** Where the image sits relative to the body. Default `"image-right"`. */
  layout?: "image-left" | "image-right" | "image-bg";
}

interface NormalizedImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fit?: "contain" | "cover" | "scale-down" | "fill" | "none";
  position?: "center" | "top" | "bottom" | "left" | "right";
}

const LAYOUT_TO_MEDIA_POS = {
  "image-left": "left",
  "image-right": "right",
  "image-bg": "background",
} as const;

function normalizeImage(img: ImageInput | undefined): NormalizedImage | null {
  if (!img) return null;
  if (typeof img === "string") return { src: img, alt: "" };
  return {
    src: img.src,
    alt: img.alt ?? "",
    width: img.width,
    height: img.height,
    fit: img.fit,
    position: img.position,
  };
}

function deriveBrandVars(b: BrandColors | undefined): CSSProperties | undefined {
  if (!b) return undefined;
  const out: Record<string, string> = {};
  if (b.bg) {
    out["--bb-brand-800"] = b.bg;
    out["--bb-brand-900"] = b.bg;
  }
  if (b.primary) {
    out["--bb-brand-700"] = b.primary;
    if (!b.bg) {
      out["--bb-brand-900"] = b.primary;
      out["--bb-brand-800"] = b.primary;
    }
  }
  if (b.accent) {
    out["--bb-accent-500"] = b.accent;
    out["--bb-accent-600"] = b.accent;
  }
  if (b.text) {
    out["--bb-on-brand"] = b.text;
  }
  const a = b.bg ?? b.primary ?? "var(--bb-brand-900)";
  const c = b.primary ?? "var(--bb-brand-700)";
  out["--bb-brand-gradient"] = `linear-gradient(105deg, ${a} 0%, ${a} 45%, ${c} 100%)`;
  return out as CSSProperties;
}

function BrandedBannerInner(props: BrandedBannerProps, forwardedRef: ForwardedRef<HTMLDivElement>) {
  const {
    title,
    subtitle,
    eyebrow,
    finePrint,
    cta,
    image,
    brandColors,
    layout,
    config,
    className,
    style,
    size,
    ...customProps
  } = props;

  const mergedTitle = title ?? config?.title;
  const mergedSubtitle = subtitle ?? config?.subtitle;
  const mergedEyebrow = eyebrow ?? config?.eyebrow;
  const mergedCta = cta ?? config?.cta;
  const mergedFinePrint = finePrint ?? config?.finePrint;
  // Resolution order: explicit `image` prop > `config.image` > `config.media` (last-resort
  // fallback so an existing MediaBanner-style config still renders something).
  const configImageFromMedia = config?.media?.src
    ? { src: config.media.src, alt: config.media.alt }
    : undefined;
  const mergedImage = normalizeImage(image ?? config?.image ?? configImageFromMedia);
  const mergedBrand = brandColors ?? config?.brandColors;
  const mergedLayout = layout ?? config?.layout ?? "image-right";
  const mergedSize = size ?? config?.size ?? "leaderboard";

  const brandVars = deriveBrandVars(mergedBrand);

  return (
    <CustomBanner
      ref={forwardedRef}
      componentType="BrandedBanner"
      config={config}
      className={cn("bb-banner-branded", className)}
      style={{
        ...brandVars,
        background: "var(--bb-brand-gradient)",
        color: "var(--bb-on-brand)",
        ...style,
      }}
      mediaPosition={LAYOUT_TO_MEDIA_POS[mergedLayout]}
      size={mergedSize}
      {...customProps}
    >
      {mergedImage && (
        <CustomBanner.Media>
          <img
            src={mergedImage.src}
            alt={mergedImage.alt}
            width={mergedImage.width}
            height={mergedImage.height}
            className="bb-banner-branded__image"
            loading="lazy"
            style={
              mergedImage.fit || mergedImage.position
                ? {
                    ...(mergedImage.fit ? { objectFit: mergedImage.fit } : null),
                    ...(mergedImage.position ? { objectPosition: mergedImage.position } : null),
                  }
                : undefined
            }
          />
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

const BrandedBanner = forwardRef<HTMLDivElement, BrandedBannerProps>(BrandedBannerInner);
BrandedBanner.displayName = "BrandedBanner";

export { BrandedBanner };
