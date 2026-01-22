import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import { GetCreditsReportSchema, ListCreditsSchema } from "@/schemas/credits.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { Cafe24CreditListResponse, CreditsReportResponse } from "@/types/credits.js";

export const cafe24_list_credits = async (args: z.infer<typeof ListCreditsSchema>) => {
  try {
    const {
      shop_no,
      start_date,
      end_date,
      type,
      case: caseType,
      admin_id,
      order_id,
      search_field,
      keyword,
      limit,
      offset,
    } = args;

    const response = await makeApiRequest<Cafe24CreditListResponse>(
      "/api/v2/admin/credits",
      "GET",
      undefined,
      {
        shop_no,
        start_date,
        end_date,
        type,
        case: caseType,
        admin_id,
        order_id,
        search_field,
        keyword,
        limit,
        offset,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: response as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Failed to list credits: ${handleApiError(error)}`,
        },
      ],
      isError: true,
    };
  }
};

export const cafe24_get_credits_report = async (args: z.infer<typeof GetCreditsReportSchema>) => {
  try {
    const { shop_no, ...params } = args;
    const response = await makeApiRequest<CreditsReportResponse>(
      "/api/v2/admin/credits/report",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...params,
      },
    );

    const report = response.report;
    const markdown = `## Credits Report
- **Shop No**: ${report.shop_no}
- **Increase Amount**: ${report.increase_amount}
- **Decrease Amount**: ${report.decrease_amount}
- **Credits Total**: ${report.credits_total}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: markdown,
        },
      ],
      structuredContent: report as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Failed to get credits report: ${handleApiError(error)}`,
        },
      ],
      isError: true,
    };
  }
};

export function registerTools(server: McpServer) {
  server.registerTool(
    "cafe24_list_credits",
    {
      title: "List Cafe24 Credits",
      description: "Retrieve a list of credits from Cafe24",
      inputSchema: ListCreditsSchema,
    },
    cafe24_list_credits,
  );

  server.registerTool(
    "cafe24_get_credits_report",
    {
      title: "Get Cafe24 Credits Report",
      description: "Get credits report summary from Cafe24",
      inputSchema: GetCreditsReportSchema,
    },
    cafe24_get_credits_report,
  );
}
