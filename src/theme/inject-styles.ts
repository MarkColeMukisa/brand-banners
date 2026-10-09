import { cssSource } from "./css-source";
import { VERSION } from "../version";

const STYLE_TAG_ID = "bb-injected-styles";
const STYLE_TAG_VERSION_ATTR = "data-bb-version";

let injected = false;

/**
 * Idempotently inject the package stylesheet into `document.head`.
 * SSR-safe: a no-op when `document` is not defined.
 *
 * Inserted at the start of `<head>` so consumer styles cascade after and win
 * any specificity-tied rules. See the note at the top of the component
 * styles in `css-source.ts` for how much each rule weighs.
 */
export function injectStyles(): void {
  if (typeof document === "undefined") return;
  if (injected) return;

  if (document.getElementById(STYLE_TAG_ID)) {
    injected = true;
    return;
  }

  const tag = document.createElement("style");
  tag.id = STYLE_TAG_ID;
  tag.setAttribute(STYLE_TAG_VERSION_ATTR, VERSION);
  tag.textContent = cssSource;

  const head = document.head ?? document.getElementsByTagName("head")[0];
  if (head) {
    head.insertBefore(tag, head.firstChild);
  } else {
    document.documentElement.appendChild(tag);
  }

  injected = true;
}

/**
 * Test-only helper. Not part of the public package exports (kept out of
 * `src/index.ts`); tests import this from the relative module path.
 */
export function __resetInjectStateForTests(): void {
  injected = false;
  if (typeof document !== "undefined") {
    document.getElementById(STYLE_TAG_ID)?.remove();
  }
}
