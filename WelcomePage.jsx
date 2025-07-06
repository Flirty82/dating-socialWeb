import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';
import logo from '../assets/logo.png';
import { useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const WelcomePage = () => {
    <div className="welcome-page">
        <h1>Welcome to Flirting Singles!</h1>
        <p className="tagline">We're bringing the change that you've been craving!</p>
        <div className="welcome-buttons">
            <Link to="/game" className="btn">Explore Games</Link>
            <Link to="/login" className="btn">Log in to your account</Link>
            <Link to="signup" className="btn light">Don't have an account?  Signup</Link>
        </div>
    </div>
};

const Welcome = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === 'loading') {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [navigation.state]);

    return (
        <div className="welcome-container">
            {isLoading ? (
                <div className="loading">Loading...</div>
            ) : (
                <WelcomePage />
            )}
        </div>
    );
}

useEffect(() => {
    // Simulate fetching the logged-in user data - use actual logged-in-user at production or deployment
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        username: "FlirtingQueen", // Replace with real database logic
        isProfileComplete(false)
    };
    set(loggedInUser);
}, []);

const handleNext = () => {
    NavigationHistoryEntry(user.isProfileComplete ? '/feed' : '/profile');
};

return (
    <div className="welcome-container">
        <h2>Welcome to Flirting Singles!</h2>
        <p>Thank you for joining us on this exciting new journey!  If you need help we are 
            available 24/7.
        </p>
        <button onClick={handleNext}>
            {user.isProfileComplete ? "Go to Feed" : "Complete Your Profile"}
        </button>
        
    </div>
);

export default Welcome;