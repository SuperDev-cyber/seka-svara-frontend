import React from 'react';

const HowItWorksSection = () => {
    return (
        <div className='how-it-works-section'>
            <div className='how-it-works-content'>
                <h2 className='how-it-works-title'>How Seka Svara Works</h2>
                <p className='how-it-works-description'>
                    A fast-paced 3-card game where strategy meets luck. Each player receives 3 cards, makes their bets, and the best hand takes the entire pot.
                </p>
                
                <div className='steps-container'>
                    <div className='step-card'>
                        <div className='step-number'>1</div>
                        <div className='step-icon'>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                                <line x1="10" y1="9" x2="14" y2="9"/>
                            </svg>
                        </div>
                        <h3 className='step-title'>Connect Wallet</h3>
                        <p className='step-description'>Connect your crypto wallet to get started</p>
                    </div>

                    <div className='step-card'>
                        <div className='step-number'>2</div>
                        <div className='step-icon'>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <line x1="9" y1="9" x2="15" y2="9"/>
                                <line x1="9" y1="15" x2="15" y2="15"/>
                            </svg>
                        </div>
                        <h3 className='step-title'>Join a Table</h3>
                        <p className='step-description'>Choose your stakes and find the perfect table</p>
                    </div>

                    <div className='step-card'>
                        <div className='step-number'>3</div>
                        <div className='step-icon'>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                                <path d="M4 22h16"/>
                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21l-2.5 1.1c-.5.22-1.03.22-1.53 0l-2.5-1.1C2.47 17.98 2 17.55 2 17v-2.34"/>
                                <path d="M22 14.66V17c0 .55-.47.98-.97 1.21l-2.5 1.1c-.5.22-1.03.22-1.53 0l-2.5-1.1C14.47 17.98 14 17.55 14 17v-2.34"/>
                                <path d="M6 6h12"/>
                                <path d="M6 10h12"/>
                            </svg>
                        </div>
                        <h3 className='step-title'>Win the Pot</h3>
                        <p className='step-description'>Play your cards right and take home the winnings</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksSection;
