import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { Customer, CustomerSetting } from "../types.js";

const CustomersSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    member_id: z.string().optional().describe("Filter by member ID"),
    email: z.string().optional().describe("Filter by email"),
    name: z.string().optional().describe("Filter by name"),
  })
  .strict();

const CustomerDetailParamsSchema = z
  .object({
    member_id: z.string().describe("Member ID"),
  })
  .strict();

const CustomerSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const CustomerSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    simple_member_join: z
      .enum(["T", "F"])
      .optional()
      .describe("Join form display: T=Basic, F=Detailed"),
    member_authentication: z
      .enum(["T", "F"])
      .optional()
      .describe("Member authentication: T=Yes, F=No"),
    minimum_age_restriction: z
      .enum(["M", "T", "F"])
      .optional()
      .describe("Under 14 restriction: M=After auth, T=Direct use, F=No join"),
    join_standard: z.enum(["id", "email"]).optional().describe("Join standard: id or email"),
    use_update_birthday: z
      .enum(["T", "F"])
      .optional()
      .describe("Allow birthday update: T=Yes, F=No"),
  })
  .strict();

async function cafe24_list_customers(params: z.infer<typeof CustomersSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ customers: Customer[]; total: number }>(
      "/admin/customers",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        ...(params.member_id ? { member_id: params.member_id } : {}),
        ...(params.email ? { email: params.email } : {}),
        ...(params.name ? { member_name: params.name } : {}),
      },
    );

    const customers = data.customers || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} customers (showing ${customers.length})\n\n` +
            customers
              .map(
                (c) =>
                  `## ${c.member_name || c.member_id} (${c.member_id})\n` +
                  `- **Email**: ${c.email}\n` +
                  `- **Phone**: ${c.phone || "N/A"}\n` +
                  `- **Join Date**: ${c.join_date}\n` +
                  `- **Group**: ${c.group || "N/A"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: customers.length,
        offset: params.offset,
        customers: customers.map((c) => ({
          id: c.member_id,
          name: c.member_name,
          email: c.email,
          phone: c.phone,
          birthdate: c.birthdate,
          gender: c.gender,
          join_date: c.join_date,
          group: c.group,
        })),
        has_more: total > params.offset + customers.length,
        ...(total > params.offset + customers.length
          ? {
              next_offset: params.offset + customers.length,
            }
          : {}),
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_customer(params: z.infer<typeof CustomerDetailParamsSchema>) {
  try {
    const data = await makeApiRequest<{ customer: Customer }>(
      `/admin/customers/${params.member_id}`,
      "GET",
    );
    const customer = data.customer || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Customer Details\n\n` +
            `- **Member ID**: ${customer.member_id}\n` +
            `- **Name**: ${customer.member_name}\n` +
            `- **Email**: ${customer.email}\n` +
            `- **Phone**: ${customer.phone || "N/A"}\n` +
            `- **Birthdate**: ${customer.birthdate || "N/A"}\n` +
            `- **Gender**: ${customer.gender || "N/A"}\n` +
            `- **Join Date**: ${customer.join_date}\n`,
        },
      ],
      structuredContent: {
        id: customer.member_id,
        name: customer.member_name,
        email: customer.email,
        phone: customer.phone,
        birthdate: customer.birthdate,
        gender: customer.gender,
        join_date: customer.join_date,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_customer_setting(params: z.infer<typeof CustomerSettingParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest<{ customer: CustomerSetting }>(
      "/admin/customers/setting",
      "GET",
      undefined,
      queryParams,
    );
    const customer = data.customer || data;

    const joinFormMap: Record<string, string> = { T: "Basic fields", F: "Detailed fields" };
    const ageRestrictionMap: Record<string, string> = {
      M: "After authentication",
      T: "Direct use without auth",
      F: "No registration allowed",
    };
    const genderMap: Record<string, string> = { B: "None", M: "Male only", F: "Female only" };

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Customer Settings (Shop #${customer.shop_no || 1})\n\n` +
            `- **Join Form**: ${joinFormMap[customer.simple_member_join] || customer.simple_member_join}\n` +
            `- **Member Auth**: ${customer.member_authentication === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Under 14 Restriction**: ${ageRestrictionMap[customer.minimum_age_restriction] || customer.minimum_age_restriction}\n` +
            `- **Under 19 Restriction**: ${customer.adult_age_restriction === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Gender Restriction**: ${genderMap[customer.gender_restriction] || customer.gender_restriction}\n` +
            `- **Rejoin Restriction**: ${customer.member_rejoin_restriction === "T" ? `${customer.member_rejoin_restriction_day} days` : "Disabled"}\n` +
            `- **Join Standard**: ${customer.join_standard}\n` +
            `- **Display Group**: ${customer.display_group === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        shop_no: customer.shop_no ?? 1,
        simple_member_join: customer.simple_member_join,
        member_authentication: customer.member_authentication,
        minimum_age_restriction: customer.minimum_age_restriction,
        adult_age_restriction: customer.adult_age_restriction,
        adult_purchase_restriction: customer.adult_purchase_restriction,
        adult_image_restriction: customer.adult_image_restriction,
        gender_restriction: customer.gender_restriction,
        member_rejoin_restriction: customer.member_rejoin_restriction,
        member_rejoin_restriction_day: customer.member_rejoin_restriction_day,
        password_authentication: customer.password_authentication,
        member_join_confirmation: customer.member_join_confirmation,
        email_duplication: customer.email_duplication,
        password_recovery: customer.password_recovery,
        link_social_account: customer.link_social_account,
        save_member_id: customer.save_member_id,
        unregistration_admin_approval: customer.unregistration_admin_approval,
        unregistration_reason: customer.unregistration_reason,
        display_group: customer.display_group,
        join_standard: customer.join_standard,
        use_update_birthday: customer.use_update_birthday,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_customer_setting(
  params: z.infer<typeof CustomerSettingUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest<{ customer: CustomerSetting }>(
      "/admin/customers/setting",
      "PUT",
      requestBody,
    );
    const customer = data.customer || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Customer Settings Updated (Shop #${customer.shop_no || 1})\n\n` +
            `- **Join Form**: ${customer.simple_member_join === "T" ? "Basic" : "Detailed"}\n` +
            `- **Member Auth**: ${customer.member_authentication === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Join Standard**: ${customer.join_standard}\n`,
        },
      ],
      structuredContent: {
        shop_no: customer.shop_no ?? 1,
        simple_member_join: customer.simple_member_join,
        member_authentication: customer.member_authentication,
        minimum_age_restriction: customer.minimum_age_restriction,
        join_standard: customer.join_standard,
        use_update_birthday: customer.use_update_birthday,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_customers",
    {
      title: "List Cafe24 Customers",
      description:
        "Retrieve a list of customers from Cafe24. Returns customer details including member ID, name, email, phone, birthdate, gender, join date, and group. Supports pagination and filtering by member ID, email, or name.",
      inputSchema: CustomersSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_customers,
  );

  server.registerTool(
    "cafe24_get_customer",
    {
      title: "Get Cafe24 Customer Details",
      description:
        "Retrieve detailed information about a specific customer by member ID. Returns complete customer details including personal information and join date.",
      inputSchema: CustomerDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_customer,
  );

  server.registerTool(
    "cafe24_get_customer_setting",
    {
      title: "Get Cafe24 Customer Settings",
      description:
        "Retrieve customer/member settings including join form type, authentication, age restrictions, gender restrictions, rejoin policy, password recovery, SNS linking, and display options.",
      inputSchema: CustomerSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_customer_setting,
  );

  server.registerTool(
    "cafe24_update_customer_setting",
    {
      title: "Update Cafe24 Customer Settings",
      description:
        "Update customer/member settings including join form type (T=Basic, F=Detailed), authentication, age restrictions (M/T/F), join standard (id/email), and birthday update permission.",
      inputSchema: CustomerSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_customer_setting,
  );
}
