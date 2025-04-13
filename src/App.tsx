import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AvatarPage from './pages/AvatarPage';
import MathQuestPage from './pages/MathQuestPage';
import EnglishQuestPage from './pages/EnglishQuestPage';
import ProgressPage from './pages/ProgressPage';
import WordQuestPage from './pages/WordQuestPage';
import ReadingQuestPage from './pages/ReadingQuestPage';
import DailyChallengesPage from './pages/DailyChallengesPages';
import HeroShopPage from './pages/HeroShopPage';
import ProfilePage from './pages/ProfilePage';
import { incrementStreak } from './utils/streakManager'; // Add this import

const App: React.FC = () => {
  // Add this useEffect hook to initialize streak tracking
  useEffect(() => {
    // This will run when the app first loads and check/update the streak
    incrementStreak();
    
    // Optional: You can add any other initialization logic here
    console.log('App initialized - streak checked');
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/avatar" element={<AvatarPage />} />
      <Route path="/math" element={<MathQuestPage />} />
      <Route path="/english" element={<EnglishQuestPage />} />
      <Route path="/word" element={<WordQuestPage />} />
      <Route path="/reading" element={<ReadingQuestPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/daily" element={<DailyChallengesPage />} />
      <Route path="/shop" element={<HeroShopPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default App;