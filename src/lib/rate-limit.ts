import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { and, eq, gte, count } from "drizzle-orm";

const DAILY_LIMIT = 10;

export async function checkRateLimit(userId: string): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [row] = await db
    .select({ n: count() })
    .from(entries)
    .where(and(eq(entries.submittedBy, userId), gte(entries.createdAt, since)));
  return (row?.n ?? 0) < DAILY_LIMIT;
}
