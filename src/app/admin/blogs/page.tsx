import { AdminNotice } from "@/components/admin/AdminNotice";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ deleted?: string }> };

export default async function AdminBlogsPage({ searchParams }: Props) {
  const q = searchParams ? await searchParams : {};
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Blog</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Published posts appear on the site. With zero published posts, the
            blog section is hidden.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          New post
        </Link>
      </div>

      <AdminNotice deleted={q.deleted === "1"} />

      <ul className="mt-8 space-y-2">
        {posts.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
          >
            <div>
              <span className="font-medium text-zinc-200">{p.title}</span>
              <span className="ml-2 text-xs text-zinc-500">
                {p.published ? "published" : "draft"}
              </span>
            </div>
            <Link
              href={`/admin/blogs/${p.id}`}
              className="text-sm text-orange-400 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
        {posts.length === 0 ? (
          <li className="text-sm text-zinc-500">No posts yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
