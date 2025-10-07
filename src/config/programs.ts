export type SimpleTask = {
  id: string;
  textEN: string;
  textTR: string;
  daily?: boolean;
};

export type Visibility = "testnet" | "mainnet" | "both";

export type Program = {
  slug: string;
  nameEN: string;
  nameTR: string;
  url: string;            // referral/main URL — open with this
  code?: string;          // invite/referral code if any
  visibility?: Visibility; // default "testnet"
  tasksText: SimpleTask[];
};

export const PROGRAMS: Program[] = [
  {
    slug: "neura-protocol",
    nameEN: "Neura Protocol",
    nameTR: "Neura Protocol",
    url: "https://neuraverse.neuraprotocol.io",
    visibility: "testnet",
    tasksText: [
      { id: "neura-faucet", textEN: "Claim daily faucet", textTR: "Günlük faucet al", daily: true },
      { id: "neura-swap", textEN: "Swap tokens", textTR: "Swap yap" },
      { id: "neura-bridge", textEN: "Bridge tokens", textTR: "Bridge işlemi yap" },
      { id: "neura-social", textEN: "Do social tasks for XP", textTR: "XP için sosyal görevleri tamamla" }
    ]
  },
  {
    slug: "nitrograph",
    nameEN: "Nitrograph",
    nameTR: "Nitrograph",
    url: "https://community.nitrograph.com/app/missions",
    code: "K175LH9L",
    visibility: "testnet",
    tasksText: [
      { id: "nitro-check", textEN: "Daily check-in for XP / $NITRO", textTR: "Günlük check-in ile XP / $NITRO al", daily: true },
      { id: "nitro-social", textEN: "Complete social missions", textTR: "Sosyal görevleri tamamla" }
    ]
  },
  {
    slug: "huddle",
    nameEN: "Huddle",
    nameTR: "Huddle",
    url: "https://testnet.huddle01.com/r/0x5583ba39732db8006938A83BF64BBB029A0b12A0",
    visibility: "testnet",
    tasksText: [
      { id: "hud-social", textEN: "Do social tasks", textTR: "Sosyal görevleri yap" },
      { id: "hud-join", textEN: "Join meetings (target 8h/day) to earn $HP", textTR: "Toplantılara katıl (günlük 8s hedef) ve $HP kazan", daily: true }
    ]
  },
  {
    slug: "incentiv",
    nameEN: "Incentiv",
    nameTR: "Incentiv",
    url: "https://testnet.incentiv.io/login?refCode=9hNV9reoKaURoTJHAAQjzJ",
    visibility: "testnet",
    tasksText: [
      { id: "inc-faucet", textEN: "Claim daily test tokens", textTR: "Günlük test token al", daily: true },
      { id: "inc-swap", textEN: "Swap tokens", textTR: "Token takası yap" },
      { id: "inc-send", textEN: "Send tokens to any address", textTR: "Herhangi bir adrese token gönder" }
    ]
  },
  {
    slug: "idos",
    nameEN: "idOS",
    nameTR: "idOS",
    url: "https://app.idos.network?ref=3C276CCF",
    visibility: "testnet",
    tasksText: [
      { id: "idos-sign", textEN: "Sign up", textTR: "Kayıt ol" },
      { id: "idos-verify", textEN: "Mobile humanity verification", textTR: "Mobil uygulama ile insanlık doğrulaması" },
      { id: "idos-social", textEN: "Telegram & X tasks", textTR: "Telegram ve X görevleri" },
      { id: "idos-checkin", textEN: "Daily check-in for points", textTR: "Günlük check-in ile puan kazan", daily: true }
    ]
  },
  {
    slug: "soneium",
    nameEN: "Soneium",
    nameTR: "Soneium",
    url: "https://portal.soneium.org",
    visibility: "mainnet",
    tasksText: [
      { id: "son-season", textEN: "Seasonal quests (on-chain)", textTR: "Sezonluk görevler (on-chain)" },
      { id: "son-daily", textEN: "Daily activity (small transactions)", textTR: "Günlük küçük işlemlerle aktif kal", daily: true },
      { id: "son-nft", textEN: "Mint the season NFT", textTR: "Sezon NFT'sini mintle" }
    ]
  }
];
