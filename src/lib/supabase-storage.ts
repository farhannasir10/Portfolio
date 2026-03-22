import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import path from "path";

let adminClient: SupabaseClient | null = null;

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      process.env.SUPABASE_STORAGE_BUCKET?.trim(),
  );
}

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("Supabase storage env vars are not set");
  }
  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminClient;
}

function contentTypeForFilename(name: string, fallback: string): string {
  if (fallback) return fallback;
  const ext = path.extname(name).toLowerCase();
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
  };
  return map[ext] ?? "application/octet-stream";
}

/**
 * Uploads to the configured public bucket. Returns the public object URL to
 * store in the database (same places that previously held a local storage key).
 */
export async function uploadFileToSupabasePublic(
  file: File,
  objectPath: string,
  maxBytes: number,
): Promise<{ publicUrl: string }> {
  if (file.size > maxBytes) {
    throw new Error("FILE_TOO_LARGE");
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET!.trim();
  const supabase = getSupabaseAdmin();
  const contentType = contentTypeForFilename(file.name, file.type);

  const { error } = await supabase.storage.from(bucket).upload(objectPath, file, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error("[supabase-storage] upload:", error.message);
    throw new Error("SUPABASE_UPLOAD_FAILED");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  if (!data.publicUrl) {
    throw new Error("SUPABASE_PUBLIC_URL_FAILED");
  }

  return { publicUrl: data.publicUrl };
}
