import { isSupabaseStorageConfigured } from "@/lib/supabase-storage";
import { supabaseUrlForBrowser } from "@/lib/supabase-url";

export function isVercelBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/** Browser can upload directly to Supabase when anon key + public URL exist and server has Storage. */
export function isSupabaseDirectUploadConfigured(): boolean {
  if (!isSupabaseStorageConfigured()) return false;
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() && supabaseUrlForBrowser(),
  );
}
