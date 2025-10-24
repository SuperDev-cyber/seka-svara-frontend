import React from 'react';

const Sidebar = () => {
    return (
        <aside className="support-sidebar">
            <div className="quick-links">
                <h3>Quick Links</h3>
                <button className="quick-link">
                    <span className="ql-icon">🏷️</span>
                    Join a Game
                </button>
                <button className="quick-link">
                    <span className="ql-icon">👛</span>
                    Manage Wallet
                </button>
                <button className="quick-link">
                    <span className="ql-icon">🛡️</span>
                    Security Settings
                </button>
                <button className="quick-link">
                    <span className="ql-icon">📜</span>
                    Terms of Service
                </button>
            </div>

            <div className="contact-card">
                <div className="contact-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <h3>Contact Support</h3>
                </div>
                <p>Can't find what you're looking for? Send us a message.</p>
                <div className="form-row">
                    <div className="form-field">
                        <label className="form-label">Name</label>
                        <input className="input" placeholder="Name" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Email</label>
                        <input className="input" placeholder="Email" />
                    </div>
                </div>
                <div className="form-field">
                    <label className="form-label">Subject</label>
                    <input className="input" placeholder="Subject" />
                </div>
                <div className="form-field">
                    <label className="form-label">Message</label>
                    <textarea className="textarea" rows="4" placeholder="Message" />
                </div>
                <button className="submit-btn">Send Message</button>
            </div>

            <div className="community-card">
                <h3>Community</h3>
                <p>Join our community for updates and discussions</p>
                <div className="community-links">
                    <button className="community-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="community-icon">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Discord Server
                    </button>
                    <button className="community-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="community-icon">
                            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"></path>
                        </svg>
                        Telegram Group
                    </button>
                    <button className="community-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="community-icon">
                            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"></path>
                        </svg>
                        Twitter Updates
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
