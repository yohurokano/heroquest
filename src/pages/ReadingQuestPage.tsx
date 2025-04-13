import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, getXP } from '../utils/xpManager';
import { unlockLevel, getUnlockedLevels } from '../utils/progressManager';
import { FaBookOpen, FaGem, FaLock, FaTrophy } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { playSound } from '../utils/soundManager';
import { triggerSparkles } from '../utils/sparkle';
import { incrementStreak } from '../utils/streakManager';

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
    incrementStreak();
    
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

  if (selectedLevel !== null && currentPassage) {
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
            <FaBookOpen className="text-primary w-6 h-6" />
            <h1 className="text-xl font-bold">
              {currentLevel.title} - Level {currentLevel.level}
            </h1>
          </div>
          <div className="badge badge-neutral">
            Passage {step + 1} of {currentLevel.passages.length}
          </div>
        </header>

        <main className="container mx-auto px-4 pt-20 pb-8">
          <div className="card bg-base-200 shadow-lg mt-4">
            <div className="card-body">
              <div className="badge badge-primary gap-2 mb-4">
                <FaGem className="w-4 h-4" />
                +{currentPassage.xp} XP
              </div>

              <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">
                  <p className="text-lg">{currentPassage.passage}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-medium">{currentPassage.question}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {currentPassage.choices.map((choice: string, index: number) => (
                    <button
                      key={index}
                      className={`btn justify-start ${
                        selectedChoice === choice 
                          ? 'btn-primary' 
                          : 'btn-outline'
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
                  {step < currentLevel.passages.length - 1 ? 'Submit & Continue' : 'Complete Level'}
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
          <FaBookOpen className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold">Reading Quest</h1>
        </div>
        <div className="badge badge-neutral gap-2">
          <FaGem className="w-4 h-4" />
          {totalXP} XP
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8">
        <h2 className="text-2xl font-bold mb-6">Select Difficulty Level</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {readingLevels.map((level: ReadingLevel, index: number) => {
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
                    <span>{level.passages.length} passages</span>
                    <span className="badge badge-neutral">
                      {level.passages.reduce((sum: number, p: { xp: number }) => sum + p.xp, 0)} XP
                    </span>
                  </div>

                  {!isUnlocked && (
                    <div className="mt-4">
                      {canUnlock ? (
                        <button 
                          className="btn btn-sm btn-primary w-full"
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

export default ReadingQuestPage;