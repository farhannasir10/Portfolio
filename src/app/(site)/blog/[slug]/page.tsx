import { BlogMeta } from "@/components/BlogMeta";
import { MarkdownBody } from "@/components/MarkdownBody";
import { getPublishedPostBySlug } from "@/lib/data";
import { estimateReadMinutes } from "@/lib/read-time";
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
        className="page-back-link"
      >
        ← Blog
      </Link>
      <h1 className="detail-hero-title mt-8 text-3xl text-[var(--text)] sm:text-4xl sm:leading-tight">
        {post.title}
      </h1>
      <BlogMeta
        publishedAt={post.publishedAt}
        readMinutes={estimateReadMinutes(post.content)}
      />
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="blog-post-cover mt-10 w-full object-cover"
        />
      ) : null}
      <div className="detail-content-panel mt-12">
        <MarkdownBody content={post.content} />
      </div>
    </article>
  );
}
