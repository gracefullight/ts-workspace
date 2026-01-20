import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const PointsSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
  })
  .strict();

const PointsSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    point_issuance_standard: z
      .enum(["C", "P"])
      .optional()
      .describe("Point issuance standard: C=After Delivery, P=After Purchase Confirmation"),
    payment_period: z
      .number()
      .int()
      .optional()
      .describe("Payment period (days): 0, 1, 3, 7, 14, 20 depending on standard"),
    name: z.string().optional().describe("Point name (e.g., Mileage)"),
    format: z.string().optional().describe("Point display format (e.g., $[:PRICE:])"),
    round_unit: z
      .enum(["F", "0.01", "0.1", "1", "10", "100", "1000"])
      .optional()
      .describe("Rounding unit: F=None, or specific unit"),
    round_type: z
      .enum(["A", "B", "C"])
      .optional()
      .describe("Rounding type: A=Down, B=Half-up, C=Up"),
    display_type: z
      .enum(["P", "W", "WP", "PW"])
      .optional()
      .describe("Display type: P=Rate, W=Amount, WP=Amount/Rate, PW=Rate/Amount"),
    unusable_points_change_type: z
      .enum(["M", "T"])
      .optional()
      .describe("Unusable points conversion: M=First date, T=Last date"),
    join_point: z.string().optional().describe("Join point amount"),
    use_email_agree_point: z
      .enum(["T", "F"])
      .optional()
      .describe("Points for email consent: T=Yes, F=No"),
    use_sms_agree_point: z
      .enum(["T", "F"])
      .optional()
      .describe("Points for SMS consent: T=Yes, F=No"),
    agree_change_type: z
      .enum(["T", "F", "P"])
      .optional()
      .describe("Consent change type: T=Possible, F=Impossible, P=Period restricted"),
    agree_restriction_period: z
      .number()
      .int()
      .optional()
      .describe("Restriction period (months): 1, 3, 6, 12"),
    agree_point: z.string().optional().describe("Consent point amount"),
  })
  .strict();

async function cafe24_get_points_setting(params: z.infer<typeof PointsSettingParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/points/setting", "GET", undefined, {
      shop_no: params.shop_no,
    });
    const point = data.point || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Points/Mileage Settings (Shop #${point.shop_no})\n\n` +
            `- **Name**: ${point.name}\n` +
            `- **Issuance Standard**: ${point.point_issuance_standard === "C" ? "After Delivery" : "After Purchase Confirmation"}\n` +
            `- **Payment Period**: ${point.payment_period} days\n` +
            `- **Join Point**: ${point.join_point}\n` +
            `- **Format**: ${point.format}\n` +
            `- **Rounding**: ${point.round_type} / Unit: ${point.round_unit}\n` +
            `- **Email Consent Points**: ${point.use_email_agree_point === "T" ? "Yes" : "No"}\n` +
            `- **SMS Consent Points**: ${point.use_sms_agree_point === "T" ? "Yes" : "No"}\n` +
            `- **Consent Points Amount**: ${point.agree_point}\n`,
        },
      ],
      structuredContent: point as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_points_setting(
  params: z.infer<typeof PointsSettingUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;
    const data = await makeApiRequest("/admin/points/setting", "PUT", {
      shop_no,
      request: settings,
    });
    const point = data.point || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Points settings updated for Shop #${point.shop_no}`,
        },
      ],
      structuredContent: point as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_points_setting",
    {
      title: "Get Cafe24 Points Settings",
      description:
        "Retrieve points/mileage configuration settings including issuance standards, naming, formatting, and consent rewards.",
      inputSchema: PointsSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_points_setting,
  );

  server.registerTool(
    "cafe24_update_points_setting",
    {
      title: "Update Cafe24 Points Settings",
      description:
        "Update points/mileage configuration settings. Only provided fields will be updated.",
      inputSchema: PointsSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_points_setting,
  );
}
