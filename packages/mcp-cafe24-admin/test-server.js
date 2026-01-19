#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "cafe24-admin-test",
  version: "1.0.0",
});

server.registerTool("test_hello", {
  title: "Test Tool",
  description: "Simple test tool",
  inputSchema: { type: "object", properties: {} },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
}, async () => {
  return {
    content: [{ type: "text", text: "MCP Server is working!" }],
  };
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cafe24 Admin Test MCP server running via stdio");
}

run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
