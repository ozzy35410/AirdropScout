import { isAddress, checksumAddress } from "viem";

export function isValidAddress(value: string | null | undefined): value is `0x${string}` {
  if (!value) return false;
  return isAddress(value as string, { strict: false });
}

export function normalizeAddress(value: string): string {
  if (!value) return "";
  return value.trim().toLowerCase();
}

export function formatChecksum(value: string): string {
  if (!isValidAddress(value)) {
    return value;
  }

  try {
    return checksumAddress(value as `0x${string}`);
  } catch {
    return value;
  }
}
