import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getXP } from '../utils/xpManager';
import { unlockLevel, getUnlockedLevels } from '../utils/progressManager';
import { FaBrain, FaGem, FaLock, FaTrophy } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';
import mathLevels from '../data/mathLevels.json';
import { incrementStreak } from '../utils/streakManager';

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

      incrementStreak();

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
      <div className="min-h-screen bg-base-100 text-base-content">
        <header className="navbar bg-base-200 shadow-lg px-4 py-2 fixed top-0 left-0 right-0 z-50">
          <button 
            className="btn btn-ghost btn-circle"
            onClick={() => setSelectedLevel(null)}
          >
            <IoMdArrowRoundBack className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center gap-2 ml-2">
            <FaBrain className="text-primary w-6 h-6" />
            <h1 className="text-xl font-bold">Math Quest - Level {currentLevel.level}</h1>
          </div>
          <div className="badge badge-neutral">
            Question {step + 1} of {currentLevel.questions.length}
          </div>
        </header>

        <main className="container mx-auto px-4 pt-20 pb-8">
          <div className="card bg-base-200 shadow-lg mt-4">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => setShowHint(!showHint)}
                >
                  {showHint ? 'Hide Hint' : 'Need Help?'}
                </button>
              </div>

              {showHint && (
                <div className="alert bg-base-300">
                  <p>{currentQuestion.hint}</p>
                </div>
              )}

              <input
                className="input input-bordered w-full"
                type="number"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
              />

              {feedback && (
                <div className={`alert ${feedback.includes('✅') ? 'alert-success' : 'alert-error'} mt-4`}>
                  {feedback}
                </div>
              )}

              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={handleCheck} 
                  disabled={!userAnswer}
                >
                  Check Answer
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
          <FaBrain className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold">Math Quest</h1>
        </div>
        <div className="badge badge-neutral gap-2">
          <FaGem className="w-4 h-4" />
          {totalXP} XP
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8">
        <h2 className="text-2xl font-bold mb-6">Select Difficulty Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {typedLevels.map((level: MathLevel, index: number) => {
            const isUnlocked = unlockedLevels.includes(level.level) || index === 0;
            const canUnlock = totalXP >= level.requiredXP && !isUnlocked;

            return (
              <div
                key={level.level}
                className={`card bg-base-200 shadow-lg ${!isUnlocked ? 'opacity-75' : 'cursor-pointer hover:bg-base-300'}`}
                onClick={() => isUnlocked && startLevel(index)}
              >
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Level {level.level}</h3>
                    {isUnlocked ? (
                      <FaTrophy className="text-warning w-6 h-6" />
                    ) : (
                      <FaLock className="text-error w-6 h-6" />
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <p>{level.questions.length} questions</p>
                    <p className="badge badge-neutral">
                      Reward: {level.questions.reduce((sum: number, q: MathQuestion) => sum + q.xp, 0)} XP
                    </p>
                  </div>

                  {!isUnlocked && (
                    <div className="mt-4">
                      {canUnlock ? (
                        <button
                          className="btn btn-sm btn-primary w-full"
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

export default MathQuestPage;