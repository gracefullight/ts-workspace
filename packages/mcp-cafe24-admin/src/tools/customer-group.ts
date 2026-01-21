import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  CommonParamsSchema,
  CustomerGroupParamsSchema,
  CustomerGroupsCountParamsSchema,
  CustomerGroupsSearchParamsSchema,
  MoveCustomerToGroupParamsSchema,
} from "@/schemas/customer-group.js";
import type {
  CommonParams,
  CustomerGroup,
  CustomerGroupParams,
  CustomerGroupSettingResponse,
  CustomerGroupsCountParams,
  CustomerGroupsSearchParams,
  MoveCustomerToGroupParams,
} from "@/types/index.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_customer_groups(params: CustomerGroupsSearchParams) {
  try {
    const data = await makeApiRequest("/admin/customergroups", "GET", undefined, params);
    const responseData = data as
      | { customergroups?: Record<string, unknown>[] }
      | Record<string, unknown>;
    const customergroups = (responseData.customergroups || []) as CustomerGroup[];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${customergroups.length} customer groups\n\n` +
            customergroups
              .map(
                (g) =>
                  `## [${g.group_no}] ${g.group_name}\n` +
                  `- **Description**: ${g.group_description || "N/A"}\n` +
                  `- **Buy Benefits**: ${g.buy_benefits}\n` +
                  `- **Ship Benefits**: ${g.ship_benefits === "T" ? "Free" : "Paid"}\n` +
                  `- **Pay Method**: ${g.benefits_paymethod === "A" ? "All" : g.benefits_paymethod === "B" ? "Cash" : "Non-cash"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: customergroups.length,
        customergroups,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_customer_groups(params: CustomerGroupsCountParams) {
  try {
    const data = await makeApiRequest<{ count: number }>(
      "/admin/customergroups/count",
      "GET",
      undefined,
      params,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Total customer group count: ${data.count}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_retrieve_customer_group(params: CustomerGroupParams) {
  try {
    const { group_no, ...queryParams } = params;
    const data = await makeApiRequest<{ customergroup: CustomerGroup }>(
      `/admin/customergroups/${group_no}`,
      "GET",
      undefined,
      queryParams,
    );
    const g = data.customergroup;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Customer Group: ${g.group_name} (${g.group_no})\n\n` +
            `- **Description**: ${g.group_description || "N/A"}\n` +
            `- **Buy Benefits**: ${g.buy_benefits}\n` +
            `- **Ship Benefits**: ${g.ship_benefits === "T" ? "Free" : "Paid"}\n` +
            `- **Pay Method**: ${g.benefits_paymethod === "A" ? "All" : g.benefits_paymethod === "B" ? "Cash" : "Non-cash"}\n` +
            `- **Product Availability**: ${g.product_availability}\n` +
            (g.discount_information
              ? `\n### Discount Information\n- **Amount Product**: ${g.discount_information.amount_product}\n- **Amount Discount**: ${g.discount_information.amount_discount} (${g.discount_information.discount_unit})\n`
              : "") +
            (g.points_information
              ? `\n### Points Information\n- **Amount Product**: ${g.points_information.amount_product}\n- **Amount Discount**: ${g.points_information.amount_discount} (${g.points_information.discount_unit})\n`
              : ""),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_move_customers_to_group(params: MoveCustomerToGroupParams) {
  try {
    const { group_no, ...requestBody } = params;
    const data = await makeApiRequest<{
      customers: Array<{
        shop_no: number;
        group_no: number;
        member_id: string;
        fixed_group: string;
      }>;
    }>(`/admin/customergroups/${group_no}/customers`, "POST", requestBody);

    const customers = data.customers || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully moved ${customers.length} customers to group #${group_no}.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_retrieve_customer_group_setting(params: CommonParams) {
  try {
    const data = await makeApiRequest<CustomerGroupSettingResponse>(
      "/admin/customergroups/setting",
      "GET",
      undefined,
      params,
    );
    const s = data.customergroup;

    return {
      content: [
        {
          type: "text" as const,
          text:
            "# Customer Group Setting\n\n" +
            `- **Shop No**: ${s.shop_no}\n` +
            `- **Auto Update**: ${s.auto_update === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Use Auto Update**: ${s.use_auto_update === "T" ? "Yes (In use)" : "No (Paused)"}\n` +
            `- **Tier Upgrade Basis**: ${s.customer_tier_criteria}\n` +
            `- **Purchase Amount Definition**: ${s.standard_purchase_amount}\n` +
            `- **Offline Purchase Amount**: ${s.offline_purchase_amount ?? "N/A"}\n` +
            `- **Purchase Count Definition**: ${s.standard_purchase_count}\n` +
            `- **Offline Purchase Count**: ${s.offline_purchase_count ?? "N/A"}\n` +
            `- **Auto Update Criteria**: ${s.auto_update_criteria}\n` +
            `- **Deduct Cancellation/Refund**: ${s.deduct_cancellation_refund === "T" ? "Yes" : "No"}\n` +
            `- **Auto Update Frequency**: ${s.interval_auto_update}\n` +
            `- **Assessment Period**: ${s.total_period}\n` +
            `- **Update Date**: ${s.auto_update_set_date}\n` +
            `- **Use Discount Limit**: ${s.use_discount_limit === "T" ? "Yes" : "No"}\n` +
            `- **Discount Limit Reset Cycle**: ${s.discount_limit_reset_period}\n` +
            `- **Discount Limit Start**: ${s.discount_limit_begin_date}\n` +
            `- **Discount Limit End**: ${s.discount_limit_end_date}\n`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerCustomerGroupTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_customer_groups",
    {
      title: "List Cafe24 Customer Groups",
      description:
        "Retrieve a list of customer groups from the mall. Supports filtering by group_no or group_name.",
      inputSchema: CustomerGroupsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_customer_groups,
  );

  server.registerTool(
    "cafe24_count_customer_groups",
    {
      title: "Count Cafe24 Customer Groups",
      description:
        "Retrieve the number of customer groups. Supports filtering by group_no or group_name.",
      inputSchema: CustomerGroupsCountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_customer_groups,
  );

  server.registerTool(
    "cafe24_retrieve_customer_group",
    {
      title: "Retrieve Cafe24 Customer Group",
      description: "Retrieve details of a single customer group by group_no.",
      inputSchema: CustomerGroupParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_retrieve_customer_group,
  );

  server.registerTool(
    "cafe24_move_customers_to_group",
    {
      title: "Move Cafe24 Customers to Group",
      description: "Move one or more customers to a specific customer group (tier).",
      inputSchema: MoveCustomerToGroupParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_move_customers_to_group,
  );

  server.registerTool(
    "cafe24_retrieve_customer_group_setting",
    {
      title: "Retrieve Cafe24 Customer Group Setting",
      description: "Retrieve customer group (tier) auto-update and assessment settings.",
      inputSchema: CommonParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_retrieve_customer_group_setting,
  );
}
