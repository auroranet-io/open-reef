export function normalizeTag(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

export function normalizeTags(raw: string[]): string[] {
  return [...new Set(raw.map(normalizeTag).filter(Boolean))].slice(0, 10);
}
