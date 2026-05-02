import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { db } from "@/db/client";
import { entries, tags, entryTags } from "@/db/schema";
import { searchEntries } from "@/lib/search";
import { normalizeTag, normalizeTags } from "@/lib/tags";
import { checkRateLimit } from "@/lib/rate-limit";
import { toEntryResponse } from "@/lib/types";
import { clampInt } from "@/lib/pagination";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? undefined;
  const tagsParam = searchParams.get("tags");
  const tagList = tagsParam
    ? tagsParam.split(",").map((t) => normalizeTag(t.trim())).filter(Boolean)
    : [];
  const sort = (searchParams.get("sort") ?? undefined) as "top" | "new" | "relevance" | undefined;
  const page = clampInt(searchParams.get("page"), { min: 1, max: 1000, fallback: 1 });
  const limit = clampInt(searchParams.get("limit"), { min: 1, max: 50, fallback: 20 });

  const rows = await searchEntries({ q, tags: tagList, sort, page, limit });
  return NextResponse.json({ entries: rows.map(toEntryResponse), page, limit });
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { title, body: mdBody, tags: rawTags = [], source_agent, display_handle = false } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "title is required" }, { status: 422 });
  }
  if (title.trim().length > 200) {
    return NextResponse.json({ error: "title exceeds 200 characters" }, { status: 422 });
  }
  if (!mdBody || typeof mdBody !== "string" || mdBody.trim().length === 0) {
    return NextResponse.json({ error: "body is required" }, { status: 422 });
  }
  if (mdBody.length > 2000) {
    return NextResponse.json({ error: "body exceeds 2000 characters" }, { status: 422 });
  }
  if (source_agent !== undefined && source_agent !== null) {
    if (typeof source_agent !== "string" || source_agent.length > 80) {
      return NextResponse.json({ error: "source_agent exceeds 80 characters" }, { status: 422 });
    }
  }
  if (!Array.isArray(rawTags)) {
    return NextResponse.json({ error: "tags must be an array" }, { status: 422 });
  }

  const normalizedTags = normalizeTags(rawTags);

  const allowed = await checkRateLimit(userId);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit: 10 submissions per 24 hours" }, { status: 429 });
  }

  const [entry] = await db
    .insert(entries)
    .values({
      title: title.trim(),
      body: mdBody,
      sourceAgent: source_agent ?? null,
      submittedBy: userId,
      displayHandle: Boolean(display_handle),
    })
    .returning();

  for (const tagName of normalizedTags) {
    const res = await db.execute<{ id: number }>(sql`
      INSERT INTO tags (name) VALUES (${tagName})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `);
    const tagId = res.rows[0].id;
    await db.insert(entryTags).values({ entryId: entry.entryId, tagId }).onConflictDoNothing();
  }

  return NextResponse.json({ entry_id: entry.entryId }, { status: 201 });
}
