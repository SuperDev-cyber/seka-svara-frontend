import React from 'react';

const HeroSection = () => {
    const items = [
        {
            title: 'Game Rules',
            desc: 'Learn how to play Seka Svara',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="3" width="16" height="18" rx="2"/>
                    <line x1="8" y1="7" x2="16" y2="7"/>
                    <line x1="8" y1="11" x2="16" y2="11"/>
                    <line x1="8" y1="15" x2="13" y2="15"/>
                </svg>
            )
        },
        {
            title: 'Security Guide',
            desc: 'Keep your funds safe',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
            )
        },
        {
            title: 'Contact Support',
            desc: 'Get help from our team',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2h-3l-4 4v-4H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>
                </svg>
            )
        }
    ];

    return (
        <div className="support-hero">
            <h1 className="support-title">Help & Support</h1>
            <p className="support-subtitle">Everything you need to know about playing Seka Svara and managing your account</p>

            <div className="support-grid">
                {items.map((item) => (
                    <div key={item.title} className="support-card">
                        <div className="support-icon">{item.icon}</div>
                        <div className="support-card-title">{item.title}</div>
                        <div className="support-card-desc">{item.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
