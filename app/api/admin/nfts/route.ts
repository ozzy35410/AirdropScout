import { NextRequest, NextResponse } from "next/server";
import { CHAINS, type ChainSlug } from "@/config/chains";
import { collectionInputSchema, normalizeCollectionPayload } from "@/lib/schemas/collection";
import { getCollections, serializeCollection, upsertCollection } from "@/lib/collections";
import { AdminUnauthorizedError, requireAdminSession } from "@/lib/auth/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    requireAdminSession();
    const url = new URL(request.url);
    const chainParam = url.searchParams.get("chain");

    let chain: ChainSlug | undefined;
    if (chainParam) {
      if (!Object.prototype.hasOwnProperty.call(CHAINS, chainParam)) {
        return NextResponse.json({ ok: false, error: "CHAIN_UNAVAILABLE" }, { status: 400 });
      }
      chain = chainParam as ChainSlug;
    }

    const collections = await getCollections(chain);
    return NextResponse.json({
      ok: true,
      collections: collections.map(serializeCollection)
    });
  } catch (error: unknown) {
    if (error instanceof AdminUnauthorizedError) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    console.error("Admin collections GET failed", error);
    return NextResponse.json({ ok: false, error: "UNKNOWN" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdminSession();
    const body = (await request.json()) as Record<string, unknown> | null;
    const normalized = normalizeCollectionPayload(body ?? {});
  const parsed = collectionInputSchema.parse(normalized);

    const record = await upsertCollection({
      chain: parsed.chain,
      slug: parsed.slug,
      name: parsed.name,
      standard: parsed.standard,
      contract: parsed.contract as `0x${string}`,
      image: parsed.image ?? null,
      tags: parsed.tags ?? [],
      mintUrl: parsed.mintUrl ?? null,
      startBlock: parsed.startBlock ?? null,
      addedAt: parsed.addedAt ?? null,
      visible: parsed.visible ?? true
    });

    return NextResponse.json({ ok: true, collection: record ? serializeCollection(record) : null });
  } catch (error: unknown) {
    if (error instanceof AdminUnauthorizedError) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (error instanceof Error) {
      console.error("Admin collections POST failed", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    console.error("Admin collections POST failed", error);
    return NextResponse.json({ ok: false, error: "UNKNOWN" }, { status: 500 });
  }
}
