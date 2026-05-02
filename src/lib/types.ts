export interface EntryRow {
  entry_id: string;
  title: string;
  body: string;
  source_agent: string | null;
  submitted_by: string | null;
  display_handle: boolean;
  upvote_count: number;
  created_at: Date;
  github_handle: string | null;
  tags: string[];
  rank?: number;
  [key: string]: unknown;
}

export interface EntryResponse {
  entry_id: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  created_at: string;
  source_agent: string | null;
  submitted_by: string | null;
}

export function toEntryResponse(row: EntryRow): EntryResponse {
  return {
    entry_id: row.entry_id,
    title: row.title,
    body: row.body,
    tags: row.tags,
    upvotes: row.upvote_count,
    created_at: new Date(row.created_at).toISOString(),
    source_agent: row.source_agent,
    submitted_by: row.display_handle ? row.github_handle : null,
  };
}
