// Quick script to update Darth Sidious NFT data in Supabase
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function updateDarthSidious() {
  console.log('🔄 Updating Darth Sidious NFT...\n');
  
  try {
    // Update Darth Sidious with missing data
    const { data, error } = await supabase
      .from('nfts')
      .update({
        external_link: 'https://cosmic-darth-sidious.nfts2.me/',
        price_eth: '0.00002'
      })
      .eq('title', 'Darth Sidious')
      .select();

    if (error) throw error;

    console.log('✅ Updated successfully!');
    console.log(data);

    // Show all Base NFTs
    const { data: baseNfts, error: listError } = await supabase
      .from('nfts')
      .select('*')
      .eq('network', 'base')
      .order('created_at', { ascending: false });

    if (listError) throw listError;

    console.log('\n📋 All Base NFTs:');
    baseNfts?.forEach((nft, i) => {
      console.log(`\n${i + 1}. ${nft.title}`);
      console.log(`   Contract: ${nft.contract_address}`);
      console.log(`   Price: ${nft.price_eth} ETH`);
      console.log(`   Link: ${nft.external_link}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateDarthSidious();
