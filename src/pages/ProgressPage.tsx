import React, { useState, useEffect } from 'react';
import styles from './ProgressPage.module.css';
import { FaChartBar, FaHome, FaRedo, FaTrophy, FaFire } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../utils/soundManager';
import HeroCard from '../components/HeroCard';
import { getXP, resetXP } from '../utils/xpManager';

type Avatar = {
  name: string;
  color: string;
  hair: string;
  costume: string;
};

const ProgressPage: React.FC = () => {
  const [xp, setXP] = useState(0);
  const [lastLevel, setLastLevel] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [avatar, setAvatar] = useState<Avatar>({
    name: 'Hero',
    color: '#eee',
    hair: 'Short',
    costume: 'Speedster',
  });

  const navigate = useNavigate();
  const level = Math.floor(xp / 100);
  const xpToNext = 100 - (xp % 100);
  const streakDays = 7; // Example streak value

  useEffect(() => {
    const currentXP = getXP();
    setXP(currentXP);

    const newLevel = Math.floor(currentXP / 100);
    if (newLevel > lastLevel) {
      setShowPulse(true);
      setLastLevel(newLevel);
      playSound('levelUp');
      setTimeout(() => setShowPulse(false), 1200);
    }

    const savedAvatar = localStorage.getItem('hero-avatar');
    if (savedAvatar) {
      setAvatar(JSON.parse(savedAvatar));
    }
  }, [lastLevel]);

  const handleResetXP = () => {
    playSound('click');
    resetXP();
    setXP(0);
    setLastLevel(0);
  };

  const handleNavigateHome = () => {
    playSound('click');
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={handleNavigateHome}
        >
          <IoMdArrowRoundBack className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>
          <FaChartBar className={styles.titleIcon} />
          Hero Progress
        </h1>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.previewSection}>
          <HeroCard
            name={avatar.name}
            color={avatar.color}
            hair={avatar.hair}
            costume={avatar.costume}
            showXP={false}
            xp={xp}
          />
        </section>

        <section className={styles.customizationSection}>
          {showPulse && (
            <div className={styles.levelUpBanner}>
              <FaTrophy className={styles.levelUpIcon} />
              LEVEL UP! 🎉
            </div>
          )}

          <div className={styles.formGroup}>
            <h3 className={styles.sectionTitle}>
              <FaTrophy className={styles.sectionIcon} />
              Level Progress
            </h3>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${xp % 100}%` }}
              />
            </div>
            <p className={styles.progressText}>
              {xp % 100}/100 XP ({xpToNext} XP to next level)
            </p>
          </div>

          <div className={styles.formGroup}>
            <h3 className={styles.sectionTitle}>
              <FaFire className={styles.sectionIcon} />
              Stats
            </h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  {level}
                </div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Current Level</p>
                  <p className={styles.statValue}>{level}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaFire />
                </div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Day Streak</p>
                  <p className={styles.statValue}>{streakDays}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.actionButtons}>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={handleResetXP}
          >
            <FaRedo className={styles.buttonIcon} />
            Reset Progress
          </button>
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={handleNavigateHome}
          >
            <FaHome className={styles.buttonIcon} />
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;