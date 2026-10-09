import { forwardRef, type ForwardedRef } from "react";
import { CustomBanner, type CustomBannerProps } from "../primitives/CustomBanner";
import type { CTA } from "../types/ad";
import { cn } from "../utils/cn";

export interface BannerAdProps extends Omit<CustomBannerProps, "children" | "componentType"> {
  /** Headline text. */
  title?: string;
  /** Secondary line under the headline. */
  subtitle?: string;
  /** Alias for `subtitle` — use whichever reads better. */
  text?: string;
  /** Tiny eyebrow label above the headline (e.g. `"20% OFF"`). */
  eyebrow?: string;
  /** Fine print under the body (e.g. `"Free delivery incl.*"`). */
  finePrint?: string;
  /** Call-to-action. */
  cta?: CTA;
  /**
   * Background style.
   * - `"surface"` *(default)*: muted neutral card. Good for content sites.
   * - `"brand"` / `"gradient"`: the signature deep-teal → emerald gradient.
   * - Any other string: passed straight to CSS `background` (color, gradient, etc.).
   */
  bg?: "surface" | "brand" | "gradient" | (string & {});
}

function BannerAdInner(props: BannerAdProps, forwardedRef: ForwardedRef<HTMLDivElement>) {
  const {
    title,
    subtitle,
    text,
    eyebrow,
    finePrint,
    cta,
    bg,
    config,
    className,
    style,
    size,
    ...customProps
  } = props;

  const mergedTitle = title ?? config?.title;
  const mergedSubtitle = subtitle ?? config?.subtitle;
  const mergedText = text ?? config?.text;
  const mergedEyebrow = eyebrow ?? config?.eyebrow;
  const mergedCta = cta ?? config?.cta;
  const mergedFinePrint = finePrint ?? config?.finePrint;
  const mergedBg = bg ?? config?.bg;
  const mergedSize = size ?? config?.size ?? "md";

  const isStrong = mergedBg === "brand" || mergedBg === "gradient";

  const inlineBg = mergedBg && mergedBg !== "surface" && !isStrong ? { background: mergedBg } : {};

  const subtitleText = mergedSubtitle ?? mergedText;
  const hasBody = !!(mergedEyebrow || mergedTitle || subtitleText || mergedFinePrint);

  return (
    <CustomBanner
      ref={forwardedRef}
      componentType="BannerAd"
      size={mergedSize}
      config={config}
      className={cn("bb-banner-ad", isStrong && "bb-banner-ad--strong", className)}
      style={{ ...inlineBg, ...style }}
      {...customProps}
    >
      {hasBody && (
        <CustomBanner.Body>
          {mergedEyebrow && <CustomBanner.Eyebrow>{mergedEyebrow}</CustomBanner.Eyebrow>}
          {mergedTitle && <CustomBanner.Title>{mergedTitle}</CustomBanner.Title>}
          {subtitleText && <CustomBanner.Subtitle>{subtitleText}</CustomBanner.Subtitle>}
          {mergedFinePrint && <CustomBanner.FinePrint>{mergedFinePrint}</CustomBanner.FinePrint>}
        </CustomBanner.Body>
      )}
      {mergedCta && <CustomBanner.CTA {...mergedCta} />}
      <CustomBanner.Close />
    </CustomBanner>
  );
}

const BannerAd = forwardRef<HTMLDivElement, BannerAdProps>(BannerAdInner);
BannerAd.displayName = "BannerAd";

export { BannerAd };
