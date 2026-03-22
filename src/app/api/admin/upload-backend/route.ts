import { auth } from "@/auth";
import {
  isSupabaseDirectUploadConfigured,
  isVercelBlobConfigured,
} from "@/lib/upload-env";
import { isSupabaseStorageConfigured } from "@/lib/supabase-storage";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const onVercel = process.env.VERCEL === "1";
  const blob = isVercelBlobConfigured();
  const supabase = isSupabaseStorageConfigured();
  const supabaseDirect = isSupabaseDirectUploadConfigured();
  /** Server can accept FormData: local disk, Supabase server upload, or Vercel Blob `put`. */
  const multipart =
    !onVercel || (supabase && !supabaseDirect) || blob;

  return NextResponse.json({
    blob,
    supabaseDirect,
    multipart,
  });
}
