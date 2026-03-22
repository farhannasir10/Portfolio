import { auth } from "@/auth";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/upload-limits";
import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
];

function maxBytesForKind(kind: string): number {
  if (kind === "video") return MAX_VIDEO_BYTES;
  if (kind === "cv") return MAX_CV_BYTES;
  return MAX_IMAGE_BYTES;
}

export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.type === "blob.generate-client-token") {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return NextResponse.json(
      { error: "Vercel Blob is not configured", code: "NO_BLOB" },
      { status: 503 },
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let maxBytes = MAX_VIDEO_BYTES;
        try {
          if (clientPayload) {
            const p = JSON.parse(clientPayload) as { kind?: string };
            if (p.kind === "video" || p.kind === "image" || p.kind === "cv") {
              maxBytes = maxBytesForKind(p.kind);
            }
          }
        } catch {
          /* ignore invalid clientPayload */
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          addRandomSuffix: true,
          maximumSizeInBytes: maxBytes,
        };
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (e) {
    console.error("[blob-client-upload]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 },
    );
  }
}
