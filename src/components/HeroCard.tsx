import React from 'react';
import styles from './HeroCard.module.css';
import { FaFire, FaGem, FaCrown } from 'react-icons/fa';

type Props = {
  name: string;
  color: string;
  hair: string;
  costume: string;
  showXP?: boolean;
  xp?: number;
  large?: boolean;
  streak?: number;
  gems?: number;
};

const HeroCard: React.FC<Props> = ({ 
  name, 
  color, 
  hair, 
  costume, 
  showXP = false, 
  xp = 0, 
  large = false,
  streak = 0,
  gems = 0
}) => {
  const getChibiSrc = () => {
    const h = hair.toLowerCase();
    const c = costume.toLowerCase().includes('hero') ? 'hero' : 
              costume.toLowerCase().includes('adventurer') ? 'adventurer' :
              costume.toLowerCase().includes('mage') ? 'mage' : 'speedster';
    return `src/assets/chibi/${h}_${c}.png`;
  };

  const level = Math.floor(xp / 100) + 1;
  const currentLevelXP = xp % 100;
  const isMaxLevel = level >= 10; // Assuming max level is 10

  return (
    <div className={`${styles.card} ${large ? styles.large : ''}`}>
      <div className={styles.cardHeader} style={{ backgroundColor: color }}>
        <div className={styles.avatarContainer}>
          <img
            src={getChibiSrc()}
            alt={`${name}'s avatar`}
            onError={(e) => (e.currentTarget.src = '/assets/chibi/default.png')}
            className={styles.chibi}
          />
          {streak > 0 && (
            <div className={styles.streakBadge}>
              <FaFire className={styles.streakIcon} />
              <span>{streak}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.nameRow}>
          <h3 className={styles.heroName}>{name || 'Unnamed Hero'}</h3>
          {isMaxLevel && <FaCrown className={styles.crownIcon} />}
        </div>
        
        <div className={styles.heroDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Style:</span>
            <span className={styles.detailValue}>{hair}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Outfit:</span>
            <span className={styles.detailValue}>{costume}</span>
          </div>
        </div>

        <div className={styles.statsRow}>
          {gems > 0 && (
            <div className={styles.gemCount}>
              <FaGem className={styles.gemIcon} />
              <span>{gems}</span>
            </div>
          )}

          {showXP && (
            <div className={styles.xpSection}>
              {!isMaxLevel ? (
                <>
                  <div className={styles.levelBadge}>
                    Lvl {level}
                  </div>
                  <div className={styles.xpBarContainer}>
                    <div 
                      className={styles.xpBarFill} 
                      style={{ width: `${currentLevelXP}%` }}
                    />
                    <span className={styles.xpText}>{currentLevelXP}/100</span>
                  </div>
                </>
              ) : (
                <div className={styles.maxLevelBadge}>
                  <FaCrown className={styles.crownIconSmall} />
                  <span>Max Level</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroCard;