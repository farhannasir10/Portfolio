import { auth } from "@/auth";
import { persistSiteSettingsFromForm } from "@/lib/persist-site-settings";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const formData = await req.formData();
  try {
    await persistSiteSettingsFromForm(formData);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(
      new URL("/admin/site?error=save", req.url),
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/site");

  return NextResponse.redirect(new URL("/admin/site?saved=1", req.url));
}
