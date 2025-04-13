import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getXP } from '../utils/xpManager';
import { unlockLevel, getUnlockedLevels } from '../utils/progressManager';
import { FaBook, FaGem, FaLock, FaTrophy } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';
import { incrementStreak } from '../utils/streakManager';

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
    incrementStreak();
    
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

  if (selectedLevel !== null && currentQuestion) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <header className="navbar bg-base-200 shadow-lg px-4 py-2 fixed top-0 left-0 right-0 z-50">
          <button 
            className="btn btn-ghost btn-circle"
            onClick={() => {
              playSound('click');
              setSelectedLevel(null);
            }}
          >
            <IoMdArrowRoundBack className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center gap-2 ml-2">
            <FaBook className="text-primary w-6 h-6" />
            <h1 className="text-xl font-bold">
              {currentLevel.title} - Level {currentLevel.level}
            </h1>
          </div>
          <div className="badge badge-neutral">
            Question {step + 1} of {currentLevel.questions.length}
          </div>
        </header>

        <main className="container mx-auto px-4 pt-20 pb-8">
          <div className="card bg-base-200 shadow-lg mt-4">
            <div className="card-body">
              <div className="badge badge-primary gap-2 mb-4">
                <FaGem className="w-4 h-4" />
                +{currentQuestion.xp} XP
              </div>

              <div className="text-center space-y-4">
                <p className="text-lg font-medium">Select the correct word for:</p>
                <h2 className="text-3xl font-bold text-primary">{currentQuestion.word}</h2>
                
                {currentQuestion.image && (
                  <img 
                    src={currentQuestion.image} 
                    alt={currentQuestion.word}
                    className="rounded-box mx-auto w-48 h-48 object-contain"
                  />
                )}

                <div className="grid grid-cols-1 gap-2 mt-6">
                  {currentQuestion.choices.map((choice: string, index: number) => (
                    <button
                      key={index}
                      className={`btn justify-start ${
                        selectedChoice === choice ? 'btn-primary' : 'btn-outline'
                      }`}
                      onClick={() => setSelectedChoice(choice)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className={`alert ${
                  feedback.includes('✅') ? 'alert-success' : 'alert-error'
                } mt-4`}>
                  {feedback}
                </div>
              )}

              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={handleAnswer}
                  disabled={!selectedChoice}
                >
                  {step < currentLevel.questions.length - 1 ? 'Submit & Continue' : 'Complete Level'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="navbar bg-base-200 shadow-lg px-4 py-2 fixed top-0 left-0 right-0 z-50">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={() => navigate('/')}
        >
          <IoMdArrowRoundBack className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-2 ml-2">
          <FaBook className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold">Word Puzzle Quest</h1>
        </div>
        <div className="badge badge-neutral gap-2">
          <FaGem className="w-4 h-4" />
          {totalXP} XP
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8">
        <h2 className="text-2xl font-bold mb-6">Select Difficulty Level</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wordLevels.map((level: WordLevel, index: number) => {
            const isUnlocked = unlockedLevels.includes(level.level) || index === 0;
            const canUnlock = totalXP >= level.requiredXP && !isUnlocked;
            
            return (
              <div 
                key={level.level} 
                className={`card bg-base-200 shadow-lg ${
                  !isUnlocked ? 'opacity-75' : 'cursor-pointer hover:bg-base-300'
                }`}
                onClick={() => isUnlocked && startLevel(index)}
              >
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      {level.title} - Level {level.level}
                    </h3>
                    {isUnlocked ? (
                      <FaTrophy className="text-warning w-6 h-6" />
                    ) : (
                      <FaLock className="text-error w-6 h-6" />
                    )}
                  </div>

                  <p className="text-sm opacity-75 mt-2">{level.description}</p>

                  <div className="flex justify-between mt-4">
                    <span>{level.questions.length} words</span>
                    <span className="badge badge-neutral">
                      {level.questions.reduce((sum: number, q: { xp: number }) => sum + q.xp, 0)} XP
                    </span>
                  </div>

                  {!isUnlocked && (
                    <div className="mt-4">
                      {canUnlock ? (
                        <button 
                          className="btn btn-sm btn-primary w-full"
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
                        <div className="badge badge-neutral">
                          Requires {level.requiredXP} XP
                        </div>
                      )}
                    </div>
                  )}

                  {isUnlocked && (
                    <button 
                      className="btn btn-outline btn-sm w-full mt-4"
                      onClick={() => startLevel(index)}
                    >
                      Start Level
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default WordQuestPage;