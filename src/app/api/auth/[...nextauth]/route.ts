import { handlers } from "@/lib/auth";
import type { NextRequest } from "next/server";

// Auth.js v5 beta handler signature doesn't include the context param that
// Next.js 16 type-checks expect — cast to the expected shape.
type RouteHandler = (req: NextRequest) => Response | Promise<Response>;
export const GET = handlers.GET as unknown as RouteHandler;
export const POST = handlers.POST as unknown as RouteHandler;
