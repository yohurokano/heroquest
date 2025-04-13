// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCalculator, FaPenNib, FaBookOpen, FaSpellCheck,
  FaGem, FaFire, FaCrown, FaRegSmile, FaRegLightbulb, 
  FaTrophy, FaDragon, FaStar
} from 'react-icons/fa';
import BottomNav from '../components/BottomNav';
import { getXP, addXP } from '../utils/xpManager';
import { getStreak } from '../utils/streakManager';
import { getDailyChallenges, completeChallenge } from '../utils/dailyChallenges';
import type { Challenge, SubjectCardProps } from '../types';

interface Avatar {
  name: string;
  image?: string;
  unlockables: string[];
}

interface SubjectProgress {
  [key: string]: { completed: number; total: number };
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000];
const AVATAR_UNLOCKABLES = [
  { id: 'dragon-pet', name: "Dragon Companion", cost: 50 },
  { id: 'space-helm', name: "Astro Helmet", cost: 30 },
  { id: 'mage-cloak', name: "Wizard's Cloak", cost: 40 }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<Avatar>({ name: 'Hero', unlockables: [] });
  const [streak, setStreak] = useState(0);
  const [gems, setGems] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress>({
    math: { completed: 0, total: 3 },
    english: { completed: 0, total: 3 },
    reading: { completed: 0, total: 3 },
    word: { completed: 0, total: 3 }
  });

  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem('hero-avatar');
      if (savedAvatar) {
        const parsedAvatar = JSON.parse(savedAvatar);
        if (parsedAvatar.name && Array.isArray(parsedAvatar.unlockables)) {
          setAvatar(parsedAvatar);
        }
      }
      
      setStreak(getStreak());
      setGems(getXP());
      
      const challenges = getDailyChallenges();
      setDailyChallenges(challenges);
      
      const completedCount = challenges.filter(c => c.completed).length;
      setDailyProgress(Math.round((completedCount / challenges.length) * 100));
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }, []);

  const currentLevel = LEVEL_THRESHOLDS.filter(threshold => gems >= threshold).length;

  const handleChallengeComplete = (id: string, reward: number, subject: string) => {
    try {
      completeChallenge(id);
      setDailyChallenges(challenges => 
        challenges.map(c => c.id === id ? { ...c, completed: true } : c)
      );
      
      const newXP = addXP(reward);
      setGems(newXP);
      
      setSubjectProgress(prev => ({
        ...prev,
        [subject]: {
          completed: prev[subject].completed + 1,
          total: prev[subject].total + 1
        }
      }));

      const unlocked = AVATAR_UNLOCKABLES.find(item => 
        newXP >= item.cost && !avatar.unlockables.includes(item.id)
      );
      
      if (unlocked) {
        const updatedAvatar = {
          ...avatar,
          unlockables: [...avatar.unlockables, unlocked.id]
        };
        setAvatar(updatedAvatar);
        localStorage.setItem('hero-avatar', JSON.stringify(updatedAvatar));
      }
    } catch (error) {
      console.error('Challenge completion error:', error);
    }
  };

  const SubjectCard = ({ title, Icon }: SubjectCardProps) => {
    const subjectKey = title.toLowerCase();
    const progress = subjectProgress[subjectKey] || { completed: 0, total: 3 };
    
    return (
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="card bg-base-100 border-2 border-base-300 hover:border-primary transition-all cursor-pointer shadow-md"
        onClick={() => navigate(`/${subjectKey}`)}
      >
        <div className="card-body p-4 items-center text-center relative">
          <div className="absolute top-2 right-2 flex items-center gap-1 text-primary">
            <FaStar className="w-5 h-5" />
            <span className="text-sm font-bold">{progress.completed}</span>
          </div>
          <Icon className="text-4xl text-primary mb-2" />
          <h4 className="font-bold text-xl text-base-content">{title}</h4>
          <div className="w-full bg-base-200 rounded-full h-3 mt-2">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      <header className="flex justify-between items-center p-4 bg-base-100 shadow-md">
        <div className="flex items-center gap-3">
          <div 
            className="avatar placeholder transition-transform hover:scale-110 relative"
            onClick={() => navigate('/profile')}
          >
            <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
              {avatar.image ? (
                <img src={avatar.image} className="rounded-full" alt="Avatar" />
              ) : (
                <span className="text-xl">⚔️</span>
              )}
              {avatar.unlockables.includes('dragon-pet') && (
                <span className="absolute -bottom-2 -right-2 text-2xl text-secondary">🐉</span>
              )}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-base-content">{avatar.name}</h2>
            <p className="text-xs text-base-content/80">Level {currentLevel}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <motion.div whileTap={{ scale: 0.95 }} className="badge badge-lg badge-info gap-2">
            <FaFire className="w-4 h-4" /> {streak}
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className="badge badge-lg badge-success gap-2">
            <FaGem className="w-4 h-4" /> {gems}
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="my-6">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="card-title text-base-content">Daily Progress</h3>
                <span className="text-primary font-bold">{dailyProgress}%</span>
              </div>
              <progress 
                className="progress progress-primary w-full h-3"
                value={dailyProgress}
                max="100"
              />
            </div>
          </div>
        </section>

        <section className="my-6">
          <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
            <FaDragon className="text-secondary" /> Today's Quests
          </h3>
          <div className="grid gap-4">
            {dailyChallenges.map(challenge => (
              <motion.div 
                key={challenge.id}
                whileTap={{ scale: 0.98 }}
                className={`card ${challenge.completed ? 'bg-success/20' : 'bg-base-100'} shadow-md border-2 border-base-300 transition-all`}
                onClick={() => !challenge.completed && handleChallengeComplete(challenge.id, challenge.reward, challenge.subject)}
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-4">
                    <div className={`avatar ${challenge.completed ? 'bg-success' : 'bg-primary'} text-primary-content p-3 rounded-lg`}>
                      {challenge.completed ? (
                        <FaRegSmile className="w-6 h-6" />
                      ) : (
                        <FaRegLightbulb className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-base-content">{challenge.text}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="badge badge-outline badge-sm">{challenge.type}</span>
                        <span className="badge badge-accent badge-sm">{challenge.subject}</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 font-bold text-primary">
                      <FaGem className="w-5 h-5" /> {challenge.reward}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="my-6">
          <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
            <FaCrown className="text-accent" /> Learning Paths
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SubjectCard title="Maths" Icon={FaCalculator} />
            <SubjectCard title="English" Icon={FaPenNib} />
            <SubjectCard title="Readings" Icon={FaBookOpen} />
            <SubjectCard title="Words" Icon={FaSpellCheck} />
          </div>
        </section>

        <section className="my-6">
          <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
            <FaTrophy className="text-warning" /> Leaderboard
          </h3>
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-base-content">Your Position</span>
                <span className="badge badge-lg badge-primary">#42</span>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(rank => (
                  <div key={rank} className="flex items-center justify-between p-3 bg-base-200 rounded-box">
                    <div className="flex items-center gap-3">
                      <span className="text-base-content/70">#{rank}</span>
                      <span className="font-medium text-base-content">Hero {rank}</span>
                      <span className="text-sm text-base-content/70">Level {currentLevel + rank}</span>
                    </div>
                    <span className="flex items-center gap-2 text-primary font-bold">
                      <FaGem className="w-5 h-5" /> {150 - rank * 30}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;