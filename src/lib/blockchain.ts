import { ethers } from 'ethers';
import { NFT } from '../types';
import { NETWORKS } from '../config/networks';

const ERC721_ABI = [
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)'
];

const ERC1155_ABI = [
  'function balanceOf(address account, uint256 id) view returns (uint256)'
];

export class BlockchainService {
  private static providers: Map<string, ethers.JsonRpcProvider> = new Map();
  private static ownershipCache: Map<string, { owned: boolean; timestamp: number }> = new Map();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getProvider(network: string): ethers.JsonRpcProvider {
    if (!this.providers.has(network)) {
      const networkConfig = NETWORKS[network];
      if (!networkConfig) {
        throw new Error(`Unsupported network: ${network}`);
      }
      this.providers.set(network, new ethers.JsonRpcProvider(networkConfig.rpcUrl));
    }
    return this.providers.get(network)!;
  }

  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  static async checkOwnership(wallet: string, nft: NFT): Promise<boolean> {
    const cacheKey = `${wallet}_${nft.network}_${nft.contract_address}_${nft.token_id}`;
    const cached = this.ownershipCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.owned;
    }

    try {
      const provider = this.getProvider(nft.network);
      let owned = false;

      if (nft.token_standard === 'ERC-721') {
        const contract = new ethers.Contract(nft.contract_address, ERC721_ABI, provider);
        try {
          const owner = await contract.ownerOf(nft.token_id);
          owned = owner.toLowerCase() === wallet.toLowerCase();
        } catch {
          const balance = await contract.balanceOf(wallet);
          owned = balance > 0;
        }
      } else if (nft.token_standard === 'ERC-1155') {
        const contract = new ethers.Contract(nft.contract_address, ERC1155_ABI, provider);
        const balance = await contract.balanceOf(wallet, nft.token_id);
        owned = balance > 0;
      }

      this.ownershipCache.set(cacheKey, { owned, timestamp: Date.now() });
      return owned;
    } catch (error) {
      console.error(`Error checking ownership for ${nft.title}:`, error);
      throw error; // Throw to handle in UI
    }
  }

  static async filterNFTsByOwnership(wallet: string, nfts: NFT[]): Promise<NFT[]> {
    if (!wallet || !ethers.isAddress(wallet)) {
      return nfts;
    }

    const ownershipPromises = nfts.map(async (nft) => {
      const owned = await this.checkOwnership(wallet, nft);
      return { nft, owned };
    });

    const results = await Promise.all(ownershipPromises);
    return results.filter(result => !result.owned).map(result => result.nft);
  }

  static clearCache(): void {
    this.ownershipCache.clear();
  }
}