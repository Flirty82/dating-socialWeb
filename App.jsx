import Welcome from './pages/Welcome';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import ActivityFeed from './components/ActivityFeed';
import Profile from './components/Profile';

<><><><Route path="/bingo" element={<BingoPage />} /><Route path="/bingo/:id" element={<BingoPage />} /><Route path="/bingo/:id/edit" element={<BingoEditPage />} /></><Route path="/" element={<Welcome />} /></><Routes>
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/activityfeed" element={<ActivityFeed />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/about" element={<About />} />
    <Route path="/games" element={<Games />} />
</Routes></>