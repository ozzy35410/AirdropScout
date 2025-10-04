const PHAROS_REFERRAL_KEY = "pharosReferralOpenedAt";
const REFERRAL_TTL_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function markPharosReferralOpened(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PHAROS_REFERRAL_KEY, Date.now().toString());
}

export function isPharosReferralUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  
  const openedAt = localStorage.getItem(PHAROS_REFERRAL_KEY);
  if (!openedAt) return false;
  
  const timestamp = parseInt(openedAt, 10);
  if (isNaN(timestamp)) return false;
  
  const elapsed = Date.now() - timestamp;
  const daysElapsed = elapsed / MS_PER_DAY;
  
  return daysElapsed < REFERRAL_TTL_DAYS;
}

export function getReferralDaysRemaining(): number {
  if (typeof window === "undefined") return 0;
  
  const openedAt = localStorage.getItem(PHAROS_REFERRAL_KEY);
  if (!openedAt) return 0;
  
  const timestamp = parseInt(openedAt, 10);
  if (isNaN(timestamp)) return 0;
  
  const elapsed = Date.now() - timestamp;
  const daysElapsed = elapsed / MS_PER_DAY;
  const remaining = REFERRAL_TTL_DAYS - daysElapsed;
  
  return Math.max(0, Math.ceil(remaining));
}

export function clearPharosReferral(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PHAROS_REFERRAL_KEY);
}
