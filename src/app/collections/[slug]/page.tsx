import { notFound } from "next/navigation";
import EntryCard from "@/components/EntryCard";
import { getCollectionBySlugOrId } from "@/lib/entry-queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCollectionBySlugOrId(slug).catch(() => null);
  if (!data) notFound();

  const { collection, entries } = data;

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">{collection.name}</h1>
      {collection.description && <p className="text-sm text-zinc-500 mb-5">{collection.description}</p>}
      {entries.length === 0 ? (
        <p className="text-zinc-400 text-sm text-center py-12">No entries in this collection yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry: Parameters<typeof EntryCard>[0]["entry"]) => (
            <EntryCard key={entry.entry_id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
