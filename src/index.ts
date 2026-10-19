export { VERSION } from "./version";

// Theme
export { ThemeProvider, injectStyles, useResolvedTheme, useSystemTheme, useTheme } from "./theme";

// Hooks
export {
  useDismiss,
  useInjectStyles,
  useInView,
  useIsomorphicLayoutEffect,
  usePrefersReducedMotion,
} from "./hooks";

// Primitives
export {
  BannerBody,
  BannerCTA,
  BannerClose,
  BannerEyebrow,
  BannerFinePrint,
  BannerMedia,
  BannerSubtitle,
  BannerTitle,
  CustomBanner,
  SlotContext,
  useSlotContext,
  type BannerCTAProps,
  type CustomBannerProps,
  type SlotContextValue,
} from "./primitives";

// Components
export {
  AdSlot,
  BannerAd,
  BannerRotator,
  BrandBanners,
  BrandedBanner,
  MediaBanner,
  type AdSlotProps,
  type BannerAdProps,
  type BrandBannersProps,
  type BrandedBannerProps,
  type CycleCompleteMeta,
  type MediaBannerProps,
  type RotateOptions,
} from "./components";

// Utils
export {
  cn,
  composeRefs,
  createExpiringStorage,
  createForeverStorage,
  createSessionStorage,
  isSlotDismissed,
  mergeConfigAndProps,
  type ClassValue,
  type IsSlotDismissedOptions,
} from "./utils";

// Types
export type {
  AdMeta,
  BannerConfig,
  BrandColors,
  CTA,
  ImageInput,
  MediaSpec,
  OnClick,
  OnClose,
  OnView,
  Position,
  ResolvedTheme,
  SizePreset,
  StorageAdapter,
  ThemeMode,
} from "./types";
