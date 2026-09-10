import { describe, expect, it, vi } from "vitest";
import type { ServerConfig } from "@/config.js";
import { generateImageInputSchema, runGenerateImage } from "@/server.js";

const config: ServerConfig = {
  apiKey: "ms-test",
  baseUrl: "https://api.example.com",
  defaultModel: "Qwen/Qwen-Image",
  cwd: "/work/cwd",
};

const generatedImage = {
  taskId: "task-1",
  imageUrl: "https://cdn.example.com/cat.png",
  contentType: "image/png",
  bytes: new Uint8Array([1]),
};

describe("generateImageInputSchema", () => {
  it("accepts a prompt-only input and trims it", () => {
    expect(generateImageInputSchema.parse({ prompt: " a cat " })).toEqual({ prompt: "a cat" });
  });

  it("rejects empty prompts", () => {
    expect(generateImageInputSchema.safeParse({ prompt: "  " }).success).toBe(false);
  });

  it("rejects malformed sizes", () => {
    expect(generateImageInputSchema.safeParse({ prompt: "cat", size: "1024*1024" }).success).toBe(
      false,
    );
  });
});

describe("runGenerateImage", () => {
  it("saves into the first workspace root and reports the saved path", async () => {
    const generate = vi.fn().mockResolvedValue(generatedImage);
    const save = vi.fn().mockResolvedValue("/work/app/generated-images/cat.png");
    const listRootDirectories = vi.fn().mockResolvedValue(["/work/app", "/work/other"]);

    const result = await runGenerateImage(
      config,
      { prompt: "a cat", output_filename: "cat" },
      { generate, save, listRootDirectories },
    );

    expect(generate).toHaveBeenCalledWith(
      { apiKey: "ms-test", baseUrl: "https://api.example.com" },
      { prompt: "a cat", model: "Qwen/Qwen-Image", size: undefined },
    );
    expect(save).toHaveBeenCalledWith(
      "/work/app/generated-images",
      generatedImage.bytes,
      "image/png",
      "cat",
    );
    expect(result.isError).toBeUndefined();
    expect(result.content).toEqual([
      {
        type: "text",
        text: [
          "Image saved to /work/app/generated-images/cat.png",
          "model: Qwen/Qwen-Image",
          "task_id: task-1",
          "url: https://cdn.example.com/cat.png",
        ].join("\n"),
      },
    ]);
  });

  it("falls back to the working directory when the client reports no roots", async () => {
    const save = vi.fn().mockResolvedValue("/work/cwd/generated-images/x.png");

    await runGenerateImage(
      config,
      { prompt: "a cat" },
      {
        generate: vi.fn().mockResolvedValue(generatedImage),
        save,
        listRootDirectories: vi.fn().mockResolvedValue([]),
      },
    );

    expect(save.mock.calls[0][0]).toBe("/work/cwd/generated-images");
  });

  it("uses --output-dir without asking the client for roots", async () => {
    const save = vi.fn().mockResolvedValue("/pictures/x.png");
    const listRootDirectories = vi.fn();

    await runGenerateImage(
      { ...config, outputDir: "/pictures" },
      { prompt: "a cat" },
      { generate: vi.fn().mockResolvedValue(generatedImage), save, listRootDirectories },
    );

    expect(save.mock.calls[0][0]).toBe("/pictures");
    expect(listRootDirectories).not.toHaveBeenCalled();
  });

  it("prefers the model and size from the tool call", async () => {
    const generate = vi.fn().mockResolvedValue(generatedImage);

    await runGenerateImage(
      config,
      { prompt: "a cat", model: "raharoo/krumb3r1", size: "768x1344" },
      { generate, save: vi.fn().mockResolvedValue("/tmp/out/x.png") },
    );

    expect(generate).toHaveBeenCalledWith(expect.anything(), {
      prompt: "a cat",
      model: "raharoo/krumb3r1",
      size: "768x1344",
    });
  });

  it("returns an error result instead of throwing", async () => {
    const generate = vi.fn().mockRejectedValue(new Error("task failed"));
    const save = vi.fn();

    const result = await runGenerateImage(config, { prompt: "a cat" }, { generate, save });

    expect(result).toEqual({
      isError: true,
      content: [{ type: "text", text: "Image generation failed: task failed" }],
    });
    expect(save).not.toHaveBeenCalled();
  });
});
