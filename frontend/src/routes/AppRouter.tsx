import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from '../pages/IntroPage';
import ProfileSetupPage from '../pages/ProfileSetupPage';
import SwipePage from '../pages/SwipePage';
import ChatPage from '../pages/ChatPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        <Route path="/swipe" element={<SwipePage />} />
        <Route path="/matches" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;