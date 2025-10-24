import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const quickLinks = [
        { name: 'Home', path: '/', icon: '🏠' },
        { name: 'Game Lobby', path: '/gamelobby', icon: '🎮' },
        { name: 'Profile', path: '/profile', icon: '👤' },
        { name: 'Marketplace', path: '/marketplace', icon: '🛒' }
    ];

    return (
        <div className="not-found-page">
            <div className="not-found-container">
                {/* Background Animation */}
                <div className="background-animation">
                    <div className="floating-card card-1">🃏</div>
                    <div className="floating-card card-2">🃏</div>
                    <div className="floating-card card-3">🃏</div>
                    <div className="floating-card card-4">🃏</div>
                    <div className="floating-card card-5">🃏</div>
                </div>

                {/* Main Content */}
                <div className="not-found-content">
                    {/* 404 Number */}
                    <div className="error-number">
                        <span className="number-4">4</span>
                        <span className="number-0">0</span>
                        <span className="number-4">4</span>
                    </div>

                    {/* Error Message */}
                    <div className="error-message">
                        <h1 className="error-title">Oops! Page Not Found</h1>
                        <p className="error-description">
                            The page you're looking for seems to have vanished into the digital void. 
                            Don't worry, even the best players sometimes draw the wrong card!
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="primary-button" onClick={handleGoHome}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9,22 9,12 15,12 15,22"/>
                            </svg>
                            Go Home
                        </button>
                        <button className="secondary-button" onClick={handleGoBack}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5"/>
                                <polyline points="12,19 5,12 12,5"/>
                            </svg>
                            Go Back
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="quick-links">
                        <h3 className="quick-links-title">Quick Navigation</h3>
                        <div className="quick-links-grid">
                            {quickLinks.map((link, index) => (
                                <button
                                    key={index}
                                    className="quick-link-item"
                                    onClick={() => navigate(link.path)}
                                >
                                    <span className="quick-link-icon">{link.icon}</span>
                                    <span className="quick-link-name">{link.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="help-section">
                        <div className="help-card">
                            <div className="help-icon">❓</div>
                            <div className="help-content">
                                <h4>Still Lost?</h4>
                                <p>If you think this is a mistake, please contact our support team.</p>
                                <button className="help-button" onClick={() => navigate('/support')}>
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="fun-facts">
                        <h3>Did You Know?</h3>
                        <div className="fact-item">
                            <span className="fact-icon">🎲</span>
                            <p>Seka Svara is a traditional card game that originated in India and is now played worldwide!</p>
                        </div>
                        <div className="fact-item">
                            <span className="fact-icon">🏆</span>
                            <p>The highest possible score in Seka Svara is 9, and the game is all about getting as close as possible!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
