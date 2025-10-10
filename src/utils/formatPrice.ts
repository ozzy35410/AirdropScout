/**
 * Pretty price formatter: keeps up to 7 decimals, trims trailing zeros, keeps tiny values intact.
 * 
 * Examples:
 * - formatPrice(0.01) → "0.01"
 * - formatPrice(0.0100000) → "0.01"
 * - formatPrice(1.0000000) → "1"
 * - formatPrice(0.0000001) → "0.0000001"
 * - formatPrice(0) → "0"
 * 
 * @param value - Price value to format
 * @param opts - Options with maxDecimals (default: 7)
 * @returns Formatted price string
 */
export function formatPrice(
  value: number | string | null | undefined,
  opts?: { maxDecimals?: number }
): string {
  if (value === null || value === undefined) return "";
  const maxDecimals = opts?.maxDecimals ?? 7;

  // Normalize to number (avoid scientific notation)
  let n = typeof value === "number" ? value : Number(value);
  if (!isFinite(n)) return "";

  // Zero: handled by caller as FREE, but return "0" if needed
  if (n === 0) return "0";

  // toFixed with maxDecimals, then trim trailing zeros and dot
  // Example: 0.0100000 -> "0.01", 1.0000000 -> "1", 0.0000001 -> "0.0000001"
  let s = n.toFixed(maxDecimals);

  // Remove trailing zeros then trailing dot if any
  s = s.replace(/(\.\d*?[1-9])0+$/, "$1"); // trim trailing zeros after significant digit
  s = s.replace(/\.0+$/, ""); // remove .000... pattern
  s = s.replace(/\.$/, ""); // remove final dot if it exists

  // Safety: keep at least one leading zero like "0.01"
  if (s.startsWith(".")) s = "0" + s;

  return s;
}
