"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/upload-limits";

type Kind = "video" | "image" | "cv";

function maxBytesFor(kind: Kind): number {
  if (kind === "video") return MAX_VIDEO_BYTES;
  if (kind === "cv") return MAX_CV_BYTES;
  return MAX_IMAGE_BYTES;
}

/** Safe pathname for Blob; store adds a random suffix server-side. */
function blobPathname(file: File): string {
  const raw = file.name.trim() || "file";
  const dot = raw.lastIndexOf(".");
  const ext = dot >= 0 ? raw.slice(dot, dot + 13) : "";
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  return `${id}${ext}`;
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

            // Client → Vercel Blob directly (via token from our API). Sending the
            // whole file through /api/admin/upload hits Vercel's ~4.5MB body limit,
            // so videos fail there while small images still worked.
            const multipart =
              kind === "video" || file.size > 4 * 1024 * 1024;
            const blob = await upload(blobPathname(file), file, {
              access: "public",
              handleUploadUrl: "/api/admin/blob-client-upload",
              clientPayload: JSON.stringify({ kind }),
              multipart,
            });
            setStorageKey(blob.url);
            setOriginalName(file.name);
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Network error";
            setErr(msg);
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
