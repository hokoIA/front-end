"use client";

import { cn } from "@/lib/utils/cn";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 scroll-mt-24 text-xl font-semibold tracking-tight text-hk-deep first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-8 scroll-mt-24 text-lg font-semibold text-hk-deep">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 text-base font-semibold text-hk-deep">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-sm leading-relaxed text-hk-ink">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-4 list-disc space-y-1.5 text-sm text-hk-ink">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-4 list-decimal space-y-1.5 text-sm text-hk-ink">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-hk-deep">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-hk-ink">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-hk-cyan/80 bg-hk-canvas/60 py-2 pl-4 pr-3 text-sm text-hk-ink">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-hk-border-subtle" />,
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto rounded-lg border border-hk-border">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-hk-border bg-hk-canvas/80">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-hk-muted">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-hk-border-subtle px-3 py-2 text-hk-ink">
      {children}
    </td>
  ),
  tr: ({ children }) => <tr className="">{children}</tr>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  code: ({ className, children, ...props }) => {
    const inline = !className?.includes("language-");
    if (inline) {
      return (
        <code
          className="rounded bg-hk-deep/8 px-1.5 py-0.5 font-mono text-[13px] text-hk-deep"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className={cn(
          "block overflow-x-auto rounded-lg bg-hk-deep p-4 font-mono text-[13px] text-white",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="mb-4 overflow-x-auto">{children}</pre>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-hk-action underline-offset-2 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

type Props = {
  content: string;
  className?: string;
};

export function AnalysisMarkdownViewer({ content, className }: Props) {
  return (
    <div
      className={cn(
        "analysis-markdown max-w-none px-5 py-6 md:px-8 md:py-8",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
