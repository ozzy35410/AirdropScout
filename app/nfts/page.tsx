import { Suspense } from "react";
import type { Metadata } from "next";
import { CHAINS, type ChainSlug } from "@/config/chains";
import { NftsView } from "@/components/nfts/NftsView";

export const metadata: Metadata = {
  title: "NFT Collections | Airdrop Scout",
  description: "Browse NFT collections across Base, Sei, GIWA, and Pharos testnet and track what you have minted.",
  openGraph: {
    title: "NFT Collections | Airdrop Scout",
    description: "Browse NFT collections across Base, Sei, GIWA, and Pharos testnet and track what you have minted.",
    url: "https://airdrop.scout3.xyz/nfts"
  }
};

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function resolveNetwork(searchParams?: Record<string, string | string[] | undefined>): ChainSlug | undefined {
  if (!searchParams) return undefined;
  const raw = searchParams["network"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return undefined;
  const lowered = value.toLowerCase();
  return lowered in CHAINS ? (lowered as ChainSlug) : undefined;
}

export default function NftsPage({ searchParams }: PageProps) {
  const initialNetwork = resolveNetwork(searchParams);

  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500">Loading NFTs…</div>}>
      <NftsView initialNetwork={initialNetwork} />
    </Suspense>
  );
}
