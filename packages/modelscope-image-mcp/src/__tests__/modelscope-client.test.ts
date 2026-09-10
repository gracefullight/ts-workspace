import { describe, expect, it, vi } from "vitest";
import type { ModelScopeClientOptions } from "@/modelscope-client.js";
import { generateImage, ModelScopeError } from "@/modelscope-client.js";

const PNG_BYTES = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const IMAGE_URL = "https://cdn.example.com/result.png";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function png(): Response {
  return new Response(PNG_BYTES, { headers: { "Content-Type": "image/png" } });
}

function setup(responses: Response[]) {
  const fetchMock = vi.fn(async (_input: string | URL | Request, _init?: RequestInit) => {
    const next = responses.shift();
    if (!next) {
      throw new Error("unexpected fetch call");
    }
    return next;
  });
  let clock = 0;
  const options: ModelScopeClientOptions = {
    apiKey: "ms-secret",
    baseUrl: "https://api.example.com/",
    fetch: fetchMock as unknown as typeof fetch,
    sleep: async (ms) => {
      clock += ms;
    },
    now: () => clock,
    pollIntervalMs: 1_000,
    timeoutMs: 3_000,
  };
  return { fetchMock, options };
}

function headersOf(init: RequestInit | undefined): Record<string, string> {
  return (init?.headers ?? {}) as Record<string, string>;
}

describe("generateImage", () => {
  it("submits an async task, polls until it succeeds, and downloads the image", async () => {
    const { fetchMock, options } = setup([
      json({ task_status: "SUCCEED", task_id: "task-1" }),
      json({ task_status: "PENDING" }),
      json({ task_status: "SUCCEED", output_images: [IMAGE_URL] }),
      png(),
    ]);

    const result = await generateImage(options, {
      prompt: "a red apple",
      model: "raharoo/krumb3r1",
      size: "1024x1024",
    });

    expect(result).toMatchObject({
      taskId: "task-1",
      imageUrl: IMAGE_URL,
      contentType: "image/png",
    });
    expect(Array.from(result.bytes)).toEqual(Array.from(PNG_BYTES));
    expect(fetchMock).toHaveBeenCalledTimes(4);

    const [submitUrl, submitInit] = fetchMock.mock.calls[0];
    expect(submitUrl).toBe("https://api.example.com/v1/images/generations");
    expect(submitInit?.method).toBe("POST");
    expect(headersOf(submitInit)).toMatchObject({
      Authorization: "Bearer ms-secret",
      "X-ModelScope-Async-Mode": "true",
    });
    expect(JSON.parse(submitInit?.body as string)).toEqual({
      model: "raharoo/krumb3r1",
      prompt: "a red apple",
      size: "1024x1024",
    });

    const [pollUrl, pollInit] = fetchMock.mock.calls[1];
    expect(pollUrl).toBe("https://api.example.com/v1/tasks/task-1");
    expect(headersOf(pollInit)).toMatchObject({
      Authorization: "Bearer ms-secret",
      "X-ModelScope-Task-Type": "image_generation",
    });

    const [downloadUrl, downloadInit] = fetchMock.mock.calls[3];
    expect(String(downloadUrl)).toBe(IMAGE_URL);
    expect(headersOf(downloadInit)).not.toHaveProperty("Authorization");
  });

  it("omits size when it is not provided", async () => {
    const { fetchMock, options } = setup([
      json({ task_id: "task-1" }),
      json({ task_status: "SUCCEED", output_images: [IMAGE_URL] }),
      png(),
    ]);

    await generateImage(options, { prompt: "a cup", model: "Qwen/Qwen-Image" });

    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
      model: "Qwen/Qwen-Image",
      prompt: "a cup",
    });
  });

  it("throws when the task fails", async () => {
    const { options } = setup([
      json({ task_id: "task-1" }),
      json({ task_status: "FAILED", message: "content blocked" }),
    ]);

    await expect(generateImage(options, { prompt: "x", model: "m" })).rejects.toThrow(
      /task-1 failed: content blocked/,
    );
  });

  it("throws after the polling timeout", async () => {
    const { fetchMock, options } = setup([
      json({ task_id: "task-1" }),
      json({ task_status: "RUNNING" }),
      json({ task_status: "RUNNING" }),
      json({ task_status: "RUNNING" }),
    ]);

    await expect(generateImage(options, { prompt: "x", model: "m" })).rejects.toThrow(
      /did not finish within 3s \(last status: RUNNING\)/,
    );
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("surfaces HTTP errors without leaking the token", async () => {
    const { options } = setup([json({ message: "invalid model" }, 400)]);

    const error = await generateImage(options, { prompt: "x", model: "m" }).catch((e) => e);

    expect(error).toBeInstanceOf(ModelScopeError);
    expect(error.status).toBe(400);
    expect(error.message).toMatch(/submit failed with HTTP 400/);
    expect(error.message).not.toContain("ms-secret");
  });

  it("rejects downloads that are not images", async () => {
    const { options } = setup([
      json({ task_id: "task-1" }),
      json({ task_status: "SUCCEED", output_images: [IMAGE_URL] }),
      new Response("<html></html>", { headers: { "Content-Type": "text/html" } }),
    ]);

    await expect(generateImage(options, { prompt: "x", model: "m" })).rejects.toThrow(
      /not an image \(text\/html\)/,
    );
  });

  it("rejects non-HTTPS image URLs", async () => {
    const { fetchMock, options } = setup([
      json({ task_id: "task-1" }),
      json({ task_status: "SUCCEED", output_images: ["http://cdn.example.com/a.png"] }),
    ]);

    await expect(generateImage(options, { prompt: "x", model: "m" })).rejects.toThrow(/non-HTTPS/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
