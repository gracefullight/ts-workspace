import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools as registerAppTools } from "./app.js";
import { registerTools as registerAutomessageTools } from "./automessage.js";
import { registerTools as registerBoardTools } from "./board.js";
import { registerTools as registerCustomerTools } from "./customer.js";
import { registerTools as registerMiscTools } from "./misc.js";
import { registerTools as registerOrderTools } from "./order.js";
import { registerTools as registerProductTools } from "./product.js";
import { registerTools as registerPromotionTools } from "./promotion.js";
import { registerTools as registerStoreTools } from "./store.js";

/**
 * Register all Cafe24 Admin tools with the MCP server
 */
export function registerAllTools(server: McpServer): void {
  registerAppTools(server);
  registerAutomessageTools(server);
  registerBoardTools(server);
  registerCustomerTools(server);
  registerMiscTools(server);
  registerOrderTools(server);
  registerProductTools(server);
  registerPromotionTools(server);
  registerStoreTools(server);
}
