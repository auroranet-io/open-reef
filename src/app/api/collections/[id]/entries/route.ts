import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { db } from "@/db/client";
import { collectionEntries, entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UUID_RE } from "@/lib/entry-queries";
import { sql } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const entryId = body?.entry_id;

  if (!entryId || typeof entryId !== "string") {
    return NextResponse.json({ error: "entry_id required" }, { status: 422 });
  }

  // Resolve collection by UUID or slug without letting Postgres cast non-UUID strings
  const isUuid = UUID_RE.test(id);
  const collResult = await db.execute<{ id: string }>(
    isUuid
      ? sql`SELECT id FROM collections WHERE id = ${id}`
      : sql`SELECT id FROM collections WHERE slug = ${id}`
  );
  if (collResult.rows.length === 0) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }
  const collectionId = collResult.rows[0].id;

  const entry = await db.query.entries.findFirst({ where: eq(entries.entryId, entryId) });
  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

  await db
    .insert(collectionEntries)
    .values({ collectionId, entryId })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true }, { status: 201 });
}
