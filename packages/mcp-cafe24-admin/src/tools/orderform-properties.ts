import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type {
  CreateOrderformPropertiesResponse,
  DeleteOrderformPropertyResponse,
  ListOrderformPropertiesResponse,
  UpdateOrderformPropertyResponse,
} from "@/types/index.js";
import {
  OrderformPropertiesListParamsSchema,
  OrderformPropertyCreateParamsSchema,
  OrderformPropertyDeleteParamsSchema,
  OrderformPropertyUpdateParamsSchema,
} from "../schemas/orderform-properties.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_orderform_properties(
  params: z.infer<typeof OrderformPropertiesListParamsSchema>,
) {
  try {
    const data = await makeApiRequest<ListOrderformPropertiesResponse>(
      "/admin/orderform/properties",
      "GET",
      undefined,
      {
        shop_no: params.shop_no,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Orderform Properties (Shop: ${data.properties.shop_no})\n\n` +
            data.properties.additional_items
              .map(
                (item) =>
                  `- **${item.subject}** (ID: ${item.orderform_property_id})\n` +
                  `  - Type: ${item.input_type}\n` +
                  `  - Required: ${item.is_required}\n` +
                  `  - Description: ${item.description || "N/A"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        properties: data.properties,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_orderform_properties(
  params: z.infer<typeof OrderformPropertyCreateParamsSchema>,
) {
  try {
    const data = await makeApiRequest<CreateOrderformPropertiesResponse>(
      "/admin/orderform/properties",
      "POST",
      {
        shop_no: params.shop_no,
        requests: params.requests,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${data.properties.length} orderform property(ies).`,
        },
      ],
      structuredContent: {
        properties: data.properties,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_orderform_property(
  params: z.infer<typeof OrderformPropertyUpdateParamsSchema>,
) {
  try {
    const data = await makeApiRequest<UpdateOrderformPropertyResponse>(
      `/admin/orderform/properties/${params.orderform_property_id}`,
      "PUT",
      {
        shop_no: params.shop_no,
        request: params.request,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated orderform property (ID: ${params.orderform_property_id}).`,
        },
      ],
      structuredContent: {
        property: data.properties,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_orderform_property(
  params: z.infer<typeof OrderformPropertyDeleteParamsSchema>,
) {
  try {
    const data = await makeApiRequest<DeleteOrderformPropertyResponse>(
      `/admin/orderform/properties/${params.orderform_property_id}`,
      "DELETE",
      undefined,
      {
        shop_no: params.shop_no,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted orderform property (ID: ${params.orderform_property_id}).`,
        },
      ],
      structuredContent: {
        property: data.properties,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_orderform_properties",
    {
      title: "List Cafe24 Orderform Properties",
      description:
        "Retrieve a list of additional checkout fields (orderform properties) for a specific shop.",
      inputSchema: OrderformPropertiesListParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_list_orderform_properties,
  );

  server.registerTool(
    "cafe24_create_orderform_properties",
    {
      title: "Create Cafe24 Orderform Properties",
      description:
        "Creates multiple additional checkout fields (orderform properties) for a specific shop.",
      inputSchema: OrderformPropertyCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_orderform_properties,
  );

  server.registerTool(
    "cafe24_update_orderform_property",
    {
      title: "Update Cafe24 Orderform Property",
      description:
        "Update an existing additional checkout field (orderform property) by its field ID.",
      inputSchema: OrderformPropertyUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_orderform_property,
  );

  server.registerTool(
    "cafe24_delete_orderform_property",
    {
      title: "Delete Cafe24 Orderform Property",
      description:
        "Delete an existing additional checkout field (orderform property) by its field ID.",
      inputSchema: OrderformPropertyDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_orderform_property,
  );
}
