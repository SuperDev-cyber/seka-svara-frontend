import React, { useState } from 'react';
import './index.css';

const PlatformSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [platformFee, setPlatformFee] = useState('2.5');
    const [minWithdrawal, setMinWithdrawal] = useState('50');
    const [maxWithdrawal, setMaxWithdrawal] = useState('50000');
    const [bep20Enabled, setBep20Enabled] = useState(true);
    const [trc20Enabled, setTrc20Enabled] = useState(false);

    const Tab = ({ id, icon, label }) => (
        <button
            className={`ps-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
            type="button"
        >
            <span className="ps-tab-icon">{icon}</span>
            <span className="ps-tab-text">{label}</span>
        </button>
    );

    const handleSave = () => {
        // Frontend only: simulate save
        // eslint-disable-next-line no-alert
        alert('Settings saved (frontend demo)');
    };

    const renderGeneral = () => (
        <div className="ps-card">
            <div className="ps-card-header">
                <h2 className="ps-card-title">Platform Configuration</h2>
                <p className="ps-card-subtitle">Configure basic platform settings and transaction limits</p>
            </div>

            <div className="ps-field">
                <label className="ps-label">Platform Fee (%)</label>
                <input className="ps-input" type="number" step="0.1" min="0.1" max="10" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} />
                <p className="ps-help">Fee charged on each transaction (0.1% - 10%)</p>
            </div>

            <div className="ps-grid-2">
                <div className="ps-field">
                    <label className="ps-label">Minimum Withdrawal Limit (USDT)</label>
                    <input className="ps-input" type="number" value={minWithdrawal} onChange={(e) => setMinWithdrawal(e.target.value)} />
                </div>
                <div className="ps-field">
                    <label className="ps-label">Maximum Withdrawal Limit (USDT)</label>
                    <input className="ps-input" type="number" value={maxWithdrawal} onChange={(e) => setMaxWithdrawal(e.target.value)} />
                </div>
            </div>

            <div className="ps-section-sep" />

            <div className="ps-field">
                <label className="ps-label">Supported Networks</label>
                <div className="ps-network-card">
                    <div className="ps-network-left">
                        <span className="ps-dot bep20" />
                        <div className="ps-network-info">
                            <div className="ps-network-name">BEP20 (Binance Smart Chain)</div>
                            <div className="ps-network-desc">USDT on BSC network</div>
                        </div>
                    </div>
                    <label className="ps-switch">
                        <input type="checkbox" checked={bep20Enabled} onChange={(e) => setBep20Enabled(e.target.checked)} />
                        <span className="ps-slider" />
                    </label>
                </div>

                <div className="ps-network-card">
                    <div className="ps-network-left">
                        <span className="ps-dot trc20" />
                        <div className="ps-network-info">
                            <div className="ps-network-name">TRC20 (Tron Network)</div>
                            <div className="ps-network-desc">USDT on Tron network</div>
                        </div>
                    </div>
                    <label className="ps-switch">
                        <input type="checkbox" checked={trc20Enabled} onChange={(e) => setTrc20Enabled(e.target.checked)} />
                        <span className="ps-slider" />
                    </label>
                </div>
            </div>

            <button type="button" className="ps-save-btn" onClick={handleSave}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span>Save Changes</span>
            </button>
        </div>
    );

    const renderNotifications = () => (
        <>
            {/* Overview Header */}
            <div className="ps-notify-overview-header">
                <div>
                    <h2 className="ps-overview-title">Notifications</h2>
                    <p className="ps-overview-subtitle">Manage system alerts, user notifications, and announcements.</p>
                </div>
                <button type="button" className="ps-btn-primary ps-send-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0F17" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    <span>Send Notification</span>
                </button>
            </div>

            {/* Stat Cards */}
            <div className="ps-notify-cards">
                <div className="ps-notify-card">
                    <div className="ps-notify-card-title">Unread Alerts <span className="ps-indicator warn" /></div>
                    <div className="ps-notify-card-value">2</div>
                    <div className="ps-notify-card-sub">System notifications</div>
                </div>
                <div className="ps-notify-card">
                    <div className="ps-notify-card-title">User Requests <span className="ps-indicator bell" /></div>
                    <div className="ps-notify-card-value">2</div>
                    <div className="ps-notify-card-sub">Pending user issues</div>
                </div>
                <div className="ps-notify-card">
                    <div className="ps-notify-card-title">Active Announcements <span className="ps-indicator ok" /></div>
                    <div className="ps-notify-card-value">1</div>
                    <div className="ps-notify-card-sub">Published announcements</div>
                </div>
                <div className="ps-notify-card">
                    <div className="ps-notify-card-title">Total Reach <span className="ps-indicator send" /></div>
                    <div className="ps-notify-card-value">12,847</div>
                    <div className="ps-notify-card-sub">Users reached today</div>
                </div>
            </div>

            {/* Tabs and Filter */}
            <div className="ps-notify-toolbar">
                <div className="ps-pill-tabs">
                    <button type="button" className="ps-pill active">System Alerts</button>
                    <button type="button" className="ps-pill">User Notifications</button>
                    <button type="button" className="ps-pill">Announcements</button>
                </div>
                <div className="ps-notify-filter-select">
                    <select className="ps-notify-select">
                        <option>All Types</option>
                        <option>Alerts</option>
                        <option>Announcements</option>
                        <option>User messages</option>
                    </select>
                    <svg className="ps-notify-select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="6,9 12,15 18,9"/></svg>
                </div>
            </div>
            <div className="ps-grid-2 ps-gap-24">
                <div className="ps-card">
                    <div className="ps-card-header">
                        <h2 className="ps-card-title">Current Announcement</h2>
                        <p className="ps-card-subtitle">Currently published announcement visible to all users</p>
                    </div>
                    <div className="ps-announcement-box">Welcome to our gaming platform! New features are coming soon.</div>
                    <div className="ps-row ps-gap-12">
                        <span className="ps-badge ps-badge-success">Active</span>
                        <span className="ps-muted">Published on platform</span>
                    </div>
                </div>

                <div className="ps-card">
                    <div className="ps-card-header">
                        <h2 className="ps-card-title">Create New Announcement</h2>
                        <p className="ps-card-subtitle">Publish a new announcement to all platform users</p>
                    </div>
                    <div className="ps-field">
                        <label className="ps-label">Announcement Message</label>
                        <textarea className="ps-textarea" maxLength={500} placeholder="Enter your announcement message..." />
                        <p className="ps-help">Maximum 500 characters</p>
                    </div>
                    <button type="button" className="ps-btn-primary">Publish Announcement</button>
                </div>
            </div>

            <div className="ps-card">
                <div className="ps-card-header">
                    <h2 className="ps-card-title">Notification Settings</h2>
                    <p className="ps-card-subtitle">Configure platform notification preferences</p>
                </div>

                <div className="ps-field ps-row ps-align-center ps-between">
                    <div>
                        <div className="ps-section-title">In-App Alerts</div>
                        <div className="ps-section-desc">Enable real-time notifications for critical events</div>
                    </div>
                    <label className="ps-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="ps-slider" />
                    </label>
                </div>

                <div className="ps-section-sep" />

                <div className="ps-notify-grid">
                    <div className="ps-notify-card">
                        <div className="ps-notify-title">User Events</div>
                        <div className="ps-notify-desc">New registrations, deposits, withdrawals</div>
                    </div>
                    <div className="ps-notify-card">
                        <div className="ps-notify-title">System Events</div>
                        <div className="ps-notify-desc">Network issues, maintenance alerts</div>
                    </div>
                    <div className="ps-notify-card">
                        <div className="ps-notify-title">Security Events</div>
                        <div className="ps-notify-desc">Failed logins, suspicious activity</div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderSecurity = () => (
        <>
            <div className="ps-grid-2 ps-gap-24">
                {/* Admin Access Control */}
                <div className="ps-card">
                    <div className="ps-card-header">
                        <h2 className="ps-card-title">Admin Access Control</h2>
                        <p className="ps-card-subtitle">Manage administrator accounts and permissions</p>
                    </div>

                    <div className="ps-admin-row">
                        <div className="ps-admin-info">
                            <div className="ps-admin-name">Super Admin</div>
                            <div className="ps-admin-email">admin@platform.com</div>
                        </div>
                        <span className="ps-badge ps-badge-success">Active</span>
                    </div>

                    <div className="ps-admin-row">
                        <div className="ps-admin-info">
                            <div className="ps-admin-name">Manager</div>
                            <div className="ps-admin-email">manager@platform.com</div>
                        </div>
                        <span className="ps-badge ps-badge-info">Limited</span>
                    </div>

                    <button type="button" className="ps-btn-secondary">Add New Admin</button>
                </div>

                {/* Change Admin Password */}
                <div className="ps-card">
                    <div className="ps-card-header">
                        <h2 className="ps-card-title">Change Admin Password</h2>
                        <p className="ps-card-subtitle">Update your admin account password</p>
                    </div>

                    <div className="ps-field">
                        <label className="ps-label">New Password</label>
                        <input className="ps-input" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="ps-field">
                        <label className="ps-label">Confirm Password</label>
                        <input className="ps-input" type="password" placeholder="Confirm new password" />
                    </div>

                    <button type="button" className="ps-btn-primary">Change Password</button>
                </div>
            </div>

            {/* Security Features */}
            <div className="ps-card">
                <div className="ps-card-header">
                    <h2 className="ps-card-title">Security Features</h2>
                    <p className="ps-card-subtitle">Configure advanced security settings</p>
                </div>

                <div className="ps-sec-row">
                    <div>
                        <div className="ps-section-title">Two-Factor Authentication</div>
                        <div className="ps-section-desc">Require 2FA for admin account access</div>
                    </div>
                    <label className="ps-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="ps-slider" />
                    </label>
                </div>

                <div className="ps-divider" />

                <div className="ps-sec-row">
                    <div>
                        <div className="ps-section-title">IP Whitelisting</div>
                        <div className="ps-section-desc">Restrict admin access to specific IP addresses</div>
                    </div>
                    <label className="ps-switch">
                        <input type="checkbox" />
                        <span className="ps-slider" />
                    </label>
                </div>

                <button type="button" className="ps-btn-primary ps-mt-16">Save Security Settings</button>
            </div>
        </>
    );

    const renderSystem = () => (
        <>
            <div className="ps-card">
                <div className="ps-card-header">
                    <h2 className="ps-card-title">System Information</h2>
                    <p className="ps-card-subtitle">Read-only system status and version information</p>
                </div>

                <div className="ps-sys-grid">
                    <div className="ps-sys-col">
                        <div className="ps-kv">
                            <div className="ps-kv-key">Platform Version</div>
                            <div className="ps-kv-value">v2.1.4</div>
                        </div>
                        <div className="ps-kv">
                            <div className="ps-kv-key">Last Update</div>
                            <div className="ps-kv-value">January 1, 2024</div>
                        </div>
                        <div className="ps-kv">
                            <div className="ps-kv-key">Database Version</div>
                            <div className="ps-kv-value">PostgreSQL 14.2</div>
                        </div>
                    </div>
                    <div className="ps-sys-col">
                        <div className="ps-kv">
                            <div className="ps-kv-key">Server Status</div>
                            <div className="ps-status-inline">
                                <span className="ps-status-dot online" />
                                <span className="ps-kv-value">Online</span>
                            </div>
                        </div>
                        <div className="ps-kv">
                            <div className="ps-kv-key">Uptime</div>
                            <div className="ps-kv-value">99.9%</div>
                        </div>
                        <div className="ps-kv">
                            <div className="ps-kv-key">Environment</div>
                            <span className="ps-env-badge">Production</span>
                        </div>
                    </div>
                </div>

                <div className="ps-section-sep" />

                <div className="ps-kv-key" style={{marginBottom: '12px'}}>Network Status</div>
                <div className="ps-network-status-grid">
                    <div className="ps-network-status-card">
                        <div className="ps-network-left">
                            <span className="ps-dot bep20" />
                            <div className="ps-network-name">Binance Smart Chain</div>
                        </div>
                        <span className="ps-status-badge">Online</span>
                    </div>
                    <div className="ps-network-status-card">
                        <div className="ps-network-left">
                            <span className="ps-dot trc20" />
                            <div className="ps-network-name">Tron Network</div>
                        </div>
                        <span className="ps-status-badge">Online</span>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="platform-settings">
            <div className="platform-settings-content">
                <h1 className="ps-title">Platform Settings</h1>
                <p className="ps-subtitle">Configure game parameters, notifications, and system settings.</p>

                {/* Tabs */}
                <div className="ps-tabs">
                    <Tab id="general" label="General" icon={(
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09c0 .63.38 1.2.97 1.46.54.23 1.16.17 1.64-.16l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.33.48-.39 1.1-.16 1.64.26.59.83.97 1.46.97H22a2 2 0 1 1 0 4h-.09c-.63 0-1.2.38-1.46.97z"/></svg>
                    )} />
                    <Tab id="notifications" label="Notifications" icon={(
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    )} />
                    <Tab id="security" label="Security" icon={(
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    )} />
                    <Tab id="system" label="System Info" icon={(
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>
                    )} />
                </div>
                {activeTab === 'general' && renderGeneral()}
                {activeTab === 'notifications' && renderNotifications()}
                {activeTab === 'security' && renderSecurity()}
                {activeTab === 'system' && renderSystem()}
            </div>
        </div>
    );
};

export default PlatformSettings;


