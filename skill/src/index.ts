const BASE_URL = process.env.OPENREEF_BASE_URL ?? "https://openreef.dev";
const TOKEN = process.env.OPENREEF_TOKEN;

interface Entry {
  entry_id: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  created_at: string;
  source_agent: string | null;
  submitted_by: string | null;
}

interface SearchResult {
  entries: Entry[];
}

export async function openreef_search(query: string, limit = 5): Promise<string> {
  const url = new URL("/api/entries", BASE_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "relevance");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OpenReef API error: ${res.status}`);

  const data: SearchResult = await res.json();

  if (data.entries.length === 0) {
    return `No OpenReef entries found for: "${query}"`;
  }

  const lines: string[] = [`## OpenReef: top ${data.entries.length} results for "${query}"\n`];
  for (const e of data.entries) {
    lines.push(`### ${e.title}`);
    lines.push(`**Tags:** ${e.tags.join(", ")} | **Upvotes:** ${e.upvotes}`);
    lines.push(e.body);
    lines.push(`[View on OpenReef](${BASE_URL}/entries/${e.entry_id})\n`);
  }

  return lines.join("\n");
}

export async function openreef_submit(
  title: string,
  body: string,
  tags: string[],
  options: { source_agent?: string; display_handle?: boolean } = {}
): Promise<string> {
  if (!TOKEN) throw new Error("OPENREEF_TOKEN is not set. Log in at OpenReef and set the token.");

  const res = await fetch(`${BASE_URL}/api/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ title, body, tags, ...options }),
  });

  if (res.status === 429) throw new Error("Rate limit reached (10 submissions per 24 hours)");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `OpenReef API error: ${res.status}`);
  }

  const { entry_id } = await res.json();
  return `Entry submitted: ${BASE_URL}/entries/${entry_id}`;
}
