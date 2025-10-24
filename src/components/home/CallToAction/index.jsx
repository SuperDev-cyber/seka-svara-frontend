import React from 'react';

const CallToAction = () => {
    return (
        <div className='cta-section'>
            <div className='cta-content'>
                <h2 className='cta-title'>Ready to Start Winning?</h2>
                <p className='cta-description'>
                    Join thousands of players competing for real USDT prizes. Connect your wallet and start playing within minutes.
                </p>
                
                <div className='cta-buttons'>
                    <button className='start-playing-btn'>
                        <svg className='play-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21"/>
                        </svg>
                        Start Playing Now
                    </button>
                    <button className='learn-rules-btn'>
                        Learn Game Rules
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallToAction;
