import { ChainSlug } from './chains';

export type NftStd = "erc721" | "erc1155";

export interface Collection {
  slug: string;
  name: string;
  standard: NftStd;
  contract: `0x${string}`;
  image?: string;
  tags?: string[];
  mintUrl?: string;
  startBlock?: bigint;
  addedAt?: string;
}

// Default collections - can be extended via Admin panel
// Keep empty by default - collections should be added via Admin panel or API
export const NFT_COLLECTIONS: Record<ChainSlug, Collection[]> = {
  base: [],
  sei: [],
  giwa: [],
  pharos: []
};

