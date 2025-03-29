const XP_KEY = 'hero-xp';

export function getXP(): number {
  const stored = localStorage.getItem(XP_KEY);
  return stored ? parseInt(stored) : 0;
}

export function addXP(amount: number): number {
  const current = getXP();
  const updated = current + amount;
  localStorage.setItem(XP_KEY, updated.toString());
  return updated;
}

export function resetXP(): void {
  localStorage.setItem(XP_KEY, '0');
}
