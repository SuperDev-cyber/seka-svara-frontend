import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const CallToAction = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleStartPlaying = () => {
        if (!isAuthenticated) {
            if (window.showToast) {
                window.showToast('Please sign in to access the game lobby', 'warning', 4000);
            }
            return;
        }
        navigate('/gamelobby');
    };

    return (
        <div className='cta-section'>
            <div className='cta-content'>
                <h2 className='cta-title'>Ready to Start Winning?</h2>
                <p className='cta-description'>
                    Join thousands of players competing for real USDT prizes. Connect your wallet and start playing within minutes.
                </p>
                
                <div className='cta-buttons'>
                    <button className='start-playing-btn' onClick={handleStartPlaying}>
                        <svg className='play-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21"/>
                        </svg>
                        Start Playing Now
                    </button>
                    <Link to='/game-rules' className='learn-rules-btn'>
                        Learn Game Rules
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CallToAction;
