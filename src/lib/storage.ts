import { NFT } from '../types';

export class NFTStorage {
  private static STORAGE_KEY = 'nft_directory_data';

  static getAllNFTs(): NFT[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return []; // Boş başlat, default NFT yok
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading NFTs from storage:', error);
      return [];
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

  static importNFTs(nfts: Partial<NFT>[]): void {
    const allNFTs = this.getAllNFTs();
    
    nfts.forEach(nftData => {
      const newNFT: NFT = {
        id: crypto.randomUUID(),
        title: nftData.title || 'Untitled NFT',
        description: nftData.description,
        network: nftData.network || 'base',
        contract_address: nftData.contract_address || '',
        token_id: nftData.token_id || '0',
        token_standard: nftData.token_standard || 'ERC-721',
        external_link: nftData.external_link,
        tags: nftData.tags,
        visible: nftData.visible !== false,
        imageUrl: nftData.imageUrl,
        price_eth: nftData.price_eth,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      allNFTs.push(newNFT);
    });

    this.saveNFTs(allNFTs);
  }
}