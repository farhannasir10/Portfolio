import { publicFileUrl } from "@/lib/public-file-url";
import { createHash, randomBytes } from "crypto";
import { createWriteStream } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable, Transform } from "stream";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export { MAX_CV_BYTES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from "@/lib/upload-limits";

const SAFE_NAME = /^[a-zA-Z0-9._-]+$/;

export function assertSafeStorageKey(key: string): void {
  const base = path.basename(key);
  if (base !== key || !SAFE_NAME.test(key) || key.includes("..")) {
    throw new Error("Invalid file key");
  }
}

export async function ensureUploadDir(): Promise<void> {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export function makeStorageKey(originalName: string): string {
  const ext = path.extname(originalName).slice(0, 12) || "";
  const stamp = createHash("sha256")
    .update(randomBytes(16))
    .digest("hex")
    .slice(0, 24);
  return `${stamp}${ext}`;
}

export async function saveUploadBuffer(
  buffer: Buffer,
  storageKey: string,
): Promise<void> {
  assertSafeStorageKey(storageKey);
  await ensureUploadDir();
  await writeFile(path.join(UPLOAD_DIR, storageKey), buffer);
}

function byteLimitTransform(maxBytes: number) {
  let total = 0;
  return new Transform({
    transform(chunk: Buffer, _enc, cb) {
      total += chunk.length;
      if (total > maxBytes) {
        cb(new Error("FILE_TOO_LARGE"));
        return;
      }
      cb(null, chunk);
    },
  });
}

export async function saveUploadFromFile(
  file: File,
  storageKey: string,
  maxBytes: number,
): Promise<void> {
  assertSafeStorageKey(storageKey);
  await ensureUploadDir();
  const dest = path.join(UPLOAD_DIR, storageKey);
  const web = file.stream();
  const input = Readable.fromWeb(web as import("stream/web").ReadableStream);
  const limiter = byteLimitTransform(maxBytes);
  const out = createWriteStream(dest);
  try {
    await pipeline(input, limiter, out);
  } catch (e) {
    await unlink(dest).catch(() => {});
    throw e;
  }
}

export function fileUrlFromKey(key: string): string {
  return publicFileUrl(key) ?? "";
}
