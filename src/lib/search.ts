import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import type { EntryRow } from "./types";

export type SortMode = "top" | "new" | "relevance";

export interface SearchParams {
  q?: string;
  tags?: string[];
  sort?: SortMode;
  page?: number;
  limit?: number;
}

export async function searchEntries(params: SearchParams): Promise<EntryRow[]> {
  const { q, tags = [], sort = q ? "relevance" : "new", page = 1, limit = 20 } = params;
  const offset = (page - 1) * limit;

  // Build a parameterised query using Drizzle's sql template tag so we can
  // use ts_rank and tsvector operators directly without fighting the ORM.
  const rows = await db.execute<EntryRow>(sql`
    SELECT
      e.entry_id,
      e.title,
      e.body,
      e.source_agent,
      e.submitted_by,
      e.display_handle,
      e.upvote_count,
      e.created_at,
      u.github_handle,
      COALESCE(
        json_agg(t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL),
        '[]'
      ) AS tags,
      ${
        q
          ? sql`ts_rank(e.search_vector, plainto_tsquery('english', ${q})) + log(e.upvote_count + 1) * 0.1 AS rank`
          : sql`0 AS rank`
      }
    FROM entries e
    LEFT JOIN users u ON u.id = e.submitted_by
    LEFT JOIN entry_tags et ON et.entry_id = e.entry_id
    LEFT JOIN tags t ON t.id = et.tag_id
    WHERE 1=1
      ${q ? sql`AND e.search_vector @@ plainto_tsquery('english', ${q})` : sql``}
      ${
        tags.length > 0
          ? sql`AND e.entry_id IN (
              SELECT et2.entry_id FROM entry_tags et2
              JOIN tags t2 ON t2.id = et2.tag_id
              WHERE t2.name = ANY(${tags})
              GROUP BY et2.entry_id
              HAVING count(*) = ${tags.length}
            )`
          : sql``
      }
    GROUP BY e.entry_id, u.github_handle
    ORDER BY ${
      sort === "top"
        ? sql`e.upvote_count DESC, e.created_at DESC`
        : sort === "new"
          ? sql`e.created_at DESC`
          : sql`rank DESC, e.upvote_count DESC`
    }
    LIMIT ${limit} OFFSET ${offset}
  `);

  return rows.rows;
}
