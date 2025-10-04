import { NextRequest, NextResponse } from "next/server";
import { CHAINS, type ChainSlug } from "@/config/chains";
import { AdminUnauthorizedError, requireAdminSession } from "@/lib/auth/server";
import { collectionInputSchema, normalizeCollectionPayload } from "@/lib/schemas/collection";
import { deleteCollection, getCollections, serializeCollection, upsertCollection } from "@/lib/collections";

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function ensureChain(chainParam: string | string[] | undefined): ChainSlug {
  if (!chainParam || Array.isArray(chainParam)) {
    throw new HttpError("CHAIN_UNAVAILABLE", 400);
  }
  if (!Object.prototype.hasOwnProperty.call(CHAINS, chainParam)) {
    throw new HttpError("CHAIN_UNAVAILABLE", 400);
  }
  return chainParam as ChainSlug;
}

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, context: { params: { chain: string; slug: string } }) {
  try {
    requireAdminSession();
    const chain = ensureChain(context.params.chain);
    const slug = context.params.slug;

    const body = (await request.json()) as Record<string, unknown> | null;
    const parsed = collectionInputSchema.parse({ ...normalizeCollectionPayload(body ?? {}), chain });

    if (parsed.slug !== slug) {
      return NextResponse.json({ ok: false, error: "SLUG_MISMATCH" }, { status: 400 });
    }

    const existing = await getCollections(chain);
    const target = existing.find((entry) => entry.slug === slug);
    if (!target) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }
    if (target.source !== "database") {
      return NextResponse.json({ ok: false, error: "IMMUTABLE" }, { status: 403 });
    }

    const record = await upsertCollection({
      chain,
      slug,
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
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    if (error instanceof Error) {
      console.error("Admin collections PUT failed", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    console.error("Admin collections PUT failed", error);
    return NextResponse.json({ ok: false, error: "UNKNOWN" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { chain: string; slug: string } }) {
  try {
    requireAdminSession();
    const chain = ensureChain(context.params.chain);
    const slug = context.params.slug;

    const existing = await getCollections(chain);
    const target = existing.find((entry) => entry.slug === slug);
    if (!target) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }
    if (target.source !== "database") {
      return NextResponse.json({ ok: false, error: "IMMUTABLE" }, { status: 403 });
    }

    await deleteCollection(chain, slug);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    if (error instanceof AdminUnauthorizedError) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (error instanceof HttpError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    if (error instanceof Error) {
      console.error("Admin collections DELETE failed", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    console.error("Admin collections DELETE failed", error);
    return NextResponse.json({ ok: false, error: "UNKNOWN" }, { status: 500 });
  }
}
