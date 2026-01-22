import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  countSupplierUsersParametersSchema,
  createSupplierUserParametersSchema,
  deleteSupplierUserParametersSchema,
  getSupplierUserParametersSchema,
  listSupplierUsersParametersSchema,
  updateSupplierUserParametersSchema,
} from "../schemas/supplier-users.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type {
  CountSupplierUsersResponse,
  ListSupplierUsersResponse,
  SupplierUserResponse,
} from "../types/supplier-users.js";

async function cafe24_list_supplier_users(
  params: z.infer<typeof listSupplierUsersParametersSchema>,
) {
  try {
    const data = await makeApiRequest<ListSupplierUsersResponse>(
      "/admin/suppliers/users",
      "GET",
      undefined,
      params,
    );
    const users = data.users || [];
    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${users.length} supplier users\n\n` +
            users
              .map(
                (u) =>
                  `## ${u.user_id} (${u.supplier_name})\n` +
                  `- Supplier Code: ${u.supplier_code}\n` +
                  `- Email: ${u.email || "N/A"}\n` +
                  `- Phone: ${u.phone || "N/A"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_count_supplier_users(
  params: z.infer<typeof countSupplierUsersParametersSchema>,
) {
  try {
    const data = await makeApiRequest<CountSupplierUsersResponse>(
      "/admin/suppliers/users/count",
      "GET",
      undefined,
      params,
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Total supplier users: ${data.count}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_get_supplier_user(params: z.infer<typeof getSupplierUserParametersSchema>) {
  try {
    const { user_id, shop_no } = params;
    const data = await makeApiRequest<SupplierUserResponse>(
      `/admin/suppliers/users/${user_id}`,
      "GET",
      undefined,
      shop_no ? { shop_no } : undefined,
    );
    const u = data.user;
    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Supplier User: ${u.user_id} (${u.supplier_name})\n` +
            `- Supplier Code: ${u.supplier_code}\n` +
            `- Nickname: ${typeof u.nick_name === "string" ? u.nick_name : "Multiple"}\n` +
            `- Email: ${u.email || "N/A"}\n` +
            `- Phone: ${u.phone || "N/A"}\n` +
            `- Permissions: \n` +
            `  - Product Modify: ${u.permission_product_modify}\n` +
            `  - Product Display: ${u.permission_product_display}\n` +
            `  - Product Selling: ${u.permission_product_selling}\n`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_create_supplier_user(
  params: z.infer<typeof createSupplierUserParametersSchema>,
) {
  try {
    const { shop_no, ...rest } = params;
    // The API expects nested "request" object
    const requestBody = {
      request: rest,
    };

    const data = await makeApiRequest<SupplierUserResponse>(
      "/admin/suppliers/users",
      "POST",
      requestBody, // API likely doesn't need shop_no in root for POST if it's in header/query? Documentation implies plain POST with body.
      // But typically shop_no is a query param for context.
      shop_no ? { shop_no } : undefined,
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created supplier user: ${data.user.user_id}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_update_supplier_user(
  params: z.infer<typeof updateSupplierUserParametersSchema>,
) {
  try {
    const { user_id, shop_no, ...rest } = params;
    const requestBody = {
      request: rest,
    };
    const data = await makeApiRequest<SupplierUserResponse>(
      `/admin/suppliers/users/${user_id}`,
      "PUT",
      requestBody,
      shop_no ? { shop_no } : undefined,
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated supplier user: ${data.user.user_id}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_delete_supplier_user(
  params: z.infer<typeof deleteSupplierUserParametersSchema>,
) {
  try {
    const { user_id, shop_no } = params;
    const data = await makeApiRequest<{ user: { user_id: string } }>(
      `/admin/suppliers/users/${user_id}`,
      "DELETE",
      undefined,
      shop_no ? { shop_no } : undefined,
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted supplier user: ${data.user.user_id}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_supplier_users",
    {
      title: "List Supplier Users",
      description:
        "Retrieve a list of supplier users. Supports filtering by shop_no, user_id, supplier_code, supplier_name.",
      inputSchema: listSupplierUsersParametersSchema,
    },
    cafe24_list_supplier_users,
  );

  server.registerTool(
    "cafe24_count_supplier_users",
    {
      title: "Count Supplier Users",
      description: "Count the number of supplier users matching the search criteria.",
      inputSchema: countSupplierUsersParametersSchema,
    },
    cafe24_count_supplier_users,
  );

  server.registerTool(
    "cafe24_get_supplier_user",
    {
      title: "Get Supplier User",
      description: "Retrieve details of a specific supplier user by user_id.",
      inputSchema: getSupplierUserParametersSchema,
    },
    cafe24_get_supplier_user,
  );

  server.registerTool(
    "cafe24_create_supplier_user",
    {
      title: "Create Supplier User",
      description: "Register a new supplier user.",
      inputSchema: createSupplierUserParametersSchema,
    },
    cafe24_create_supplier_user,
  );

  server.registerTool(
    "cafe24_update_supplier_user",
    {
      title: "Update Supplier User",
      description: "Update details of an existing supplier user.",
      inputSchema: updateSupplierUserParametersSchema,
    },
    cafe24_update_supplier_user,
  );

  server.registerTool(
    "cafe24_delete_supplier_user",
    {
      title: "Delete Supplier User",
      description: "Delete a supplier user.",
      inputSchema: deleteSupplierUserParametersSchema,
    },
    cafe24_delete_supplier_user,
  );
}
