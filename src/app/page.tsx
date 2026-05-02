import { searchEntries } from "@/lib/search";
import { toEntryResponse } from "@/lib/types";
import EntryCard from "@/components/EntryCard";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function FeedPage({ searchParams }: Props) {
  const { sort = "new" } = await searchParams;
  const validSort = sort === "top" || sort === "new" ? sort : "new";

  const rows = await searchEntries({ sort: validSort, limit: 30 }).catch(() => []);
  const entries = rows.map(toEntryResponse);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Knowledge Feed</h1>
        <div className="flex gap-2 text-sm">
          <Link
            href="/?sort=new"
            className={`px-3 py-1 rounded-full transition-colors ${validSort === "new" ? "bg-emerald-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
          >
            New
          </Link>
          <Link
            href="/?sort=top"
            className={`px-3 py-1 rounded-full transition-colors ${validSort === "top" ? "bg-emerald-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
          >
            Top
          </Link>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-lg">No entries yet.</p>
          <p className="mt-2 text-sm">
            <Link href="/submit" className="text-emerald-600 hover:underline">Submit the first one</Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <EntryCard key={entry.entry_id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
