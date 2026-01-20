import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { CashReceipt } from "@/types/index.js";
import {
  CashReceiptCancelParamsSchema,
  CashReceiptCreateParamsSchema,
  CashReceiptSearchParamsSchema,
  CashReceiptUpdateParamsSchema,
} from "../schemas/cashreceipt.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_cash_receipts(params: z.infer<typeof CashReceiptSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ cashreceipt: CashReceipt[] }>(
      "/admin/cashreceipt",
      "GET",
      undefined,
      params,
    );
    const receipts = data.cashreceipt || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${receipts.length} cash receipt(s).\n\n` +
            receipts
              .map(
                (r) =>
                  `## Receipt #${r.cashreceipt_no}\n` +
                  `- **Order ID**: ${r.order_id}\n` +
                  `- **Status**: ${r.status}\n` +
                  `- **Approval No**: ${r.approval_no}\n` +
                  `- **Amount**: ${r.order_price_amount}\n` +
                  `- **Requester**: ${r.name} (${r.member_id || "Guest"})\n` +
                  `- **Request Date**: ${r.request_date}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        receipts,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_cash_receipt(params: z.infer<typeof CashReceiptCreateParamsSchema>) {
  try {
    const data = await makeApiRequest<{ cashreceipt: CashReceipt }>("/admin/cashreceipt", "POST", {
      request: params.request,
    });
    const receipt = data.cashreceipt;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created cash receipt #${receipt.cashreceipt_no} for order ${receipt.order_id}.`,
        },
      ],
      structuredContent: {
        receipt,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_cash_receipt(params: z.infer<typeof CashReceiptUpdateParamsSchema>) {
  try {
    const data = await makeApiRequest<{ cashreceipt: CashReceipt }>(
      `/admin/cashreceipt/${params.cashreceipt_no}`,
      "PUT",
      {
        request: params.request,
      },
    );
    const receipt = data.cashreceipt;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated cash receipt #${receipt.cashreceipt_no} for order ${receipt.order_id}.`,
        },
      ],
      structuredContent: {
        receipt,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_cancel_cash_receipt(params: z.infer<typeof CashReceiptCancelParamsSchema>) {
  try {
    const data = await makeApiRequest<{
      cancellation: { cashreceipt_no: number; order_id: string; status: string };
    }>(`/admin/cashreceipt/${params.cashreceipt_no}/cancellation`, "PUT", {
      request: params.request,
    });
    const cancellation = data.cancellation;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully requested cancellation for cash receipt #${cancellation.cashreceipt_no}. Status: ${cancellation.status}`,
        },
      ],
      structuredContent: {
        cancellation,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_cash_receipts",
    {
      title: "List Cafe24 Cash Receipts",
      description:
        "Retrieve a list of cash receipts from Cafe24. Supports filtering by date range, order ID, status, and member info.",
      inputSchema: CashReceiptSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_cash_receipts,
  );

  server.registerTool(
    "cafe24_create_cash_receipt",
    {
      title: "Create Cafe24 Cash Receipt",
      description: "Request issuance of a new cash receipt for a specific order in Cafe24.",
      inputSchema: CashReceiptCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_cash_receipt,
  );

  server.registerTool(
    "cafe24_update_cash_receipt",
    {
      title: "Update Cafe24 Cash Receipt",
      description: "Update info for an existing cash receipt in Cafe24.",
      inputSchema: CashReceiptUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_cash_receipt,
  );

  server.registerTool(
    "cafe24_cancel_cash_receipt",
    {
      title: "Cancel Cafe24 Cash Receipt",
      description: "Cancel a request for or issuance of a cash receipt in Cafe24.",
      inputSchema: CashReceiptCancelParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_cancel_cash_receipt,
  );
}
