import { deleteBlogPost, updateBlogPost } from "@/actions/blogs";
import { AdminFileField } from "@/components/AdminFileField";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
};

export default async function EditBlogPage({ params, searchParams }: Props) {
  const { id } = await params;
  const q = searchParams ? await searchParams : {};
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/blogs" className="text-sm text-cyan-400 hover:underline">
        ← Blog
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Edit post</h1>

      <AdminNotice saved={q.saved === "1"} />

      <form action={updateBlogPost.bind(null, post.id)} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Title</label>
          <input
            name="title"
            required
            defaultValue={post.title}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Slug</label>
          <input
            name="slug"
            defaultValue={post.slug}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <p className="text-sm text-zinc-400">Cover image</p>
          <p className="mt-1 text-xs text-zinc-500">
            Current: {post.coverImage ?? "none"}. Upload to replace (optional).
          </p>
          <div className="mt-2">
            <AdminFileField
              kind="image"
              fieldName="coverImage"
              label="New cover upload"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Content (Markdown)</label>
          <textarea
            name="content"
            rows={14}
            required
            defaultValue={post.content}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published}
            className="rounded"
          />
          Published
        </label>
        <AdminFormSubmitButton
          pendingLabel="Saving…"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-cyan-400"
        >
          Save
        </AdminFormSubmitButton>
      </form>

      <form action={deleteBlogPost.bind(null, post.id)} className="mt-10">
        <AdminFormSubmitButton
          pendingLabel="Deleting…"
          confirmMessage="Delete this post?"
          className="rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:bg-red-950/30"
        >
          Delete post
        </AdminFormSubmitButton>
      </form>
    </div>
  );
}
