import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getXP } from '../utils/xpManager';
import { unlockLevel, getUnlockedLevels } from '../utils/progressManager';
import styles from './ReadingQuestPage.module.css';
import { FaBookOpen, FaGem, FaLock, FaTrophy } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';

type ReadingLevel = {
  level: number;
  requiredXP: number;
  title: string;
  description: string;
  passages: {
    passage: string;
    question: string;
    choices: string[];
    answer: string;
    xp: number;
  }[];
};

const readingLevels: ReadingLevel[] = [
  {
    level: 1,
    requiredXP: 0,
    title: "Hero Beginnings",
    description: "Simple hero stories for new readers",
    passages: [
      {
        passage: 'Deku always believed in being kind, even when he was scared. He never gave up, even if he had no powers at first.',
        question: 'What describes Deku best?',
        choices: ['Selfish', 'Kind', 'Angry'],
        answer: 'Kind',
        xp: 10
      },
      {
        passage: 'Sonic runs faster than the speed of sound. He always uses his speed to help others and stop bad guys.',
        question: 'What is Sonic known for?',
        choices: ['Flying', 'Speed', 'Magic'],
        answer: 'Speed',
        xp: 10
      }
    ]
  },
  {
    level: 2,
    requiredXP: 30,
    title: "Hero Adventures",
    description: "Longer stories with more complex questions",
    passages: [
      {
        passage: 'All Might was the Symbol of Peace who protected society with a smile. Even after being injured, he continued to inspire others and train the next generation of heroes.',
        question: 'Why was All Might called the Symbol of Peace?',
        choices: ['He was very strong', 'He protected society', 'He had a big smile'],
        answer: 'He protected society',
        xp: 15
      },
      {
        passage: 'Batman has no superpowers but uses his intelligence, detective skills, and technology to fight crime in Gotham City. He follows a strict moral code of never killing his enemies.',
        question: 'How does Batman fight crime differently from other heroes?',
        choices: ['With magic', 'Using technology and skills', 'By breaking the law'],
        answer: 'Using technology and skills',
        xp: 15
      }
    ]
  },
  {
    level: 3,
    requiredXP: 70,
    title: "Hero Legends",
    description: "Challenging passages with deeper meanings",
    passages: [
      {
        passage: 'With great power comes great responsibility. This lesson was taught to Spider-Man by his Uncle Ben, and it became the guiding principle of his hero career. Even when facing personal struggles, Peter Parker remembers this lesson and puts others before himself.',
        question: 'What is the main theme of this passage?',
        choices: ['Power corrupts', 'Responsibility comes with power', 'Heroes should be selfish'],
        answer: 'Responsibility comes with power',
        xp: 20
      },
      {
        passage: 'A true hero isn\'t measured by the size of their strength, but by the strength of their heart. Hercules discovered that true heroism comes from compassion and helping others, not just physical might.',
        question: 'What does Hercules learn about heroism?',
        choices: ['Physical strength is most important', 'Heroism comes from the heart', 'Heroes should work alone'],
        answer: 'Heroism comes from the heart',
        xp: 20
      }
    ]
  }
];

const ReadingQuestPage: React.FC = () => {
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
    const unlocked = getUnlockedLevels('reading');
    setUnlockedLevels(unlocked);
  }, []);

  const currentLevel = selectedLevel !== null ? readingLevels[selectedLevel] : null;
  const currentPassage = currentLevel?.passages[step];

  const handleAnswer = () => {
    if (!currentPassage || !selectedChoice) return;
    
    playSound('click');
    
    if (selectedChoice === currentPassage.answer) {
      playSound('xp');
      triggerSparkles();
      const earnedXP = addXP(currentPassage.xp);
      setTotalXP(earnedXP);
      setFeedback(`✅ Correct! +${currentPassage.xp} XP`);
      
      setTimeout(() => {
        if (step < currentLevel.passages.length - 1) {
          setStep(step + 1);
          setSelectedChoice(null);
          setFeedback('');
        } else {
          unlockLevel('reading', currentLevel.level + 1);
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

  if (selectedLevel !== null && currentPassage) {
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
            <FaBookOpen className={styles.titleIcon} />
            {currentLevel.title} - Level {currentLevel.level}
          </h1>
          <div className={styles.progress}>
            Passage {step + 1} of {currentLevel.passages.length}
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.questStep}>
            <div className={styles.stepHeader}>
              <div className={styles.xpBadge}>
                <FaGem className={styles.gemIcon} />
                <span>+{currentPassage.xp} XP</span>
              </div>
            </div>
            
            <div className={styles.passageCard}>
              <p className={styles.passage}>{currentPassage.passage}</p>
            </div>
            
            <div className={styles.questionCard}>
              <h3 className={styles.question}>{currentPassage.question}</h3>
              <div className={styles.choices}>
                {currentPassage.choices.map((choice, index) => (
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
              {step < currentLevel.passages.length - 1 ? 'Submit & Continue' : 'Complete Level'}
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
          <FaBookOpen className={styles.titleIcon} />
          Reading Quest
        </h1>
        <div className={styles.xpDisplay}>
          <FaGem className={styles.gemIcon} />
          <span>{totalXP} XP</span>
        </div>
      </header>

      <main className={styles.levelSelection}>
        <h2 className={styles.sectionTitle}>Select Difficulty Level</h2>
        
        <div className={styles.levelsGrid}>
          {readingLevels.map((level, index) => {
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
                  <p>{level.passages.length} passages</p>
                  <p>Reward: {level.passages.reduce((sum, p) => sum + p.xp, 0)} XP</p>
                </div>
                
                {!isUnlocked && (
                  <div className={styles.lockInfo}>
                    {canUnlock ? (
                      <button 
                        className={styles.unlockButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          unlockLevel('reading', level.level);
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

export default ReadingQuestPage;