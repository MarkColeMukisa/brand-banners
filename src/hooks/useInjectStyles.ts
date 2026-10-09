import { injectStyles } from "../theme/inject-styles";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Auto-injects the package stylesheet on mount. Idempotent and SSR-safe.
 *
 * Every banner primitive calls this internally, so a consumer who only imports
 * a single banner gets the styles automatically without needing
 * `import "brand-banners/styles.css"`. For SSR-rendered initial paint
 * (no FOUC), import the stylesheet explicitly in your root.
 */
export function useInjectStyles(): void {
  useIsomorphicLayoutEffect(() => {
    injectStyles();
  }, []);
}
