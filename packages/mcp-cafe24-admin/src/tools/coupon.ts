import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CouponCreateParams,
  CouponCreateSchema,
  type CouponDetailParams,
  CouponDetailParamsSchema,
  type CouponsCountParams,
  CouponsCountParamsSchema,
  type CouponsSearchParams,
  CouponsSearchParamsSchema,
  type CouponUpdateParams,
  CouponUpdateSchema,
} from "@/schemas/coupon.js";
import type {
  CouponCreateRequest,
  CouponResponse,
  CouponsCountResponse,
  CouponsResponse,
  CouponUpdateRequest,
} from "@/types/index.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_coupons(params: CouponsSearchParams) {
  try {
    const { shop_no, ...rest } = params;
    const data = await makeApiRequest<CouponsResponse>("/admin/coupons", "GET", undefined, {
      shop_no: shop_no || 1,
      ...rest,
    });

    const coupons = data.coupons || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${coupons.length} coupons\n\n` +
            coupons
              .map(
                (c) =>
                  `## ${c.coupon_name} (No: ${c.coupon_no})\n` +
                  `- **Type**: ${c.coupon_type} (${c.available_period_type})\n` +
                  `- **Benefit**: ${c.benefit_type} (${c.benefit_text})\n` +
                  `- **Issued**: ${c.issued_count}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        coupons: coupons.map((c) => ({
          shop_no: c.shop_no,
          coupon_no: c.coupon_no,
          coupon_name: c.coupon_name,
          coupon_type: c.coupon_type,
          benefit_type: c.benefit_type,
          issue_type: c.issue_type,
          created_date: c.created_date,
        })),
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_coupon_count(params: CouponsCountParams) {
  try {
    const { shop_no, ...rest } = params;
    const data = await makeApiRequest<CouponsCountResponse>(
      "/admin/coupons/count",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...rest,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Total Coupons: ${data.count}`,
        },
      ],
      structuredContent: {
        count: data.count,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_coupon(params: CouponDetailParams) {
  try {
    const { shop_no, coupon_no } = params;
    const data = await makeApiRequest<CouponResponse>(
      `/admin/coupons/${coupon_no}`,
      "GET",
      undefined,
      { shop_no: shop_no || 1 },
    );

    const coupon = data.coupon;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Coupon Details: ${coupon.coupon_name}\n\n` +
            `- **No**: ${coupon.coupon_no}\n` +
            `- **Type**: ${coupon.coupon_type}\n` +
            `- **Benefit**: ${coupon.benefit_text} (${coupon.benefit_type})\n` +
            `- **Issue Type**: ${coupon.issue_type} (Sub: ${coupon.issue_sub_type})\n` +
            `- **Available**: ${coupon.available_begin_datetime} ~ ${coupon.available_end_datetime}\n` +
            `- **Status**: Deleted=${coupon.deleted}, Stopped=${coupon.is_stopped_issued_coupon}\n`,
        },
      ],
      structuredContent: {
        coupon,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_create_coupon(params: CouponCreateParams) {
  try {
    const { shop_no, request } = params;

    // Construct the request body according to API documentation
    const requestBody: CouponCreateRequest = {
      shop_no: shop_no || 1,
      request: request,
    };

    const data = await makeApiRequest<CouponResponse>("/admin/coupons", "POST", requestBody);

    const coupon = data.coupon;

    return {
      content: [
        {
          type: "text" as const,
          text: `Coupon created successfully: ${coupon.coupon_name} (No: ${coupon.coupon_no})`,
        },
      ],
      structuredContent: {
        coupon,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_update_coupon(params: CouponUpdateParams) {
  try {
    const { shop_no, coupon_no, request } = params;

    const requestBody: CouponUpdateRequest = {
      shop_no: shop_no || 1,
      request: request,
    };

    const data = await makeApiRequest<CouponResponse>(
      `/admin/coupons/${coupon_no}`,
      "PUT",
      requestBody,
    );

    const coupon = data.coupon;

    return {
      content: [
        {
          type: "text" as const,
          text: `Coupon updated successfully: ${coupon.coupon_name} (No: ${coupon.coupon_no})`,
        },
      ],
      structuredContent: {
        coupon,
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
    "cafe24_list_coupons",
    {
      title: "List Cafe24 Coupons",
      description:
        "Retrieve a list of coupons from Cafe24. Supports filtering by type, issue type, dates, etc.",
      inputSchema: CouponsSearchParamsSchema,
    },
    cafe24_list_coupons,
  );

  server.registerTool(
    "cafe24_get_coupon_count",
    {
      title: "Get Cafe24 Coupon Count",
      description: "Get the total count of coupons matching the criteria.",
      inputSchema: CouponsCountParamsSchema,
    },
    cafe24_get_coupon_count,
  );

  server.registerTool(
    "cafe24_get_coupon",
    {
      title: "Get Cafe24 Coupon Details",
      description: "Retrieve detailed information about a specific coupon.",
      inputSchema: CouponDetailParamsSchema,
    },
    cafe24_get_coupon,
  );

  server.registerTool(
    "cafe24_create_coupon",
    {
      title: "Create Cafe24 Coupon",
      description: "Create a new coupon in Cafe24.",
      inputSchema: CouponCreateSchema,
    },
    cafe24_create_coupon,
  );

  server.registerTool(
    "cafe24_update_coupon",
    {
      title: "Update Cafe24 Coupon",
      description:
        "Update an existing coupon status (pause, restart, delete, immediate issue pause/restart).",
      inputSchema: CouponUpdateSchema,
    },
    cafe24_update_coupon,
  );
}
