import { useState, useEffect, useCallback } from 'react';
import { NFT } from '../types';
import { api } from '../utils/api';

export function useAdminNFTs() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    // If no Supabase configuration, show sample data
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setLoading(false);
      setNfts([
        {
          id: '1',
          title: 'Cool Art #123',
          description: 'A beautiful piece of digital art from the Cool Art collection',
          network: 'base',
          contract_address: '0x1234567890123456789012345678901234567890',
          token_id: '123',
          token_standard: 'ERC-721' as const,
          external_link: 'https://opensea.io/assets/base/0x1234567890123456789012345678901234567890/123',
          tags: ['art', 'collectible', 'digital'],
          visible: true,
          price_eth: '0.050000',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Zora Genesis',
          description: 'First edition from the Zora Genesis collection',
          network: 'zora',
          contract_address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          token_id: '1',
          token_standard: 'ERC-721' as const,
          external_link: 'https://zora.co/collect/0xabcdefabcdefabcdefabcdefabcdefabcdefabcd/1',
          tags: ['genesis', 'rare', 'zora'],
          visible: true,
          price_eth: '1.2000',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Linea Legends #456',
          description: 'Legendary NFT from the Linea ecosystem',
          network: 'linea',
          contract_address: '0x9876543210987654321098765432109876543210',
          token_id: '456',
          token_standard: 'ERC-1155' as const,
          external_link: 'https://element.market/assets/linea/0x9876543210987654321098765432109876543210/456',
          tags: ['legends', 'linea', 'gaming'],
          visible: true,
          price_eth: '0.00002000',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.admin.getNFTs();
      setNfts(response.nfts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFTs';
      setError(errorMessage);
      console.error('Failed to fetch admin NFTs:', err);
      
      // Fallback to sample data on error
      setNfts([
        {
          id: '1',
          title: 'Cool Art #123',
          description: 'A beautiful piece of digital art from the Cool Art collection',
          network: 'base',
          contract_address: '0x1234567890123456789012345678901234567890',
          token_id: '123',
          token_standard: 'ERC-721' as const,
          external_link: 'https://opensea.io/assets/base/0x1234567890123456789012345678901234567890/123',
          tags: ['art', 'collectible', 'digital'],
          visible: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Zora Genesis',
          description: 'First edition from the Zora Genesis collection',
          network: 'zora',
          contract_address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          token_id: '1',
          token_standard: 'ERC-721' as const,
          external_link: 'https://zora.co/collect/0xabcdefabcdefabcdefabcdefabcdefabcd/1',
          tags: ['genesis', 'rare', 'zora'],
          visible: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Linea Legends #456',
          description: 'Legendary NFT from the Linea ecosystem',
          network: 'linea',
          contract_address: '0x9876543210987654321098765432109876543210',
          token_id: '456',
          token_standard: 'ERC-1155' as const,
          external_link: 'https://element.market/assets/linea/0x9876543210987654321098765432109876543210/456',
          tags: ['legends', 'linea', 'gaming'],
          visible: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNFT = async (nftData: Omit<NFT, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await api.admin.addNFT(nftData);
      await fetchNFTs(); // Refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add NFT';
      return { success: false, error: errorMessage };
    }
  };

  const updateNFT = async (id: string, updates: Partial<NFT>) => {
    try {
      await api.admin.updateNFT(id, updates);
      await fetchNFTs(); // Refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update NFT';
      return { success: false, error: errorMessage };
    }
  };

  const deleteNFT = async (id: string) => {
    try {
      await api.admin.deleteNFT(id);
      await fetchNFTs(); // Refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete NFT';
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    loading,
    error,
    addNFT,
    updateNFT,
    deleteNFT,
    refetch: fetchNFTs
  };
}