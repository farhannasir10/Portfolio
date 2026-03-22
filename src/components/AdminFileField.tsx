"use client";

import { upload as blobUpload } from "@vercel/blob/client";
import { blobPathnameFromFile } from "@/lib/client-blob-pathname";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/upload-limits";
import { useState } from "react";

type Kind = "video" | "image" | "cv";

function maxBytes(kind: Kind): number {
  if (kind === "video") return MAX_VIDEO_BYTES;
  if (kind === "cv") return MAX_CV_BYTES;
  return MAX_IMAGE_BYTES;
}

type UploadBackend = {
  blob?: boolean;
  supabaseDirect?: boolean;
  multipart?: boolean;
};

export function AdminFileField({
  kind,
  fieldName = "storageKey",
  originalNameField,
  label,
}: {
  kind: Kind;
  fieldName?: string;
  originalNameField?: string;
  label: string;
}) {
  const [storageKey, setStorageKey] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="space-y-2">
      {originalNameField ? (
        <input type="hidden" name={originalNameField} value={originalName} />
      ) : null}
      <input type="hidden" name={fieldName} value={storageKey} />
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        type="file"
        disabled={busy}
        className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-100"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setErr("");
          setBusy(true);
          try {
            const beRes = await fetch("/api/admin/upload-backend", {
              credentials: "include",
            });
            if (beRes.status === 401) {
              setErr("Session expired; sign in again.");
              return;
            }
            const backends = (await beRes.json()) as UploadBackend & {
              error?: string;
            };
            if (!beRes.ok) {
              setErr(backends.error ?? "Could not check upload options");
              return;
            }

            const limit = maxBytes(kind);
            if (file.size > limit) {
              setErr("File too large");
              return;
            }

            if (backends.blob) {
              try {
                const pathname = blobPathnameFromFile(file);
                const result = await blobUpload(pathname, file, {
                  access: "public",
                  handleUploadUrl: "/api/admin/blob-client-upload",
                  clientPayload: JSON.stringify({ kind }),
                  contentType: file.type || undefined,
                  multipart: file.size > 4 * 1024 * 1024,
                });
                setStorageKey(result.url);
                setOriginalName(file.name);
                return;
              } catch (blobErr) {
                console.error("[admin upload] blob", blobErr);
                /* fall through to Supabase / multipart */
              }
            }

            if (backends.supabaseDirect) {
              const signRes = await fetch("/api/admin/upload-sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  fileName: file.name,
                  kind,
                  size: file.size,
                }),
              });

              if (signRes.status !== 503) {
                const j = (await signRes.json()) as {
                  error?: string;
                  missingEnv?: string[];
                  path?: string;
                  token?: string;
                  bucket?: string;
                  publicUrl?: string;
                };
                if (!signRes.ok) {
                  const miss =
                    Array.isArray(j.missingEnv) && j.missingEnv.length > 0
                      ? ` Add: ${j.missingEnv.join(", ")}.`
                      : "";
                  setErr((j.error ?? "Could not start upload") + miss);
                  return;
                }
                const { supabaseUrlForBrowser } = await import(
                  "@/lib/supabase-url"
                );
                const { createClient } = await import("@supabase/supabase-js");
                const browserUrl = supabaseUrlForBrowser();
                const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
                if (
                  !j.path ||
                  !j.token ||
                  !j.bucket ||
                  !j.publicUrl ||
                  !browserUrl ||
                  !anon
                ) {
                  setErr("Invalid upload response");
                  return;
                }

                const supabase = createClient(browserUrl, anon);

                const { error: upErr } = await supabase.storage
                  .from(j.bucket)
                  .uploadToSignedUrl(j.path, j.token, file, {
                    contentType: file.type || "application/octet-stream",
                  });

                if (upErr) {
                  setErr(upErr.message || "Upload to storage failed");
                  return;
                }

                setStorageKey(j.publicUrl);
                setOriginalName(file.name);
                return;
              }
            }

            if (backends.multipart) {
              const fd = new FormData();
              fd.append("file", file);
              fd.append("kind", kind);
              const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: fd,
                credentials: "include",
              });
              const j = (await res.json()) as {
                error?: string;
                storageKey?: string;
                missingEnv?: string[];
              };
              if (!res.ok) {
                const miss =
                  Array.isArray(j.missingEnv) && j.missingEnv.length > 0
                    ? ` Add in Vercel: ${j.missingEnv.join(", ")}.`
                    : "";
                setErr((j.error ?? "Upload failed") + miss);
                return;
              }
              if (j.storageKey) {
                setStorageKey(j.storageKey);
                setOriginalName(file.name);
              }
              return;
            }

            setErr(
              "No upload method available. On Vercel: Project → Storage → create a Blob store (sets BLOB_READ_WRITE_TOKEN). Optional legacy: Supabase Storage + anon key for direct uploads.",
            );
          } catch {
            setErr("Network error");
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy ? (
        <p className="text-xs text-zinc-500">Uploading… large files may take a while.</p>
      ) : null}
      {storageKey ? (
        <p className="text-xs text-emerald-400">
          Uploaded.
          {storageKey.length > 72
            ? ` ${storageKey.slice(0, 48)}…`
            : ` ${storageKey}`}
        </p>
      ) : null}
      {err ? <p className="text-xs text-red-400">{err}</p> : null}
    </div>
  );
}
