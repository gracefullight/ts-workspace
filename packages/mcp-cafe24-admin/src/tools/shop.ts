import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { Shop } from "../types.js";

const ShopListParamsSchema = z.object({}).strict();

const ShopDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).describe("Multi-shop number"),
  })
  .strict();

async function cafe24_list_shops() {
  try {
    const data = await makeApiRequest<{ shops: Shop[] }>("/admin/shops", "GET");
    const shops = data.shops || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Shop List (${shops.length})\n\n` +
            shops
              .map(
                (shop) =>
                  `### [${shop.shop_no}] ${shop.shop_name} (${shop.default === "T" ? "Default" : "Multi-shop"})\n` +
                  `- **Domain**: ${shop.primary_domain}\n` +
                  `- **Status**: ${shop.active === "T" ? "Active" : "Inactive"}\n` +
                  `- **Language**: ${shop.language_name} (${shop.language_code})\n` +
                  `- **Currency**: ${shop.currency_name} (${shop.currency_code})\n` +
                  `- **HTTPS**: ${shop.is_https_active === "T" ? "Active" : "Inactive"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: shops.length,
        shops: shops,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_shop(params: z.infer<typeof ShopDetailParamsSchema>) {
  try {
    const data = await makeApiRequest<{ shop: Shop }>(`/admin/shops/${params.shop_no}`, "GET");
    const shop = data.shop || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Shop Detail [${shop.shop_no}] ${shop.shop_name}\n\n` +
            `- **Type**: ${shop.default === "T" ? "Default Shop" : "Multi-shop"}\n` +
            `- **Status**: ${shop.active === "T" ? "Active" : "Inactive"}\n` +
            `- **Primary Domain**: ${shop.primary_domain}\n` +
            `- **Base Domain**: ${shop.base_domain}\n` +
            `- **Connected Domains**: ${shop.slave_domain ? shop.slave_domain.join(", ") : "None"}\n\n` +
            `### Localization\n` +
            `- **Country**: ${shop.business_country_code}\n` +
            `- **Language**: ${shop.language_name} (${shop.language_code})\n` +
            `- **Currency**: ${shop.currency_name} (${shop.currency_code})\n` +
            `- **Timezone**: ${shop.timezone_name} (${shop.timezone})\n` +
            `- **Date format**: ${shop.date_format}\n\n` +
            `### Design\n` +
            `- **PC Skin**: ${shop.pc_skin_no || "N/A"}\n` +
            `- **Mobile Skin**: ${shop.mobile_skin_no || "N/A"}\n\n` +
            `### Settings\n` +
            `- **HTTPS**: ${shop.is_https_active === "T" ? "Active" : "Inactive"}\n` +
            `- **Site Connect**: ${shop.site_connect === "T" ? "Allowed" : "Blocked"}\n` +
            `- **Translation**: ${shop.use_translation === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: shop,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_shops",
    {
      title: "List Cafe24 Shops",
      description:
        "Retrieve a list of all multi-shops associated with the account, including basic details like shop number, name, domain, and active status.",
      inputSchema: ShopListParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_shops,
  );

  server.registerTool(
    "cafe24_get_shop",
    {
      title: "Get Cafe24 Shop Detail",
      description:
        "Retrieve detailed information for a specific shop by shop number. Includes domain info, localization settings (language, currency, timezone), design skin IDs, and activity status.",
      inputSchema: ShopDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_shop,
  );
}
