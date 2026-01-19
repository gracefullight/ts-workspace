import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const BoardsSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    board_no: z.number().optional().describe("Filter by board number"),
  })
  .strict();

const BoardDetailParamsSchema = z
  .object({
    board_no: z.number().describe("Board number"),
  })
  .strict();

async function cafe24_list_boards(params: z.infer<typeof BoardsSearchParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/boards", "GET", undefined, {
      limit: params.limit,
      offset: params.offset,
      ...(params.board_no ? { board_no: params.board_no } : {}),
    });

    const boards = data.boards || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} boards (showing ${boards.length})\n\n` +
            boards
              .map(
                (b: any) =>
                  `## ${b.board_name} (Board #${b.board_no})\n` +
                  `- **Type**: ${b.board_type}\n` +
                  `- **Status**: ${b.display ? "Displayed" : "Hidden"} | ${b.use ? "In Use" : "Not In Use"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: boards.length,
        offset: params.offset,
        boards: boards.map((b: any) => ({
          id: b.board_no.toString(),
          name: b.board_name,
          type: b.board_type,
          display: b.display,
          use: b.use,
        })),
        has_more: total > params.offset + boards.length,
        ...(total > params.offset + boards.length
          ? {
              next_offset: params.offset + boards.length,
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

async function cafe24_get_board(params: z.infer<typeof BoardDetailParamsSchema>) {
  try {
    const data = await makeApiRequest(`/admin/boards/${params.board_no}`, "GET");
    const board = data.board || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Board Details\n\n` +
            `- **Board No**: ${board.board_no}\n` +
            `- **Board Name**: ${board.board_name}\n` +
            `- **Type**: ${board.board_type}\n` +
            `- **Status**: ${board.display ? "Displayed" : "Hidden"} | ${board.use ? "In Use" : "Not In Use"}\n`,
        },
      ],
      structuredContent: {
        id: board.board_no.toString(),
        name: board.board_name,
        type: board.board_type,
        display: board.display,
        use: board.use,
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
    "cafe24_list_boards",
    {
      title: "List Cafe24 Boards",
      description:
        "Retrieve a list of boards from Cafe24. Returns board details including board number, name, type, display status, and usage status. Supports pagination and filtering by board number.",
      inputSchema: BoardsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_boards,
  );

  server.registerTool(
    "cafe24_get_board",
    {
      title: "Get Cafe24 Board Details",
      description:
        "Retrieve detailed information about a specific board by board number. Returns complete board details including type and status.",
      inputSchema: BoardDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_board,
  );
}
