import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const UsersSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
  })
  .strict();

const ShopsSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    shop_no: z.number().optional().describe("Filter by specific shop number"),
  })
  .strict();

const StoreDetailParamsSchema = z
  .object({
    shop_no: z.number().optional().describe("Shop number for multi-store malls"),
  })
  .strict();

const StoreUpdateParamsSchema = z
  .object({
    mall_name: z.string().optional().describe("Mall name"),
    shop_name: z.string().optional().describe("Shop name"),
    currency_code: z
      .string()
      .length(3)
      .optional()
      .describe("3-character currency code (e.g., KRW)"),
  })
  .strict();

async function cafe24_list_users(params: z.infer<typeof UsersSearchParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/users", "GET", undefined, {
      limit: params.limit,
      offset: params.offset,
    });

    const users = data.users || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} admin users (showing ${users.length})\n\n` +
            users
              .map(
                (u: any) =>
                  `## ${u.user_name || u.member_id} (${u.user_id})\n- **Email**: ${u.email}\n- **Group**: ${u.group || "N/A"}\n- **Status**: ${u.status}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: users.length,
        offset: params.offset,
        users: users.map((u: any) => ({
          id: u.user_id,
          name: u.user_name,
          email: u.email,
          group: u.group,
          status: u.status,
        })),
        has_more: total > params.offset + users.length,
        ...(total > params.offset + users.length
          ? { next_offset: params.offset + users.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_shops(params: z.infer<typeof ShopsSearchParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/shops", "GET", undefined, {
      limit: params.limit,
      offset: params.offset,
      ...(params.shop_no ? { shop_no: params.shop_no } : {}),
    });

    const shops = data.shops || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} shops (showing ${shops.length})\n\n` +
            shops
              .map(
                (s: any) =>
                  `## ${s.shop_name} (Shop #${s.shop_no})\n- **Currency**: ${s.currency_code}\n- **Locale**: ${s.locale_code}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: shops.length,
        offset: params.offset,
        shops: shops.map((s: any) => ({
          id: s.shop_no.toString(),
          name: s.shop_name,
          currency: s.currency_code,
          locale: s.locale_code,
        })),
        has_more: total > params.offset + shops.length,
        ...(total > params.offset + shops.length
          ? { next_offset: params.offset + shops.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_store(params: z.infer<typeof StoreDetailParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/store", "GET", undefined, params);
    const store = data.store || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Store Details\n\n` +
            `- **Mall ID**: ${store.mall_id}\n` +
            `- **Mall Name**: ${store.mall_name}\n` +
            `- **Shop No**: ${store.shop_no}\n` +
            `- **Currency**: ${store.currency_code}\n` +
            `- **Currency Symbol**: ${store.currency_symbol}\n`,
        },
      ],
      structuredContent: {
        mall_id: store.mall_id,
        mall_name: store.mall_name,
        shop_no: store.shop_no,
        currency_code: store.currency_code,
        currency_symbol: store.currency_symbol,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_store(params: z.infer<typeof StoreUpdateParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/store", "PUT", params);
    const store = data.store || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Store updated successfully\n\n` +
            `- **Mall Name**: ${store.mall_name}\n` +
            `- **Shop Name**: ${store.shop_name}\n` +
            `- **Currency**: ${store.currency_code}\n`,
        },
      ],
      structuredContent: {
        mall_id: store.mall_id,
        mall_name: store.mall_name,
        shop_no: store.shop_no,
        currency_code: store.currency_code,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_users",
    {
      title: "List Cafe24 Admin Users",
      description:
        "Retrieve a list of admin users in Cafe24. Returns user details including ID, name, email, group, and status. Supports pagination and filtering by member ID, email, or name.",
      inputSchema: UsersSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_users,
  );

  server.registerTool(
    "cafe24_list_shops",
    {
      title: "List Cafe24 Shops",
      description:
        "Retrieve a list of shops in Cafe24. Returns shop details including shop number, name, currency, and locale. Supports pagination and filtering by shop number.",
      inputSchema: ShopsSearchParamsSchema,
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
    "cafe24_get_store",
    {
      title: "Get Cafe24 Store Details",
      description:
        "Retrieve detailed information about the Cafe24 store including mall ID, mall name, shop number, currency code, and currency symbol. Use shop_no parameter for multi-store malls.",
      inputSchema: StoreDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_store,
  );

  server.registerTool(
    "cafe24_update_store",
    {
      title: "Update Cafe24 Store Settings",
      description:
        "Update store information including mall name, shop name, and currency code. Only provided fields will be updated.",
      inputSchema: StoreUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_store,
  );
}
