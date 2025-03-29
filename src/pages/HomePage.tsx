import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalculator, FaPenNib, FaBookOpen, FaSpellCheck,
  FaChartBar, FaStore, FaTasks,
  FaGem, FaFire
} from 'react-icons/fa';
import { playSound } from '../utils/soundManager';
import HeroCard from '../components/HeroCard';
import BottomNav from '../components/BottomNav';
import styles from './HomePage.module.css';

type Avatar = {
  name: string;
  color: string;
  hair: string;
  costume: string;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [streak, setStreak] = useState(0);
  const [gems, setGems] = useState(100);

  useEffect(() => {
    const saved = localStorage.getItem('hero-avatar');
    if (saved) setAvatar(JSON.parse(saved));
    
    // Simulate loading user data
    setStreak(5); // Example streak
    setGems(250); // Example gems
  }, []);

  const handleNavigate = (path: string) => {
    playSound('click');
    navigate(path);
  };

  return (
    <div className={styles.duolingoContainer}>
      {/* Fixed Header Section */}
      <header className={styles.header}>
        <div className={styles.profileSection}>
          {avatar && (
            <div 
              className={styles.avatarIcon} 
              style={{ backgroundColor: avatar.color }}
              onClick={() => handleNavigate('/profile')}
            >
              {avatar.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className={styles.streakSection}>
          <div className={styles.streakBox}>
            <FaFire className={styles.fireIcon} />
            <span>{streak}</span>
          </div>
        </div>
        
        <div className={styles.currencySection}>
          <div className={styles.gemBox}>
            <FaGem className={styles.gemIcon} />
            <span>{gems}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {avatar && (
          <div className={styles.heroSection}>
            <h2 className={styles.greeting}>Good morning, {avatar.name || 'Hero'}!</h2>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '65%' }}></div>
              </div>
              <span className={styles.progressText}>Daily goal: 65%</span>
            </div>
            <HeroCard
              name={avatar.name}
              color={avatar.color}
              hair={avatar.hair}
              costume={avatar.costume}
            />
          </div>
        )}

        {/* Daily Quests Section */}
        <section className={styles.dailyQuests}>
          <h3 className={styles.sectionTitle}>Today's Quests</h3>
          <div className={styles.questsGrid}>
            <div className={styles.questCard}>
              <div className={styles.questIcon}>
                <FaCalculator />
              </div>
              <div className={styles.questInfo}>
                <h4>Solve 5 math problems</h4>
                <div className={styles.questProgress}>
                  <div className={styles.progressBarSmall}>
                    <div className={styles.progressFill} style={{ width: '40%' }}></div>
                  </div>
                  <span>2/5</span>
                </div>
              </div>
              <div className={styles.questReward}>
                <FaGem className={styles.smallGem} />
                <span>+10</span>
              </div>
            </div>
            
            <div className={styles.questCard}>
              <div className={styles.questIcon}>
                <FaBookOpen />
              </div>
              <div className={styles.questInfo}>
                <h4>Complete 3 reading exercises</h4>
                <div className={styles.questProgress}>
                  <div className={styles.progressBarSmall}>
                    <div className={styles.progressFill} style={{ width: '33%' }}></div>
                  </div>
                  <span>1/3</span>
                </div>
              </div>
              <div className={styles.questReward}>
                <FaGem className={styles.smallGem} />
                <span>+15</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Activities Grid */}
        <section className={styles.activitiesSection}>
          <h3 className={styles.sectionTitle}>Continue your journey</h3>
          <div className={styles.grid}>
            <div 
              className={`${styles.card} ${styles.mathCard}`} 
              onClick={() => handleNavigate('/math')}
            >
              <div className={styles.cardIcon}>
                <FaCalculator />
              </div>
              <h4>Math Quest</h4>
              <p className={styles.cardXP}>+20 XP</p>
            </div>
            
            <div 
              className={`${styles.card} ${styles.englishCard}`} 
              onClick={() => handleNavigate('/english')}
            >
              <div className={styles.cardIcon}>
                <FaPenNib />
              </div>
              <h4>English Quest</h4>
              <p className={styles.cardXP}>+20 XP</p>
            </div>
            
            <div 
              className={`${styles.card} ${styles.readingCard}`} 
              onClick={() => handleNavigate('/reading')}
            >
              <div className={styles.cardIcon}>
                <FaBookOpen />
              </div>
              <h4>Reading Quest</h4>
              <p className={styles.cardXP}>+25 XP</p>
            </div>
            
            <div 
              className={`${styles.card} ${styles.wordCard}`} 
              onClick={() => handleNavigate('/word')}
            >
              <div className={styles.cardIcon}>
                <FaSpellCheck />
              </div>
              <h4>Word Quest</h4>
              <p className={styles.cardXP}>+15 XP</p>
            </div>
            
            <div 
              className={`${styles.card} ${styles.dailyCard}`} 
              onClick={() => handleNavigate('/daily')}
            >
              <div className={styles.cardIcon}>
                <FaTasks />
              </div>
              <h4>Daily Challenges</h4>
              <p className={styles.cardXP}>+30 XP</p>
            </div>
            
            <div 
              className={`${styles.card} ${styles.shopCard}`} 
              onClick={() => handleNavigate('/shop')}
            >
              <div className={styles.cardIcon}>
                <FaStore />
              </div>
              <h4>Hero Shop</h4>
              <p className={styles.cardXP}>Spend gems</p>
            </div>
            
            <div 
              className={`${styles.card} ${styles.progressCard}`} 
              onClick={() => handleNavigate('/progress')}
            >
              <div className={styles.cardIcon}>
                <FaChartBar />
              </div>
              <h4>Progress</h4>
              <p className={styles.cardXP}>View stats</p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;