import { AdminFileField } from "@/components/AdminFileField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { getOrCreateSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ saved?: string; error?: string }> };

export default async function AdminSitePage({ searchParams }: Props) {
  const s = await getOrCreateSiteSettings();
  const profileSrc = s.profileImage
    ? `/api/files/${encodeURIComponent(s.profileImage)}`
    : null;

  const q = searchParams ? await searchParams : {};

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-50">Site & contact</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Profile photo, home hero, about (Markdown), and contact links.
      </p>

      <AdminNotice
        saved={q.saved === "1"}
        savedMessage="Settings saved."
        error={q.error === "save"}
        errorMessage="Could not save. Check the terminal for errors."
      />

      <form
        method="POST"
        action="/api/admin/site-settings"
        className="mt-8 space-y-6"
      >
        <div className="rounded-xl border-2 border-cyan-900/50 bg-cyan-950/20 p-5 ring-1 ring-cyan-500/20">
          <h2 className="text-base font-semibold text-cyan-200">
            Profile picture
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            This is the round photo on your public home page. Use a square image
            (e.g. 400×400). Choose a file below, then click <strong>Save</strong>{" "}
            at the bottom of this page.
          </p>
          {profileSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileSrc}
              alt=""
              className="mt-4 h-28 w-28 rounded-full object-cover ring-2 ring-cyan-500/20"
            />
          ) : (
            <p className="mt-4 text-xs text-zinc-600">No photo set.</p>
          )}
          <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950/50 p-3">
            <AdminFileField
              kind="image"
              fieldName="profileImage"
              label="Choose image file (JPEG, PNG, WebP…)"
            />
          </div>
          {profileSrc ? (
            <label className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
              <input type="checkbox" name="clearProfileImage" className="rounded" />
              Remove current photo on save
            </label>
          ) : null}
        </div>

        <div>
          <label className="block text-sm text-zinc-400">Hero title</label>
          <input
            name="heroTitle"
            defaultValue={s.heroTitle}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Hero subtitle</label>
          <textarea
            name="heroSubtitle"
            rows={2}
            defaultValue={s.heroSubtitle}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">About (Markdown)</label>
          <textarea
            name="aboutMarkdown"
            rows={12}
            defaultValue={s.aboutMarkdown}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={s.email ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">LinkedIn URL</label>
          <input
            name="linkedinUrl"
            defaultValue={s.linkedinUrl ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">GitHub URL</label>
          <input
            name="githubUrl"
            defaultValue={s.githubUrl ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-cyan-400"
        >
          Save
        </button>
      </form>
    </div>
  );
}
