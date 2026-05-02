import { NextRequest } from "next/server";
import { auth } from "./auth";
import { db } from "@/db/client";
import { apiTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function generateToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = hashToken(token);
  await db.insert(apiTokens).values({ userId, tokenHash: hash });
  return token;
}

export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  // Check session first
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  // Fall back to Bearer token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const hash = hashToken(token);

  const row = await db.query.apiTokens.findFirst({
    where: eq(apiTokens.tokenHash, hash),
  });

  return row?.userId ?? null;
}
