import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaPaintBrush, FaCut, FaTshirt, FaCheck } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../utils/soundManager';
import HeroCard from '../components/HeroCard';

const hairOptions = ['Short', 'Spiky', 'Curly'];
const colorOptions = ['#ffadad', '#ffd6a5', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff'];
const costumeOptions = ['Speedster', 'Hero Uniform', 'Adventurer', 'Mage'];

type AvatarState = {
  name: string;
  color: string;
  hair: string;
  costume: string;
};

type ExpandedSections = {
  name: boolean;
  color: boolean;
  hair: boolean;
  costume: boolean;
};

const AvatarPage: React.FC = () => {
  const [avatar, setAvatar] = useState<AvatarState>({
    name: '',
    color: '#ffadad',
    hair: 'Short',
    costume: 'Speedster',
  });

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    name: true,
    color: true,
    hair: true,
    costume: true
  });

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('hero-avatar');
    if (saved) setAvatar(JSON.parse(saved));
  }, []);

  const updateAvatar = (key: keyof AvatarState, value: string) => {
    playSound('click');
    setAvatar(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('hero-avatar', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleSection = (section: keyof ExpandedSections) => {
    playSound('click');
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-base-100">
      <header className="flex items-center p-4 bg-primary text-primary-content shadow-md">
        <button className="btn btn-circle btn-secondary" onClick={() => navigate('/')}>
          <IoMdArrowRoundBack size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold flex items-center justify-center gap-2">
          <FaUserAlt /> Customize Your Hero
        </h1>
      </header>

      <div className="p-4">
        <HeroCard
          name={avatar.name || 'Your Hero'}
          color={avatar.color}
          hair={avatar.hair}
          costume={avatar.costume}
          large
        />

        <div className="space-y-4 mt-6">
          <section className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" checked={expandedSections.name} onChange={() => toggleSection('name')} />
            <div className="collapse-title text-md font-medium">Hero Name</div>
            <div className="collapse-content">
              <input
                type="text"
                value={avatar.name}
                onChange={e => updateAvatar('name', e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter hero name"
                maxLength={12}
              />
            </div>
          </section>

          <section className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" checked={expandedSections.color} onChange={() => toggleSection('color')} />
            <div className="collapse-title text-md font-medium flex items-center gap-2">
              <FaPaintBrush /> Choose Color
            </div>
            <div className="collapse-content grid grid-cols-3 gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  className={`btn btn-circle ${avatar.color === color ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateAvatar('color', color)}
                >
                  {avatar.color === color && <FaCheck className="text-white" />}
                </button>
              ))}
            </div>
          </section>

          <section className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" checked={expandedSections.hair} onChange={() => toggleSection('hair')} />
            <div className="collapse-title text-md font-medium flex items-center gap-2">
              <FaCut /> Hair Style
            </div>
            <div className="collapse-content flex gap-2">
              {hairOptions.map(h => (
                <button
                  key={h}
                  className={`btn ${avatar.hair === h ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => updateAvatar('hair', h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </section>

          <section className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" checked={expandedSections.costume} onChange={() => toggleSection('costume')} />
            <div className="collapse-title text-md font-medium flex items-center gap-2">
              <FaTshirt /> Costume
            </div>
            <div className="collapse-content flex gap-2">
              {costumeOptions.map(c => (
                <button
                  key={c}
                  className={`btn ${avatar.costume === c ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => updateAvatar('costume', c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>
        </div>

        <button className="btn btn-primary w-full mt-4" onClick={() => navigate('/')}>Save Changes</button>
      </div>
    </div>
  );
};

export default AvatarPage;