import { fileURLToPath } from "node:url";

export interface RootLike {
  uri: string;
}

/** Converts MCP roots to local directory paths, skipping non-file and malformed URIs. */
export function rootDirectories(roots: RootLike[]): string[] {
  return roots.flatMap((root) => {
    if (!root.uri.startsWith("file://")) {
      return [];
    }
    try {
      return [fileURLToPath(root.uri)];
    } catch {
      return [];
    }
  });
}
