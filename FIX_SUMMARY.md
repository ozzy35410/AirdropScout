# 🔧 NFT Görünürlük Sorunu - Uygulanan Düzeltmeler

## 📅 Tarih: 2025-10-09

## 🎯 Sorun
NFT'ler Supabase database'de mevcut ancak sitede görünmüyor. API `/api/admin/collections` endpoint'i boş sonuç döndürüyor.

## ✅ Uygulanan Çözümler

### 1. Backend API Endpoint Güçlendirmesi

**Dosya**: `server/index.ts` (Line ~603)

**Değişiklikler**:
- ✅ Case-insensitive chain matching eklendi (`base` = `Base` = `BASE`)
- ✅ Supabase `.or()` query kullanılarak hem `eq` hem `ilike` desteği
- ✅ Error handling geliştirildi (detaylı log mesajları)
- ✅ Response format standardize edildi: `{ ok: true, collections: [...] }`
- ✅ Token standard normalizasyonu: `ERC-721` → `erc721`
- ✅ Field mapping düzeltildi: `title` → `name`, `external_link` → `mintUrl`

**Eski Kod**:
```typescript
const { data, error } = await supabase
  .from('nfts')
  .select('*')
  .eq('network', chain)  // ❌ Case-sensitive
  .eq('visible', true);

const collections = (data || []).map(nft => ({
  name: nft.title,
  // ... basic mapping
}));

res.json({ collections });  // ❌ No 'ok' field
```

**Yeni Kod**:
```typescript
const chain = chainRaw.toLowerCase();  // ✅ Normalize

const { data, error } = await supabase
  .from('nfts')
  .select('*')
  .eq('visible', true)
  .or(`network.eq.${chain},network.ilike.${chain}`)  // ✅ Case-insensitive

const collections = (data || []).filter(Boolean).map((nft: any) => {
  let standard = (nft.token_standard || '').toLowerCase();
  if (standard === 'erc-721') standard = 'erc721';  // ✅ Normalize
  
  return {
    name: nft.title,
    chain: (nft.network || '').toLowerCase(),  // ✅ Normalize
    standard: standard,
    mintUrl: nft.external_link || null,
    // ... complete mapping
  };
});

console.log(`[collections] Found ${collections.length} NFTs`);  // ✅ Logging
return res.json({ ok: true, collections });  // ✅ Standard format
```

---

### 2. Frontend collectionsProvider Güncellenmesi

**Dosya**: `src/data/collectionsProvider.ts`

**Değişiklikler**:
- ✅ Chain parameter lowercase'e normalize edildi
- ✅ `encodeURIComponent` ile güvenli URL encoding
- ✅ Yeni API format desteği: `{ ok, collections }`
- ✅ Backward compatibility: Hem eski hem yeni format çalışıyor
- ✅ Field mapping düzeltildi (contract, mintUrl, standard)

**Eski Kod**:
```typescript
const response = await fetch(`/api/admin/collections?chain=${chain}`);
const data = await response.json();
return data.collections.map(item => ({
  name: item.name,
  contract: item.contract_address,
  // ...
}));
```

**Yeni Kod**:
```typescript
const chainSlug = (chain || '').toLowerCase();  // ✅ Normalize
const response = await fetch(
  `/api/admin/collections?chain=${encodeURIComponent(chainSlug)}`,  // ✅ Safe encoding
  { headers: { 'accept': 'application/json' } }
);

const json = await response.json();

if (json.ok === false) {  // ✅ Handle new format
  throw new Error(json.error || 'bad response');
}

const collections = json.ok ? json.collections : json.collections || [];  // ✅ Backward compat

return collections.map((item: any) => ({
  name: item.name || item.title,  // ✅ Fallback mapping
  contract: item.contract || item.contract_address,  // ✅ Multiple sources
  standard: item.standard?.toLowerCase() === 'erc721' ? 'erc721' : 'erc1155',  // ✅ Normalize
  mintUrl: item.mintUrl || item.mint_url || item.external_link,  // ✅ Multiple sources
}));
```

---

### 3. Vercel Routing Konfigürasyonu

**Dosya**: `vercel.json` (YENİ)

