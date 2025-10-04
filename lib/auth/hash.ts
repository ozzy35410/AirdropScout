import { createHash } from "node:crypto";

export function sha256Hex(value: string): string {
  const hash = createHash("sha256");
  hash.update(value);
  return hash.digest("hex");
}
