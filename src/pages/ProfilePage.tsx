import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getXP, getLevel } from '../utils/xpManager';
import { getStreak } from '../utils/streakManager';
import { FaUserAlt, FaGem, FaFire, FaTrophy, FaArrowLeft } from 'react-icons/fa';
import HeroCard from '../components/HeroCard';

type Avatar = {
  name: string;
  color: string;
  hair: string;
  costume: string;
};

const ProfilePage: React.FC = () => {
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAvatar = localStorage.getItem('hero-avatar');
    if (savedAvatar) setAvatar(JSON.parse(savedAvatar));
    
    const currentXP = getXP();
    setXp(currentXP);
    setStreak(getStreak());
    setLevel(getLevel(currentXP));
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="navbar bg-base-200 shadow-lg px-4 py-2 fixed top-0 left-0 right-0 z-50">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-2 ml-2">
          <FaUserAlt className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold">Hero Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex flex-col items-center gap-8">
          {avatar && (
            <div className="w-full max-w-md flex justify-center">
              <HeroCard
                name={avatar.name}
                color={avatar.color}
                hair={avatar.hair}
                costume={avatar.costume}
                large
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body flex-row items-center gap-4">
                <FaGem className="text-secondary w-8 h-8" />
                <div>
                  <h3 className="text-sm opacity-75">Total XP</h3>
                  <p className="text-xl font-bold">{xp} points</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg">
              <div className="card-body flex-row items-center gap-4">
                <FaTrophy className="text-warning w-8 h-8" />
                <div>
                  <h3 className="text-sm opacity-75">Level</h3>
                  <p className="text-xl font-bold">{level}</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg">
              <div className="card-body flex-row items-center gap-4">
                <FaFire className="text-error w-8 h-8" />
                <div>
                  <h3 className="text-sm opacity-75">Current Streak</h3>
                  <p className="text-xl font-bold">{streak} days</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary max-w-xs w-full"
            onClick={() => navigate('/avatar')}
          >
            Edit Hero
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;