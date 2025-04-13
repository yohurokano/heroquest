// src/utils/dailyChallenges.ts
import type { Challenge } from '../types';

const challengePool: Omit<Challenge, 'completed'>[] = [
  { 
    id: 'math-1',
    text: 'Solve 5 addition problems',
    type: 'Math',
    subject: 'math',
    reward: 15
  },
  { 
    id: 'english-1',
    text: 'Complete spelling exercise',
    type: 'Vocabulary',
    subject: 'english',
    reward: 12
  },
  {
    id: 'customize-1',
    text: 'Customize your Hero avatar',
    type: 'Customization',
    subject: 'general',
    reward: 10
  },
  {
    id: 'mini-game-1',
    text: 'Play the trivia mini-game',
    type: 'Mini-Game',
    subject: 'general',
    reward: 20
  },
  {
    id: 'progress-1',
    text: 'Review your progress page',
    type: 'Progress',
    subject: 'general',
    reward: 8
  },
];

export function getDailyChallenges(): Challenge[] {
  const saved = localStorage.getItem('daily-challenges');
  const today = new Date().toDateString();

  if (saved) {
    const data = JSON.parse(saved);
    if (data.date === today) return data.challenges;
  }

  // Generate new challenges with all required properties
  const shuffled = [...challengePool].sort(() => 0.5 - Math.random()).slice(0, 3);
  const challenges: Challenge[] = shuffled.map(c => ({
    ...c,
    completed: false,
    // Ensure all Challenge properties are present
    type: c.type || 'General',
    subject: c.subject || 'general',
    reward: c.reward || 10
  }));

  localStorage.setItem('daily-challenges', JSON.stringify({ date: today, challenges }));
  return challenges;
}

export function completeChallenge(id: string): void {
  const saved = localStorage.getItem('daily-challenges');
  if (!saved) return;

  const data = JSON.parse(saved);
  const updated = data.challenges.map((c: Challenge) =>
    c.id === id ? { ...c, completed: true } : c
  );

  localStorage.setItem('daily-challenges', JSON.stringify({ ...data, challenges: updated }));
}