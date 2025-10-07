// Test script to check Supabase NFT data
// Run with: node --loader tsx test-supabase.ts

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...\n');
  
  try {
    // Get all NFTs
    const { data: nfts, error } = await supabase
      .from('nfts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`✅ Found ${nfts?.length || 0} NFTs in database:\n`);
    
    if (nfts && nfts.length > 0) {
      nfts.forEach((nft, index) => {
        console.log(`${index + 1}. ${nft.title}`);
        console.log(`   Network: ${nft.network}`);
        console.log(`   Contract: ${nft.contract_address}`);
        console.log(`   Price: ${nft.price_eth} ETH`);
        console.log(`   Visible: ${nft.visible}`);
        console.log(`   Link: ${nft.external_link || 'N/A'}`);
        console.log(`   Created: ${new Date(nft.created_at).toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No NFTs found in database!');
      console.log('\nTo add NFTs, go to Supabase Dashboard:');
      console.log('https://ulungobrkoxwrwaccfwm.supabase.co/project/ulungobrkoxwrwaccfwm/editor');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

testSupabase();
