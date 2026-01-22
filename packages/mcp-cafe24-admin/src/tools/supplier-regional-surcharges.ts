import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  createSupplierRegionalSurchargeParametersSchema,
  deleteSupplierRegionalSurchargeParametersSchema,
  listSupplierRegionalSurchargesParametersSchema,
} from "../schemas/supplier-regional-surcharges.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type {
  ListSupplierRegionalSurchargesResponse,
  SupplierRegionalSurchargeResponse,
} from "../types/supplier-regional-surcharges.js";

async function cafe24_list_supplier_regional_surcharges(
  params: z.infer<typeof listSupplierRegionalSurchargesParametersSchema>,
) {
  try {
    const { supplier_id, shop_no, ...rest } = params;
    const data = await makeApiRequest<ListSupplierRegionalSurchargesResponse>(
      `/admin/suppliers/users/${supplier_id}/regionalsurcharges`,
      "GET",
      undefined,
      shop_no ? { shop_no, ...rest } : { ...rest },
    );
    const notes = data.regionalsurcharges || [];
    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${notes.length} regional surcharges for supplier ${supplier_id}\n\n` +
            notes
              .map(
                (n) =>
                  `## ID: ${n.regional_surcharge_no} (${n.country_code} - ${n.region_name})\n` +
                  `- Amount: ${n.regional_surcharge_amount}\n` +
                  `- Zipcode: ${n.start_zipcode || "N/A"} ~ ${n.end_zipcode || "N/A"}\n`,
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

async function cafe24_create_supplier_regional_surcharge(
  params: z.infer<typeof createSupplierRegionalSurchargeParametersSchema>,
) {
  try {
    const { supplier_id, shop_no, ...rest } = params;
    const requestBody = {
      shop_no,
      request: rest,
    };
    const data = await makeApiRequest<SupplierRegionalSurchargeResponse>(
      `/admin/suppliers/users/${supplier_id}/regionalsurcharges`,
      "POST",
      requestBody,
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created regional surcharge ${data.regionalsurcharge.regional_surcharge_no} for supplier ${supplier_id}`,
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

async function cafe24_delete_supplier_regional_surcharge(
  params: z.infer<typeof deleteSupplierRegionalSurchargeParametersSchema>,
) {
  try {
    const { supplier_id, regional_surcharge_no, shop_no } = params;
    const data = await makeApiRequest<SupplierRegionalSurchargeResponse>(
      `/admin/suppliers/users/${supplier_id}/regionalsurcharges/${regional_surcharge_no}`,
      "DELETE",
      undefined,
      shop_no ? { shop_no } : undefined,
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted regional surcharge ${data.regionalsurcharge.regional_surcharge_no} from supplier ${supplier_id}`,
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
    "cafe24_list_supplier_regional_surcharges",
    {
      title: "List Supplier Regional Surcharges",
      description: "Retrieve a list of regional surcharges for a supplier user.",
      inputSchema: listSupplierRegionalSurchargesParametersSchema,
    },
    cafe24_list_supplier_regional_surcharges,
  );

  server.registerTool(
    "cafe24_create_supplier_regional_surcharge",
    {
      title: "Create Supplier Regional Surcharge",
      description: "Create a new regional surcharge for a supplier user.",
      inputSchema: createSupplierRegionalSurchargeParametersSchema,
    },
    cafe24_create_supplier_regional_surcharge,
  );

  server.registerTool(
    "cafe24_delete_supplier_regional_surcharge",
    {
      title: "Delete Supplier Regional Surcharge",
      description: "Delete a regional surcharge for a supplier user by surcharge number.",
      inputSchema: deleteSupplierRegionalSurchargeParametersSchema,
    },
    cafe24_delete_supplier_regional_surcharge,
  );
}
