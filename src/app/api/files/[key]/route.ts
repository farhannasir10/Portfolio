import {
  UPLOAD_DIR,
  assertSafeStorageKey,
} from "@/lib/files";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";

const EXT_MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

function mimeForPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return EXT_MIME[ext] ?? "application/octet-stream";
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> },
) {
  const { key } = await ctx.params;
  const decoded = decodeURIComponent(key);
  try {
    assertSafeStorageKey(decoded);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, decoded);
  try {
    const st = await stat(filePath);
    if (!st.isFile()) return new Response("Not found", { status: 404 });
    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream);
    return new Response(webStream as unknown as BodyInit, {
      headers: {
        "Content-Type": mimeForPath(filePath),
        "Content-Length": String(st.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
