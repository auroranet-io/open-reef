import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { db } from "@/db/client";
import { votes, entries } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const voted = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(votes)
      .values({ userId, entryId: id })
      .onConflictDoNothing()
      .returning();

    if (inserted.length > 0) {
      await tx.update(entries).set({ upvoteCount: sql`upvote_count + 1` }).where(eq(entries.entryId, id));
      return true;
    } else {
      await tx.delete(votes).where(and(eq(votes.userId, userId), eq(votes.entryId, id)));
      await tx.update(entries).set({ upvoteCount: sql`upvote_count - 1` }).where(eq(entries.entryId, id));
      return false;
    }
  });

  return NextResponse.json({ voted });
}
