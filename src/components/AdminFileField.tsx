"use client";

import { useState } from "react";
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

            const fd = new FormData();
            fd.append("file", file);
            fd.append("kind", kind);
            const res = await fetch("/api/admin/upload", {
              method: "POST",
              body: fd,
              credentials: "include",
            });
            const j = (await res.json().catch(() => ({}))) as {
              error?: string;
              storageKey?: string;
            };
            if (!res.ok) {
              const serverErr = j.error ?? "Upload failed";
              setErr(serverErr);
              return;
            }
            if (j.storageKey) {
              setStorageKey(j.storageKey);
              setOriginalName(file.name);
            }
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
