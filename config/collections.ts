import type { ChainSlug } from "./chains";

export type NftStd = "erc721" | "erc1155";

export type Collection = {
  slug: string;
  name: string;
  standard: NftStd;
  contract: `0x${string}`;
  image?: string;
  tags?: string[];
  mintUrl?: string;
  startBlock?: bigint;
  addedAt?: string;
  source?: "config" | "database";
  id?: string;
  updatedAt?: string | null;
  visible?: boolean;
};

export const NFT_COLLECTIONS: Record<ChainSlug, Collection[]> = {
  base: [
    {
      slug: "airdrop-scout-og",
      name: "Airdrop Scout OG Badge",
      standard: "erc721",
      contract: "0xd9c0190be8517c056c04b52c883fae24e05a47fb",
      image: "/images/base/og-badge.png",
      tags: ["community", "badge", "airdropscout"],
      mintUrl: "https://zora.co/collect/base:0xd9c0190be8517c056c04b52c883fae24e05a47fb",
      startBlock: 18000000n,
      addedAt: "2024-07-01T00:00:00Z"
    },
    {
      slug: "scout-labs-founding",
      name: "Scout Labs Founding Pass",
      standard: "erc1155",
      contract: "0x6a68b9309343c5d8f8221f51ac3aaee47cebb6bd",
      image: "/images/base/founding-pass.png",
      tags: ["membership", "labs"],
      mintUrl: "https://app.manifold.xyz/c/scout-labs",
      startBlock: 18250000n,
      addedAt: "2024-08-20T00:00:00Z"
    }
  ],
  sei: [
    {
      slug: "sei-compass",
      name: "Sei Compass Pioneers",
      standard: "erc721",
      contract: "0x1234567890abcdef1234567890abcdef12345678",
      image: "/images/sei/compass.png",
      tags: ["pioneer", "sei"],
      mintUrl: "https://pallet.exchange/collection/sei-compass",
      startBlock: 3500000n,
      addedAt: "2024-06-15T00:00:00Z"
    }
  ],
  giwa: [
    {
      slug: "giwa-pathfinder",
      name: "GIWA Pathfinder",
      standard: "erc721",
      contract: "0xce4a86c499386fbe4cd7e37cd4b9e495c972b36f",
      image: "/images/giwa/pathfinder.png",
      tags: ["quest", "giwa", "pathfinder"],
      mintUrl: "https://airdrop.scout3.xyz/tasks?network=giwa&task=giwa-mint-nft",
      startBlock: 1200000n,
      addedAt: "2024-07-15T00:00:00Z"
    }
  ],
  pharos: [
    {
      slug: "pharos-legends",
      name: "Pharos Legends",
      standard: "erc721",
      contract: "0x6789012345678901234567890123456789012345",
      image: "/images/pharos/legends.png",
      tags: ["legend", "pharos"],
      mintUrl: "https://testnet.pharosnetwork.xyz/nft/legends",
      startBlock: 4200000n,
      addedAt: "2024-02-15T00:00:00Z"
    },
    {
      slug: "faroswap-citadel",
      name: "FaroSwap Citadel",
      standard: "erc1155",
      contract: "0xaabbccddeeff0011223344556677889900aabbcc",
      image: "/images/pharos/citadel.png",
      tags: ["dex", "pharos", "liquidity"],
      mintUrl: "https://faroswap.xyz/citadel",
      startBlock: 4450000n,
      addedAt: "2024-05-12T00:00:00Z"
    }
  ]
};
