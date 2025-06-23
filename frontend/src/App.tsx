import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import MainPage from './components/MainPage'; // 既存のApp内容をMainPageに移す想定
import Analysis from './components/Analysis'; // 年率リターン分析のコンポーネント

export const App: React.FC = () => {
  return (
    <Router>
      <nav style={{ padding: 10, backgroundColor: '#eee' }}>
        <Link to="/" style={{ marginRight: 15 }}>株価チャート</Link>
        <Link to="/analysis">年率リターン分析</Link>
      </nav>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
};