**Amaç**: `/api/*` isteklerinin Express server'a yönlendirilmesini garanti et.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Neden Gerekli**:
- Vercel'de API endpoint'lerinin 404 döndüğü durumlarda routing sorununu çözer
- `/api/health` ve `/api/admin/collections` isteklerini doğru handler'a yönlendirir

---

### 4. Supabase RLS Policy

**Dosya**: `supabase/enable_rls_policy.sql` (YENİ)

**Amaç**: Row Level Security aktifse, anonim kullanıcıların `visible=true` NFT'leri okuyabilmesini sağla.

```sql
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for visible NFTs"
ON public.nfts
FOR SELECT
TO anon, authenticated
USING (visible = true);
```

**Neden Gerekli**:
- RLS aktifse ve policy yoksa, Supabase query'leri boş sonuç döner (hata vermeden)
- Bu en yaygın "NFT'ler görünmüyor" sorunudur

---

## 🧪 Test Adımları

### 1. Local Test
```bash
# Terminal 1: Server başlat
npm run dev

# Terminal 2: API test et
curl http://localhost:3001/api/health
curl "http://localhost:3001/api/admin/collections?chain=base"
```

**Beklenen Sonuç**:
```json
{
  "ok": true,
  "collections": [
    {
      "id": "...",
      "name": "Darth Sidious",
      "chain": "base",
      "contract": "0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4",
      "standard": "erc721"
    },
    {
      "id": "...",
      "name": "Saruman",
      "chain": "base",
      "contract": "0x4a3991821402153c77ed25f7e054bB293759Ccad",
      "standard": "erc721"
    }
  ]
}
```

### 2. Supabase RLS Policy Kontrolü

1. Git: https://ulungobrkoxwrwaccfwm.supabase.co/project/ulungobrkoxwrwaccfwm/sql
2. Çalıştır: `supabase/enable_rls_policy.sql`
3. Verify:
```sql
SELECT * FROM pg_policies WHERE tablename = 'nfts';
```

### 3. Production Test (Deploy Sonrası)

```bash
# Health check
curl https://airdropscout.vercel.app/api/health

# Base NFTs
curl "https://airdropscout.vercel.app/api/admin/collections?chain=base"

# SEI NFTs
curl "https://airdropscout.vercel.app/api/admin/collections?chain=sei"
```

### 4. Browser Test

1. Siteye git: https://airdropscout.vercel.app
2. F12 → Network tab aç
3. NFTs sayfasına git, Base seç
4. `/api/admin/collections?chain=base` isteğini bul
5. Response'u kontrol et:
   - ✅ Status: 200
   - ✅ Response: `{ ok: true, collections: [...] }`
   - ✅ 2 NFT döndü mü?

---

## 📋 Commit Mesajı

```
Fix: Harden NFT collections API with RLS support & case-insensitive matching

Changes:
- Backend: Added case-insensitive chain matching (.or with ilike)
- Backend: Standardized response format { ok, collections }
- Backend: Improved error handling and logging
- Frontend: Normalize chain slugs to lowercase
- Frontend: Support both old and new API response formats
- Added vercel.json for proper API routing
- Added RLS policy SQL script for Supabase

This fixes the issue where NFTs exist in Supabase but don't render on site.
Tested with: curl /api/admin/collections?chain=base

Commits:
- server/index.ts (modified)
- src/data/collectionsProvider.ts (modified)
- vercel.json (new)
- supabase/enable_rls_policy.sql (new)
```

---

## 🎯 Beklenen Sonuç

✅ **Base network**: 2 NFT görünecek (Darth Sidious, Saruman)
✅ **SEI network**: 1 NFT görünecek (Middle East Technical University)
✅ **API response**: `{ ok: true, collections: [...] }` formatında
✅ **Console logs**: `[collections] Found X NFTs for chain="base"`
✅ **No errors**: Network tab'da 200 status, console'da hata yok

---

## 🔗 İlgili Dosyalar

1. `server/index.ts` - Backend API endpoint
2. `src/data/collectionsProvider.ts` - Frontend data fetching
3. `vercel.json` - Routing configuration
4. `supabase/enable_rls_policy.sql` - RLS policy script
5. `SUPABASE_NFT_INTEGRATION_REPORT.md` - Detaylı teknik rapor
