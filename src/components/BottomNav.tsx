import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaUserEdit, FaBook, FaGem
} from 'react-icons/fa';
import styles from './BottomNav.module.css';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome />, activePaths: ['/'] },
    { path: '/avatar', label: 'Hero', icon: <FaUserEdit />, activePaths: ['/avatar'] },
    { path: '/daily', label: 'Quests', icon: <FaBook />, activePaths: ['/daily', '/math', '/english', '/reading', '/word'] },
    { path: '/shop', label: 'Shop', icon: <FaGem />, activePaths: ['/shop'] },
  ];

  const isActive = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => {
        const active = isActive(item.activePaths);
        return (
          <button
            key={item.path}
            className={`${styles.navItem} ${active ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
            aria-current={active ? 'page' : undefined}
          >
            <div className={styles.iconContainer}>
              {React.cloneElement(item.icon, {
                className: `${styles.icon} ${active ? styles.activeIcon : ''}`
              })}
            </div>
            <span className={styles.label}>{item.label}</span>
            {active && <div className={styles.activeIndicator}></div>}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;