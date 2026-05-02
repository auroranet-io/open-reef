import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { db } from "@/db/client";
import { collections } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { clampInt } from "@/lib/pagination";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = clampInt(searchParams.get("page"), { min: 1, max: 1000, fallback: 1 });
  const limit = clampInt(searchParams.get("limit"), { min: 1, max: 50, fallback: 20 });
  const offset = (page - 1) * limit;

  const rows = await db.query.collections.findMany({
    orderBy: [desc(collections.createdAt)],
    limit,
    offset,
  });

  return NextResponse.json({ collections: rows, page, limit });
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { name, description } = body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 422 });
  }
  if (name.trim().length > 100) {
    return NextResponse.json({ error: "name exceeds 100 characters" }, { status: 422 });
  }
  if (description !== undefined && description !== null) {
    if (typeof description !== "string" || description.length > 1000) {
      return NextResponse.json({ error: "description exceeds 1000 characters" }, { status: 422 });
    }
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;

  let attempt = 0;
  while (true) {
    const existing = await db.query.collections.findFirst({
      where: eq(collections.slug, slug),
    });
    if (!existing) break;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const [collection] = await db
    .insert(collections)
    .values({ slug, name: name.trim(), description: description ?? null, createdBy: userId })
    .returning();

  return NextResponse.json(collection, { status: 201 });
}
