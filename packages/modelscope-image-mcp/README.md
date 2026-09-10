# @gracefullight/modelscope-image-mcp

> MCP server for ModelScope API-Inference image generation

[![npm version](https://img.shields.io/npm/v/@gracefullight/modelscope-image-mcp.svg)](https://www.npmjs.com/package/@gracefullight/modelscope-image-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** | [한국어](./README.ko.md)

## Features

- **Async ModelScope image API** - Submits a task, polls `/v1/tasks/{id}`, and downloads the result
- **Any API-Inference image model** - Including community LoRA repositories (e.g. `owner/lora-name`)
- **One required environment variable** - Everything else has sensible defaults
- **Local files** - Saves the image and returns its absolute path
- **Any stdio MCP client** - Claude Desktop, Claude Code, Qwen Code, Cursor, and more

## Requirements

- Node.js 20+
- A ModelScope access token (from your account settings on [modelscope.ai](https://modelscope.ai) or [modelscope.cn](https://modelscope.cn))

## Quick Start

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "modelscope-image": {
      "command": "npx",
      "args": ["-y", "@gracefullight/modelscope-image-mcp"],
      "env": {
        "MODELSCOPE_API_TOKEN": "ms-..."
      }
    }
  }
}
```

Claude Code:

```bash
claude mcp add modelscope-image -e MODELSCOPE_API_TOKEN=ms-... -- npx -y @gracefullight/modelscope-image-mcp
```

## Configuration

The only required environment variable is `MODELSCOPE_API_TOKEN` (`MODELSCOPE_SDK_TOKEN` is also accepted). Optional CLI flags:

| Flag | Default | Description |
|------|---------|-------------|
| `--model` | `Qwen/Qwen-Image` | Model used when a tool call omits `model` |
| `--output-dir` | `generated-images` in the project | Directory for saved images. Without it, images go to `generated-images` under the client's workspace root ([MCP roots](https://modelcontextprotocol.io/specification/2025-06-18/client/roots)), or under the server's working directory if the client reports no roots |
| `--base-url` | `https://api-inference.modelscope.ai` | API base URL. Use `https://api-inference.modelscope.cn` for ModelScope China |

Example with a LoRA model and a fixed output directory:

```json
{
  "mcpServers": {
    "modelscope-image": {
      "command": "npx",
      "args": [
        "-y",
        "@gracefullight/modelscope-image-mcp",
        "--model",
        "owner/lora-name",
        "--output-dir",
        "/Users/me/Pictures/modelscope"
      ],
      "env": {
        "MODELSCOPE_API_TOKEN": "ms-..."
      }
    }
  }
}
```

## Tool: `generate_image`

| Parameter | Required | Description |
|-----------|----------|-------------|
| `prompt` | Yes | Detailed description of the image |
| `model` | No | ModelScope model id (LoRA repositories supported). Defaults to `--model` |
| `size` | No | `WIDTHxHEIGHT`, e.g. `1024x1024` or `768x1344`. Supported sizes depend on the model |
| `output_filename` | No | File name without directories. The extension follows the returned image type |

On success the tool returns the saved path, model, task id, and image URL. Failures (HTTP errors, failed tasks, timeouts) are returned as tool errors.

## Notes

- Generation usually takes tens of seconds. The server polls every 5 seconds for up to 10 minutes.
- Requests count against your ModelScope API-Inference quota, and ModelScope may reject prompts through content moderation.
- A model must be served by the API-Inference endpoint of the site you use; a model on modelscope.ai may not exist on modelscope.cn.
- The token is sent only to the API base URL, never to the image download host.

## Programmatic Usage

```ts
import { generateImage, saveImage } from "@gracefullight/modelscope-image-mcp";

const image = await generateImage(
  { apiKey: process.env.MODELSCOPE_API_TOKEN ?? "", baseUrl: "https://api-inference.modelscope.ai" },
  { prompt: "a red apple on a white table", model: "Qwen/Qwen-Image", size: "1024x1024" },
);

const path = await saveImage("./generated-images", image.bytes, image.contentType, "apple");
```

## License

MIT
