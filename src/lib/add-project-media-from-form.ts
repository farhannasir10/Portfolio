import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";

/**
 * Used by POST /api/admin/project-media so the browser sends a normal form
 * (Server Actions often drop client-updated hidden fields like storageKey).
 */
export async function addProjectMediaFromForm(
  projectId: string,
  formData: FormData,
) {
  const typeRaw = String(formData.get("type") ?? "");
  const type =
    typeRaw === "VIDEO_UPLOAD"
      ? MediaType.VIDEO_UPLOAD
      : typeRaw === "IMAGE"
        ? MediaType.IMAGE
        : typeRaw === "EXTERNAL_LINK"
          ? MediaType.EXTERNAL_LINK
          : null;
  if (!type) throw new Error("Invalid media type");

  const storageKey = String(formData.get("storageKey") ?? "").trim();
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim() || null;

  let url: string;
  if (type === MediaType.EXTERNAL_LINK) {
    if (!externalUrl) throw new Error("URL required");
    url = externalUrl;
  } else {
    if (!storageKey) throw new Error("Upload a file first");
    url = storageKey;
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Project not found");

  const max = await prisma.projectMedia.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });
  const sortOrder = (max._max.sortOrder ?? -1) + 1;

  await prisma.projectMedia.create({
    data: {
      projectId,
      type,
      url,
      caption,
      sortOrder,
    },
  });

  return { slug: project.slug };
}
