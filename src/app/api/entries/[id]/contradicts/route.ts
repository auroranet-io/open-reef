import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { db } from "@/db/client";
import { contradictions, entries } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  const targetId = body?.target_entry_id;

  if (!targetId || typeof targetId !== "string") {
    return NextResponse.json({ error: "target_entry_id required" }, { status: 422 });
  }
  if (targetId === id) {
    return NextResponse.json({ error: "An entry cannot contradict itself" }, { status: 422 });
  }

  const source = await db.query.entries.findFirst({ where: eq(entries.entryId, id) });
  if (!source) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

  const target = await db.query.entries.findFirst({ where: eq(entries.entryId, targetId) });
  if (!target) return NextResponse.json({ error: "Target entry not found" }, { status: 404 });

  await db
    .insert(contradictions)
    .values({ entryId: id, targetEntryId: targetId, flaggedBy: userId })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true }, { status: 201 });
}
