import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActivityFeed from './pages/ActivityFeed';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Friends from './components/Friends';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/feed" element={<ActivityFeed/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/friends" element={<Friends/>}/>
            </Routes>
        </Router>
    );
}

export default App;