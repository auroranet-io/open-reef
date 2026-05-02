import Link from "next/link";
import { listCollections } from "@/lib/entry-queries";

export default async function CollectionsPage() {
  const collections = await listCollections(30).catch(() => []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Collections</h1>
      {collections.length === 0 ? (
        <p className="text-zinc-400 text-sm text-center py-12">No collections yet. Log in to create one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.slug}`}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
              <h2 className="font-semibold text-sm mb-1">{c.name}</h2>
              {c.description && <p className="text-xs text-zinc-500 line-clamp-2">{c.description}</p>}
              <p className="text-xs text-zinc-400 mt-2">{new Date(c.created_at).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
