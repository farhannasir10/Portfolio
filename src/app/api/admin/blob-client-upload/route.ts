import { auth } from "@/auth";
import {
  MAX_CV_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/files";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

function maxBytesForKind(kind: string): number {
  if (kind === "video") return MAX_VIDEO_BYTES;
  if (kind === "cv") return MAX_CV_BYTES;
  return MAX_IMAGE_BYTES;
}

export async function POST(req: Request) {
  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Only enforce user auth for token generation request.
  if (body.type === "blob.generate-client-token") {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.portfolio_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Missing Blob token. Set BLOB_READ_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  try {
    const json = await handleUpload({
      token,
      request: req,
      body,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let kind = "image";
        try {
          const parsed = JSON.parse(clientPayload ?? "{}") as { kind?: string };
          if (parsed.kind) kind = parsed.kind;
        } catch {}
        return {
          // Wildcards prevent “wrong MIME type” falling back to the slower server upload.
          allowedContentTypes: ["image/*", "video/*", "application/pdf"],
          maximumSizeInBytes: maxBytesForKind(kind),
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload setup failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
