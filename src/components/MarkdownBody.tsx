"use client";

import { useSiteTheme } from "@/components/SiteThemeContext";
import { rehypeTechTerms } from "@/lib/rehype-tech-terms";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export function MarkdownBody({
  content,
  /** Slightly brighter body copy (e.g. About on home). */
  brighterBody = false,
  /** Highlight known tech / product names (project detail “Details” only). */
  highlightTechTerms = false,
}: {
  content: string;
  brighterBody?: boolean;
  highlightTechTerms?: boolean;
}) {
  const { theme } = useSiteTheme();
  const isLight = theme === "light";

  const bodyTone = isLight
    ? brighterBody
      ? "prose-p:text-stone-700 prose-li:text-stone-700"
      : "prose-p:text-stone-600 prose-li:text-stone-600"
    : brighterBody
      ? "prose-p:text-zinc-300/90 prose-li:text-zinc-300/90"
      : "prose-p:text-zinc-400 prose-li:text-zinc-400";

  const strongTone = highlightTechTerms
    ? "prose-strong:font-semibold prose-strong:[color:var(--accent-bright)]"
    : isLight
      ? "prose-strong:text-stone-900"
      : "prose-strong:text-zinc-100";

  const base = isLight
    ? "prose prose-stone max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-stone-900 prose-a:font-medium prose-a:text-[color:var(--accent-bright)] prose-a:underline prose-a:decoration-blue-900/35 prose-a:underline-offset-[4px] hover:prose-a:text-[color:var(--md-link-hover)]"
    : "prose prose-invert prose-zinc max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-zinc-100 prose-a:text-orange-500 prose-a:underline prose-a:decoration-orange-500/40 prose-a:underline-offset-[4px] hover:prose-a:text-orange-400";

  return (
    <div className={`${base} ${bodyTone} ${strongTone}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={highlightTechTerms ? [rehypeTechTerms] : []}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
