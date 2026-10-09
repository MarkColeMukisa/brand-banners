import { defineConfig } from "tsup";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const CSS_SOURCE_FILE = resolve("src/theme/css-source.ts");
const CSS_DEST_FILE = resolve("dist/styles.css");
const CLIENT_BUNDLES = [resolve("dist/index.js"), resolve("dist/index.cjs")];
const CLIENT_DIRECTIVE = '"use client";';

/**
 * Extract the canonical CSS string from `src/theme/css-source.ts` and write
 * it to `dist/styles.css` for consumers who prefer an explicit stylesheet
 * import (SSR-rendered apps, no-FOUC setups).
 *
 * Regex parsing keeps this build step free of runtime TS imports — works
 * with any bundler or CI setup without needing a separate transform.
 */
async function extractCss(): Promise<void> {
  const source = await readFile(CSS_SOURCE_FILE, "utf8");
  const match = source.match(/cssSource\s*=\s*String\.raw\s*`([\s\S]*?)`\s*\.trim\s*\(\s*\)/);
  const captured = match?.[1];
  if (typeof captured !== "string") {
    throw new Error(
      `[tsup] Could not extract canonical CSS from ${CSS_SOURCE_FILE}. ` +
        "Expected pattern: `export const cssSource = String.raw`...`.trim()`.",
    );
  }
  await mkdir(dirname(CSS_DEST_FILE), { recursive: true });
  await writeFile(CSS_DEST_FILE, captured.trim() + "\n");
}

/**
 * Mark the component bundle as a client module so it can be imported
 * straight into a Next.js App Router server component (every export uses
 * hooks or context). Done here, not with tsup's `banner`, because the
 * tree-shaking pass drops module-level directives. Prepended without a
 * newline so sourcemap line numbers stay valid.
 */
async function markClientBundles(): Promise<void> {
  for (const file of CLIENT_BUNDLES) {
    const code = await readFile(file, "utf8");
    if (!code.startsWith(CLIENT_DIRECTIVE)) await writeFile(file, CLIENT_DIRECTIVE + code);
  }
}

export default defineConfig(async () => {
  const pkg = JSON.parse(await readFile(resolve("package.json"), "utf8")) as { version: string };
  return {
    define: { __BB_VERSION__: JSON.stringify(pkg.version) },
    entry: {
      index: "src/index.ts",
      "tailwind-preset": "src/theme/tailwind-preset.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    splitting: false,
    target: "es2020",
    external: ["react", "react-dom", "react/jsx-runtime"],
    outDir: "dist",
    onSuccess: async () => {
      await extractCss();
      await markClientBundles();
    },
  };
});
