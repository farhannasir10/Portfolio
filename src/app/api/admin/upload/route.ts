import { auth } from "@/auth";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  makeStorageKey,
  saveUploadFromFile,
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
  try {
    await saveUploadFromFile(file, storageKey, max);
  } catch (e) {
    if (e instanceof Error && e.message === "FILE_TOO_LARGE") {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({
    storageKey,
    url: `/api/files/${encodeURIComponent(storageKey)}`,
  });
}
