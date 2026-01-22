import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type WebhookLogsSearchParams,
  WebhookLogsSearchParamsSchema,
} from "@/schemas/webhook-logs.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { WebhookLog, WebhookLogsResponse } from "@/types/index.js";

function formatPayload(label: string, payload?: string | null): string {
  if (!payload) {
    return `- **${label}**: N/A\n`;
  }

  const trimmed = payload.trim();
  if (!trimmed) {
    return `- **${label}**: N/A\n`;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return `- **${label}**:\n\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\`\n`;
  } catch {
    return `- **${label}**: ${payload}\n`;
  }
}

function formatLogType(logType: WebhookLog["log_type"]): string {
  switch (logType) {
    case "G":
      return "Sent";
    case "R":
      return "Resent";
    case "T":
      return "Test sent";
    default:
      return logType;
  }
}

function formatWebhookLog(log: WebhookLog): string {
  return (
    `## Log ${log.log_id}\n` +
    `- **Log Type**: ${formatLogType(log.log_type)}\n` +
    `- **Event No**: ${log.event_no}\n` +
    `- **Mall ID**: ${log.mall_id}\n` +
    `- **Trace ID**: ${log.trace_id}\n` +
    `- **Requested Time**: ${log.requested_time}\n` +
    `- **Endpoint**: ${log.request_endpoint}\n` +
    `- **Success**: ${log.success === "T" ? "Yes" : "No"}\n` +
    `- **Response HTTP**: ${log.response_http_code ?? "N/A"}\n` +
    formatPayload("Request Body", log.request_body) +
    formatPayload("Response Body", log.response_body)
  );
}

async function cafe24_list_webhook_logs(params: WebhookLogsSearchParams) {
  try {
    const data = await makeApiRequest<WebhookLogsResponse>(
      "/admin/webhooks/logs",
      "GET",
      undefined,
      params,
    );

    const logs = data.logs || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Webhook Logs (${logs.length})\n\n` +
            (logs.length > 0 ? logs.map(formatWebhookLog).join("\n") : "No webhook logs found."),
        },
      ],
      structuredContent: {
        count: logs.length,
        logs,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_webhook_logs",
    {
      title: "List Cafe24 Webhook Logs",
      description: "Retrieve webhook delivery logs with optional filters.",
      inputSchema: WebhookLogsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_list_webhook_logs,
  );
}
