import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { AutomessageArgument, AutomessageSetting } from "../types.js";

/**
 * Schema for getting automessage arguments
 */
const AutomessageArgumentsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

/**
 * Schema for getting automessage settings
 */
const AutomessageSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

/**
 * Schema for updating automessage settings
 */
const AutomessageSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    send_method: z
      .enum(["S", "K"])
      .describe("Auto message send method: S=SMS, K=KakaoAlimtalk (fallback to SMS on failure)"),
    send_method_push: z
      .enum(["T", "F"])
      .optional()
      .describe("Send push first to push recipients: T=Yes, F=No"),
  })
  .strict();

/**
 * Retrieve automessage arguments/placeholders
 *
 * GET /api/v2/admin/automessages/arguments
 *
 * Returns available placeholders for automessages like [NAME], [PRODUCT], etc.
 */
async function cafe24_get_automessage_arguments(
  params: z.infer<typeof AutomessageArgumentsParamsSchema>,
) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest<{ arguments: AutomessageArgument[] }>(
      "/admin/automessages/arguments",
      "GET",
      undefined,
      queryParams,
    );

    const args = data.arguments || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Automessage Arguments\n\n` +
            `Found ${args.length} available placeholders:\n\n` +
            args
              .map(
                (a) =>
                  `### ${a.name}\n` +
                  `- **Description**: ${a.description}\n` +
                  `- **Sample**: ${a.sample}\n` +
                  `- **Max Length**: ${a.string_length} chars\n` +
                  `- **Send Case**: ${a.send_case}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: args.length,
        arguments: args.map((a: AutomessageArgument) => ({
          shop_no: a.shop_no,
          name: a.name,
          description: a.description,
          sample: a.sample,
          string_length: a.string_length,
          send_case: a.send_case,
        })),
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

/**
 * Retrieve automessage settings
 *
 * GET /api/v2/admin/automessages/setting
 *
 * Returns current automessage configuration including SMS, KakaoAlimtalk, and Push settings
 */
async function cafe24_get_automessage_setting(
  params: z.infer<typeof AutomessageSettingParamsSchema>,
) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest<{ automessages: AutomessageSetting } | AutomessageSetting>(
      "/admin/automessages/setting",
      "GET",
      undefined,
      queryParams,
    );
    const settings = (data as any).automessages || data;

    const useSmsText = settings.use_sms === "T" ? "Enabled" : "Disabled";
    const useKakaoText = settings.use_kakaoalimtalk === "T" ? "Enabled" : "Disabled";
    const usePushText = settings.use_push === "T" ? "Enabled" : "Disabled";
    const sendMethodText = settings.send_method === "S" ? "SMS" : "KakaoAlimtalk (SMS fallback)";
    const sendMethodPushText =
      settings.send_method_push === "T" ? "Push First" : "No Push Priority";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Automessage Settings (Shop #${settings.shop_no || 1})\n\n` +
            `- **SMS**: ${useSmsText}\n` +
            `- **KakaoAlimtalk**: ${useKakaoText}\n` +
            `- **Push**: ${usePushText}\n` +
            `- **Send Method**: ${sendMethodText}\n` +
            `- **Push Priority**: ${sendMethodPushText}\n`,
        },
      ],
      structuredContent: {
        shop_no: settings.shop_no ?? 1,
        use_sms: settings.use_sms,
        use_kakaoalimtalk: settings.use_kakaoalimtalk,
        use_push: settings.use_push,
        send_method: settings.send_method,
        send_method_push: settings.send_method_push,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

/**
 * Update automessage settings
 *
 * PUT /api/v2/admin/automessages/setting
 *
 * Updates the automessage send method and push priority settings
 */
async function cafe24_update_automessage_setting(
  params: z.infer<typeof AutomessageSettingUpdateParamsSchema>,
) {
  try {
    const requestBody: Record<string, unknown> = {
      shop_no: params.shop_no ?? 1,
      request: {
        send_method: params.send_method,
      },
    };

    if (params.send_method_push !== undefined) {
      requestBody.request.send_method_push = params.send_method_push;
    }

    const data = await makeApiRequest<{ automessages: AutomessageSetting } | AutomessageSetting>(
      "/admin/automessages/setting",
      "PUT",
      requestBody,
    );

    const settings = (data as any).automessages || data;

    const sendMethodText = settings.send_method === "S" ? "SMS" : "KakaoAlimtalk (SMS fallback)";
    const sendMethodPushText =
      settings.send_method_push === "T" ? "Push First" : "No Push Priority";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Automessage Settings Updated (Shop #${settings.shop_no || 1})\n\n` +
            `- **Send Method**: ${sendMethodText}\n` +
            `- **Push Priority**: ${sendMethodPushText}\n`,
        },
      ],
      structuredContent: {
        shop_no: settings.shop_no ?? 1,
        send_method: settings.send_method,
        send_method_push: settings.send_method_push,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

/**
 * Register all automessage-related tools with the MCP server
 */
export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_automessage_arguments",
    {
      title: "Get Cafe24 Automessage Arguments",
      description:
        "Retrieve available placeholders/arguments for automessages like [NAME], [PRODUCT], etc. Returns the name, description, sample value, max length, and applicable send cases for each placeholder.",
      inputSchema: AutomessageArgumentsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_automessage_arguments,
  );

  server.registerTool(
    "cafe24_get_automessage_setting",
    {
      title: "Get Cafe24 Automessage Settings",
      description:
        "Retrieve current automessage configuration including SMS, KakaoAlimtalk, and Push notification settings. Shows whether each channel is enabled and the current send method.",
      inputSchema: AutomessageSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_automessage_setting,
  );

  server.registerTool(
    "cafe24_update_automessage_setting",
    {
      title: "Update Cafe24 Automessage Settings",
      description:
        "Update automessage send method (SMS or KakaoAlimtalk with SMS fallback) and push notification priority settings.",
      inputSchema: AutomessageSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_update_automessage_setting,
  );
}
