import { notFound } from "next/navigation";
import Link from "next/link";
import MarkdownView from "@/components/MarkdownView";
import { getEntryById } from "@/lib/entry-queries";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EntryDetailPage({ params }: Props) {
  const { id } = await params;
  const entry = await getEntryById(id).catch(() => null);

  if (!entry) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-4 inline-block">← Back</Link>

      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 min-w-[3rem] pt-1">
          <span className="text-2xl font-bold tabular-nums text-emerald-600">{entry.upvotes}</span>
          <span className="text-xs text-zinc-400">votes</span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold leading-snug mb-3">{entry.title}</h1>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {entry.tags.map((tag: string) => (
              <Link key={tag} href={`/tags/${tag}`}
                className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs px-2.5 py-1 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors">
                {tag}
              </Link>
            ))}
          </div>

          <MarkdownView content={entry.body} className="mb-4" />

          <div className="text-xs text-zinc-400 flex flex-wrap gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <span>Submitted {new Date(entry.created_at).toLocaleDateString()}</span>
            {entry.submitted_by && <span>by {entry.submitted_by}</span>}
            {entry.source_agent && (
              <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{entry.source_agent}</span>
            )}
          </div>

          {entry.contradicts?.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">⚠ Flagged as contradicting:</p>
              <ul className="space-y-1">
                {entry.contradicts.map((c: { entry_id: string; title: string }) => (
                  <li key={c.entry_id}>
                    <Link href={`/entries/${c.entry_id}`} className="text-xs text-amber-600 dark:text-amber-400 hover:underline">{c.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
