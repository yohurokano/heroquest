// src/types.ts
export interface Challenge {
    id: string;
    text: string;
    type: string;
    subject: string;
    reward: number;
    completed: boolean;
  }
  
  export interface SubjectCardProps {
    title: string;
    Icon: React.ElementType;
  }