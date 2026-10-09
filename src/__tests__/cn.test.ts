import { describe, expect, it } from "vitest";
import { cn } from "../utils/cn";

describe("cn()", () => {
  it("joins truthy strings with spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, null, undefined, "", 0, "b")).toBe("a b");
  });

  it("stringifies truthy numbers", () => {
    expect(cn("a", 1, "b", 42)).toBe("a 1 b 42");
  });

  it("returns an empty string when no truthy values", () => {
    expect(cn(false, null, undefined, "")).toBe("");
    expect(cn()).toBe("");
  });

  it("preserves order so later classes win the CSS cascade", () => {
    expect(cn("bb-default", "user-override")).toBe("bb-default user-override");
  });
});
