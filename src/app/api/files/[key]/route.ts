import {
  UPLOAD_DIR,
  assertSafeStorageKey,
} from "@/lib/files";
import { get as getBlob } from "@vercel/blob";
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

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN ?? process.env.portfolio_READ_WRITE_TOKEN;
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

  // On Vercel, read from Blob instead of ephemeral local disk.
  // `BLOB_READ_WRITE_TOKEN` is provided automatically when you connect a Vercel Blob store.
  const token = blobToken();
  if (token) {
    try {
      const res = await getBlob(decoded, { access: "public", token });
      if (!res || res.statusCode !== 200) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(res.stream as unknown as BodyInit, {
        headers: {
          "Content-Type": res.blob.contentType ?? "application/octet-stream",
          "Content-Length": String(res.blob.size),
          "Cache-Control": res.blob.cacheControl ?? "public, max-age=31536000",
          // Keep client behavior close to previous local implementation.
          "Content-Disposition": res.blob.contentDisposition ?? "inline",
        },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
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
