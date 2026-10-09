declare const __BB_VERSION__: string | undefined;

/**
 * Package version. Injected from `package.json` by the build (tsup) and the
 * test runner (vitest), so it cannot drift. The fallback only shows when the
 * source is consumed directly, e.g. by the playground's Vite alias.
 */
export const VERSION: string = typeof __BB_VERSION__ !== "undefined" ? __BB_VERSION__ : "0.0.0-dev";
