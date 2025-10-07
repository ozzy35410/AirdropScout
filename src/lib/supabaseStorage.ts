import { NFT } from '../types';
import { supabase } from './supabase';

export class SupabaseNFTStorage {
  /**
   * Get all NFTs from Supabase
   */
  static async getAllNFTs(): Promise<NFT[]> {
    try {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        title: row.title,
        description: row.description || undefined,
        network: row.network,
        contract_address: row.contract_address,
        token_id: row.token_id,
        token_standard: row.token_standard,
        external_link: row.external_link || undefined,
        imageUrl: row.image_url || undefined,
        price_eth: row.price_eth || undefined,
        tags: row.tags || [],
        visible: row.visible,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (error) {
      console.error('Error loading NFTs from Supabase:', error);
      return [];
    }
  }

  /**
   * Get NFTs by network
   */
  static async getNFTsByNetwork(network: string): Promise<NFT[]> {
    if (network === 'all' || !network) return this.getAllNFTs();

    try {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('network', network)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        title: row.title,
        description: row.description || undefined,
        network: row.network,
        contract_address: row.contract_address,
        token_id: row.token_id,
        token_standard: row.token_standard,
        external_link: row.external_link || undefined,
        imageUrl: row.image_url || undefined,
        price_eth: row.price_eth || undefined,
        tags: row.tags || [],
        visible: row.visible,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (error) {
      console.error('Error loading NFTs by network:', error);
      return [];
    }
  }

  /**
   * Add a new NFT
   */
  static async addNFT(nft: Omit<NFT, 'id' | 'created_at' | 'updated_at'>): Promise<NFT | null> {
    try {
      const { data, error } = await supabase
        .from('nfts')
        .insert([{
          title: nft.title,
          description: nft.description || null,
          network: nft.network,
          contract_address: nft.contract_address,
          token_id: nft.token_id,
          token_standard: nft.token_standard,
          external_link: nft.external_link || null,
          image_url: nft.imageUrl || null,
          price_eth: nft.price_eth || null,
          tags: nft.tags || [],
          visible: nft.visible !== false
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        network: data.network,
        contract_address: data.contract_address,
        token_id: data.token_id,
        token_standard: data.token_standard,
        external_link: data.external_link || undefined,
        imageUrl: data.image_url || undefined,
        price_eth: data.price_eth || undefined,
        tags: data.tags || [],
        visible: data.visible,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error adding NFT to Supabase:', error);
      throw error;
    }
  }

  /**
   * Update an NFT
   */
  static async updateNFT(id: string, updates: Partial<NFT>): Promise<NFT | null> {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.network !== undefined) updateData.network = updates.network;
      if (updates.contract_address !== undefined) updateData.contract_address = updates.contract_address;
      if (updates.token_id !== undefined) updateData.token_id = updates.token_id;
      if (updates.token_standard !== undefined) updateData.token_standard = updates.token_standard;
      if (updates.external_link !== undefined) updateData.external_link = updates.external_link;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.price_eth !== undefined) updateData.price_eth = updates.price_eth;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.visible !== undefined) updateData.visible = updates.visible;

      const { data, error } = await supabase
        .from('nfts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        network: data.network,
        contract_address: data.contract_address,
        token_id: data.token_id,
        token_standard: data.token_standard,
        external_link: data.external_link || undefined,
        imageUrl: data.image_url || undefined,
        price_eth: data.price_eth || undefined,
        tags: data.tags || [],
        visible: data.visible,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error updating NFT in Supabase:', error);
      throw error;
    }
  }

  /**
   * Delete an NFT
   */
  static async deleteNFT(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('nfts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting NFT from Supabase:', error);
      return false;
    }
  }

  /**
   * Bulk import NFTs
   */
  static async importNFTs(nfts: Partial<NFT>[]): Promise<void> {
    try {
      const insertData = nfts.map(nft => ({
        title: nft.title || 'Untitled NFT',
        description: nft.description || null,
        network: nft.network || 'base',
        contract_address: nft.contract_address || '',
        token_id: nft.token_id || '0',
        token_standard: nft.token_standard || 'ERC-721',
        external_link: nft.external_link || null,
        image_url: nft.imageUrl || null,
        price_eth: nft.price_eth || null,
        tags: nft.tags || [],
        visible: nft.visible !== false
      }));

      const { error } = await supabase
        .from('nfts')
        .insert(insertData);

      if (error) throw error;
    } catch (error) {
      console.error('Error importing NFTs to Supabase:', error);
      throw error;
    }
  }
}
