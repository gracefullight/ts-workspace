#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { resolveConfig } from "@/config";
import { createServer } from "@/server";

async function main(): Promise<void> {
  const config = resolveConfig(process.argv.slice(2));
  const server = createServer(config);
  await server.connect(new StdioServerTransport());
}

main().catch((error: unknown) => {
  console.error(`modelscope-image-mcp: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
