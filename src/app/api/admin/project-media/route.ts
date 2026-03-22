import { auth } from "@/auth";
import { addProjectMediaFromForm } from "@/lib/add-project-media-from-form";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

function errorCode(e: unknown): string {
  if (!(e instanceof Error)) return "unknown";
  if (e.message === "Upload a file first") return "file";
  if (e.message === "URL required") return "url";
  if (e.message === "Invalid media type") return "type";
  if (e.message === "Project not found") return "project";
  return "unknown";
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const formData = await req.formData();
  const projectId = String(formData.get("projectId") ?? "").trim();
  if (!projectId) {
    return NextResponse.redirect(new URL("/admin/projects", req.url));
  }

  try {
    const { slug } = await addProjectMediaFromForm(projectId, formData);
    revalidatePath("/");
    revalidatePath("/admin/projects");
    revalidatePath(`/work/${slug}`);
  } catch (e) {
    console.error(e);
    const code = errorCode(e);
    return NextResponse.redirect(
      new URL(`/admin/projects/${projectId}?mediaError=${code}`, req.url),
    );
  }

  return NextResponse.redirect(
    new URL(`/admin/projects/${projectId}?mediaAdded=1`, req.url),
  );
}
