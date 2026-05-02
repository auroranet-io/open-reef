"use client";

import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownView({ content, className = "" }: Props) {
  return (
    <div className={`prose prose-zinc dark:prose-invert max-w-none text-sm ${className}`}>
      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
    </div>
  );
}
