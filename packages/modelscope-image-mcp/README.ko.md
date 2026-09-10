# @gracefullight/modelscope-image-mcp

> ModelScope API-Inference 이미지 생성을 위한 MCP 서버

[![npm version](https://img.shields.io/npm/v/@gracefullight/modelscope-image-mcp.svg)](https://www.npmjs.com/package/@gracefullight/modelscope-image-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | **한국어**

## 기능

- **ModelScope 비동기 이미지 API** - 작업 제출 후 `/v1/tasks/{id}`를 폴링하고 결과를 다운로드
- **모든 API-Inference 이미지 모델** - 커뮤니티 LoRA 저장소(예: `owner/lora-name`) 포함
- **필수 환경변수 1개** - 나머지는 모두 기본값 제공
- **로컬 파일 저장** - 이미지를 저장하고 절대 경로를 반환
- **모든 stdio MCP 클라이언트** - Claude Desktop, Claude Code, Qwen Code, Cursor 등

## 요구 사항

- Node.js 20+
- ModelScope 액세스 토큰 ([modelscope.ai](https://modelscope.ai) 또는 [modelscope.cn](https://modelscope.cn) 계정 설정에서 발급)

## 빠른 시작

MCP 클라이언트 설정에 서버를 추가합니다.

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

## 설정

필수 환경변수는 `MODELSCOPE_API_TOKEN` 하나입니다(`MODELSCOPE_SDK_TOKEN`도 인식). 선택 CLI 옵션은 다음과 같습니다.

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `--model` | `Qwen/Qwen-Image` | 도구 호출에 `model`이 없을 때 사용할 모델 |
| `--output-dir` | 프로젝트의 `generated-images` | 이미지 저장 디렉터리. 지정하지 않으면 클라이언트가 알려준 워크스페이스 루트([MCP roots](https://modelcontextprotocol.io/specification/2025-06-18/client/roots)) 아래 `generated-images`에 저장하고, 루트 정보가 없으면 서버 작업 디렉터리 아래에 저장 |
| `--base-url` | `https://api-inference.modelscope.ai` | API 기본 URL. ModelScope 중국 사이트는 `https://api-inference.modelscope.cn` |

LoRA 모델과 고정 저장 경로를 쓰는 예시:

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

## 도구: `generate_image`

| 파라미터 | 필수 | 설명 |
|----------|------|------|
| `prompt` | 예 | 생성할 이미지에 대한 상세 설명 |
| `model` | 아니요 | ModelScope 모델 ID(LoRA 저장소 지원). 기본값은 `--model` |
| `size` | 아니요 | `WIDTHxHEIGHT` 형식(예: `1024x1024`, `768x1344`). 지원 크기는 모델마다 다름 |
| `output_filename` | 아니요 | 디렉터리를 제외한 파일 이름. 확장자는 반환된 이미지 형식을 따름 |

성공하면 저장 경로, 모델, 작업 ID, 이미지 URL을 반환합니다. HTTP 오류, 작업 실패, 시간 초과는 도구 오류로 반환합니다.

## 참고

- 생성은 보통 수십 초가 걸립니다. 서버는 5초 간격으로 최대 10분간 폴링합니다.
- 요청은 ModelScope API-Inference 사용량에 포함되며, ModelScope가 콘텐츠 검수로 프롬프트를 거부할 수 있습니다.
- 모델은 사용하는 사이트의 API-Inference에서 제공되어야 합니다. modelscope.ai의 모델이 modelscope.cn에는 없을 수 있습니다.
- 토큰은 API 기본 URL에만 전송되며 이미지 다운로드 호스트에는 전송하지 않습니다.

## 코드에서 사용

```ts
import { generateImage, saveImage } from "@gracefullight/modelscope-image-mcp";

const image = await generateImage(
  { apiKey: process.env.MODELSCOPE_API_TOKEN ?? "", baseUrl: "https://api-inference.modelscope.ai" },
  { prompt: "a red apple on a white table", model: "Qwen/Qwen-Image", size: "1024x1024" },
);

const path = await saveImage("./generated-images", image.bytes, image.contentType, "apple");
```

## 라이선스

MIT
