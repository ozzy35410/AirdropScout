# 🚀 Supabase Setup Guide

## 1️⃣ Supabase Bilgilerini Al

1. [Supabase Dashboard](https://app.supabase.com) adresine git
2. Projenizi seçin
3. Sol menüden **Settings** → **API** tıklayın
4. Şu bilgileri kopyalayın:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (uzun bir token)

## 2️⃣ .env Dosyasını Güncelle

`.env` dosyasını açın ve şu değerleri güncelleyin:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**ÖNEMLİ:** Gerçek değerlerinizi yazın!

## 3️⃣ Database'i Oluştur

Supabase Dashboard'da:

### Option A: SQL Editor Kullan (Kolay)

1. Sol menüden **SQL Editor** seçin
2. **New Query** butonuna tıklayın
3. `supabase/migrations/20250925212047_calm_fire.sql` dosyasının içeriğini kopyala-yapıştır
4. **Run** butonuna tıklayın ✅
5. Aynı şekilde `supabase/migrations/20251008000000_add_image_and_price.sql` dosyasını da çalıştır

### Option B: Migration Files Kullan (Gelişmiş)

```bash
# Supabase CLI kur
npm install -g supabase

# Supabase'e bağlan
supabase link --project-ref your-project-id

# Migrations'ları çalıştır
supabase db push
```

## 4️⃣ Admin Kullanıcısı Oluştur (Opsiyonel)

Admin paneli için authentication:

1. **Authentication** → **Users** → **Add User**
2. Email: `admin@yourdomain.com`
3. Password: Güçlü bir şifre
4. **Auto Confirm User**: ✅ İşaretle

## 5️⃣ Test Et

```bash
# Bağımlılıkları yükle (eğer yüklemediysen)
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç ve admin panelinden NFT ekle!

## 6️⃣ Database Tablolarını Kontrol Et

Supabase Dashboard'da:
1. **Table Editor** → **nfts** tablosunu göreceksin
2. Şu sütunlar olmalı:
   - ✅ `id`, `title`, `description`
   - ✅ `network`, `contract_address`, `token_id`
   - ✅ `token_standard`, `external_link`
   - ✅ `image_url` ⭐ YENİ
   - ✅ `price_eth` ⭐ YENİ
   - ✅ `tags`, `visible`
   - ✅ `created_at`, `updated_at`

## 🎯 Başarı!

Artık NFT'ler Supabase'de saklanacak! 

### Avantajlar:
- ✅ Kalıcı veri storage
- ✅ Her cihazdan aynı data
- ✅ Gerçek database özellikleri
- ✅ Güvenli ve ölçeklenebilir

## 🔧 Sorun Giderme

### "CORS Error" alıyorsanız:
- Supabase Dashboard → **Settings** → **API**
- **URL Configuration** kısmında `http://localhost:5173` ekleyin

### "Unauthorized" hatası alıyorsanız:
- `.env` dosyasındaki key'leri kontrol edin
- Tarayıcı cache'ini temizleyin (Ctrl+Shift+R)

### Migration hataları:
- SQL Editor'de hataları okuyun
- Tablo zaten varsa `IF NOT EXISTS` kullanıldığı için sorun olmaz

## 📚 Daha Fazla Bilgi

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
