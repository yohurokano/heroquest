import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getXP } from '../utils/xpManager';
import { unlockLevel, getUnlockedLevels } from '../utils/progressManager';
import styles from './EnglishQuestPage.module.css';
import { FaPenNib, FaGem, FaLock, FaTrophy } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';
import rawEnglishLevels from '../data/englishLevels.json';

type QuestionStep =
  | {
      type: 'text';
      question: string;
      placeholder: string;
      xp: number;
    }
  | {
      type: 'quiz';
      question: string;
      options: string[];
      correctAnswer: string;
      hint: string;
      xp: number;
    }
  | {
      type: 'fill-blank';
      question: string;
      answer: string;
      hint: string;
      xp: number;
    }
  | {
      type: 'synonym' | 'definition';
      question: string;
      answer: string;
      acceptable?: string[];
      xp: number;
    }
  | {
      type: 'story' | 'description';
      question: string;
      minWords: number;
      xp: number;
    }
  | {
      type: 'dialogue';
      question: string;
      minLines: number;
      xp: number;
    };

type EnglishLevel = {
  level: number;
  requiredXP: number;
  title: string;
  description: string;
  steps: QuestionStep[];
};

type EnglishLevelsData = EnglishLevel[];

const englishLevels = rawEnglishLevels as EnglishLevelsData;


const EnglishQuestPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const xp = getXP();
    setTotalXP(xp);
    const unlocked = getUnlockedLevels('english');
    setUnlockedLevels(unlocked);
  }, []);

  const currentLevel = selectedLevel !== null ? englishLevels[selectedLevel] : null;
  const currentStep = currentLevel?.steps[step];

  const handleSubmit = () => {
    if (!currentStep) return;
    
    playSound('click');
    
    let isCorrect = false;
    switch(currentStep.type) {
      case 'quiz':
        isCorrect = userInput === currentStep.correctAnswer;
        break;
      case 'fill-blank':
        isCorrect = userInput.toLowerCase() === currentStep.answer.toLowerCase();
        break;
      case 'synonym':
      case 'definition': {
        const acceptable = [currentStep.answer.toLowerCase(), ...(currentStep.acceptable?.map((a: string) => a.toLowerCase()) || [])];
        isCorrect = acceptable.includes(userInput.toLowerCase());
        break;
      }
      case 'story':
      case 'description': {
        const wordCount = userInput.trim() ? userInput.trim().split(/\s+/).length : 0;
        isCorrect = wordCount >= currentStep.minWords;
        break;
      }
      case 'dialogue': {
        const lineCount = userInput.trim() ? userInput.trim().split('\n').filter(line => line.trim()).length : 0;
        isCorrect = lineCount >= currentStep.minLines;
        break;
      }
      default:
        isCorrect = true;
    }

    if (isCorrect) {
      playSound('success');
      triggerSparkles();
      const earnedXP = addXP(currentStep.xp);
      setTotalXP(earnedXP);
      setFeedback(`Correct! +${currentStep.xp} XP`);
      
      setTimeout(() => {
        if (step < currentLevel.steps.length - 1) {
          setStep(step + 1);
          setUserInput('');
          setFeedback('');
        } else {
          unlockLevel('english', currentLevel.level + 1);
          setUnlockedLevels([...unlockedLevels, currentLevel.level + 1]);
          setSelectedLevel(null);
          setStep(0);
          setUserInput('');
          setFeedback('');
        }
      }, 1500);
    } else {
      playSound('error');
      setFeedback(currentStep.type.includes('story') ? 
        `Your ${currentStep.type} needs to be longer` : 
        'Try again!');
    }
  };

  const startLevel = (levelIndex: number) => {
    playSound('click');
    setSelectedLevel(levelIndex);
    setStep(0);
    setUserInput('');
    setFeedback('');
  };

  if (selectedLevel !== null && currentStep) {
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
            <FaPenNib className={styles.titleIcon} />
            {currentLevel.title} - Level {currentLevel.level}
          </h1>
          <div className={styles.progress}>
            Step {step + 1} of {currentLevel.steps.length}
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.questStep}>
            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>
                {currentStep.question}
              </h2>
              <div className={styles.xpBadge}>
                <FaGem className={styles.gemIcon} />
                <span>+{currentStep.xp} XP</span>
              </div>
            </div>
            
            {currentStep.type === 'quiz' && (
              <div className={styles.choiceButtons}>
                {currentStep.options.map((option: string) => (
                  <button
                    key={option}
                    className={styles.choiceButton}
                    onClick={() => setUserInput(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {(currentStep.type === 'text' || currentStep.type === 'fill-blank' || 
              currentStep.type === 'synonym' || currentStep.type === 'definition') && (
              <input
                className={styles.input}
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder={currentStep.type === 'text' ? currentStep.placeholder : "Enter your answer"}
              />
            )}
            
            {(currentStep.type === 'story' || currentStep.type === 'dialogue' || 
              currentStep.type === 'description') && (
              <textarea
                className={styles.textarea}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                rows={6}
                placeholder={currentStep.type === 'dialogue' ? 
                  "Villain: ...\nHero: ...\nVillain: ..." : 
                  "Start writing your story here..."}
              />
            )}
            
            {feedback && (
              <div className={`${styles.feedback} ${feedback.includes('Correct') ? styles.correct : styles.incorrect}`}>
                {feedback}
              </div>
            )}
            
            <button 
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!userInput}
            >
              {step < currentLevel.steps.length - 1 ? 'Submit & Continue' : 'Complete Level'}
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
          onClick={() => {
            playSound('click');
            navigate('/');
          }}
        >
          <IoMdArrowRoundBack className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>
          <FaPenNib className={styles.titleIcon} />
          English Quest
        </h1>
        <div className={styles.xpDisplay}>
          <FaGem className={styles.gemIcon} />
          <span>{totalXP} XP</span>
        </div>
      </header>

      <main className={styles.levelSelection}>
        <h2 className={styles.sectionTitle}>Select Difficulty Level</h2>
        
        <div className={styles.levelsGrid}>
          {englishLevels.map((level, index) => {
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
                  <p>{level.steps.length} challenges</p>
                  <p>Reward: {level.steps.reduce((sum, s) => sum + s.xp, 0)} XP</p>
                </div>
                
                {!isUnlocked && (
                  <div className={styles.lockInfo}>
                    {canUnlock ? (
                      <button 
                        className={styles.unlockButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          unlockLevel('english', level.level);
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

export default EnglishQuestPage;