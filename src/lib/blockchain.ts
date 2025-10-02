import { ethers } from 'ethers';
import { NFT } from '../types';
import { NETWORKS } from '../config/networks';

export class BlockchainService {
  private static providers: Record<string, ethers.JsonRpcProvider> = {};

  static getProvider(network: string): ethers.JsonRpcProvider {
    if (!this.providers[network]) {
      const networkConfig = NETWORKS[network];
      if (!networkConfig) {
        throw new Error(`Unsupported network: ${network}`);
      }
      this.providers[network] = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    }
    return this.providers[network];
  }

  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  static async checkOwnership(
    network: string,
    contractAddress: string,
    tokenId: string,
    walletAddress: string,
    tokenStandard: string
  ): Promise<boolean> {
    try {
      const provider = this.getProvider(network);
      const contract = new ethers.Contract(
        contractAddress,
        tokenStandard === 'ERC-721' 
          ? ['function ownerOf(uint256) view returns (address)', 'function balanceOf(address) view returns (uint256)']
          : ['function balanceOf(address, uint256) view returns (uint256)'],
        provider
      );

      if (tokenStandard === 'ERC-721') {
        try {
          const owner = await contract.ownerOf(tokenId);
          return owner.toLowerCase() === walletAddress.toLowerCase();
        } catch (error) {
          // If ownerOf fails, try balanceOf
          const balance = await contract.balanceOf(walletAddress);
          return balance > 0;
        }
      } else if (tokenStandard === 'ERC-1155') {
        const balance = await contract.balanceOf(walletAddress, tokenId);
        return balance > 0;
      }

      return false;
    } catch (error) {
      console.error('Ownership check error:', error);
      return false;
    }
  }

  static async filterNFTsByOwnership(walletAddress: string, nfts: NFT[]): Promise<NFT[]> {
    const ownershipChecks = await Promise.all(
      nfts.map(async (nft) => {
        const owned = await this.checkOwnership(
          nft.network,
          nft.contract_address,
          nft.token_id,
          walletAddress,
          nft.token_standard
        );
        return { ...nft, owned };
      })
    );

    return ownershipChecks.filter(nft => !nft.owned);
  }
}