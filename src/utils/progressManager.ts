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