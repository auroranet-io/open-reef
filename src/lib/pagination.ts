export function clampInt(
  value: string | null | undefined,
  opts: { min: number; max: number; fallback: number }
): number {
  const n = parseInt(value ?? "", 10);
  if (!Number.isFinite(n)) return opts.fallback;
  return Math.min(opts.max, Math.max(opts.min, n));
}
