const DEFAULT_POLL_INTERVAL_MS = 5_000;
const DEFAULT_TIMEOUT_MS = 10 * 60_000;
const MAX_ERROR_BODY_CHARS = 500;

export interface ModelScopeClientOptions {
  apiKey: string;
  baseUrl: string;
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  pollIntervalMs?: number;
  timeoutMs?: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  model: string;
  size?: string;
}

export interface GeneratedImage {
  taskId: string;
  imageUrl: string;
  contentType: string;
  bytes: Uint8Array;
}

export class ModelScopeError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ModelScopeError";
    this.status = status;
  }
}

interface SubmitResponse {
  task_id?: string;
}

interface TaskResponse {
  task_status?: string;
  output_images?: string[];
  message?: string;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Generates an image through the ModelScope async API:
 * submit with X-ModelScope-Async-Mode, poll /v1/tasks/{id}, then download the first output image.
 */
export async function generateImage(
  options: ModelScopeClientOptions,
  request: ImageGenerationRequest,
  signal?: AbortSignal,
): Promise<GeneratedImage> {
  const fetchFn = options.fetch ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/+$/, "");
  const auth = { Authorization: `Bearer ${options.apiKey}` };

  const body: Record<string, string> = { model: request.model, prompt: request.prompt };
  if (request.size) {
    body.size = request.size;
  }

  const submitResponse = await fetchFn(`${baseUrl}/v1/images/generations`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json", "X-ModelScope-Async-Mode": "true" },
    body: JSON.stringify(body),
    signal,
  });
  const submitted = await readJson<SubmitResponse>(submitResponse, "submit");
  const taskId = submitted.task_id;
  if (!taskId) {
    throw new ModelScopeError(
      `ModelScope submit response did not include task_id: ${truncate(JSON.stringify(submitted))}`,
    );
  }

  const imageUrl = await waitForImageUrl(options, baseUrl, auth, taskId, signal);
  const { contentType, bytes } = await downloadImage(fetchFn, imageUrl, signal);
  return { taskId, imageUrl, contentType, bytes };
}

async function waitForImageUrl(
  options: ModelScopeClientOptions,
  baseUrl: string,
  auth: Record<string, string>,
  taskId: string,
  signal?: AbortSignal,
): Promise<string> {
  const fetchFn = options.fetch ?? fetch;
  const sleep = options.sleep ?? defaultSleep;
  const now = options.now ?? Date.now;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const deadline = now() + timeoutMs;

  for (;;) {
    await sleep(options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS);
    signal?.throwIfAborted();

    const response = await fetchFn(`${baseUrl}/v1/tasks/${encodeURIComponent(taskId)}`, {
      headers: { ...auth, "X-ModelScope-Task-Type": "image_generation" },
      signal,
    });
    const task = await readJson<TaskResponse>(response, "poll");

    const imageUrl = imageUrlFromTask(task, taskId);
    if (imageUrl) {
      return imageUrl;
    }
    if (now() >= deadline) {
      throw new ModelScopeError(
        `ModelScope task ${taskId} did not finish within ${Math.round(timeoutMs / 1000)}s ` +
          `(last status: ${task.task_status ?? "unknown"})`,
      );
    }
  }
}

/** Returns the first output image of a finished task, throws for failed tasks, or undefined while pending. */
function imageUrlFromTask(task: TaskResponse, taskId: string): string | undefined {
  if (task.task_status === "FAILED") {
    throw new ModelScopeError(
      `ModelScope task ${taskId} failed: ${truncate(task.message ?? JSON.stringify(task))}`,
    );
  }
  if (task.task_status !== "SUCCEED") {
    return undefined;
  }
  const imageUrl = task.output_images?.[0];
  if (!imageUrl) {
    throw new ModelScopeError(`ModelScope task ${taskId} succeeded without output_images`);
  }
  return imageUrl;
}

async function downloadImage(
  fetchFn: typeof fetch,
  imageUrl: string,
  signal?: AbortSignal,
): Promise<{ contentType: string; bytes: Uint8Array }> {
  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    throw new ModelScopeError(`ModelScope returned an invalid image URL: ${truncate(imageUrl)}`);
  }
  if (url.protocol !== "https:") {
    throw new ModelScopeError(`ModelScope returned a non-HTTPS image URL: ${truncate(imageUrl)}`);
  }

  // The access token is intentionally not sent to the image host.
  const response = await fetchFn(url, { signal });
  if (!response.ok) {
    throw new ModelScopeError(
      `Image download failed with HTTP ${response.status}`,
      response.status,
    );
  }
  const contentType = (response.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!contentType.startsWith("image/")) {
    throw new ModelScopeError(
      `Downloaded content is not an image (${contentType || "unknown content type"})`,
    );
  }
  return { contentType, bytes: new Uint8Array(await response.arrayBuffer()) };
}

async function readJson<T>(response: Response, stage: string): Promise<T> {
  const text = await response.text();
  if (!response.ok) {
    throw new ModelScopeError(
      `ModelScope ${stage} failed with HTTP ${response.status}: ${truncate(text)}`,
      response.status,
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ModelScopeError(
      `ModelScope ${stage} returned invalid JSON (HTTP ${response.status})`,
      response.status,
    );
  }
}

function truncate(value: string): string {
  return value.length > MAX_ERROR_BODY_CHARS ? `${value.slice(0, MAX_ERROR_BODY_CHARS)}…` : value;
}
