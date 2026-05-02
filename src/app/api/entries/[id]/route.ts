import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import type { EntryRow } from "@/lib/types";
import { toEntryResponse } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = result.rows[0];

  // Also fetch contradiction flags
  const contradictions = await db.execute<{ entry_id: string; title: string }>(sql`
    SELECT e2.entry_id, e2.title
    FROM contradictions c
    JOIN entries e2 ON e2.entry_id = c.target_entry_id
    WHERE c.entry_id = ${id}
  `);

  return NextResponse.json({
    ...toEntryResponse(row),
    contradicts: contradictions.rows.map((r) => ({ entry_id: r.entry_id, title: r.title })),
  });
}
