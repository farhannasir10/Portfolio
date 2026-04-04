import { SectionHeading } from "@/components/SectionHeading";
import { getPublishedPosts, hasPublishedPosts } from "@/lib/data";
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
        className="kicker-sky inline-block opacity-90 transition hover:text-orange-400"
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
              className="surface-card surface-card-hover group block p-6 sm:p-7"
            >
              <span className="text-lg font-semibold tracking-tight text-zinc-100 transition group-hover:text-orange-500">
                {post.title}
              </span>
              {post.excerpt ? (
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {post.excerpt}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
