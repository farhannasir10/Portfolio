import { auth } from "@/auth";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  makeStorageKey,
  saveUploadFromFile,
} from "@/lib/files";
import {
  isSupabaseStorageConfigured,
  uploadFileToSupabasePublic,
} from "@/lib/supabase-storage";
import { NextResponse } from "next/server";

export const maxDuration = 300;

function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

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

  if (file.size > max) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const storageKey = makeStorageKey(file.name);

  if (isVercel() && !isSupabaseStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          "Vercel cannot store uploads on disk. Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET, and use direct uploads (NEXT_PUBLIC_SUPABASE_ANON_KEY). See README.",
      },
      { status: 503 },
    );
  }

  if (isSupabaseStorageConfigured()) {
    try {
      const { publicUrl } = await uploadFileToSupabasePublic(
        file,
        storageKey,
        max,
      );
      return NextResponse.json({
        storageKey: publicUrl,
        url: publicUrl,
      });
    } catch (e) {
      if (e instanceof Error && e.message === "FILE_TOO_LARGE") {
        return NextResponse.json({ error: "File too large" }, { status: 413 });
      }
      console.error(e);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  }

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
