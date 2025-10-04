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
export const NFT_COLLECTIONS: Record<ChainSlug, Collection[]> = {
  base: [
    {
      slug: 'base-names',
      name: 'Basename',
      contract: '0x03c4738Ee98aE44591e1A4A4F3CAb6641d95DD9a',
      standard: 'erc721',
      image: 'https://i.seadn.io/s/raw/files/df34b121a2ba5e6d8d0f734dc23fb1e8.png',
      tags: ['identity', 'domain', 'ens'],
      mintUrl: 'https://www.base.org/names',
      startBlock: 10000000n
    },
    {
      slug: 'basepaint',
      name: 'BasePaint',
      contract: '0xBa5e05cb26b78eDa3A2f8e3b3814726305dcAc83',
      standard: 'erc721',
      image: 'https://basepaint.xyz/images/basepaint-logo.png',
      tags: ['art', 'generative', 'community'],
      mintUrl: 'https://basepaint.xyz',
      startBlock: 8000000n
    },
    {
      slug: 'base-god',
      name: 'Based God',
      contract: '0xd40A09dE1dD30Ecef8A12e8c17fDC8C5e8C2a7b5',
      standard: 'erc721',
      tags: ['pfp', 'meme', 'culture'],
      mintUrl: 'https://zora.co/collect/base:0xd40A09dE1dD30Ecef8A12e8c17fDC8C5e8C2a7b5',
      startBlock: 9000000n
    },
    {
      slug: 'onchain-summer',
      name: 'Onchain Summer',
      contract: '0xD4307E0acD12CF46fD6cf93BC264f5D5D1598792',
      standard: 'erc721',
      tags: ['event', 'summer', 'commemorative'],
      mintUrl: 'https://onchainsummer.xyz',
      startBlock: 7000000n
    },
    {
      slug: 'toshi-vibe',
      name: 'Toshi Vibe',
      contract: '0x8Fc0D90f2C45a5e7f94904075c952e0943dCcf61',
      standard: 'erc721',
      tags: ['pfp', 'mascot', 'community'],
      mintUrl: 'https://www.toshi.vibe',
      startBlock: 8500000n
    },
    {
      slug: 'base-builders',
      name: 'Base Builders',
      contract: '0x1FBB7b7DAb8b8DcBA9D234ABd8EAf24120e46c5d',
      standard: 'erc721',
      tags: ['builder', 'community', 'og'],
      mintUrl: 'https://zora.co/collect/base:0x1FBB7b7DAb8b8DcBA9D234ABd8EAf24120e46c5d',
      startBlock: 6000000n
    }
  ],
  sei: [
    {
      slug: 'sei-spartans',
      name: 'Sei Spartans',
      contract: '0x9A8DBc6BB75fF6C86fb39e5935eF6d8e3C3E05f3',
      standard: 'erc721',
      tags: ['pfp', 'gaming', 'community'],
      mintUrl: 'https://sei.io/spartans',
      startBlock: 1000000n
    },
    {
      slug: 'seilors',
      name: 'Seilors',
      contract: '0x6A12b8d0b8e0B5d7e6B8e9E3c5c4f9e3c5c4f9e3',
      standard: 'erc721',
      tags: ['pfp', 'sailor', 'og'],
      mintUrl: 'https://seilors.xyz',
      startBlock: 500000n
    },
    {
      slug: 'sei-pandas',
      name: 'Sei Pandas',
      contract: '0x5C8e9E3c5c4f9e3c5c4f9e3c5c4f9e3c5c4f9e3',
      standard: 'erc721',
      tags: ['pfp', 'animal', 'cute'],
      mintUrl: 'https://seipandas.com',
      startBlock: 800000n
    },
    {
      slug: 'sei-dragons',
      name: 'Sei Dragons',
      contract: '0x7D8f9E3c5c4f9e3c5c4f9e3c5c4f9e3c5c4f9e3',
      standard: 'erc721',
      tags: ['pfp', 'dragon', 'mythical'],
      mintUrl: 'https://seidragons.xyz',
      startBlock: 1200000n
    }
  ],
  giwa: [
    {
      slug: 'giwa-genesis',
      name: 'GIWA Genesis',
      contract: '0x1234567890123456789012345678901234567890',
      standard: 'erc721',
      tags: ['genesis', 'og', 'testnet'],
      mintUrl: 'https://giwa.io/mint/genesis',
      startBlock: 0n
    },
    {
      slug: 'giwa-og',
      name: 'GIWA OG',
      contract: '0x2345678901234567890123456789012345678901',
      standard: 'erc721',
      tags: ['og', 'early', 'testnet'],
      mintUrl: 'https://giwa.io/mint/og',
      startBlock: 100000n
    },
    {
      slug: 'giwa-pioneers',
      name: 'GIWA Pioneers',
      contract: '0x3456789012345678901234567890123456789012',
      standard: 'erc721',
      tags: ['pioneer', 'early', 'testnet'],
      mintUrl: 'https://giwa.io/mint/pioneers',
      startBlock: 200000n
    },
    {
      slug: 'giwa-builders',
      name: 'GIWA Builders',
      contract: '0x4567890123456789012345678901234567890123',
      standard: 'erc721',
      tags: ['builder', 'community', 'testnet'],
      mintUrl: 'https://giwa.io/mint/builders',
      startBlock: 300000n
    },
    {
      slug: 'giwa-validators',
      name: 'GIWA Validators',
      contract: '0x5678901234567890123456789012345678901234',
      standard: 'erc721',
      tags: ['validator', 'staking', 'testnet'],
      mintUrl: 'https://giwa.io/mint/validators',
      startBlock: 400000n
    }
  ],
  pharos: [
    {
      slug: 'pharos-explorer',
      name: 'Pharos Explorer',
      contract: '0x6789012345678901234567890123456789012345',
      standard: 'erc721',
      tags: ['explorer', 'og', 'testnet'],
      mintUrl: 'https://pharos.testnet/mint/explorer',
      startBlock: 0n
    },
    {
      slug: 'pharos-early-adopter',
      name: 'Pharos Early Adopter',
      contract: '0x7890123456789012345678901234567890123456',
      standard: 'erc721',
      tags: ['early', 'adopter', 'testnet'],
      mintUrl: 'https://pharos.testnet/mint/early',
      startBlock: 50000n
    },
    {
      slug: 'pharos-validators',
      name: 'Pharos Validators',
      contract: '0x8901234567890123456789012345678901234567',
      standard: 'erc721',
      tags: ['validator', 'staking', 'testnet'],
      mintUrl: 'https://pharos.testnet/mint/validators',
      startBlock: 100000n
    },
    {
      slug: 'pharos-community',
      name: 'Pharos Community Pass',
      contract: '0x9012345678901234567890123456789012345678',
      standard: 'erc721',
      tags: ['community', 'pass', 'testnet'],
      mintUrl: 'https://pharos.testnet/mint/community',
      startBlock: 150000n
    },
    {
      slug: 'pharos-hero',
      name: 'Pharos Hero',
      contract: '0x0123456789012345678901234567890123456789',
      standard: 'erc721',
      tags: ['hero', 'rare', 'testnet'],
      mintUrl: 'https://pharos.testnet/mint/hero',
      startBlock: 200000n
    },
    {
      slug: 'pharos-builders',
      name: 'Pharos Builders',
      contract: '0x1357924680135792468013579246801357924680',
      standard: 'erc721',
      tags: ['builder', 'community', 'testnet'],
      mintUrl: 'https://pharos.testnet/mint/builders',
      startBlock: 250000n
    }
  ]
};
