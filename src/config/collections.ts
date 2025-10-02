// NFT Collections configuration
export interface NFTCollection {
  slug: string;
  name: string;
  symbol: string;
  contract: string;
  standard: 'erc721' | 'erc1155';
  image: string;
  description?: string;
  tags: string[];
  mintUrl: string;
  addedAt: string; // ISO date string for sorting
}

export const NFT_COLLECTIONS: Record<string, NFTCollection[]> = {
  // Mainnet collections
  base: [
    {
      slug: 'cool-art',
      name: 'Cool Art Collection',
      symbol: 'CART',
      contract: '0x1234567890123456789012345678901234567890',
      standard: 'erc721',
      image: '/images/collections/cool-art.png',
      description: 'A beautiful collection of digital art pieces',
      tags: ['art', 'collectible', 'digital', 'nft2sme'],
      mintUrl: 'https://opensea.io/collection/cool-art',
      addedAt: '2024-01-15T00:00:00Z'
    },
    {
      slug: 'base-builders',
      name: 'Base Builders',
      symbol: 'BUILD',
      contract: '0x2345678901234567890123456789012345678901',
      standard: 'erc721',
      image: '/images/collections/base-builders.png',
      description: 'NFTs for the Base ecosystem builders',
      tags: ['builders', 'utility', 'base', 'community'],
      mintUrl: 'https://zora.co/collect/base:0x2345678901234567890123456789012345678901',
      addedAt: '2024-02-01T00:00:00Z'
    }
  ],
  
  sei: [
    {
      slug: 'sei-warriors',
      name: 'Sei Warriors',
      symbol: 'WAR',
      contract: '0x3456789012345678901234567890123456789012',
      standard: 'erc721',
      image: '/images/collections/sei-warriors.png',
      description: 'Elite warriors of the Sei network',
      tags: ['gaming', 'warriors', 'sei', 'pfp'],
      mintUrl: 'https://pallet.exchange/collection/sei-warriors',
      addedAt: '2024-01-20T00:00:00Z'
    }
  ],
  
  // Testnet collections
  giwa: [
    {
      slug: 'giwa-genesis',
      name: 'GIWA Genesis',
      symbol: 'GENESIS',
      contract: '0x4567890123456789012345678901234567890123',
      standard: 'erc721',
      image: '/images/collections/giwa-genesis.png',
      description: 'First NFT collection on GIWA testnet',
      tags: ['genesis', 'testnet', 'giwa', 'experimental'],
      mintUrl: 'https://testnet.giwa.io/mint/genesis',
      addedAt: '2024-03-01T00:00:00Z'
    },
    {
      slug: 'test-collection',
      name: 'Test Collection',
      symbol: 'TEST',
      contract: '0x5678901234567890123456789012345678901234',
      standard: 'erc1155',
      image: '/images/collections/test-collection.png',
      description: 'Testing ERC-1155 functionality',
      tags: ['test', 'erc1155', 'multitoken'],
      mintUrl: 'https://testnet.giwa.io/mint/test',
      addedAt: '2024-03-10T00:00:00Z'
    }
  ],
  
  pharos: [
    {
      slug: 'pharos-legends',
      name: 'Pharos Legends',
      symbol: 'LEGEND',
      contract: '0x6789012345678901234567890123456789012345',
      standard: 'erc721',
      image: '/images/collections/pharos-legends.png',
      description: 'Legendary NFTs from Pharos testnet',
      tags: ['legends', 'pharos', 'rare', 'limited'],
      mintUrl: 'https://testnet.pharosnetwork.xyz/nft/legends',
      addedAt: '2024-02-15T00:00:00Z'
    }
  ]
};

// Helper functions
export const getCollectionsByChain = (chainSlug: string): NFTCollection[] => {
  return NFT_COLLECTIONS[chainSlug] || [];
};

export const getAllCollections = (): NFTCollection[] => {
  return Object.values(NFT_COLLECTIONS).flat();
};

export const getCollectionBySlug = (chainSlug: string, collectionSlug: string): NFTCollection | undefined => {
  const collections = getCollectionsByChain(chainSlug);
  return collections.find(c => c.slug === collectionSlug);
};

export const searchCollections = (chainSlug: string, query: string): NFTCollection[] => {
  const collections = getCollectionsByChain(chainSlug);
  const lowercaseQuery = query.toLowerCase();
  
  return collections.filter(collection => 
    collection.name.toLowerCase().includes(lowercaseQuery) ||
    collection.symbol.toLowerCase().includes(lowercaseQuery) ||
    collection.slug.toLowerCase().includes(lowercaseQuery) ||
    collection.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getCollectionsByTags = (chainSlug: string, tags: string[]): NFTCollection[] => {
  const collections = getCollectionsByChain(chainSlug);
  
  return collections.filter(collection =>
    tags.some(tag => collection.tags.includes(tag))
  );
};

export const sortCollections = (collections: NFTCollection[], sortBy: 'newest' | 'az' | 'za'): NFTCollection[] => {
  return [...collections].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'az':
        return a.name.localeCompare(b.name);
      case 'za':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
};