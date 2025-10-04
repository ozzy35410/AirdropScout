import { NextRequest, NextResponse } from "next/server";
import { CHAINS, type ChainSlug } from "@/config/chains";
import { getCollections, serializeCollection } from "@/lib/collections";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const chainParam = url.searchParams.get("chain");

    let chain: ChainSlug | undefined;
    if (chainParam) {
      if (!Object.prototype.hasOwnProperty.call(CHAINS, chainParam)) {
        return NextResponse.json(
          { ok: false, error: "CHAIN_UNAVAILABLE" },
          { status: 400 }
        );
      }
      chain = chainParam as ChainSlug;
    }

    const collections = await getCollections(chain);
    return NextResponse.json({
      ok: true,
      collections: collections.map(serializeCollection)
    });
  } catch (error) {
    console.error("Failed to list collections", error);
    return NextResponse.json({ ok: false, error: "UNKNOWN" }, { status: 500 });
  }
}
