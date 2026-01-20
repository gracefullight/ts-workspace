import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { AdminUser, Shop, Store, StoreAccount } from "../types.js";

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
    search_type: z.enum(["member_id", "name"]).optional().describe("Search type"),
    keyword: z.string().optional().describe("Search keyword"),
    admin_type: z.enum(["P", "A"]).optional().describe("Admin type: P=Principal, A=Sub-admin"),
  })
  .strict();

const UserDetailParamsSchema = z
  .object({
    user_id: z.string().describe("User ID"),
    shop_no: z.number().int().min(1).default(1).describe("Shop number"),
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
    currency_code: z
      .string()
      .length(3)
      .optional()
      .describe("3-character currency code (e.g., KRW)"),
  })
  .strict();

const StoreAccountsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

async function cafe24_list_users(params: z.infer<typeof UsersSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ users: AdminUser[]; total: number }>(
      "/admin/users",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        search_type: params.search_type,
        keyword: params.keyword,
        admin_type: params.admin_type,
      },
    );

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
                (u) =>
                  `## ${u.user_name} (${u.user_id})\n` +
                  `- **Type**: ${u.admin_type === "P" ? "Principal" : "Sub-admin"}\n` +
                  `- **Email**: ${u.email}\n` +
                  `- **Last Login**: ${u.last_login_date || "Never"}\n` +
                  `- **IP Restriction**: ${u.ip_restriction_type === "A" ? "Active" : "Inactive"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: users.length,
        offset: params.offset,
        users: users,
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

async function cafe24_get_user_detail(params: z.infer<typeof UserDetailParamsSchema>) {
  try {
    const data = await makeApiRequest<{ user: AdminUser }>(
      `/admin/users/${params.user_id}`,
      "GET",
      undefined,
      {
        shop_no: params.shop_no,
      },
    );
    const user = data.user || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## User Details: ${user.user_name} (${user.user_id})\n\n` +
            `- **Shop No**: ${user.shop_no}\n` +
            `- **Type**: ${user.admin_type === "P" ? "Principal" : "Sub-admin"}\n` +
            `- **Nickname**: ${user.nick_name || "N/A"}\n` +
            `- **Mobile**: ${user.phone}\n` +
            `- **Email**: ${user.email}\n` +
            `- **Available**: ${user.available === "T" ? "Yes" : "No"}\n` +
            `- **Memo**: ${user.memo || ""}\n` +
            `- **Multishop Access**: ${user.multishop_access_authority === "T" ? "Yes" : "No"}\n` +
            `- **IP Access Restriction**: ${user.ip_access_restriction?.usage === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: user as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_shops(params: z.infer<typeof ShopsSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ shops: Shop[]; total: number }>(
      "/admin/shops",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        ...(params.shop_no ? { shop_no: params.shop_no } : {}),
      },
    );

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
                (s) =>
                  `## ${s.shop_name} (Shop #${s.shop_no})\n- **Currency**: ${s.currency_code}\n- **Locale**: ${s.locale_code}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: shops.length,
        offset: params.offset,
        shops: shops.map((s) => ({
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
    const data = await makeApiRequest<{ store: Store }>("/admin/store", "GET", undefined, params);
    const store = data.store || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Store Details (Shop #${store.shop_no})\n\n` +
            `- **Mall Name**: ${store.mall_name} (${store.mall_id})\n` +
            `- **Company**: ${store.company_name} (Reg: ${store.company_registration_no})\n` +
            `- **President**: ${store.president_name}\n` +
            `- **Base Domain**: ${store.base_domain}\n` +
            `- **Primary Domain**: ${store.primary_domain || "N/A"}\n` +
            `- **Email**: ${store.email}\n` +
            `- **Phone**: ${store.phone} (CS: ${store.customer_service_phone})\n` +
            `- **Address**: ${store.address1} ${store.address2}\n` +
            `- **Categories**: ${
              Array.isArray(store.sales_product_categories)
                ? store.sales_product_categories.join(", ")
                : "N/A"
            }\n`,
        },
      ],
      structuredContent: store as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_store(params: z.infer<typeof StoreUpdateParamsSchema>) {
  try {
    const data = await makeApiRequest<{ store: Store }>("/admin/store", "PUT", params);
    const store = data.store || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Store updated successfully\n\n- **Mall Name**: ${store.mall_name}\n- **Currency**: ${store.currency_code}\n`,
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

async function cafe24_get_store_accounts(params: z.infer<typeof StoreAccountsParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest<{ accounts: StoreAccount[] }>(
      "/admin/store/accounts",
      "GET",
      undefined,
      queryParams,
    );
    const accounts = data.accounts || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Store Bank Accounts (Shop #${params.shop_no || 1})\n\n` +
            accounts
              .map(
                (account) =>
                  `### ${account.bank_name} (${account.bank_code})\n` +
                  `- **Account Number**: ${account.bank_account_no}\n` +
                  `- **Holder**: ${account.bank_account_holder}\n` +
                  `- **Use Account**: ${account.use_account === "T" ? "Enabled" : "Disabled"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        shop_no: params.shop_no ?? 1,
        accounts: accounts,
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
        "Retrieve a list of admin users. Supports filtering by admin_type (P: Principal, A: Sub), search_type (member_id, name), and keyword.",
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
    "cafe24_get_user_detail",
    {
      title: "Get Cafe24 Admin User Details",
      description:
        "Retrieve detailed information about a specific admin user, including permissions and access settings.",
      inputSchema: UserDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_user_detail,
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

  server.registerTool(
    "cafe24_get_store_accounts",
    {
      title: "Get Cafe24 Store Bank Accounts",
      description: "Retrieve list of bank accounts registered for the shop.",
      inputSchema: StoreAccountsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_store_accounts,
  );
}
