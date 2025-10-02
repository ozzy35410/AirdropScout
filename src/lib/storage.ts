import { NFT } from '../types';

export class NFTStorage {
  private static STORAGE_KEY = 'nft_directory_data';

  static getAllNFTs(): NFT[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return this.getDefaultNFTs();
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading NFTs from storage:', error);
      return this.getDefaultNFTs();
    }
  }

  static getNFTsByNetwork(network: string): NFT[] {
    const allNFTs = this.getAllNFTs();
    if (network === 'all' || !network) return allNFTs;
    return allNFTs.filter(nft => nft.network === network);
  }

  static saveNFTs(nfts: NFT[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nfts));
    } catch (error) {
      console.error('Error saving NFTs to storage:', error);
    }
  }

  static addNFT(nft: Omit<NFT, 'id' | 'created_at' | 'updated_at'>): NFT {
    const newNFT: NFT = {
      ...nft,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const allNFTs = this.getAllNFTs();
    allNFTs.push(newNFT);
    this.saveNFTs(allNFTs);
    return newNFT;
  }

  static updateNFT(id: string, updates: Partial<NFT>): NFT | null {
    const allNFTs = this.getAllNFTs();
    const index = allNFTs.findIndex(nft => nft.id === id);
    
    if (index === -1) return null;

    allNFTs[index] = {
      ...allNFTs[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveNFTs(allNFTs);
    return allNFTs[index];
  }

  static deleteNFT(id: string): boolean {
    const allNFTs = this.getAllNFTs();
    const filteredNFTs = allNFTs.filter(nft => nft.id !== id);
    
    if (filteredNFTs.length === allNFTs.length) return false;
    
    this.saveNFTs(filteredNFTs);
    return true;
  }

  private static getDefaultNFTs(): NFT[] {
    return [
      {
        id: '1',
        title: 'Base Network Builders #100',
        description: 'Commemorative NFT celebrating the builders of Base network. This exclusive collection represents the pioneering spirit of early adopters.',
        network: 'base',
        contract_address: '0x3456789012345678901234567890123456789012',
        token_id: '100',
        token_standard: 'ERC-721' as const,
        external_link: 'https://opensea.io/assets/base/0x3456789012345678901234567890123456789012/100',
        tags: ['builder', 'base', 'commemorative'],
        visible: true,
        price_eth: '0.050000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Base DeFi Genesis #1',
        description: 'Genesis NFT from Base network DeFi protocols, representing early participation in decentralized finance on Base.',
        network: 'base',
        contract_address: '0x1234567890123456789012345678901234567890',
        token_id: '1',
        token_standard: 'ERC-721' as const,
        external_link: 'https://opensea.io/assets/base/0x1234567890123456789012345678901234567890/1',
        tags: ['genesis', 'defi', 'base'],
        visible: true,
        price_eth: '1.2000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Darth Sidious',
        description: 'Rare collectible from the Zora network featuring iconic characters and unique artwork.',
        network: 'zora',
        contract_address: '0xe47f...bba4',
        token_id: '1',
        token_standard: 'ERC-721' as const,
        external_link: 'https://zora.co/collect/0xe47f...bba4/1',
        tags: ['collectible', 'rare', 'character'],
        visible: true,
        price_eth: '0.00002000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}