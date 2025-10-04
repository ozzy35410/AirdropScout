const FLAG = "pharosReferralOpenedAt";
const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function isPharosReferralOpen(): boolean {
  const value = localStorage.getItem(FLAG);
  return value ? (Date.now() - Number(value)) < TTL : false;
}

export function openPharosReferral(): void {
  window.open(
    "https://testnet.pharosnetwork.xyz/experience?inviteCode=CktVYkx8FeejVAHr",
    "_blank",
    "noopener"
  );
  localStorage.setItem(FLAG, String(Date.now()));
}