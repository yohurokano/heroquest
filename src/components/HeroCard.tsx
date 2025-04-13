import React from 'react';
import { FaFire, FaGem, FaCrown } from 'react-icons/fa';

type Props = {
  name: string;
  color: string;
  hair: string;
  costume: string;
  showXP?: boolean;
  xp?: number;
  large?: boolean;
  streak?: number;
  gems?: number;
};

const HeroCard: React.FC<Props> = ({ 
  name, 
  color, 
  hair, 
  costume, 
  showXP = false, 
  xp = 0, 
  large = false,
  streak = 0,
  gems = 0
}) => {
  const getChibiSrc = () => {
    const h = hair.toLowerCase();
    const c = costume.toLowerCase().includes('hero') ? 'hero' : 
              costume.toLowerCase().includes('adventurer') ? 'adventurer' :
              costume.toLowerCase().includes('mage') ? 'mage' : 'speedster';
    return `src/assets/chibi/${h}_${c}.png`;
  };

  const level = Math.floor(xp / 100) + 1;
  const currentLevelXP = xp % 100;
  const isMaxLevel = level >= 10;

  return (
    <div className={`card ${large ? 'w-80' : 'w-64'} bg-base-200 shadow-xl mx-auto`}> 
      <div className="card-header flex justify-center p-4" style={{ backgroundColor: color }}>
        <div className="relative">
          <img
            src={getChibiSrc()}
            alt={`${name}'s avatar`}
            onError={(e) => (e.currentTarget.src = '/assets/chibi/default.png')}
            className="w-24 h-24 object-cover rounded-full"
          />
          {streak > 0 && (
            <div className="absolute bottom-0 right-0 bg-warning text-warning-content badge badge-sm gap-1">
              <FaFire /> {streak}
            </div>
          )}
        </div>
      </div>

      <div className="card-body text-center p-4">
        <div className="flex justify-center items-center gap-1 mb-2">
          <h3 className="text-xl font-semibold">{name || 'Unnamed Hero'}</h3>
          {isMaxLevel && <FaCrown className="text-primary" />}
        </div>
        <div className="text-sm">
          <p><span className="font-semibold">Style:</span> {hair}</p>
          <p><span className="font-semibold">Outfit:</span> {costume}</p>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          {gems > 0 && (
            <div className="badge badge-info gap-1">
              <FaGem /> {gems}
            </div>
          )}

          {showXP && (
            <div className="flex items-center gap-1">
              {!isMaxLevel ? (
                <>
                  <span className="badge badge-success">Lvl {level}</span>
                  <progress className="progress progress-success w-24" value={currentLevelXP} max="100"></progress>
                  <span className="text-xs">{currentLevelXP}/100</span>
                </>
              ) : (
                <span className="badge badge-primary gap-1">
                  <FaCrown /> Max Level
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroCard;