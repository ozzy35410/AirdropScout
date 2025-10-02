import { useState, useEffect } from 'react';

type Language = 'en' | 'tr';
type Translations = Record<string, string>;

const translations: Record<Language, Translations> = {
  en: {},
  tr: {}
};

// Load translations
const loadTranslations = async () => {
  try {
    const enResponse = await fetch('/locales/en.json');
    const trResponse = await fetch('/locales/tr.json');
    
    translations.en = await enResponse.json();
    translations.tr = await trResponse.json();
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

// Initialize translations
loadTranslations();

export function useTranslation(language: Language) {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Force re-render when language changes
    forceUpdate({});
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return { t };
}

// Fallback translations if files don't load
const fallbackTranslations = {
  en: {
    "connect_to_track": "Connect wallet to track progress",
    "open_task": "Open Task",
    "get_test_tokens": "Get Test Tokens",
    "mint_nfts": "Mint NFTs",
    "token_swaps": "Token Swaps",
    "provide_liquidity": "Provide Liquidity",
    "gas_only": "Gas-only transaction",
    "no_approvals": "No token approvals required",
    "play": "Play",
    "faucet_open": "Open Faucet",
    "referral_link": "Pharos Referral Link",
    "start_exploring": "Start Exploring Tasks",
    "pharos_unlock_hint": "Please open the Pharos link first to unlock the other faucets.",
    "mint_different_nfts": "Mint different NFTs",
    "stay_active_games": "Stay active with daily games",
    "xp_earned": "+10 XP"
  },
  tr: {
    "connect_to_track": "İlerlemeyi takip etmek için cüzdan bağlayın",
    "open_task": "Görevi Aç",
    "get_test_tokens": "Test Token Al",
    "mint_nfts": "NFT Mint Et",
    "token_swaps": "Token Takası",
    "provide_liquidity": "Likidite Ekle",
    "gas_only": "Yalnızca gaz ücreti",
    "no_approvals": "Token onayı gerekmez",
    "play": "Oyna",
    "faucet_open": "Faucet'i Aç",
    "referral_link": "Pharos Referans Bağlantısı",
    "start_exploring": "Görevleri Keşfetmeye Başla",
    "pharos_unlock_hint": "Diğer faucetleri açmadan önce Pharos bağlantısını açmalısınız.",
    "mint_different_nfts": "Farklı NFT'ler Mint Et",
    "stay_active_games": "Günlük oyunlarla aktif kal",
    "xp_earned": "+10 XP"
  }
};

// Use fallback if main translations aren't loaded
if (Object.keys(translations.en).length === 0) {
  translations.en = fallbackTranslations.en;
  translations.tr = fallbackTranslations.tr;
}