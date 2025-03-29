// src/types/mathTypes.ts

export type MathQuestion = {
    question: string;
    answer: number;
    hint: string;
    xp: number;
  };
  
  export type MathLevel = {
    level: number;
    requiredXP: number;
    questions: MathQuestion[];
  };
  