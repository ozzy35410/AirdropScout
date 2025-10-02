import { useState, useEffect, useCallback } from 'react';
import { NFT, NetworkConfigs } from '../types';
import { api } from '../utils/api';

export function useNFTs() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [networks, setNetworks] = useState<NetworkConfigs>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [hideOwned, setHideOwned] = useState<boolean>(false);

  // Fetch networks configuration
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await api.getNetworks();
        setNetworks(response.networks);
      } catch (err) {
        console.error('Failed to fetch networks:', err);
      }
    };

    fetchNetworks();
  }, []);

  // Fetch NFTs
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
      ].filter(nft => !selectedNetwork || nft.network === selectedNetwork));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (selectedNetwork) params.network = selectedNetwork;
      if (walletAddress && hideOwned) {
        params.wallet = walletAddress;
        params.hideOwned = true;
      }

      const response = await api.getNFTs(params);
      setNfts(response.nfts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFTs';
      setError(errorMessage);
      console.error('Failed to fetch NFTs:', err);
      
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
      ].filter(nft => !selectedNetwork || nft.network === selectedNetwork));
    } finally {
      setLoading(false);
    }
  }, [selectedNetwork, walletAddress, hideOwned]);

  // Fetch NFTs when dependencies change
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    networks,
    loading,
    error,
    selectedNetwork,
    setSelectedNetwork,
    walletAddress,
    setWalletAddress,
    hideOwned,
    setHideOwned,
    refetch: fetchNFTs
  };
}