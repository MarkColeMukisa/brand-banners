import { describe, expect, it } from "vitest";
import { SIZE_PRESETS, getSizeMeta } from "../utils/size-presets";

describe("SIZE_PRESETS", () => {
  it("covers every documented preset", () => {
    expect(Object.keys(SIZE_PRESETS).sort()).toEqual(
      [
        "sm",
        "md",
        "lg",
        "leaderboard",
        "social",
        "halfpage",
        "banner",
        "fullwidth-strip",
        "card",
      ].sort(),
    );
  });

  it("uses the IAB standard dimensions for named presets", () => {
    expect(SIZE_PRESETS["leaderboard"]).toMatchObject({ width: "930px", height: "180px" });
    expect(SIZE_PRESETS["social"]).toMatchObject({ width: "1200px", height: "628px" });
    expect(SIZE_PRESETS["halfpage"]).toMatchObject({ width: "300px", height: "600px" });
    expect(SIZE_PRESETS["banner"]).toMatchObject({ width: "468px" });
    expect(SIZE_PRESETS["fullwidth-strip"]).toMatchObject({ width: "100%" });
  });

  it("stacks halfpage/social vertically by default", () => {
    expect(SIZE_PRESETS["halfpage"]?.flexDirection).toBe("column");
    expect(SIZE_PRESETS["social"]?.flexDirection).toBe("column");
  });

  it("sm/md/lg give content-height min-heights only", () => {
    expect(SIZE_PRESETS["sm"]).toEqual({ minHeight: "56px" });
    expect(SIZE_PRESETS["md"]).toEqual({ minHeight: "72px" });
    expect(SIZE_PRESETS["lg"]).toEqual({ minHeight: "96px" });
  });

  it("card is width-only, so its height follows the content", () => {
    expect(SIZE_PRESETS["card"]).toEqual({ width: "520px" });
  });

  it("getSizeMeta returns undefined for undefined input", () => {
    expect(getSizeMeta(undefined)).toBeUndefined();
  });

  it("getSizeMeta returns the matching preset", () => {
    expect(getSizeMeta("banner")).toBe(SIZE_PRESETS["banner"]);
  });
});
