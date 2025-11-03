import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add logout logic here
        console.log('Logging out...');
        // For now, just navigate to home page
        navigate('/');
    };
    
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
            ),
            path: '/admin/dashboard'
        },
        {
            id: 'commission',
            label: 'Commission Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1" fill="none"/>
                </svg>
            ),
            path: '/admin/commission'
        },
        {
            id: 'users',
            label: 'User Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.99-1.51A2.5 2.5 0 0 0 10 8H8.46c-.8 0-1.54.37-2.01.99L4 10.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 12.46 8H14c.8 0 1.54.37 2.01.99L18 10.5V22h2z"/>
                </svg>
            ),
            path: '/admin/users'
        },
        {
            id: 'scores',
            label: 'Score Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
            ),
            path: '/admin/scores'
        },
        {
            id: 'team',
            label: 'Team Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5l-1.99-1.51A2.5 2.5 0 0 0 10 8H8.46c-.8 0-1.54.37-2.01.99L4 10.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 12.46 8H14c.8 0 1.54.37 2.01.99L18 10.5V22h2z"/>
                </svg>
            ),
            path: '/admin/team'
        },
        {
            id: 'transactions',
            label: 'Transaction Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                    <rect x="4" y="6" width="3" height="2" rx="0.5"/>
                </svg>
            ),
            path: '/admin/transactions'
        },
        {
            id: 'tables',
            label: 'Table Management',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="8" width="18" height="12" rx="2"/>
                    <path d="M3 8h18M3 12h18M3 16h18"/>
                    <circle cx="7" cy="10" r="1"/>
                    <circle cx="17" cy="10" r="1"/>
                </svg>
            ),
            path: '/admin/tables'
        },
        {
            id: 'settings',
            label: 'Platform Settings',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
            ),
            path: '/admin/settings'
        },
        {
            id: 'reports',
            label: 'Reports & Analytics',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <rect x="7" y="7" width="3" height="9"/>
                    <rect x="14" y="7" width="3" height="5"/>
                    <rect x="10.5" y="7" width="3" height="7"/>
                </svg>
            ),
            path: '/admin/reports'
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
            ),
            path: '/admin/notifications'
        },
        {
            id: 'security',
            label: 'Security',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
            ),
            path: '/admin/security'
        }
    ];

    return (
        <aside className="admin-sidebar">
            <nav className="admin-nav">
                <div className="admin-nav-items">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <div className="admin-nav-icon">
                                    {item.icon}
                                </div>
                                <span className="admin-nav-label">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
                
                {/* Logout Button */}
                <div className="admin-logout-section">
                    <button 
                        className="admin-logout-btn"
                        onClick={handleLogout}
                    >
                        <div className="admin-logout-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16,17 21,12 16,7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                        </div>
                        <span className="admin-logout-text">Log out</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
