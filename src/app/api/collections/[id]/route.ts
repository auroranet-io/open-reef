import { NextRequest, NextResponse } from "next/server";
import { getCollectionBySlugOrId } from "@/lib/entry-queries";
import { clampInt } from "@/lib/pagination";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const page = clampInt(searchParams.get("page"), { min: 1, max: 1000, fallback: 1 });
  const limit = clampInt(searchParams.get("limit"), { min: 1, max: 50, fallback: 20 });

  const data = await getCollectionBySlugOrId(id, page, limit);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ...data, page, limit });
}
