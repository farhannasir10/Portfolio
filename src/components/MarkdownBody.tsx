import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-400 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-100 prose-a:text-sky-300 prose-a:underline prose-a:decoration-sky-500/40 prose-a:underline-offset-[5px] prose-a:transition-colors hover:prose-a:text-sky-200 prose-strong:text-slate-200 prose-li:text-slate-400">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
