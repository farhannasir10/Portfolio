import { createBlogPost } from "@/actions/blogs";
import { AdminFileField } from "@/components/AdminFileField";
import { AdminMarkdownTextarea } from "@/components/admin/AdminMarkdownTextarea";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import Link from "next/link";

export default function NewBlogPage() {
  return (
    <div>
      <Link href="/admin/blogs" className="text-sm text-orange-400 hover:underline">
        ← Blog
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">New post</h1>

      <form action={createBlogPost} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Title</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <AdminFileField
          kind="image"
          fieldName="coverImage"
          label="Cover image (optional)"
        />
        <div>
          <label className="block text-sm text-zinc-400">Content (Markdown)</label>
          <AdminMarkdownTextarea
            name="content"
            rows={14}
            required
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="published" className="rounded" />
          Published
        </label>
        <AdminFormSubmitButton
          pendingLabel="Creating…"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          Create
        </AdminFormSubmitButton>
      </form>
    </div>
  );
}
