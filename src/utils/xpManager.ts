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

export function getLevel(xp?: number): number {
  try {
  const currentXP = xp !== undefined ? xp : getXP();
  return Math.max(1, Math.floor(currentXP / 100) + 1); // ensure minimun level of 1
} catch {
  return 1; // fallback level
}
}

export function getXPToNextLevel(currentXP?: number): number 
{
  const xp = currentXP !== undefined ? currentXP : getXP();
  const currentLevel = getLevel(xp);
  return (currentLevel * 100) - xp;
}