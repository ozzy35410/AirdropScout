// Test API endpoint directly
import 'dotenv/config';

async function testAPI() {
  console.log('🔍 Testing API endpoint...\n');
  
  try {
    // Test 1: Get all NFTs
    console.log('1️⃣ Testing GET /api/nfts (all networks)');
    const response1 = await fetch('http://localhost:3001/api/nfts');
    const data1 = await response1.json();
    console.log(`   Found ${data1.nfts.length} total NFTs`);
    console.log(`   Response:`, JSON.stringify(data1, null, 2));
    
    // Test 2: Get Base NFTs
    console.log('\n2️⃣ Testing GET /api/nfts?network=base');
    const response2 = await fetch('http://localhost:3001/api/nfts?network=base');
    const data2 = await response2.json();
    console.log(`   Found ${data2.nfts.length} Base NFTs`);
    data2.nfts.forEach((nft: any) => {
      console.log(`   - ${nft.title}`);
    });
    
    // Test 3: Get SEI NFTs
    console.log('\n3️⃣ Testing GET /api/nfts?network=sei');
    const response3 = await fetch('http://localhost:3001/api/nfts?network=sei');
    const data3 = await response3.json();
    console.log(`   Found ${data3.nfts.length} SEI NFTs`);
    data3.nfts.forEach((nft: any) => {
      console.log(`   - ${nft.title}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Wait for server to be ready
setTimeout(testAPI, 2000);
