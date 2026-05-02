import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export async function GET() {
  const result = await db.execute<{ name: string; count: number }>(sql`
    SELECT t.name, count(et.entry_id)::int AS count
    FROM tags t
    LEFT JOIN entry_tags et ON et.tag_id = t.id
    GROUP BY t.id, t.name
    ORDER BY count DESC, t.name ASC
    LIMIT 200
  `);
  return NextResponse.json({ tags: result.rows });
}
