// utils/streakManager.ts
export const getStreak = (): number => {
    const streak = localStorage.getItem('hero-streak');
    return streak ? parseInt(streak) : 0;
  };
  
  export const incrementStreak = (): number => {
    const lastActiveDate = localStorage.getItem('hero-last-active');
    const today = new Date().toDateString();
    
    // If last active was yesterday or streak is new
    if (!lastActiveDate || 
        new Date(lastActiveDate).toDateString() === 
        new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
      const newStreak = (getStreak() || 0) + 1;
      localStorage.setItem('hero-streak', newStreak.toString());
      localStorage.setItem('hero-last-active', today);
      return newStreak;
    }
    
    // If already active today
    if (lastActiveDate === today) {
      return getStreak();
    }
    
    // If broken streak
    localStorage.setItem('hero-streak', '1');
    localStorage.setItem('hero-last-active', today);
    return 1;
  };
  
  export const resetStreak = (): void => {
    localStorage.setItem('hero-streak', '0');
    localStorage.removeItem('hero-last-active');
  };