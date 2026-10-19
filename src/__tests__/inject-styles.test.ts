import { afterEach, describe, expect, it } from "vitest";
import pkg from "../../package.json";
import { __resetInjectStateForTests, injectStyles } from "../theme/inject-styles";

describe("injectStyles", () => {
  afterEach(() => {
    __resetInjectStateForTests();
  });

  it("injects a <style> tag containing the package CSS", () => {
    expect(document.getElementById("bb-injected-styles")).toBeNull();
    injectStyles();
    const tag = document.getElementById("bb-injected-styles");
    expect(tag).not.toBeNull();
    expect(tag?.tagName).toBe("STYLE");
    expect(tag?.textContent).toContain("--bb-brand-900");
    expect(tag?.textContent).toContain(".bb-root");
  });

  it("tags the injected element with the package version for debugging", () => {
    injectStyles();
    const tag = document.getElementById("bb-injected-styles");
    expect(tag?.getAttribute("data-bb-version")).toBe(pkg.version);
  });

  it("is idempotent — repeated calls produce a single tag", () => {
    injectStyles();
    injectStyles();
    injectStyles();
    expect(document.querySelectorAll("#bb-injected-styles")).toHaveLength(1);
  });

  it("inserts the style tag at the start of <head> so consumer styles cascade after", () => {
    const userStyle = document.createElement("style");
    userStyle.id = "user-style";
    document.head.appendChild(userStyle);

    injectStyles();
    expect((document.head.firstChild as HTMLElement | null)?.id).toBe("bb-injected-styles");

    userStyle.remove();
  });
});
