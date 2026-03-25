import { auth } from "@/auth";
import { put } from "@vercel/blob";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  makeStorageKey,
  assertSafeStorageKey,
} from "@/lib/files";
import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const kind = String(form.get("kind") ?? "");
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  let max = MAX_IMAGE_BYTES;
  if (kind === "video") max = MAX_VIDEO_BYTES;
  if (kind === "cv") max = MAX_CV_BYTES;

  const storageKey = makeStorageKey(file.name);
  // Extra guard: avoid uploading files larger than our configured limits.
  if (typeof file.size === "number" && file.size > max) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  // In production (Vercel), store the upload in Vercel Blob.
  // We keep returning `storageKey` so your DB schema can stay unchanged.
  try {
    assertSafeStorageKey(storageKey);
    await put(storageKey, file, {
      access: "public",
      multipart: true,
      // Match previous "immutable" behavior as much as possible.
      cacheControlMaxAge: 31536000,
      allowOverwrite: false,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({
    storageKey,
    url: `/api/files/${encodeURIComponent(storageKey)}`,
  });
}
