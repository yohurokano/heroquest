import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserEdit, FaBook, FaGem } from 'react-icons/fa';

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
    <nav className="fixed bottom-0 left-0 right-0 bg-base-100 shadow-md py-2 px-4 flex justify-around border-t border-base-200">
      {navItems.map((item) => {
        const active = isActive(item.activePaths);
        return (
          <button
            key={item.path}
            className={`flex flex-col items-center text-xs ${active ? 'text-primary' : 'text-base-content'}`}
            onClick={() => navigate(item.path)}
            aria-current={active ? 'page' : undefined}
          >
            <div className={`text-xl ${active ? 'text-primary' : 'text-base-content'}`}>
              {item.icon}
            </div>
            <span>{item.label}</span>
            {active && <div className="h-1 w-4 rounded bg-primary mt-1"></div>}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;