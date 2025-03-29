import React, { useEffect, useState } from 'react';
import { getDailyChallenges, completeChallenge } from '../utils/dailyChallenges';
import { addXP } from '../utils/xpManager';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';
import styles from './DailyChallengesPage.module.css';
import { FaCalendarCheck, FaCheck, FaGem } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

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
      reward: 10 + Math.floor(Math.random() * 15) // Random reward between 10-25
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
      setChallenges(prev => 
        prev.map(c => 
          c.id === id ? { ...c, completed: true } : c
        )
      );
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalCount = challenges.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => {
            playSound('click');
            navigate('/');
          }}
        >
          <IoMdArrowRoundBack className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>
          <FaCalendarCheck className={styles.titleIcon} />
          Daily Challenges
        </h1>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.progressContainer}>
          <div className={styles.progressText}>
            {completedCount} of {totalCount} completed
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={styles.challengesList}>
          {challenges.map(challenge => (
            <div 
              key={challenge.id} 
              className={`${styles.challengeCard} ${challenge.completed ? styles.completed : ''}`}
            >
              <div className={styles.challengeContent}>
                <div className={styles.challengeText}>
                  {challenge.text}
                </div>
                {!challenge.completed && (
                  <div className={styles.rewardBadge}>
                    <FaGem className={styles.gemIcon} />
                    <span>+{challenge.reward}</span>
                  </div>
                )}
              </div>
              
              {challenge.completed ? (
                <div className={styles.completedBadge}>
                  <FaCheck className={styles.checkIcon} />
                  <span>Completed</span>
                </div>
              ) : (
                <button 
                  className={styles.completeButton}
                  onClick={() => handleComplete(challenge.id)}
                >
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default DailyChallengesPage;