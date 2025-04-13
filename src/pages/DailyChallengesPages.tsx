import React, { useEffect, useState } from 'react';
import { getDailyChallenges, completeChallenge } from '../utils/dailyChallenges';
import { addXP } from '../utils/xpManager';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';
import { FaCalendarCheck, FaCheck, FaGem } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { incrementStreak } from '../utils/streakManager';

type Challenge = {
  id: string;
  text: string;
  completed: boolean;
  reward: number;
};

const DailyChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dailyChallenges = getDailyChallenges().map(challenge => ({
      ...challenge,
      reward: 10 + Math.floor(Math.random() * 15)
    }));
    setChallenges(dailyChallenges);
  }, []);

  const handleComplete = (id: string) => {
    playSound('success');
    const challenge = challenges.find(c => c.id === id);
    if (challenge) {
      completeChallenge(id);
      triggerSparkles();
      addXP(challenge.reward);
      incrementStreak();
      setChallenges(prev => 
        prev.map(c => c.id === id ? { ...c, completed: true } : c)
      );
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalCount = challenges.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="navbar bg-base-200 shadow-lg px-4 py-2 fixed top-0 left-0 right-0 z-50">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={() => {
            playSound('click');
            navigate('/');
          }}
        >
          <IoMdArrowRoundBack className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-2 ml-2">
          <FaCalendarCheck className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold">Daily Challenges</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="card bg-base-200 shadow-lg mt-4">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <span className="badge badge-neutral">
                {completedCount}/{totalCount} Completed
              </span>
              <span className="text-sm">{progress}%</span>
            </div>
            <progress 
              className="progress progress-primary w-full h-4" 
              value={progress} 
              max="100"
            ></progress>
          </div>
        </div>

        <div className="grid gap-4 mt-6">
          {challenges.map(challenge => (
            <div 
              key={challenge.id} 
              className={`card bg-base-200 shadow-lg transition-all ${
                challenge.completed ? 'opacity-75 line-through' : ''
              }`}
            >
              <div className="card-body flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium">{challenge.text}</p>
                  {!challenge.completed && (
                    <div className="badge badge-neutral gap-2 mt-2">
                      <FaGem className="w-4 h-4" />
                      +{challenge.reward} XP
                    </div>
                  )}
                </div>
                
                {challenge.completed ? (
                  <div className="badge badge-success gap-2">
                    <FaCheck className="w-4 h-4" />
                    Completed
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleComplete(challenge.id)}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DailyChallengesPage;