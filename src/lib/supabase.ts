import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      nfts: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          network: 'base' | 'sei' | 'zora' | 'linea' | 'scroll' | 'giwa' | 'pharos' | 'zksync' | 'soneium';
          contract_address: string;
          token_id: string;
          token_standard: 'ERC-721' | 'ERC-1155';
          external_link: string | null;
          image_url: string | null;
          price_eth: string | null;
          tags: string[];
          visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          network: 'base' | 'sei' | 'zora' | 'linea' | 'scroll' | 'giwa' | 'pharos' | 'zksync' | 'soneium';
          contract_address: string;
          token_id: string;
          token_standard: 'ERC-721' | 'ERC-1155';
          external_link?: string | null;
          image_url?: string | null;
          price_eth?: string | null;
          tags?: string[];
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          network?: 'base' | 'sei' | 'zora' | 'linea' | 'scroll' | 'giwa' | 'pharos' | 'zksync' | 'soneium';
          contract_address?: string;
          token_id?: string;
          token_standard?: 'ERC-721' | 'ERC-1155';
          external_link?: string | null;
          image_url?: string | null;
          price_eth?: string | null;
          tags?: string[];
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
