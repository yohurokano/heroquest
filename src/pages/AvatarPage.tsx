import React, { useState, useEffect } from 'react';
import styles from './AvatarPage.module.css';
import { FaUserAlt, FaPaintBrush, FaCut, FaTshirt, FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../utils/soundManager';
import HeroCard from '../components/HeroCard';
import BottomNav from '../components/BottomNav';

type Avatar = {
  name: string;
  color: string;
  hair: string;
  costume: string;
};

const hairOptions = ['Short', 'Spiky', 'Curly'];
const colorOptions = ['#ffadad', '#ffd6a5', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff'];
const costumeOptions = ['Speedster', 'Hero Uniform', 'Adventurer', 'Mage'];

const AvatarPage: React.FC = () => {
  const [avatar, setAvatar] = useState<Avatar>({
    name: '',
    color: '#ffadad',
    hair: 'Short',
    costume: 'Speedster',
  });
  const [expandedSections, setExpandedSections] = useState({
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

  const updateAvatar = (key: keyof Avatar, value: string) => {
    playSound('click');
    setAvatar(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('hero-avatar', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    playSound('click');
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
          <FaUserAlt className={styles.titleIcon} />
          Customize Your Hero
        </h1>
      </header>

      {/* Fixed HeroCard that stays at the top */}
      <div className={styles.fixedHeroCard}>
        <HeroCard
          name={avatar.name || 'Your Hero'}
          color={avatar.color}
          hair={avatar.hair}
          costume={avatar.costume}
          large
        />
      </div>

      {/* Scrollable customization sections */}
      <main className={styles.scrollableContent}>
        <section className={styles.customizationSection}>
          <div className={styles.formGroup}>
            <div 
              className={styles.sectionHeader}
              onClick={() => toggleSection('name')}
            >
              <h3 className={styles.sectionTitle}>
                Hero Name
              </h3>
              {expandedSections.name ? (
                <FaChevronUp className={styles.chevronIcon} />
              ) : (
                <FaChevronDown className={styles.chevronIcon} />
              )}
            </div>
            {expandedSections.name && (
              <input
                type="text"
                value={avatar.name}
                onChange={e => updateAvatar('name', e.target.value)}
                className={styles.textInput}
                placeholder="Enter hero name"
                maxLength={12}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <div 
              className={styles.sectionHeader}
              onClick={() => toggleSection('color')}
            >
              <h3 className={styles.sectionTitle}>
                <FaPaintBrush className={styles.sectionIcon} />
                Choose Color
              </h3>
              {expandedSections.color ? (
                <FaChevronUp className={styles.chevronIcon} />
              ) : (
                <FaChevronDown className={styles.chevronIcon} />
              )}
            </div>
            {expandedSections.color && (
              <div className={styles.colorGrid}>
                {colorOptions.map(color => (
                  <button
                    key={color}
                    className={`${styles.colorOption} ${avatar.color === color ? styles.selected : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateAvatar('color', color)}
                  >
                    {avatar.color === color && <FaCheck className={styles.checkIcon} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <div 
              className={styles.sectionHeader}
              onClick={() => toggleSection('hair')}
            >
              <h3 className={styles.sectionTitle}>
                <FaCut className={styles.sectionIcon} />
                Hair Style
              </h3>
              {expandedSections.hair ? (
                <FaChevronUp className={styles.chevronIcon} />
              ) : (
                <FaChevronDown className={styles.chevronIcon} />
              )}
            </div>
            {expandedSections.hair && (
              <div className={styles.optionsGrid}>
                {hairOptions.map(h => (
                  <button
                    key={h}
                    onClick={() => updateAvatar('hair', h)}
                    className={`${styles.optionButton} ${avatar.hair === h ? styles.selected : ''}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <div 
              className={styles.sectionHeader}
              onClick={() => toggleSection('costume')}
            >
              <h3 className={styles.sectionTitle}>
                <FaTshirt className={styles.sectionIcon} />
                Costume
              </h3>
              {expandedSections.costume ? (
                <FaChevronUp className={styles.chevronIcon} />
              ) : (
                <FaChevronDown className={styles.chevronIcon} />
              )}
            </div>
            {expandedSections.costume && (
              <div className={styles.optionsGrid}>
                {costumeOptions.map(c => (
                  <button
                    key={c}
                    onClick={() => updateAvatar('costume', c)}
                    className={`${styles.optionButton} ${avatar.costume === c ? styles.selected : ''}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <button
          className={styles.saveButton}
          onClick={() => {
            playSound('xp');
            navigate('/');
          }}
        >
          Save Changes
        </button>
      </main>
      <BottomNav />
    </div>
  );
};

export default AvatarPage;