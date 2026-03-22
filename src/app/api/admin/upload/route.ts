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
  missingSupabaseStorageEnvKeys,
  uploadFileToSupabasePublic,
} from "@/lib/supabase-storage";
import { isVercelBlobConfigured } from "@/lib/upload-env";
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

  if (
    isVercel() &&
    !isVercelBlobConfigured() &&
    !isSupabaseStorageConfigured()
  ) {
    return NextResponse.json(
      {
        error:
          "No file storage on Vercel. Add a Blob store (project → Storage → Blob) so BLOB_READ_WRITE_TOKEN is set, or configure Supabase Storage (service role + project URL).",
        missingEnv: [
          "BLOB_READ_WRITE_TOKEN",
          ...missingSupabaseStorageEnvKeys(),
        ],
        hint:
          "Large files: the admin UI uploads via Blob in the browser first (no Supabase needed). Server FormData uploads are limited by the host request body size (~4.5 MB on many plans).",
      },
      { status: 503 },
    );
  }

  if (isVercelBlobConfigured()) {
    try {
      const { put } = await import("@vercel/blob");
      const result = await put(storageKey, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type || undefined,
        multipart: file.size > 4 * 1024 * 1024,
      });
      return NextResponse.json({
        storageKey: result.url,
        url: result.url,
      });
    } catch (e) {
      console.error("[upload] vercel blob put", e);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
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
