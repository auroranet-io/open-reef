"use client";

import Link from "next/link";
import type { EntryResponse } from "@/lib/types";

interface Props {
  entry: EntryResponse;
  showVote?: boolean;
  onVote?: (id: string) => void;
}

export default function EntryCard({ entry, showVote = true, onVote }: Props) {
  const preview = entry.body.length > 200 ? entry.body.slice(0, 200) + "…" : entry.body;
  const submittedBy = entry.submitted_by ?? "anonymous";

  return (
    <article className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
      <div className="flex gap-4">
        {showVote && (
          <button
            onClick={() => onVote?.(entry.entry_id)}
            className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-emerald-500 transition-colors min-w-[2.5rem]"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2l6 10H2z" />
            </svg>
            <span className="text-sm font-semibold tabular-nums">{entry.upvotes}</span>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <Link href={`/entries/${entry.entry_id}`} className="text-base font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
            {entry.title}
          </Link>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{preview}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span>{new Date(entry.created_at).toLocaleDateString()}</span>
            <span>by {submittedBy}</span>
            {entry.source_agent && (
              <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">
                {entry.source_agent}
              </span>
            )}
            <div className="flex flex-wrap gap-1 ml-auto">
              {entry.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
