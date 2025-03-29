type Challenge = {
    id: string;
    text: string;
    completed: boolean;
  };
  
  const challengePool: Omit<Challenge, 'completed'>[] = [
    { id: 'math', text: 'Answer a Math question' },
    { id: 'english', text: 'Complete an English Quest step' },
    { id: 'customize', text: 'Customize your Hero' },
    { id: 'playMini', text: 'Play the Mini Game' },
    { id: 'visitProgress', text: 'Visit Progress Page' },
  ];
  
  export function getDailyChallenges(): Challenge[] {
    const saved = localStorage.getItem('daily-challenges');
    const today = new Date().toDateString();
  
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === today) return data.challenges;
    }
  
    // Pick 3 random challenges
    const shuffled = challengePool.sort(() => 0.5 - Math.random()).slice(0, 3);
    const challenges = shuffled.map(c => ({ ...c, completed: false }));
  
    localStorage.setItem('daily-challenges', JSON.stringify({ date: today, challenges }));
    return challenges;
  }
  
  export function completeChallenge(id: string) {
    const saved = localStorage.getItem('daily-challenges');
    if (!saved) return;
  
    const data = JSON.parse(saved);
    const updated = data.challenges.map((c: Challenge) =>
      c.id === id ? { ...c, completed: true } : c
    );
  
    localStorage.setItem('daily-challenges', JSON.stringify({ ...data, challenges: updated }));
  }
  