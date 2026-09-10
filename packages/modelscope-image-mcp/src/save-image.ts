import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

/** Returns a filesystem-safe file stem; directories and extensions in `name` are discarded. */
export function toFileStem(
  name?: string,
  date: Date = new Date(),
  id: string = randomUUID().slice(0, 8),
): string {
  const raw = name ? basename(name, extname(name)) : "";
  const stem = raw.replace(/[^A-Za-z0-9._-]/g, "_").replace(/^[._]+|[._]+$/g, "");
  if (stem) {
    return stem;
  }
  const stamp = date.toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "-");
  return `${stamp}-${id}`;
}

export async function saveImage(
  outputDir: string,
  bytes: Uint8Array,
  contentType: string,
  filename?: string,
): Promise<string> {
  const dir = resolve(outputDir);
  await mkdir(dir, { recursive: true });
  const path = join(
    dir,
    `${toFileStem(filename)}${EXTENSION_BY_CONTENT_TYPE[contentType] ?? ".png"}`,
  );
  await writeFile(path, bytes);
  return path;
}
