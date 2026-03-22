"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

type Kind = "video" | "image" | "cv";

function clientHasSupabaseDirectUpload(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url?.trim() && anon?.trim());
}

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
            let useFormPost = !clientHasSupabaseDirectUpload();

            if (!useFormPost) {
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

              if (signRes.status === 503) {
                useFormPost = true;
              } else {
                const j = (await signRes.json()) as {
                  error?: string;
                  path?: string;
                  token?: string;
                  bucket?: string;
                  publicUrl?: string;
                };
                if (!signRes.ok) {
                  setErr(j.error ?? "Could not start upload");
                  return;
                }
                if (
                  !j.path ||
                  !j.token ||
                  !j.bucket ||
                  !j.publicUrl ||
                  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                ) {
                  setErr("Invalid upload response");
                  return;
                }

                const supabase = createClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL,
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                );

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
            };
            if (!res.ok) {
              setErr(j.error ?? "Upload failed");
              return;
            }
            if (j.storageKey) {
              setStorageKey(j.storageKey);
              setOriginalName(file.name);
            }
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
