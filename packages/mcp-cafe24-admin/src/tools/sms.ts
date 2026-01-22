import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type SendSMS, SendSMSSchema } from "@/schemas/sms.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { SMSRequest, SMSSendResponse } from "@/types/index.js";

/**
 * Send SMS or LMS messages
 */
async function cafe24_send_sms(params: SendSMS) {
  try {
    const response = await makeApiRequest<SMSSendResponse>(
      "/admin/sms",
      "POST",
      params as unknown as SMSRequest,
    );

    const { queue_code } = response.sms;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully queued SMS/LMS message.\n\n**Queue Code:** ${queue_code}`,
        },
      ],
      structuredContent: response,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
    };
  }
}

/**
 * Register SMS tools
 */
export function registerTools(server: McpServer) {
  server.registerTool(
    "cafe24_send_sms",
    {
      title: "Send SMS",
      description: "Send SMS or LMS messages to customers or numbers",
      inputSchema: SendSMSSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_send_sms,
  );
}
