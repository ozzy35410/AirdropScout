export type ProgramTask = {
  id: string;
  kind: "daily" | "once" | "social";
  titleEN: string;
  titleTR: string;
  href?: string;        // deep link for this task (optional)
  notesEN?: string;
  notesTR?: string;
};

export type Program = {
  slug: string;         // kebab-case unique
  nameEN: string;
  nameTR: string;
  url: string;          // main/referral landing URL (use exactly as provided)
  socialX?: string;
  code?: string;        // invite code if any
  tasks: ProgramTask[];
  tags?: string[];
  visible: boolean;
  testnetOnly?: boolean; // default true for our programs
};

export const PROGRAMS: Program[] = [
  {
    slug: "neura-protocol",
    nameEN: "Neura Protocol",
    nameTR: "Neura Protocol",
    url: "https://neuraverse.neuraprotocol.io",
    socialX: "https://x.com/Neura_io",
    tasks: [
      { id:"daily-faucet", kind:"daily", titleEN:"Claim daily faucet", titleTR:"Günlük faucet al" },
      { id:"swap", kind:"once", titleEN:"Swap tokens", titleTR:"Swap yap" },
      { id:"bridge", kind:"once", titleEN:"Bridge tokens", titleTR:"Bridge işlemi yap" },
      { id:"social", kind:"social", titleEN:"Do social tasks for XP", titleTR:"XP için sosyal görevleri tamamla" }
    ],
    tags:["xp","faucet","swap","bridge","social"],
    visible:true,
    testnetOnly:true
  },
  {
    slug: "nitrograph",
    nameEN: "Nitrograph",
    nameTR: "Nitrograph",
    url: "https://community.nitrograph.com/app/missions",
    socialX: "https://x.com/Nitrograph",
    code: "K175LH9L",
    tasks: [
      { id:"daily-checkin", kind:"daily", titleEN:"Daily check-in for XP / $NITRO", titleTR:"Günlük check-in ile XP / $NITRO al" },
      { id:"social", kind:"social", titleEN:"Complete social missions", titleTR:"Sosyal görevleri tamamla" }
    ],
    tags:["xp","daily","social"],
    visible:true,
    testnetOnly:true
  },
  {
    slug: "huddle",
    nameEN: "Huddle",
    nameTR: "Huddle",
    url: "https://testnet.huddle01.com/r/0x5583ba39732db8006938A83BF64BBB029A0b12A0",
    socialX: "https://x.com/huddle01com",
    tasks: [
      { id:"social", kind:"social", titleEN:"Do social tasks", titleTR:"Sosyal görevleri yap" },
      { id:"daily-join", kind:"daily", titleEN:"Join meetings (target 8h/day) to earn $HP", titleTR:"Toplantılara katıl (günlük 8s hedef) ve $HP kazan", href:"https://huddle01.app/room/cey-zyrk-wtu/lobby" }
    ],
    tags:["daily","hp","social"],
    visible:true,
    testnetOnly:true
  },
  {
    slug: "incentiv",
    nameEN: "Incentiv",
    nameTR: "Incentiv",
    url: "https://testnet.incentiv.io/login?refCode=9hNV9reoKaURoTJHAAQjzJ",
    socialX: "https://x.com/Incentiv_net",
    tasks: [
      { id:"daily-faucet", kind:"daily", titleEN:"Claim daily test tokens", titleTR:"Günlük test token al" },
      { id:"swap", kind:"once", titleEN:"Swap tokens", titleTR:"Token takası yap" },
      { id:"send", kind:"once", titleEN:"Send tokens to any address", titleTR:"Herhangi bir adrese token gönder" }
    ],
    tags:["faucet","swap","send","xp"],
    visible:true,
    testnetOnly:true
  },
  {
    slug: "idos",
    nameEN: "idOS",
    nameTR: "idOS",
    url: "https://app.idos.network?ref=3C276CCF",
    socialX: "https://x.com/idOS_network",
    tasks: [
      { id:"signup", kind:"once", titleEN:"Sign up", titleTR:"Kayıt ol" },
      { id:"mobile-verify", kind:"once", titleEN:"Mobile humanity verification", titleTR:"Mobil uygulama ile insanlık doğrulaması" },
      { id:"social", kind:"social", titleEN:"Telegram & X tasks", titleTR:"Telegram ve X görevleri" },
      { id:"daily-checkin", kind:"daily", titleEN:"Daily check-in for points", titleTR:"Günlük check-in ile puan kazan" }
    ],
    tags:["identity","daily","social"],
    visible:true,
    testnetOnly:true
  },
  {
    slug: "soneium",
    nameEN: "Soneium",
    nameTR: "Soneium",
    url: "https://portal.soneium.org",
    socialX: "https://x.com/soneium",
    tasks: [
      { id:"season-quests", kind:"once", titleEN:"Seasonal quests (on-chain)", titleTR:"Sezonluk görevler (on-chain)" },
      { id:"daily-activity", kind:"daily", titleEN:"Daily activity (small transactions)", titleTR:"Günlük küçük işlemlerle aktif kal" },
      { id:"season-nft", kind:"once", titleEN:"Mint the season NFT", titleTR:"Sezon NFT'sini mintle" }
    ],
    tags:["season","activity","nft"],
    visible:true,
    testnetOnly:true
  }
];
