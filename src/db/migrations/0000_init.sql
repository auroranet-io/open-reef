-- Auth.js tables
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image TEXT,
  github_handle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  PRIMARY KEY (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  session_token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Application tables
CREATE TABLE IF NOT EXISTS entries (
  entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  source_agent TEXT,
  submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  display_handle BOOLEAN NOT NULL DEFAULT FALSE,
  upvote_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  search_vector TSVECTOR
);

CREATE INDEX IF NOT EXISTS entries_search_vector_idx ON entries USING gin(search_vector);
CREATE INDEX IF NOT EXISTS entries_upvote_count_idx ON entries(upvote_count);
CREATE INDEX IF NOT EXISTS entries_created_at_idx ON entries(created_at);

-- Auto-update search_vector on insert/update
CREATE OR REPLACE FUNCTION entries_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.title || ' ' || NEW.body);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS entries_search_vector_trigger ON entries;
CREATE TRIGGER entries_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, body ON entries
  FOR EACH ROW EXECUTE FUNCTION entries_search_vector_update();

CREATE TABLE IF NOT EXISTS tags (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS tags_name_idx ON tags(name);

CREATE TABLE IF NOT EXISTS entry_tags (
  entry_id UUID NOT NULL REFERENCES entries(entry_id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);

CREATE TABLE IF NOT EXISTS votes (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(entry_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, entry_id)
);

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS collections_slug_idx ON collections(slug);

CREATE TABLE IF NOT EXISTS collection_entries (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(entry_id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (collection_id, entry_id)
);

CREATE TABLE IF NOT EXISTS contradictions (
  entry_id UUID NOT NULL REFERENCES entries(entry_id) ON DELETE CASCADE,
  target_entry_id UUID NOT NULL REFERENCES entries(entry_id) ON DELETE CASCADE,
  flagged_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (entry_id, target_entry_id)
);

CREATE TABLE IF NOT EXISTS api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS api_tokens_hash_idx ON api_tokens(token_hash);
