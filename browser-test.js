// Browser Console Test Script
// Copy-paste this into browser console (F12) on https://airdrop-scout-lax0.bolt.host

console.log('🧪 Testing NFT Collections...\n');

// Test 1: Check if Supabase client exists
try {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(
    'https://ulungobrkoxwrwaccfwm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdW5nb2Jya294d3J3YWNjZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NjA1MDYsImV4cCI6MjA3NTQzNjUwNn0.Y2VaULV2jZ6lp7NvSYb5PKy-yH1wtUSiJddvkUfiz2c'
  );
  
  console.log('✅ Supabase client created');
  
  // Test 2: Query NFTs for Base network
  console.log('🔍 Querying Base NFTs...');
  const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .eq('visible', true)
    .or('network.eq.base,network.ilike.base')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Supabase error:', error);
  } else {
    console.log(`✅ Found ${data.length} Base NFTs:`, data);
    data.forEach((nft, i) => {
      console.log(`${i + 1}. ${nft.title} (${nft.contract_address})`);
    });
  }
  
  // Test 3: Check current page collections
  console.log('\n🔍 Checking page state...');
  // This will show if React state has the collections
  
} catch (err) {
  console.error('❌ Error:', err);
}

console.log('\n📋 Next steps:');
console.log('1. Check Network tab for failed requests');
console.log('2. Check if collectionsProvider.ts is loaded');
console.log('3. Verify Bolt.host deployed latest code');
