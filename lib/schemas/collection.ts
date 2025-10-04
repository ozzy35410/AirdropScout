import { z } from "zod";
import { CHAINS, type ChainSlug } from "@/config/chains";

const emptyToUndefined = (value: string | null | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const chainSchema = z
  .string()
  .trim()
  .refine((value: string): value is ChainSlug => Object.prototype.hasOwnProperty.call(CHAINS, value), "Unsupported chain")
  .transform((value: string) => value as ChainSlug);

export const collectionInputSchema = z.object({
  chain: chainSchema,
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Slug can contain lowercase letters, numbers, and hyphens")
    .transform((value: string) => value.trim()),
  name: z.string().min(3).max(140).transform((value: string) => value.trim()),
  standard: z.enum(["erc721", "erc1155"]),
  contract: z
    .string()
    .trim()
    .transform((value: string) => value.toLowerCase())
    .refine((value: string) => /^0x[a-f0-9]{40}$/.test(value), "Contract address must be a valid 0x address"),
  image: z
    .string()
    .trim()
    .transform((value: string) => emptyToUndefined(value))
    .refine((value: string | undefined) => !value || value.startsWith("https://"), "Image must be an HTTPS URL")
    .optional(),
  tags: z
    .array(z.string().trim().min(1))
    .transform((tags: string[]) => Array.from(new Set(tags.map((tag: string) => tag.toLowerCase()))))
    .optional(),
  mintUrl: z
    .string()
    .trim()
    .transform((value: string) => emptyToUndefined(value))
    .refine((value: string | undefined) => !value || /^https?:\/\//.test(value), "Mint URL must be http(s)")
    .optional(),
  startBlock: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value: string | number | undefined) => {
      if (value === undefined) return undefined;
      const numeric = typeof value === "number" ? Math.trunc(value) : parseInt(value, 10);
      if (Number.isNaN(numeric) || numeric < 0) {
        throw new Error("Start block must be a positive integer");
      }
      return numeric.toString();
    }),
  addedAt: z
    .string()
    .trim()
    .transform((value: string) => emptyToUndefined(value))
    .optional()
    .refine((value: string | undefined) => !value || !Number.isNaN(Date.parse(value)), "Added at must be a valid ISO date"),
  visible: z.boolean().optional()
});

export type CollectionInput = z.infer<typeof collectionInputSchema>;

export function normalizeCollectionPayload(payload: Record<string, unknown> | null | undefined) {
  const input = payload ?? {};
  const tagsRaw = input.tags;

  let tags: string[] | undefined;
  if (Array.isArray(tagsRaw)) {
    tags = tagsRaw.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean);
  } else if (typeof tagsRaw === "string") {
    tags = tagsRaw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return {
    ...input,
    tags
  };
}
