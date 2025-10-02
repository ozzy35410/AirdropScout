export function addXP(addr: string, amount: number) {
  const key = `xp:${addr.toLowerCase()}`;
  const current = Number(localStorage.getItem(key) || 0);
  localStorage.setItem(key, String(current + amount));
}

export function getXP(addr: string): number {
  return Number(localStorage.getItem(`xp:${addr.toLowerCase()}`) || 0);
}

export function getTotalXP(addr: string): number {
  return getXP(addr);
}