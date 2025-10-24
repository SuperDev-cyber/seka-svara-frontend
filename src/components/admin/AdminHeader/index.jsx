import React from 'react';
import logo from '../../../assets/images/logo.jpg';
import './index.css';

const AdminHeader = () => {
    return (
        <header className="admin-header">
            <div className="admin-header-content">
                {/* Left Section - Logo */}
                <div className="admin-logo">
                    <img src={logo} alt="Seka Svara Logo" className="admin-logo-img" />
                </div>

                {/* Center Section - Search Bar */}
                <div className="admin-search-container">
                    <div className="admin-search-bar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-search-icon">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search users or transactions...."
                            className="admin-search-input"
                        />
                    </div>
                </div>

                {/* Right Section - Icons & User */}
                <div className="admin-header-actions">
                    <div className="admin-user-avatar">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                            alt="Admin User"
                            className="admin-avatar-img"
                        />
                    </div>
                    <button className="admin-action-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </button>
                    <button className="admin-action-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
