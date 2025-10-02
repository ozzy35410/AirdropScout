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
      slug: 'airdrop-scout-og-labs',
      name: 'Airdrop Scout OG Labs',
      symbol: 'OGSCOUT',
      contract: '0xd9C0190BE8517C056C04B52C883Fae24E05A47fB',
      standard: 'erc721',
      image: '/images/collections/airdrop-scout-og.png',
      description: 'The inaugural OG badge for early Airdrop Scout community members on Base.',
      tags: ['airdrop-scout', 'community', 'base', 'og'],
      mintUrl: 'https://zora.co/collect/base:0xd9c0190be8517c056c04b52c883fae24e05a47fb',
      addedAt: '2024-07-01T00:00:00Z'
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
      slug: 'airdrop-scout-pathfinder-giwa',
      name: 'Airdrop Scout Pathfinder GIWA',
      symbol: 'PATH',
      contract: '0xce4A86c499386FBE4Cd7E37CD4B9E495C972B36F',
      standard: 'erc721',
      image: '/images/collections/airdrop-scout-pathfinder.png',
      description: 'Complete the Pathfinder quest on GIWA Sepolia to mint this commemorative NFT.',
      tags: ['airdrop-scout', 'quest', 'giwa', 'pathfinder'],
      mintUrl: 'https://airdrop.scout3.xyz/tasks?network=giwa&task=giwa-mint-nft',
      addedAt: '2024-07-15T00:00:00Z'
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