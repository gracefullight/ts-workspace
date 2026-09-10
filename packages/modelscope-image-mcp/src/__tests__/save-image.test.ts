import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { saveImage, toFileStem } from "@/save-image.js";

describe("toFileStem", () => {
  it("discards directories and extensions", () => {
    expect(toFileStem("../../etc/cat.png")).toBe("cat");
  });

  it("replaces unsafe characters", () => {
    expect(toFileStem("my cat!.jpg")).toBe("my_cat");
  });

  it("generates a timestamped name when the name is empty or unusable", () => {
    const date = new Date("2026-09-10T12:34:56.789Z");
    expect(toFileStem(undefined, date, "abcd1234")).toBe("20260910-123456-abcd1234");
    expect(toFileStem("...", date, "abcd1234")).toBe("20260910-123456-abcd1234");
  });
});

describe("saveImage", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "modelscope-image-mcp-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("writes bytes with an extension matching the content type", async () => {
    const bytes = new Uint8Array([1, 2, 3]);

    const path = await saveImage(join(dir, "nested"), bytes, "image/webp", "cat.png");

    expect(path).toBe(join(dir, "nested", "cat.webp"));
    expect(Array.from(await readFile(path))).toEqual([1, 2, 3]);
  });

  it("keeps the file inside the output directory", async () => {
    const path = await saveImage(dir, new Uint8Array([1]), "image/png", "../../escape.png");

    expect(dirname(path)).toBe(dir);
  });

  it("falls back to .png for unknown image types", async () => {
    const path = await saveImage(dir, new Uint8Array([1]), "image/x-unknown", "odd");

    expect(path.endsWith("odd.png")).toBe(true);
  });
});
