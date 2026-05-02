import { db } from "@/db/client";
import { collections } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import type { EntryRow } from "./types";
import { toEntryResponse, type EntryResponse } from "./types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface EntryDetail extends EntryResponse {
  contradicts: { entry_id: string; title: string }[];
}

export async function getEntryById(id: string): Promise<EntryDetail | null> {
  const result = await db.execute<EntryRow>(sql`
    SELECT
      e.entry_id, e.title, e.body, e.source_agent, e.submitted_by,
      e.display_handle, e.upvote_count, e.created_at,
      u.github_handle,
      COALESCE(
        json_agg(t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL), '[]'
      ) AS tags,
      0 AS rank
    FROM entries e
    LEFT JOIN users u ON u.id = e.submitted_by
    LEFT JOIN entry_tags et ON et.entry_id = e.entry_id
    LEFT JOIN tags t ON t.id = et.tag_id
    WHERE e.entry_id = ${id}
    GROUP BY e.entry_id, u.github_handle
  `);

  if (result.rows.length === 0) return null;

  const contradictions = await db.execute<{ entry_id: string; title: string }>(sql`
    SELECT e2.entry_id, e2.title
    FROM contradictions c
    JOIN entries e2 ON e2.entry_id = c.target_entry_id
    WHERE c.entry_id = ${id}
  `);

  return {
    ...toEntryResponse(result.rows[0]),
    contradicts: contradictions.rows.map((r) => ({ entry_id: r.entry_id, title: r.title })),
  };
}

export interface CollectionRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: Date;
  [key: string]: unknown;
}

export interface CollectionDetail {
  collection: CollectionRow;
  entries: EntryResponse[];
}

export async function getCollectionBySlugOrId(
  id: string,
  page = 1,
  limit = 20
): Promise<CollectionDetail | null> {
  const offset = (page - 1) * limit;
  const isUuid = UUID_RE.test(id);

  const collResult = await db.execute<CollectionRow>(
    isUuid
      ? sql`SELECT id, slug, name, description, created_at FROM collections WHERE id = ${id}`
      : sql`SELECT id, slug, name, description, created_at FROM collections WHERE slug = ${id}`
  );

  if (collResult.rows.length === 0) return null;
  const collection = collResult.rows[0];

  const entriesResult = await db.execute<EntryRow>(sql`
    SELECT
      e.entry_id, e.title, e.body, e.source_agent, e.submitted_by,
      e.display_handle, e.upvote_count, e.created_at,
      u.github_handle,
      COALESCE(
        json_agg(t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL), '[]'
      ) AS tags,
      0 AS rank
    FROM collection_entries ce
    JOIN entries e ON e.entry_id = ce.entry_id
    LEFT JOIN users u ON u.id = e.submitted_by
    LEFT JOIN entry_tags et ON et.entry_id = e.entry_id
    LEFT JOIN tags t ON t.id = et.tag_id
    WHERE ce.collection_id = ${collection.id}
    GROUP BY e.entry_id, u.github_handle, ce.added_at
    ORDER BY ce.added_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return {
    collection,
    entries: entriesResult.rows.map(toEntryResponse),
  };
}

export async function listCollections(limit = 30, offset = 0): Promise<CollectionRow[]> {
  return db
    .select({
      id: collections.id,
      slug: collections.slug,
      name: collections.name,
      description: collections.description,
      created_at: collections.createdAt,
    })
    .from(collections)
    .orderBy(desc(collections.createdAt))
    .limit(limit)
    .offset(offset) as unknown as CollectionRow[];
}

// Re-export UUID_RE so route handlers can reuse it
export { UUID_RE };
