import { createProject } from "@/actions/projects";
import { AdminMarkdownTextarea } from "@/components/admin/AdminMarkdownTextarea";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-orange-400 hover:underline">
        ← Projects
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">New project</h1>
      <p className="mt-3 max-w-xl rounded-lg border border-orange-900/40 bg-orange-950/20 px-4 py-3 text-sm text-orange-200/90">
        After you click <strong className="text-orange-100">Create</strong>, you
        will go to the project editor where you can add{" "}
        <strong className="text-orange-100">screen recordings</strong>,{" "}
        <strong className="text-orange-100">screenshots</strong>, and{" "}
        <strong className="text-orange-100">Loom / Drive / demo links</strong>.
      </p>

      <form action={createProject} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Title</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Summary</label>
          <textarea
            name="summary"
            rows={3}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Body (Markdown)</label>
          <AdminMarkdownTextarea
            name="content"
            rows={8}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Stack (comma-separated)</label>
          <input
            name="stack"
            placeholder="Next.js, Prisma, …"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="published" defaultChecked className="rounded" />
          Published
        </label>
        <AdminFormSubmitButton
          pendingLabel="Creating…"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          Create and add media
        </AdminFormSubmitButton>
      </form>

      <p className="mt-10 text-sm text-zinc-500">
        Blog posts are separate:{" "}
        <Link href="/admin/blogs/new" className="text-orange-400 hover:underline">
          Add a blog post
        </Link>
        .
      </p>
    </div>
  );
}
