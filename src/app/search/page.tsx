import { searchEntries } from "@/lib/search";
import { toEntryResponse } from "@/lib/types";
import EntryCard from "@/components/EntryCard";
import Link from "next/link";
import { clampInt } from "@/lib/pagination";

interface Props {
  searchParams: Promise<{ q?: string; tags?: string; sort?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, tags: tagsParam, sort, page } = await searchParams;
  const tagList = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  const pageNum = clampInt(page, { min: 1, max: 1000, fallback: 1 });
  const validSort = (sort === "top" || sort === "new" || sort === "relevance") ? sort : undefined;

  const hasQuery = Boolean(q || tagList.length);
  const rows = hasQuery
    ? await searchEntries({ q, tags: tagList, sort: validSort, page: pageNum, limit: 20 }).catch(() => [])
    : [];
  const entries = rows.map(toEntryResponse);

  function buildUrl(params: Record<string, string>) {
    const sp = new URLSearchParams({ ...(q ? { q } : {}), ...(tagsParam ? { tags: tagsParam } : {}), ...(sort ? { sort } : {}), ...params });
    return `/search?${sp}`;
  }

  return (
    <div>
      <form method="GET" action="/search" className="mb-6">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search entries…"
            className="flex-1 border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Search
          </button>
        </div>
        {tagList.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            <span className="text-zinc-500">Tags:</span>
            {tagList.map((tag) => (
              <span key={tag} className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </form>

      {hasQuery && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-500">{entries.length === 0 ? "No results" : `${entries.length} result${entries.length === 1 ? "" : "s"}`}</p>
          <div className="flex gap-1.5 text-sm">
            {(["relevance", "top", "new"] as const).map((s) => (
              <Link key={s} href={buildUrl({ sort: s, page: "1" })}
                className={`px-2.5 py-1 rounded-full transition-colors capitalize ${(validSort ?? "relevance") === s ? "bg-emerald-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
              >{s}</Link>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && hasQuery ? (
        <p className="text-center py-12 text-zinc-400 text-sm">No entries matched your query.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => <EntryCard key={entry.entry_id} entry={entry} />)}
        </div>
      )}

      {entries.length === 20 && (
        <div className="mt-6 flex justify-center gap-3">
          {pageNum > 1 && (
            <Link href={buildUrl({ page: String(pageNum - 1) })} className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              ← Previous
            </Link>
          )}
          <Link href={buildUrl({ page: String(pageNum + 1) })} className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            Next →
          </Link>
        </div>
      )}
    </div>
  );
}
