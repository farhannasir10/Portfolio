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
  req: Request,
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
  const rangeHeader = req.headers.get("range");
  if (token) {
    try {
      const res = await getBlob(decoded, {
        access: "private",
        token,
        headers: rangeHeader ? { range: rangeHeader } : undefined,
      });
      if (!res || res.statusCode !== 200) {
        return new Response("Not found", { status: 404 });
      }
      const contentRange =
        res.headers.get("content-range") ?? res.headers.get("Content-Range");
      const contentLength =
        res.headers.get("content-length") ??
        res.headers.get("Content-Length") ??
        String(res.blob.size);
      const status = contentRange ? 206 : 200;
      return new Response(res.stream as unknown as BodyInit, {
        status,
        headers: {
          "Content-Type": res.blob.contentType ?? "application/octet-stream",
          "Content-Length": contentLength,
          "Accept-Ranges": "bytes",
          ...(contentRange ? { "Content-Range": contentRange } : {}),
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
    const total = st.size;
    const range = req.headers.get("range");
    let start = 0;
    let end = total - 1;
    let status = 200;
    if (range && /^bytes=\d*-\d*$/.test(range)) {
      const [rawStart, rawEnd] = range.replace("bytes=", "").split("-");
      if (rawStart) start = Number(rawStart);
      if (rawEnd) end = Number(rawEnd);
      if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= total) {
        return new Response("Requested Range Not Satisfiable", {
          status: 416,
          headers: { "Content-Range": `bytes */${total}` },
        });
      }
      status = 206;
    }
    const chunkSize = end - start + 1;
    const nodeStream = createReadStream(filePath, { start, end });
    const webStream = Readable.toWeb(nodeStream);
    return new Response(webStream as unknown as BodyInit, {
      status,
      headers: {
        "Content-Type": mimeForPath(filePath),
        "Accept-Ranges": "bytes",
        "Content-Length": String(chunkSize),
        ...(status === 206 ? { "Content-Range": `bytes ${start}-${end}/${total}` } : {}),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
