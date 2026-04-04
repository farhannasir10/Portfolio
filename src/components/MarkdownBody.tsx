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
  const bodyTone = brighterBody
    ? "prose-p:text-zinc-300/90 prose-li:text-zinc-300/90"
    : "prose-p:text-zinc-400 prose-li:text-zinc-400";

  /** Match auto-highlighted tech terms; Ctrl+B `**…**` maps to <strong>. */
  const strongTone = highlightTechTerms
    ? "prose-strong:font-semibold prose-strong:[color:var(--accent-bright)]"
    : "prose-strong:text-zinc-100";

  return (
    <div
      className={`prose prose-invert prose-zinc max-w-none prose-p:leading-relaxed ${bodyTone} prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-zinc-100 prose-a:text-orange-500 prose-a:underline prose-a:decoration-orange-500/40 prose-a:underline-offset-[4px] hover:prose-a:text-orange-400 ${strongTone}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={highlightTechTerms ? [rehypeTechTerms] : []}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
