import { MarkdownBody } from "@/components/MarkdownBody";
import { getPublishedPostBySlug } from "@/lib/data";
import { publicFileUrl } from "@/lib/public-file-url";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Blog" };
  return { title: `${post.title} · Blog` };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const cover = publicFileUrl(post.coverImage);

  return (
    <article className="mx-auto max-w-3xl scroll-mt-36 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Link
        href="/blog"
        className="kicker-sky inline-block opacity-90 transition hover:text-orange-400"
      >
        ← Blog
      </Link>
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl sm:leading-tight">
        {post.title}
      </h1>
      {post.publishedAt ? (
        <p className="mt-3 font-mono text-sm text-zinc-600">
          {post.publishedAt.toLocaleDateString(undefined, {
            dateStyle: "long",
          })}
        </p>
      ) : null}
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          className="mt-10 w-full rounded-xl border border-zinc-800 object-cover shadow-[0_24px_48px_-20px_rgba(249,115,22,0.12)]"
        />
      ) : null}
      <div className="mt-12">
        <MarkdownBody content={post.content} />
      </div>
    </article>
  );
}
