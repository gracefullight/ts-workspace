import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { Menu } from "../types.js";

const AdminMenusSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    mode: z
      .enum(["new_pro", "mobile_admin"])
      .default("new_pro")
      .describe("Menu mode (new_pro: PC admin, mobile_admin: Mobile admin)"),
    menu_no: z.string().optional().describe("Menu number(s), comma-separated for multiple"),
    contains_app_url: z
      .enum(["T", "F"])
      .optional()
      .describe("Filter by app URL inclusion (T: Included, F: Not included)"),
  })
  .strict();

async function cafe24_list_admin_menus(params: z.infer<typeof AdminMenusSearchParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {
      shop_no: params.shop_no,
      mode: params.mode,
    };

    if (params.menu_no) {
      queryParams.menu_no = params.menu_no;
    }

    if (params.contains_app_url) {
      queryParams.contains_app_url = params.contains_app_url;
    }

    const data = await makeApiRequest<{ menus: Menu[] }>(
      "/admin/menus",
      "GET",
      undefined,
      queryParams,
    );
    const menus = data.menus || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${menus.length} admin menus\n\n` +
            menus
              .map(
                (m) =>
                  `## ${m.name} (${m.menu_no})\n` +
                  `- **Shop No**: ${m.shop_no}\n` +
                  `- **Mode**: ${m.mode}\n` +
                  `- **Path**: ${m.path}\n` +
                  `- **Contains App URL**: ${m.contains_app_url === "T" ? "Yes" : "No"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: menus.length,
        menus: menus.map((m) => ({
          shop_no: m.shop_no,
          mode: m.mode,
          menu_no: m.menu_no,
          name: m.name,
          path: m.path,
          contains_app_url: m.contains_app_url === "T",
        })),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_admin_menus",
    {
      title: "List Cafe24 Admin Menus",
      description:
        "Retrieve a list of admin menus from Cafe24. Returns menu details including menu number, name, path, and app URL status. Supports filtering by shop number, mode, menu number list, and app URL inclusion.",
      inputSchema: AdminMenusSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_admin_menus,
  );
}
