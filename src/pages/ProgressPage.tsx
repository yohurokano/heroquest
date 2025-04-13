import React, { useState, useEffect } from 'react';
import { FaChartBar, FaHome, FaRedo, FaTrophy, FaFire } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../utils/soundManager';
import HeroCard from '../components/HeroCard';
import { getXP, resetXP } from '../utils/xpManager';
import { getStreak } from '../utils/streakManager';

type Avatar = {
  name: string;
  color: string;
  hair: string;
  costume: string;
};

const ProgressPage: React.FC = () => {
  const [xp, setXP] = useState(0);
  const [lastLevel, setLastLevel] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const [avatar, setAvatar] = useState<Avatar>({
    name: 'Hero',
    color: '#eee',
    hair: 'Short',
    costume: 'Speedster',
  });

  const navigate = useNavigate();
  const level = Math.floor(xp / 100);
  const xpToNext = 100 - (xp % 100);
  const streakDays = getStreak();

  useEffect(() => {
    const currentXP = getXP();
    setXP(currentXP);

    const newLevel = Math.floor(currentXP / 100);
    if (newLevel > lastLevel) {
      setShowPulse(true);
      setLastLevel(newLevel);
      playSound('levelUp');
      setTimeout(() => setShowPulse(false), 1200);
    }

    const savedAvatar = localStorage.getItem('hero-avatar');
    if (savedAvatar) {
      setAvatar(JSON.parse(savedAvatar));
    }
  }, [lastLevel]);

  const handleResetXP = () => {
    playSound('click');
    resetXP();
    setXP(0);
    setLastLevel(0);
  };

  const handleNavigateHome = () => {
    playSound('click');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="navbar bg-base-200 shadow-lg px-4 py-2 fixed top-0 left-0 right-0 z-50">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={handleNavigateHome}
        >
          <IoMdArrowRoundBack className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-2 ml-2">
          <FaChartBar className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold">Hero Progress</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hero Preview Section */}
          <div className="w-full lg:w-1/3 flex justify-center">
            <HeroCard
              name={avatar.name}
              color={avatar.color}
              hair={avatar.hair}
              costume={avatar.costume}
              showXP={false}
              xp={xp}
            />
          </div>

          {/* Stats Section */}
          <div className="w-full lg:w-2/3 space-y-8">
            {showPulse && (
              <div className="alert alert-success animate-pulse">
                <FaTrophy className="w-6 h-6" />
                <span className="font-bold">LEVEL UP! 🎉</span>
              </div>
            )}

            {/* Progress Section */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <FaTrophy className="text-warning" />
                  Level Progress
                </h2>
                <progress 
                  className="progress progress-primary w-full h-4 mt-4"
                  value={xp % 100}
                  max="100"
                ></progress>
                <p className="mt-2">
                  {xp % 100}/100 XP ({xpToNext} XP to next level)
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center text-xl">
                      {level}
                    </div>
                    <div>
                      <p className="text-sm opacity-75">Current Level</p>
                      <p className="text-2xl font-bold">{level}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary text-secondary-content rounded-full w-12 h-12 flex items-center justify-center">
                      <FaFire className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm opacity-75">Day Streak</p>
                      <p className="text-2xl font-bold">{streakDays}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button
                className="btn btn-error gap-2"
                onClick={handleResetXP}
              >
                <FaRedo className="w-5 h-5" />
                Reset Progress
              </button>
              <button
                className="btn btn-ghost gap-2"
                onClick={handleNavigateHome}
              >
                <FaHome className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;