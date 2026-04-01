"use client";

import { upload as blobUpload } from "@vercel/blob/client";
import { useState } from "react";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/files";

type Kind = "video" | "image" | "cv";

function maxBytesFor(kind: Kind): number {
  if (kind === "video") return MAX_VIDEO_BYTES;
  if (kind === "cv") return MAX_CV_BYTES;
  return MAX_IMAGE_BYTES;
}

function safePathname(fileName: string): string {
  const clean = fileName.replace(/[^\w.-]/g, "_");
  return `${Date.now()}-${clean}`;
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
            const maxBytes = maxBytesFor(kind);
            if (file.size > maxBytes) {
              setErr("File too large");
              return;
            }

            // Primary path: browser uploads directly to Vercel Blob to avoid Vercel body limits.
            try {
              const blob = await blobUpload(safePathname(file.name), file, {
                access: "private",
                handleUploadUrl: "/api/admin/blob-client-upload",
                clientPayload: JSON.stringify({ kind }),
                multipart: file.size > 4 * 1024 * 1024,
              });
              setStorageKey(blob.pathname);
              setOriginalName(file.name);
              return;
            } catch {
              // Fallback to server route (local dev / non-blob setups).
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
        <p className="text-xs text-emerald-400">Uploaded. Key: {storageKey}</p>
      ) : null}
      {err ? <p className="text-xs text-red-400">{err}</p> : null}
    </div>
  );
}
