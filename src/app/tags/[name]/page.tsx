import { searchEntries } from "@/lib/search";
import { toEntryResponse } from "@/lib/types";
import EntryCard from "@/components/EntryCard";
import { normalizeTag } from "@/lib/tags";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function TagPage({ params }: Props) {
  const { name } = await params;
  const tag = normalizeTag(decodeURIComponent(name));
  const rows = await searchEntries({ tags: [tag], sort: "top", limit: 50 }).catch(() => []);
  const entries = rows.map(toEntryResponse);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold">Tagged:</h1>
        <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold">{tag}</span>
        <span className="text-sm text-zinc-400">{entries.length} {entries.length === 1 ? "entry" : "entries"}</span>
      </div>
      {entries.length === 0 ? (
        <p className="text-zinc-400 text-sm text-center py-12">No entries with this tag.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => <EntryCard key={entry.entry_id} entry={entry} />)}
        </div>
      )}
    </div>
  );
}
