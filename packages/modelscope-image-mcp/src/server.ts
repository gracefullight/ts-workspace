import type { CallToolResult } from "@modelcontextprotocol/server";
import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import type { ServerConfig } from "@/config";
import { resolveOutputDir } from "@/config";
import { generateImage } from "@/modelscope-client";
import { rootDirectories } from "@/roots";
import { saveImage } from "@/save-image";
import { VERSION } from "@/version";

const SIZE_PATTERN = /^\d{2,4}x\d{2,4}$/;
const ROOTS_TIMEOUT_MS = 5_000;

export const generateImageInputSchema = z.object({
  prompt: z.string().trim().min(1).describe("Detailed description of the image to generate."),
  model: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe(
      "ModelScope model id, including LoRA repositories. Defaults to the server's configured model.",
    ),
  size: z
    .string()
    .regex(SIZE_PATTERN, "size must look like 1024x1024")
    .optional()
    .describe("Output size as WIDTHxHEIGHT, e.g. 1024x1024 or 768x1344."),
  output_filename: z
    .string()
    .optional()
    .describe("File name without directories. The extension follows the returned image type."),
});

export type GenerateImageInput = z.infer<typeof generateImageInputSchema>;

export interface GenerateImageDeps {
  generate?: typeof generateImage;
  save?: typeof saveImage;
  /** Workspace root directories reported by the client; consulted only when `--output-dir` is unset. */
  listRootDirectories?: () => Promise<string[]>;
}

export async function runGenerateImage(
  config: ServerConfig,
  input: GenerateImageInput,
  deps: GenerateImageDeps = {},
): Promise<CallToolResult> {
  const generate = deps.generate ?? generateImage;
  const save = deps.save ?? saveImage;
  const model = input.model ?? config.defaultModel;

  try {
    const roots =
      config.outputDir || !deps.listRootDirectories ? [] : await deps.listRootDirectories();
    const outputDir = resolveOutputDir(config, roots);
    const image = await generate(
      { apiKey: config.apiKey, baseUrl: config.baseUrl },
      { prompt: input.prompt, model, size: input.size },
    );
    const path = await save(outputDir, image.bytes, image.contentType, input.output_filename);
    const lines = [
      `Image saved to ${path}`,
      `model: ${model}`,
      ...(input.size ? [`size: ${input.size}`] : []),
      `task_id: ${image.taskId}`,
      `url: ${image.imageUrl}`,
    ];
    return { content: [{ type: "text", text: lines.join("\n") }] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      isError: true,
      content: [{ type: "text", text: `Image generation failed: ${message}` }],
    };
  }
}

export function createServer(config: ServerConfig, deps: GenerateImageDeps = {}): McpServer {
  const server = new McpServer({ name: "modelscope-image-mcp", version: VERSION });
  const toolDeps: GenerateImageDeps = {
    listRootDirectories: () => listClientRootDirectories(server),
    ...deps,
  };

  server.registerTool(
    "generate_image",
    {
      title: "Generate image",
      description:
        "Generate an image with a ModelScope API-Inference model (LoRA repository ids supported) " +
        "and save it locally. Returns the saved file path.",
      inputSchema: generateImageInputSchema,
    },
    (input) => runGenerateImage(config, input, toolDeps),
  );

  return server;
}

/** Asks the client for its workspace roots; clients without roots support yield none. */
async function listClientRootDirectories(server: McpServer): Promise<string[]> {
  if (!server.server.getClientCapabilities()?.roots) {
    return [];
  }
  try {
    const { roots } = await server.server.listRoots(undefined, { timeout: ROOTS_TIMEOUT_MS });
    return rootDirectories(roots);
  } catch {
    return [];
  }
}
