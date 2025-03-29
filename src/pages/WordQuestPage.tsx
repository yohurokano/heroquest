import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getXP } from '../utils/xpManager';
import { unlockLevel, getUnlockedLevels } from '../utils/progressManager';
import styles from './WordQuestPage.module.css';
import { FaBook, FaGem, FaLock, FaTrophy } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';

type WordLevel = {
  level: number;
  requiredXP: number;
  title: string;
  description: string;
  questions: {
    word: string;
    image?: string;
    choices: string[];
    answer: string;
    xp: number;
  }[];
};

const wordLevels: WordLevel[] = [
  {
    level: 1,
    requiredXP: 0,
    title: "Word Basics",
    description: "Simple word recognition",
    questions: [
      {
        word: 'Hero',
        image: '/images/hero.png',
        choices: ['Villain', 'Hero', 'Monster'],
        answer: 'Hero',
        xp: 10
      },
      {
        word: 'Speed',
        choices: ['Slow', 'Run', 'Speed'],
        answer: 'Speed',
        xp: 10
      }
    ]
  },
  {
    level: 2,
    requiredXP: 30,
    title: "Hero Vocabulary",
    description: "Intermediate hero terms",
    questions: [
      {
        word: 'Quirk',
        image: '/images/quirk.png',
        choices: ['Power', 'Quirk', 'Ability'],
        answer: 'Quirk',
        xp: 15
      },
      {
        word: 'Plus Ultra',
        choices: ['Go Beyond', 'Plus Ultra', 'Never Stop'],
        answer: 'Plus Ultra',
        xp: 15
      }
    ]
  },
  {
    level: 3,
    requiredXP: 70,
    title: "Advanced Terms",
    description: "Challenging hero vocabulary",
    questions: [
      {
        word: 'Omnitrix',
        image: '/images/omnitrix.png',
        choices: ['Watch', 'Omnitrix', 'Device'],
        answer: 'Omnitrix',
        xp: 20
      },
      {
        word: 'One For All',
        choices: ['All For One', 'One For All', 'Super Power'],
        answer: 'One For All',
        xp: 20
      }
    ]
  }
];

const WordQuestPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const xp = getXP();
    setTotalXP(xp);
    const unlocked = getUnlockedLevels('word');
    setUnlockedLevels(unlocked);
  }, []);

  const currentLevel = selectedLevel !== null ? wordLevels[selectedLevel] : null;
  const currentQuestion = currentLevel?.questions[step];

  const handleAnswer = () => {
    if (!currentQuestion || !selectedChoice) return;
    
    playSound('click');
    
    if (selectedChoice === currentQuestion.answer) {
      playSound('xp');
      triggerSparkles();
      const earnedXP = addXP(currentQuestion.xp);
      setTotalXP(earnedXP);
      setFeedback(`✅ Correct! +${currentQuestion.xp} XP`);
      
      setTimeout(() => {
        if (step < currentLevel.questions.length - 1) {
          setStep(step + 1);
          setSelectedChoice(null);
          setFeedback('');
        } else {
          unlockLevel('word', currentLevel.level + 1);
          setUnlockedLevels([...unlockedLevels, currentLevel.level + 1]);
          setSelectedLevel(null);
          setStep(0);
          setSelectedChoice(null);
          setFeedback('');
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
    setSelectedChoice(null);
    setFeedback('');
  };

  const handleNavigateHome = () => {
    playSound('click');
    navigate('/');
  };

  if (selectedLevel !== null && currentQuestion) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => {
              playSound('click');
              setSelectedLevel(null);
            }}
          >
            <IoMdArrowRoundBack className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>
            <FaBook className={styles.titleIcon} />
            {currentLevel.title} - Level {currentLevel.level}
          </h1>
          <div className={styles.progress}>
            Question {step + 1} of {currentLevel.questions.length}
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.questStep}>
            <div className={styles.stepHeader}>
              <div className={styles.xpBadge}>
                <FaGem className={styles.gemIcon} />
                <span>+{currentQuestion.xp} XP</span>
              </div>
            </div>
            
            <div className={styles.questionCard}>
              <p className={styles.questionPrompt}>Select the correct word for:</p>
              <h3 className={styles.word}>{currentQuestion.word}</h3>
              
              {currentQuestion.image && (
                <img 
                  src={currentQuestion.image} 
                  alt={currentQuestion.word} 
                  className={styles.wordImage}
                />
              )}
              
              <div className={styles.choices}>
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    className={`${styles.choiceButton} ${selectedChoice === choice ? styles.selected : ''}`}
                    onClick={() => setSelectedChoice(choice)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
            
            {feedback && (
              <div className={`${styles.feedback} ${feedback.includes('✅') ? styles.correct : styles.incorrect}`}>
                {feedback}
              </div>
            )}
            
            <button 
              className={styles.submitButton}
              onClick={handleAnswer}
              disabled={!selectedChoice}
            >
              {step < currentLevel.questions.length - 1 ? 'Submit & Continue' : 'Complete Level'}
            </button>
          </div>
        </main>
      </div>
    );
  }

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
          <FaBook className={styles.titleIcon} />
          Word Puzzle Quest
        </h1>
        <div className={styles.xpDisplay}>
          <FaGem className={styles.gemIcon} />
          <span>{totalXP} XP</span>
        </div>
      </header>

      <main className={styles.levelSelection}>
        <h2 className={styles.sectionTitle}>Select Difficulty Level</h2>
        
        <div className={styles.levelsGrid}>
          {wordLevels.map((level, index) => {
            const isUnlocked = unlockedLevels.includes(level.level) || index === 0;
            const canUnlock = totalXP >= level.requiredXP && !isUnlocked;
            
            return (
              <div 
                key={level.level} 
                className={`${styles.levelCard} ${isUnlocked ? styles.unlocked : styles.locked}`}
                onClick={() => isUnlocked && startLevel(index)}
              >
                <div className={styles.levelHeader}>
                  <h3>{level.title} - Level {level.level}</h3>
                  {isUnlocked ? (
                    <FaTrophy className={styles.trophyIcon} />
                  ) : (
                    <FaLock className={styles.lockIcon} />
                  )}
                </div>
                
                <p className={styles.levelDescription}>{level.description}</p>
                
                <div className={styles.levelInfo}>
                  <p>{level.questions.length} words</p>
                  <p>Reward: {level.questions.reduce((sum, q) => sum + q.xp, 0)} XP</p>
                </div>
                
                {!isUnlocked && (
                  <div className={styles.lockInfo}>
                    {canUnlock ? (
                      <button 
                        className={styles.unlockButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          unlockLevel('word', level.level);
                          setUnlockedLevels([...unlockedLevels, level.level]);
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
                  <button 
                    className={styles.startButton}
                    onClick={() => startLevel(index)}
                  >
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

export default WordQuestPage;