export const unlockLevel = (category: string, level: number) => {
  const unlocked = getUnlockedLevels(category);
  if (!unlocked.includes(level)) {
    const updated = [...unlocked, level];
    localStorage.setItem(`unlocked-${category}`, JSON.stringify(updated));
  }
};

export const getUnlockedLevels = (category: string): number[] => {
  const saved = localStorage.getItem(`unlocked-${category}`);
  return saved ? JSON.parse(saved) : [1]; // Level 1 always unlocked by default
};

export const markSubLevelComplete = (category: string, level: number, subLevel: number): void => {
  const completedKey = `${category}-completed-sublevels`;
  try {
    const completed = JSON.parse(localStorage.getItem(completedKey) || '{}');
    completed[`${level}-${subLevel}`] = true;
    localStorage.setItem(completedKey, JSON.stringify(completed));
  } catch (e) {
    console.error('Error marking sublevel complete:', e);
  }
};

export const getCompletedSubLevels = (category: string): Record<string, boolean> => {
  const completedKey = `${category}-completed-sublevels`;
  try {
    const savedData = localStorage.getItem(completedKey);
    return savedData ? JSON.parse(savedData) : {};
  } catch (e) {
    console.error('Error getting completed sublevels:', e);
    return {};
  }
};