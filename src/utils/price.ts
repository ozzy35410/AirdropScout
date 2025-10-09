/**
 * Normalize price_eth from Supabase into a consistent type.
 * @returns number | null where 0 means free, null means unknown
 */
export function normalizePriceEth(input: unknown): number | null {
  if (input === undefined || input === null) return null;
  const s = String(input).trim().toLowerCase();

  // treat empty / "free" as free
  if (s === '' || s === 'free') return 0;

  // "0", "0.", "0.0", "0.0000..." → free
  if (s === '0' || s === '0.' || /^0\.0*$/.test(s)) return 0;

  const n = Number(s);
  if (Number.isFinite(n)) return n;

  return null; // unknown price
}
