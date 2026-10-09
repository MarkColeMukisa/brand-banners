import { describe, expect, it } from "vitest";
import { cssSource } from "../theme/css-source";

describe("cssSource", () => {
  it("defines the brand / accent token core", () => {
    expect(cssSource).toMatch(/--bb-brand-900:\s*#0B2E2A/);
    expect(cssSource).toMatch(/--bb-brand-800:\s*#0F3D38/);
    expect(cssSource).toMatch(/--bb-accent-500:\s*#B6F23D/);
    expect(cssSource).toMatch(/--bb-pop-500:\s*#7C4DFF/);
  });

  it("includes the signature brand gradient", () => {
    expect(cssSource).toMatch(/--bb-brand-gradient:\s*linear-gradient/);
  });

  it("defines light theme tokens on the base .bb-root scope", () => {
    expect(cssSource).toMatch(/\.bb-root\s*\{[\s\S]*?--bb-bg:\s*#FFFFFF/);
    expect(cssSource).toMatch(/--bb-text:\s*#0E1726/);
  });

  it("defines an explicit dark theme override", () => {
    expect(cssSource).toMatch(/\.bb-root\[data-bb-theme="dark"\]\s*\{[\s\S]*?--bb-bg:\s*#0B0F14/);
  });

  it("defines a system theme dark fallback via prefers-color-scheme", () => {
    expect(cssSource).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
    expect(cssSource).toMatch(/\.bb-root\[data-bb-theme="system"\]/);
  });

  it("honors prefers-reduced-motion inside the scope", () => {
    expect(cssSource).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(cssSource).toMatch(/transition-duration:\s*0\.001ms\s*!important/);
  });

  it("scopes every rule under .bb-root (no leaking global selectors)", () => {
    expect(cssSource).not.toMatch(/^\s*:root\s*\{/m);
    expect(cssSource).not.toMatch(/^\s*html\s*\{/m);
    expect(cssSource).not.toMatch(/^\s*body\s*\{/m);
    expect(cssSource).not.toMatch(/^\s*\*\s*\{/m);
  });

  it("anchors every component rule to .bb-root so host element selectors can't repaint it", () => {
    // Collect selector lines: everything outside a declaration block that
    // isn't an at-rule.
    const selectorLines: string[] = [];
    let inDeclarations = false;
    for (const raw of cssSource.replace(/\/\*[\s\S]*?\*\//g, "").split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      if (inDeclarations) {
        if (line === "}") inDeclarations = false;
        continue;
      }
      if (line === "}" || line.startsWith("@")) continue;
      selectorLines.push(line);
      if (line.endsWith("{")) inDeclarations = true;
    }
    expect(selectorLines.length).toBeGreaterThan(80);
    for (const line of selectorLines) {
      expect(line).toMatch(/^\.bb-root/);
    }
  });

  it("gives rules of a kind equal specificity: one class for roots, two for the parts inside", () => {
    const rootRules = cssSource.match(/^\s*\.bb-root:where\(.+\)(,| \{)$/gm) ?? [];
    const partRules = cssSource.match(/^\s*\.bb-root\.bb-root :where\(.+\)(,| \{)$/gm) ?? [];
    expect(rootRules.length).toBeGreaterThan(25);
    expect(partRules.length).toBeGreaterThan(60);

    // Root rules only ever target the banner / slot element itself…
    // (`:has(> …)` conditions aside, the selector has no descendant step.)
    for (const rule of rootRules) {
      expect(rule.replace(/:has\([^)]*\)/g, "")).toMatch(
        /:where\(\.bb-(banner|ad-slot)[^ ]*\)(,| \{)$/,
      );
    }
    // …and nothing component-level escapes the :where() wrapper.
    expect(cssSource).not.toMatch(/^\s*\.bb-(banner|ad-slot)/m);
    expect(cssSource).not.toMatch(/^\s*\.bb-root :where\(/m);
  });

  it("ships the content-height card preset", () => {
    expect(cssSource).toMatch(/\.bb-banner\[data-bb-size="card"\]\) \{[\s\S]*?display:\s*grid/);
    expect(cssSource).toMatch(/grid-template-areas:\s*"body media" "cta media"/);
  });

  it("colors the close button from the banner, not the page theme", () => {
    expect(cssSource).toMatch(/\.bb-banner__close\) \{[^}]*color:\s*inherit/);
  });

  it("ships the full type-scale + spacing + radii + shadow + motion + z-index sets", () => {
    expect(cssSource).toMatch(/--bb-fs-3xl:\s*3rem/);
    expect(cssSource).toMatch(/--bb-space-12:\s*3rem/);
    expect(cssSource).toMatch(/--bb-radius-pill:\s*9999px/);
    expect(cssSource).toMatch(/--bb-shadow-cta:/);
    expect(cssSource).toMatch(/--bb-ease-out:\s*cubic-bezier/);
    expect(cssSource).toMatch(/--bb-z-overlay:\s*1200/);
  });
});
