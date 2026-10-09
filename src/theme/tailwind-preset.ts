/**
 * brand-banners — Tailwind preset.
 *
 * Mirrors every design token from `design-style-guide.md` (and `css-source.ts`)
 * as Tailwind theme extensions. Every value resolves to the same CSS custom
 * property used at runtime (`var(--bb-*)`), so light/dark/system theme
 * switching keeps working automatically — Tailwind doesn't need its own
 * darkMode strategy for these utilities.
 *
 * Usage (Tailwind v3+):
 *
 *   import bbPreset from "brand-banners/tailwind-preset";
 *
 *   export default {
 *     presets: [bbPreset],
 *     content: ["./src/your-glob-here"],
 *   };
 *
 * Then utilities like `bg-bb-surface`, `text-bb-on-brand`,
 * `rounded-bb-lg`, etc. become available. The full token table lives in
 * `design-style-guide.md` §10.
 */
const preset = {
  theme: {
    extend: {
      colors: {
        "bb-brand": {
          900: "var(--bb-brand-900)",
          800: "var(--bb-brand-800)",
          700: "var(--bb-brand-700)",
          600: "var(--bb-brand-600)",
        },
        "bb-accent": {
          300: "var(--bb-accent-300)",
          500: "var(--bb-accent-500)",
          600: "var(--bb-accent-600)",
        },
        "bb-pop": {
          500: "var(--bb-pop-500)",
          600: "var(--bb-pop-600)",
        },
        bb: {
          bg: "var(--bb-bg)",
          surface: "var(--bb-surface)",
          "surface-2": "var(--bb-surface-2)",
          text: "var(--bb-text)",
          "text-muted": "var(--bb-text-muted)",
          border: "var(--bb-border)",
          "on-brand": "var(--bb-on-brand)",
          "on-accent": "var(--bb-on-accent)",
          "cta-bg": "var(--bb-cta-bg)",
          "cta-text": "var(--bb-cta-text)",
          "cta-bg-hover": "var(--bb-cta-bg-hover)",
          "focus-ring": "var(--bb-focus-ring)",
          overlay: "var(--bb-overlay)",
        },
      },
      fontFamily: {
        "bb-heading": ["var(--bb-font-heading)"],
        "bb-body": ["var(--bb-font-body)"],
        "bb-display": ["var(--bb-font-display)"],
      },
      fontSize: {
        "bb-xs": "var(--bb-fs-xs)",
        "bb-sm": "var(--bb-fs-sm)",
        "bb-base": "var(--bb-fs-base)",
        "bb-lg": "var(--bb-fs-lg)",
        "bb-xl": "var(--bb-fs-xl)",
        "bb-2xl": "var(--bb-fs-2xl)",
        "bb-3xl": "var(--bb-fs-3xl)",
      },
      fontWeight: {
        "bb-regular": "var(--bb-fw-regular)",
        "bb-medium": "var(--bb-fw-medium)",
        "bb-semibold": "var(--bb-fw-semibold)",
        "bb-bold": "var(--bb-fw-bold)",
        "bb-black": "var(--bb-fw-black)",
      },
      lineHeight: {
        "bb-tight": "var(--bb-lh-tight)",
        "bb-snug": "var(--bb-lh-snug)",
        "bb-normal": "var(--bb-lh-normal)",
      },
      letterSpacing: {
        "bb-tight": "var(--bb-ls-tight)",
        "bb-normal": "var(--bb-ls-normal)",
        "bb-wide": "var(--bb-ls-wide)",
      },
      spacing: {
        "bb-0": "var(--bb-space-0)",
        "bb-1": "var(--bb-space-1)",
        "bb-2": "var(--bb-space-2)",
        "bb-3": "var(--bb-space-3)",
        "bb-4": "var(--bb-space-4)",
        "bb-5": "var(--bb-space-5)",
        "bb-6": "var(--bb-space-6)",
        "bb-8": "var(--bb-space-8)",
        "bb-10": "var(--bb-space-10)",
        "bb-12": "var(--bb-space-12)",
      },
      borderRadius: {
        "bb-sm": "var(--bb-radius-sm)",
        "bb-md": "var(--bb-radius-md)",
        "bb-lg": "var(--bb-radius-lg)",
        "bb-xl": "var(--bb-radius-xl)",
        "bb-pill": "var(--bb-radius-pill)",
      },
      boxShadow: {
        "bb-sm": "var(--bb-shadow-sm)",
        "bb-md": "var(--bb-shadow-md)",
        "bb-lg": "var(--bb-shadow-lg)",
        "bb-cta": "var(--bb-shadow-cta)",
      },
      transitionDuration: {
        "bb-fast": "var(--bb-dur-fast)",
        "bb-base": "var(--bb-dur-base)",
        "bb-slow": "var(--bb-dur-slow)",
      },
      transitionTimingFunction: {
        "bb-out": "var(--bb-ease-out)",
        "bb-in-out": "var(--bb-ease-in-out)",
      },
      zIndex: {
        "bb-inline": "var(--bb-z-inline)",
        "bb-sticky": "var(--bb-z-sticky)",
        "bb-corner": "var(--bb-z-corner)",
        "bb-overlay": "var(--bb-z-overlay)",
      },
      backgroundImage: {
        "bb-brand-gradient": "var(--bb-brand-gradient)",
      },
    },
  },
} as const;

export default preset;
