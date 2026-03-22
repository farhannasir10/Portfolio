import { auth } from "@/auth";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  makeStorageKey,
} from "@/lib/files";
import {
  createSignedUploadForAdmin,
  isSupabaseStorageConfigured,
} from "@/lib/supabase-storage";
import { NextResponse } from "next/server";

const MAX_BY_KIND: Record<string, number> = {
  image: MAX_IMAGE_BYTES,
  video: MAX_VIDEO_BYTES,
  cv: MAX_CV_BYTES,
};

/**
 * Returns a signed upload token so the browser can upload the file directly to
 * Supabase Storage (required on Vercel: no large request bodies through the
 * serverless function, and no persistent local disk).
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase Storage is not configured on the server." },
      { status: 503 },
    );
  }

  let body: { fileName?: string; kind?: string; size?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fileName = String(body.fileName ?? "").trim() || "upload";
  const kind = String(body.kind ?? "");
  const size = Number(body.size ?? 0);

  const max = MAX_BY_KIND[kind];
  if (!max) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }
  if (!Number.isFinite(size) || size < 1) {
    return NextResponse.json({ error: "Invalid size" }, { status: 400 });
  }
  if (size > max) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const objectPath = makeStorageKey(fileName);

  try {
    const signed = await createSignedUploadForAdmin(objectPath);
    return NextResponse.json(signed);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not start upload" }, { status: 500 });
  }
}
