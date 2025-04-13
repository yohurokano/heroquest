import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getXP } from '../utils/xpManager';
import { 
  unlockLevel,
  getUnlockedLevels,
  markSubLevelComplete,
  getCompletedSubLevels
} from '../utils/progressManager';
import { 
  FaPenNib, FaGem, FaLock, FaTrophy, FaChevronDown, 
  FaChevronRight, FaCheck, FaLightbulb 
} from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';
import rawEnglishLevels from '../data/englishLevels.json';
import { incrementStreak } from '../utils/streakManager';
import BottomNav from '../components/BottomNav';

type QuestionStep = 
  | {
      type: 'text';
      question: string;
      hint: string;
      placeholder: string;
      xp: number;
      theme?: string;
    }
  | {
      type: 'quiz';
      question: string;
      options: string[];
      correctAnswer: string;
      hint: string;
      xp: number;
      theme?: string;
    }
  | {
      type: 'fill-blank';
      question: string;
      answer: string;
      hint: string;
      xp: number;
      theme?: string;
    }
  | {
      type: 'synonym' | 'definition';
      question: string;
      answer: string;
      hint: string;
      acceptable?: string[];
      xp: number;
      theme?: string;
    }
  | {
      type: 'story' | 'description';
      question: string;
      minWords: number;
      hint: string;
      xp: number;
      theme?: string;
    }
  | {
      type: 'dialogue';
      question: string;
      minLines: number;
      hint: string;
      xp: number;
      theme?: string;
    };

type SubLevel = {
  subLevel: number;
  title: string;
  steps: QuestionStep[];
  requiredXP?: number;
};

type EnglishLevel = {
  level: number;
  requiredXP: number;
  title: string;
  description: string;
  subLevels: SubLevel[];
};

type EnglishLevelsData = {
  englishLevels: EnglishLevel[];
  settings?: {
    progression?: {
      xpPerMainLevel?: number;
      xpPerSubLevel?: number;
      dailyGoal?: number;
      streakBonus?: number;
    };
    themes?: {
      available?: string[];
      default?: string;
    };
  };
};

const englishLevelsData = rawEnglishLevels as EnglishLevelsData;
const englishLevels = englishLevelsData.englishLevels; 

const EnglishQuestPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedSubLevel, setSelectedSubLevel] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([]);
  const [completedSubLevels, setCompletedSubLevels] = useState<{[key: string]: boolean}>({});
  const [expandedLevels, setExpandedLevels] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [subLevelCompleted, setSubLevelCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const xp = getXP();
    setTotalXP(xp);
    const unlocked = getUnlockedLevels('english');
    setUnlockedLevels(unlocked);
    const completed = getCompletedSubLevels('english');
    setCompletedSubLevels(completed);
  }, []);

  const currentLevel = selectedLevel !== null ? englishLevels[selectedLevel] : null;
  const currentSubLevel = selectedSubLevel !== null && currentLevel ? currentLevel.subLevels[selectedSubLevel] : null;
  const currentStep = currentSubLevel?.steps[step];

  const toggleLevelExpansion = (levelIndex: number) => {
    if (expandedLevels.includes(levelIndex)) {
      setExpandedLevels(expandedLevels.filter(l => l !== levelIndex));
    } else {
      setExpandedLevels([...expandedLevels, levelIndex]);
    }
  };

  const isSubLevelCompleted = (levelIndex: number, subLevelIndex: number) => {
    const key = `${englishLevels[levelIndex].level}-${englishLevels[levelIndex].subLevels[subLevelIndex].subLevel}`;
    return completedSubLevels[key] || false;
  };

  const handleSubmit = () => {
    if (!currentStep || !currentSubLevel || !currentLevel || selectedSubLevel === null) return;

    incrementStreak();
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
      
      const subLevelKey = `${currentLevel.level}-${currentSubLevel.subLevel}`;
      if (!completedSubLevels[subLevelKey]) {
        const earnedXP = addXP(currentStep.xp);
        setTotalXP(earnedXP);
      }
      
      setFeedback(`Correct! +${currentStep.xp} XP`);
      
      setTimeout(() => {
        if (step < currentSubLevel.steps.length - 1) {
          setStep(step + 1);
          setUserInput('');
          setFeedback('');
          setShowHint(false);
        } else {
          markSubLevelComplete('english', currentLevel.level, currentSubLevel.subLevel);
          setCompletedSubLevels({
            ...completedSubLevels,
            [subLevelKey]: true
          });
          
          setSubLevelCompleted(true);
          setFeedback('Sub-level completed! Great job!');
        }
      }, 1500);
    } else {
      playSound('error');
      setFeedback(currentStep.type.includes('story') ? 
        `Your ${currentStep.type} needs to be longer` : 
        'Try again!');
    }
  };

  const startSubLevel = (levelIndex: number, subLevelIndex: number) => {
    if (subLevelIndex > 0 && !isSubLevelCompleted(levelIndex, subLevelIndex - 1)) {
      playSound('error');
      setFeedback('Complete the previous sub-level first!');
      return;
    }

    playSound('click');
    setSelectedLevel(levelIndex);
    setSelectedSubLevel(subLevelIndex);
    setStep(0);
    setUserInput('');
    setFeedback('');
    setShowHint(false);
    setSubLevelCompleted(false);
  };

  const resetSubLevel = () => {
    setSelectedSubLevel(null);
    setStep(0);
    setUserInput('');
    setFeedback('');
    setShowHint(false);
    setSubLevelCompleted(false);
  };

  if (selectedLevel !== null && selectedSubLevel !== null && currentLevel && currentSubLevel && currentStep) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <header className="navbar bg-base-200 shadow-lg px-4 py-2 fixed top-0 left-0 right-0 z-50">
          <button 
            className="btn btn-ghost btn-circle"
            onClick={() => {
              playSound('click');
              resetSubLevel();
            }}
          >
            <IoMdArrowRoundBack className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center gap-2 ml-2">
            <FaPenNib className="text-primary w-6 h-6" />
            <h1 className="text-xl font-bold">
              {currentLevel.title} - {currentSubLevel.title}
            </h1>
          </div>
          <div className="badge badge-neutral">
            Step {step + 1} of {currentSubLevel.steps.length}
          </div>
        </header>

        <main className="container mx-auto px-4 pt-20 pb-24">
          <div className="card bg-base-200 shadow-lg mt-4">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{currentStep.question}</h2>
                <div className="badge badge-primary gap-2">
                  <FaGem className="w-4 h-4" />
                  +{currentStep.xp} XP
                </div>
              </div>
              
              {currentStep.hint && (
                <div className="collapse collapse-arrow bg-base-100 mb-4">
                  <input 
                    type="checkbox" 
                    checked={showHint}
                    onChange={() => setShowHint(!showHint)}
                  />
                  <div className="collapse-title font-medium flex items-center gap-2">
                    <FaLightbulb className="text-warning" />
                    Hint
                  </div>
                  <div className="collapse-content">
                    <p>{currentStep.hint}</p>
                  </div>
                </div>
              )}
              
              {currentStep.type === 'quiz' && (
                <div className="grid gap-2">
                  {currentStep.options.map((option: string) => (
                    <button
                      key={option}
                      className="btn btn-outline justify-start"
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
                  className="input input-bordered w-full"
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder={currentStep.type === 'text' ? currentStep.placeholder : "Enter your answer"}
                  disabled={subLevelCompleted}
                />
              )}
              
              {(currentStep.type === 'story' || currentStep.type === 'dialogue' || 
                currentStep.type === 'description') && (
                <textarea
                  className="textarea textarea-bordered w-full h-48"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder={currentStep.type === 'dialogue' ? 
                    "Villain: ...\nHero: ...\nVillain: ..." : 
                    "Start writing your story here..."}
                  disabled={subLevelCompleted}
                />
              )}
              
              {feedback && (
                <div className={`alert ${
                  feedback.includes('Correct') || feedback.includes('completed') 
                    ? 'alert-success' 
                    : 'alert-error'
                } mt-4`}>
                  {feedback}
                </div>
              )}
              
              <div className="card-actions justify-end mt-4">
                {!subLevelCompleted ? (
                  <button 
                    className={`btn btn-primary ${!userInput ? 'btn-disabled' : ''}`}
                    onClick={handleSubmit}
                  >
                    {step < currentSubLevel.steps.length - 1 ? 'Submit & Continue' : 'Complete Sub-Level'}
                  </button>
                ) : (
                  <button 
                    className="btn btn-ghost"
                    onClick={resetSubLevel}
                  >
                    Return to Levels
                  </button>
                )}
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
          onClick={() => {
            playSound('click');
            navigate('/');
          }}
        >
          <IoMdArrowRoundBack className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-2 ml-2">
          <FaPenNib className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold">English Quest</h1>
        </div>
        <div className="badge badge-neutral gap-2">
          <FaGem className="w-4 h-4" />
          {totalXP} XP
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-24">
        <h2 className="text-2xl font-bold mb-6">Select Difficulty Level</h2>
        
        <div className="grid gap-4">
          {englishLevels.map((level, levelIndex) => {
            const isUnlocked = unlockedLevels.includes(level.level) || levelIndex === 0;
            const canUnlock = totalXP >= level.requiredXP && !isUnlocked;
            const isExpanded = expandedLevels.includes(levelIndex);

            return (
              <div 
                key={level.level} 
                className={`card bg-base-200 shadow-lg ${!isUnlocked ? 'opacity-75' : ''}`}
              >
                <div 
                  className="card-body cursor-pointer"
                  onClick={() => toggleLevelExpansion(levelIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <FaChevronDown className="w-4 h-4" />
                      ) : (
                        <FaChevronRight className="w-4 h-4" />
                      )}
                      <h3 className="text-lg font-medium">
                        {level.title} - Level {level.level}
                      </h3>
                    </div>
                    {isUnlocked ? (
                      <FaTrophy className="text-warning w-6 h-6" />
                    ) : (
                      <FaLock className="text-error w-6 h-6" />
                    )}
                  </div>
                  
                  <p className="text-sm opacity-75">{level.description}</p>
                  
                  {isExpanded && (
                    <div className="ml-6 mt-4 space-y-4">
                      {level.subLevels.map((subLevel, subLevelIndex) => {
                        const isCompleted = isSubLevelCompleted(levelIndex, subLevelIndex);
                        const isPreviousCompleted = subLevelIndex === 0 || isSubLevelCompleted(levelIndex, subLevelIndex - 1);
                        const isAvailable = isUnlocked && isPreviousCompleted;
                        
                        return (
                          <div
                            key={subLevel.subLevel}
                            className={`card bg-base-100 shadow-md ${
                              isCompleted ? 'border-2 border-success' : 
                              isAvailable ? 'cursor-pointer hover:bg-base-300' : 'opacity-50'
                            }`}
                            onClick={() => isAvailable && startSubLevel(levelIndex, subLevelIndex)}
                          >
                            <div className="card-body p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{subLevel.title}</h4>
                                {isCompleted && <FaCheck className="text-success" />}
                              </div>
                              <div className="flex justify-between text-sm mt-2">
                                <span>{subLevel.steps.length} challenges</span>
                                <span>{subLevel.steps.reduce((sum, s) => sum + s.xp, 0)} XP</span>
                              </div>
                              {!isPreviousCompleted && (
                                <div className="text-xs text-error mt-2">
                                  Complete previous sub-level first
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {!isUnlocked && (
                    <div className="card-actions justify-end mt-4">
                      {canUnlock ? (
                        <button 
                          className="btn btn-sm btn-primary"
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
                        <div className="badge badge-neutral">
                          Requires {level.requiredXP} XP
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav/>
    </div>
  );
};

export default EnglishQuestPage;