import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

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

async function cafe24_list_customers(params: z.infer<typeof CustomersSearchParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/customers", "GET", undefined, {
      limit: params.limit,
      offset: params.offset,
      ...(params.member_id ? { member_id: params.member_id } : {}),
      ...(params.email ? { email: params.email } : {}),
      ...(params.name ? { member_name: params.name } : {}),
    });

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
                (c: any) =>
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
        customers: customers.map((c: any) => ({
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
    const data = await makeApiRequest(`/admin/customers/${params.member_id}`, "GET");
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
}
