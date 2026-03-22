import { prisma } from "@/lib/prisma";

/** Shared by the server action and the POST route (avoids Server Action fetch issues in dev). */
export async function persistSiteSettingsFromForm(formData: FormData) {
  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const aboutMarkdown = String(formData.get("aboutMarkdown") ?? "");
  const email = String(formData.get("email") ?? "").trim() || null;
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim() || null;
  const githubUrl = String(formData.get("githubUrl") ?? "").trim() || null;

  const clearProfile = formData.get("clearProfileImage") === "on";
  const profileRaw = String(formData.get("profileImage") ?? "").trim();
  const existing = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  let profileImage: string | null;
  if (clearProfile) {
    profileImage = null;
  } else if (profileRaw.length > 0) {
    profileImage = profileRaw;
  } else {
    profileImage = existing?.profileImage ?? null;
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      profileImage,
      heroTitle: heroTitle || "Freelance software engineer",
      heroSubtitle: heroSubtitle || "",
      aboutMarkdown,
      email,
      linkedinUrl,
      githubUrl,
    },
    update: {
      profileImage,
      heroTitle: heroTitle || "Freelance software engineer",
      heroSubtitle: heroSubtitle || "",
      aboutMarkdown,
      email,
      linkedinUrl,
      githubUrl,
    },
  });
}
