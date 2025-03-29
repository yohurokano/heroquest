import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getXP } from '../utils/xpManager';
import { unlockLevel, getUnlockedLevels } from '../utils/progressManager';
import styles from './MathQuestPage.module.css';
import { FaBrain, FaGem, FaLock, FaTrophy } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';
import mathLevels from '../data/mathLevels.json';

type MathQuestion = {
  type: 'basic' | 'fraction' | 'decimal' | 'logic' | 'visual';
  question: string;
  answer: number | string;
  hint: string;
  xp: number;
};

type MathLevel = {
  level: number;
  requiredXP: number;
  questions: MathQuestion[];
};

const typedLevels = mathLevels as MathLevel[];


const MathQuestPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const xp = getXP();
    setTotalXP(xp);
    const unlocked = getUnlockedLevels('math');
    setUnlockedLevels(unlocked);
  }, []);

  const currentLevel = selectedLevel !== null ? typedLevels[selectedLevel] : null;
  const currentQuestion = currentLevel?.questions[step];

  const handleCheck = () => {
    if (!currentQuestion) return;

    playSound('click');
    if (parseInt(userAnswer) === currentQuestion.answer) {
      playSound('success');
      triggerSparkles();
      const xpEarned = addXP(currentQuestion.xp);
      setTotalXP(xpEarned);
      setFeedback(`✅ +${currentQuestion.xp} XP`);
      setUserAnswer('');
      setShowHint(false);

      if (step === currentLevel.questions.length - 1) {
        unlockLevel('math', currentLevel.level + 1);
        setUnlockedLevels(prev => [...prev, currentLevel.level + 1]);
      }

      setTimeout(() => {
        if (step < currentLevel.questions.length - 1) {
          setStep(prev => prev + 1);
        } else {
          setSelectedLevel(null);
          setStep(0);
        }
      }, 1500);
    } else {
      playSound('error');
      setFeedback('❌ Try again!');
    }
  };

  const startLevel = (levelIndex: number) => {
    playSound('click');
    setSelectedLevel(levelIndex);
    setStep(0);
    setFeedback('');
    setUserAnswer('');
  };

  if (selectedLevel !== null && currentQuestion) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={() => setSelectedLevel(null)}>
            <IoMdArrowRoundBack className={styles.backIcon} />
          </button>
          <h1 className={styles.title}><FaBrain className={styles.titleIcon} /> Math Quest - Level {currentLevel.level}</h1>
          <div className={styles.progress}>Question {step + 1} of {currentLevel.questions.length}</div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <h3 className={styles.questionText}>{currentQuestion.question}</h3>
              <button className={styles.hintButton} onClick={() => setShowHint(!showHint)}>
                {showHint ? 'Hide Hint' : 'Need Help?'}
              </button>
            </div>

            {showHint && <div className={styles.hintBox}><p>{currentQuestion.hint}</p></div>}

            <input
              className={styles.input}
              type="number"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
            />

            {feedback && (
              <div className={`${styles.feedback} ${feedback.includes('✅') ? styles.correct : styles.incorrect}`}>
                {feedback}
              </div>
            )}

            <button className={styles.submitButton} onClick={handleCheck} disabled={!userAnswer}>
              Check Answer
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <IoMdArrowRoundBack className={styles.backIcon} />
        </button>
        <h1 className={styles.title}><FaBrain className={styles.titleIcon} /> Math Quest</h1>
        <div className={styles.xpDisplay}>
          <FaGem className={styles.gemIcon} /> <span>{totalXP} XP</span>
        </div>
      </header>

      <main className={styles.levelSelection}>
        <h2 className={styles.sectionTitle}>Select Difficulty Level</h2>
        <div className={styles.levelsGrid}>
          {typedLevels.map((level: MathLevel, index: number) => {
            const isUnlocked = unlockedLevels.includes(level.level) || index === 0;
            const canUnlock = totalXP >= level.requiredXP && !isUnlocked;

            return (
              <div
                key={level.level}
                className={`${styles.levelCard} ${isUnlocked ? styles.unlocked : styles.locked}`}
                onClick={() => isUnlocked && startLevel(index)}
              >
                <div className={styles.levelHeader}>
                  <h3>Level {level.level}</h3>
                  {isUnlocked ? <FaTrophy className={styles.trophyIcon} /> : <FaLock className={styles.lockIcon} />}
                </div>

                <div className={styles.levelInfo}>
                  <p>{level.questions.length} questions</p>
                  <p>Reward: {level.questions.reduce((sum: number, q: MathQuestion) => sum + q.xp, 0)} XP</p>
                </div>

                {!isUnlocked && (
                  <div className={styles.lockInfo}>
                    {canUnlock ? (
                      <button
                        className={styles.unlockButton}
                        onClick={e => {
                          e.stopPropagation();
                          unlockLevel('math', level.level);
                          setUnlockedLevels(prev => [...prev, level.level]);
                          playSound('success');
                        }}
                      >
                        Unlock Now
                      </button>
                    ) : (
                      <p>Requires {level.requiredXP} XP</p>
                    )}
                  </div>
                )}

                {isUnlocked && (
                  <button className={styles.startButton} onClick={() => startLevel(index)}>
                    Start Level
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MathQuestPage;
