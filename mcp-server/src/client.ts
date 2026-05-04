const BASE_URL = process.env.OPENREEF_BASE_URL ?? "https://openrf.io";
const TOKEN = process.env.OPENREEF_TOKEN;

export interface Entry {
  entry_id: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  created_at: string;
  source_agent: string | null;
  submitted_by: string | null;
}

export function getBaseUrl(): string {
  return BASE_URL;
}

export async function searchEntries(query: string, limit: number): Promise<Entry[]> {
  const url = new URL("/api/entries", BASE_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "relevance");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OpenReef API error: ${res.status}`);

  const data = await res.json() as { entries: Entry[] };
  return data.entries;
}

export async function submitEntry(
  title: string,
  body: string,
  tags: string[],
  opts: { source_agent?: string; display_handle?: boolean } = {}
): Promise<{ entry_id: string }> {
  if (!TOKEN) {
    throw new Error(
      "OPENREEF_TOKEN is not set. Log in at https://openrf.io, generate a token under Settings, " +
        "then add OPENREEF_TOKEN to the MCP server's env block in ~/.claude.json."
    );
  }

  const res = await fetch(`${BASE_URL}/api/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ title, body, tags, ...opts }),
  });

  if (res.status === 429) throw new Error("Rate limit reached (10 submissions per 24 hours)");
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `OpenReef API error: ${res.status}`);
  }

  return res.json() as Promise<{ entry_id: string }>;
}
