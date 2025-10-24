import React from 'react';
import './index.css';

const Notifications = () => {
    return (
        <div className="admin-notify">
            <div className="admin-notify-content">
                <div className="notify-header">
                    <div>
                        <h1 className="notify-title">Notifications</h1>
                        <p className="notify-subtitle">Manage system alerts, user notifications, and announcements.</p>
                    </div>
                    <button className="notify-send-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0F17" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                        <span>Send Notification</span>
                    </button>
                </div>

                <div className="notify-cards">
                    <div className="notify-card">
                        <div className="notify-card-title">Unread Alerts <span className="dot warn" /></div>
                        <div className="notify-card-value">2</div>
                        <div className="notify-card-sub">System notifications</div>
                    </div>
                    <div className="notify-card">
                        <div className="notify-card-title">User Requests <span className="dot bell" /></div>
                        <div className="notify-card-value">2</div>
                        <div className="notify-card-sub">Pending user issues</div>
                    </div>
                    <div className="notify-card">
                        <div className="notify-card-title">Active Announcements <span className="dot ok" /></div>
                        <div className="notify-card-value">1</div>
                        <div className="notify-card-sub">Published announcements</div>
                    </div>
                    <div className="notify-card">
                        <div className="notify-card-title">Total Reach <span className="dot send" /></div>
                        <div className="notify-card-value">12,847</div>
                        <div className="notify-card-sub">Users reached today</div>
                    </div>
                </div>

                <div className="notify-toolbar">
                    <div className="pill-tabs">
                        <button className="pill active">System Alerts</button>
                        <button className="pill">User Notifications</button>
                        <button className="pill">Announcements</button>
                    </div>
                    <div className="notify-filter-select">
                        <select>
                            <option>All Types</option>
                            <option>Alerts</option>
                            <option>Announcements</option>
                            <option>User messages</option>
                        </select>
                    </div>
                </div>
                
                <div className="notify-section">
                    <div className="notify-section-header">
                        <div className="notify-section-title">System Alerts</div>
                        <div className="notify-section-sub">Platform errors, warnings, and system notifications</div>
                    </div>

                    <div className="notify-list">
                        {/* Item 1 */}
                        <div className="notify-item">
                            <div className="notify-item-left">
                                <span className="notify-icon error">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
                                </span>
                                <div>
                                    <div className="notify-item-title">Deposit Processing Error <span className="sev sev-high">high</span> <span className="dot ok" /></div>
                                    <div className="notify-item-desc">Multiple deposit transactions failed due to network congestion on BSC</div>
                                    <div className="notify-item-time">2024-01-07 15:45</div>
                                </div>
                            </div>
                            <div className="notify-item-actions">
                                <button className="notify-btn">Mark Read</button>
                                <button className="notify-icon-btn" aria-label="delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="notify-item">
                            <div className="notify-item-left">
                                <span className="notify-icon warn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
                                </span>
                                <div>
                                    <div className="notify-item-title">High Volume Alert <span className="sev sev-medium">medium</span> <span className="dot ok" /></div>
                                    <div className="notify-item-desc">Transaction volume is 150% above normal, monitor system performance</div>
                                    <div className="notify-item-time">2024-01-07 14:20</div>
                                </div>
                            </div>
                            <div className="notify-item-actions">
                                <button className="notify-btn">Mark Read</button>
                                <button className="notify-icon-btn" aria-label="delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="notify-item">
                            <div className="notify-item-left">
                                <span className="notify-icon info">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>
                                </span>
                                <div>
                                    <div className="notify-item-title">Scheduled Maintenance <span className="sev sev-low">low</span></div>
                                    <div className="notify-item-desc">Planned maintenance window scheduled for tonight 2:00–4:00 AM UTC</div>
                                    <div className="notify-item-time">2024-01-07 12:00</div>
                                </div>
                            </div>
                            <div className="notify-item-actions">
                                <button className="notify-btn">Mark Read</button>
                                <button className="notify-icon-btn" aria-label="delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="notify-item">
                            <div className="notify-item-left">
                                <span className="notify-icon success">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                </span>
                                <div>
                                    <div className="notify-item-title">System Update Complete <span className="sev sev-low">low</span></div>
                                    <div className="notify-item-desc">Platform successfully updated to version 2.1.4 with new features</div>
                                    <div className="notify-item-time">2024-01-07 10:30</div>
                                </div>
                            </div>
                            <div className="notify-item-actions">
                                <button className="notify-btn">Mark Read</button>
                                <button className="notify-icon-btn" aria-label="delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;


