import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-zinc max-w-none prose-p:leading-relaxed prose-p:text-zinc-400 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-zinc-100 prose-a:text-orange-500 prose-a:underline prose-a:decoration-orange-500/40 prose-a:underline-offset-[4px] hover:prose-a:text-orange-400 prose-strong:text-zinc-100 prose-li:text-zinc-400">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
