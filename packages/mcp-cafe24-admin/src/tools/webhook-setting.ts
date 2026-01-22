import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type WebhookSettingParams,
  WebhookSettingParamsSchema,
  type WebhookSettingUpdateParams,
  WebhookSettingUpdateParamsSchema,
} from "@/schemas/webhook-setting.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { WebhookSetting, WebhookSettingResponse } from "@/types/index.js";

function formatScopes(scopes: string[]): string {
  if (scopes.length === 0) {
    return "None";
  }

  return scopes.map((scope) => `- ${scope}`).join("\n");
}

async function cafe24_get_webhook_setting(_params: WebhookSettingParams) {
  try {
    const data = await makeApiRequest<WebhookSettingResponse>("/admin/webhooks/setting", "GET");
    const responseData = data as { webhook?: Record<string, unknown> } | Record<string, unknown>;
    const webhook = (responseData.webhook || responseData) as WebhookSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            "## Webhook Setting\n\n" +
            `- **Reception Status**: ${webhook.reception_status === "T" ? "Activated" : "Deactivated"}\n` +
            `- **Scopes**:\n${formatScopes(webhook.scopes || [])}\n`,
        },
      ],
      structuredContent: webhook as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_webhook_setting(params: WebhookSettingUpdateParams) {
  try {
    const requestBody = {
      request: {
        reception_status: params.reception_status,
      },
    };

    const data = await makeApiRequest<WebhookSettingResponse>(
      "/admin/webhooks/setting",
      "PUT",
      requestBody,
    );
    const responseData = data as { webhook?: Record<string, unknown> } | Record<string, unknown>;
    const webhook = (responseData.webhook || responseData) as WebhookSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            "## Webhook Setting Updated\n\n" +
            `- **Reception Status**: ${webhook.reception_status === "T" ? "Activated" : "Deactivated"}\n`,
        },
      ],
      structuredContent: webhook as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_webhook_setting",
    {
      title: "Get Cafe24 Webhook Setting",
      description: "Retrieve webhook scopes and reception status.",
      inputSchema: WebhookSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_get_webhook_setting,
  );

  server.registerTool(
    "cafe24_update_webhook_setting",
    {
      title: "Update Cafe24 Webhook Setting",
      description: "Update webhook reception status (activated or deactivated).",
      inputSchema: WebhookSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_webhook_setting,
  );
}
