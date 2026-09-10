import { describe, expect, it } from "vitest";
import type { ServerConfig } from "@/config.js";
import { DEFAULT_BASE_URL, DEFAULT_MODEL, resolveConfig, resolveOutputDir } from "@/config.js";

describe("resolveConfig", () => {
  const env = { MODELSCOPE_API_TOKEN: "ms-test" };

  it("uses defaults when only the token is set", () => {
    expect(resolveConfig([], env, "/work")).toEqual({
      apiKey: "ms-test",
      baseUrl: DEFAULT_BASE_URL,
      defaultModel: DEFAULT_MODEL,
      cwd: "/work",
    });
  });

  it("applies CLI flags", () => {
    const config = resolveConfig(
      [
        "--model",
        "raharoo/krumb3r1",
        "--output-dir",
        "out",
        "--base-url",
        "https://api-inference.modelscope.cn/",
      ],
      env,
      "/work",
    );

    expect(config).toMatchObject({
      defaultModel: "raharoo/krumb3r1",
      outputDir: "/work/out",
      baseUrl: "https://api-inference.modelscope.cn",
    });
  });

  it("falls back to MODELSCOPE_SDK_TOKEN", () => {
    expect(resolveConfig([], { MODELSCOPE_SDK_TOKEN: " ms-sdk " }, "/work").apiKey).toBe("ms-sdk");
  });

  it("throws when no token is set", () => {
    expect(() => resolveConfig([], {}, "/work")).toThrow(/MODELSCOPE_API_TOKEN/);
  });

  it("rejects non-HTTPS base URLs", () => {
    expect(() => resolveConfig(["--base-url", "http://example.com"], env, "/work")).toThrow(
      /HTTPS/,
    );
  });

  it("rejects unknown flags", () => {
    expect(() => resolveConfig(["--unknown"], env, "/work")).toThrow();
  });
});

describe("resolveOutputDir", () => {
  const config: ServerConfig = {
    apiKey: "ms-test",
    baseUrl: DEFAULT_BASE_URL,
    defaultModel: DEFAULT_MODEL,
    cwd: "/work/cwd",
  };

  it("prefers --output-dir over workspace roots", () => {
    expect(resolveOutputDir({ ...config, outputDir: "/pictures" }, ["/work/app"])).toBe(
      "/pictures",
    );
  });

  it("uses the first workspace root", () => {
    expect(resolveOutputDir(config, ["/work/app", "/work/other"])).toBe(
      "/work/app/generated-images",
    );
  });

  it("falls back to the working directory", () => {
    expect(resolveOutputDir(config)).toBe("/work/cwd/generated-images");
  });
});
