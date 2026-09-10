import { resolve } from "node:path";
import { parseArgs } from "node:util";

export const DEFAULT_BASE_URL = "https://api-inference.modelscope.ai";
export const DEFAULT_MODEL = "Qwen/Qwen-Image";
export const DEFAULT_OUTPUT_DIR = "generated-images";

/** The first key is canonical; the second keeps compatibility with the Python modelscope-image-mcp. */
export const TOKEN_ENV_KEYS = ["MODELSCOPE_API_TOKEN", "MODELSCOPE_SDK_TOKEN"] as const;

export interface ServerConfig {
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
  /** Absolute `--output-dir`. When unset, images go to the client's workspace root. */
  outputDir?: string;
  cwd: string;
}

export function resolveConfig(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd(),
): ServerConfig {
  const { values } = parseArgs({
    args: argv,
    options: {
      model: { type: "string" },
      "output-dir": { type: "string" },
      "base-url": { type: "string" },
    },
    strict: true,
    allowPositionals: false,
  });

  const apiKey = TOKEN_ENV_KEYS.map((key) => env[key]?.trim()).find(Boolean);
  if (!apiKey) {
    throw new Error(`Set ${TOKEN_ENV_KEYS[0]} to your ModelScope access token.`);
  }

  const outputDir = values["output-dir"];
  return {
    apiKey,
    baseUrl: normalizeBaseUrl(values["base-url"] ?? DEFAULT_BASE_URL),
    defaultModel: values.model ?? DEFAULT_MODEL,
    ...(outputDir ? { outputDir: resolve(cwd, outputDir) } : {}),
    cwd,
  };
}

/**
 * Chooses where images are saved: the explicit `--output-dir`, otherwise `generated-images`
 * under the first workspace root reported by the client, otherwise under the working directory.
 */
export function resolveOutputDir(config: ServerConfig, rootDirectories: string[] = []): string {
  return config.outputDir ?? resolve(rootDirectories[0] ?? config.cwd, DEFAULT_OUTPUT_DIR);
}

function normalizeBaseUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`--base-url must be a valid URL: ${value}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`--base-url must use HTTPS: ${value}`);
  }
  return url.toString().replace(/\/+$/, "");
}
