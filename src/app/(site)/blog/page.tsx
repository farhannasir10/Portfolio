import { BlogMeta } from "@/components/BlogMeta";
import { SectionHeading } from "@/components/SectionHeading";
import { getPublishedPosts, hasPublishedPosts } from "@/lib/data";
import { estimateReadMinutes } from "@/lib/read-time";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Blog · Portfolio" };

export default async function BlogIndexPage() {
  const show = await hasPublishedPosts();
  if (!show) redirect("/");

  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-3xl scroll-mt-36 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Link
        href="/"
        className="page-back-link"
      >
        ← Home
      </Link>
      <div className="mt-8">
        <SectionHeading kicker="Writing" title="Blog" />
      </div>
      <ul className="mt-2 flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="blog-card-link surface-card surface-card-hover group block p-6 pr-14 sm:p-7 sm:pr-16"
            >
              <span className="text-lg font-semibold tracking-tight text-[var(--text)] transition group-hover:text-[var(--accent-bright)]">
                {post.title}
              </span>
              {post.excerpt ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {post.excerpt}
                </p>
              ) : null}
              <BlogMeta
                publishedAt={post.publishedAt}
                readMinutes={estimateReadMinutes(post.content)}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
