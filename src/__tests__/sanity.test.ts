import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { VERSION } from "../index";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };

describe("brand-banners (sanity)", () => {
  it("exposes a VERSION constant matching package.json semver", () => {
    expect(VERSION).toBe(pkg.version);
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
