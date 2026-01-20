import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const SmsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

async function cafe24_get_sms_setting(params: z.infer<typeof SmsParamsSchema>) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/sms/setting", "GET", undefined, queryParams);
    const sms = data.sms || data;

    return {
      content: [
        {
          type: "text" as const,
          text: `## SMS Settings\n\n- **Use SMS**: ${sms.use_sms || "N/A"}\n`,
        },
      ],
      structuredContent: sms as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_sms_setting",
    {
      title: "Get Cafe24 SMS Settings",
      description: "Retrieve SMS usage and configuration settings.",
      inputSchema: SmsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_sms_setting,
  );
}
