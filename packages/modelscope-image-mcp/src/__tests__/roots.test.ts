import { describe, expect, it } from "vitest";
import { rootDirectories } from "@/roots.js";

describe("rootDirectories", () => {
  it("converts file URIs to paths in order", () => {
    expect(
      rootDirectories([{ uri: "file:///work/app" }, { uri: "file:///work/with%20space" }]),
    ).toEqual(["/work/app", "/work/with space"]);
  });

  it("skips non-file and malformed URIs", () => {
    expect(
      rootDirectories([
        { uri: "https://example.com/repo" },
        { uri: "file://remote-host/share" },
        { uri: "file:///work/app" },
      ]),
    ).toEqual(["/work/app"]);
  });

  it("returns an empty list when there are no roots", () => {
    expect(rootDirectories([])).toEqual([]);
  });
});
