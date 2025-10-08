import { createClient } from '@supabase/supabase-js';

// ⚠️ HARDCODED - Ignore env vars (Bolt.host has wrong values)
const PUBLIC_URL = 'https://ulungobrkoxwrwaccfwm.supabase.co';
const PUBLIC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdW5nb2Jya294d3J3YWNjZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NjA1MDYsImV4cCI6MjA3NTQzNjUwNn0.Y2VaULV2jZ6lp7NvSYb5PKy-yH1wtUSiJddvkUfiz2c';

export const supabase = createClient(PUBLIC_URL, PUBLIC_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

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
