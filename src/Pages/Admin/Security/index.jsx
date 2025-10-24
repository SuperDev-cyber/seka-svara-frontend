import React, { useState } from 'react';
import './index.css';

const Security = () => {
    const admins = [
        { email: 'admin@platform.com', role: 'Super Admin', status: 'Active', twofa: true, lastLogin: '2024-01-07 16:30' },
        { email: 'manager@platform.com', role: 'Manager', status: 'Active', twofa: false, lastLogin: '2024-01-07 14:20' },
        { email: 'support@platform.com', role: 'Support Agent', status: 'Inactive', twofa: true, lastLogin: '2024-01-05 09:15' },
    ];

    const [activeTab, setActiveTab] = useState('admin');

    return (
        <div className="admin-security">
            <div className="admin-security-content">
                <h1 className="sec-title">Security</h1>
                <p className="sec-subtitle">Manage admin access control, authentication settings, and security monitoring.</p>

                <div className="sec-cards">
                    <div className="sec-card">
                        <div className="sec-card-title">Active Admins <span className="ico gold">👥</span></div>
                        <div className="sec-card-value">2</div>
                        <div className="sec-card-sub">Out of 3 total</div>
                    </div>
                    <div className="sec-card">
                        <div className="sec-card-title">2FA Enabled <span className="ico blue">🛡️</span></div>
                        <div className="sec-card-value">2</div>
                        <div className="sec-card-sub">Accounts with 2FA</div>
                    </div>
                    <div className="sec-card">
                        <div className="sec-card-title">Failed Logins <span className="ico red">⚠️</span></div>
                        <div className="sec-card-value">1</div>
                        <div className="sec-card-sub">Last 24 hours</div>
                    </div>
                    <div className="sec-card">
                        <div className="sec-card-title">Security Score <span className="ico gold">🔒</span></div>
                        <div className="sec-card-value">92%</div>
                        <div className="sec-card-sub">Excellent security</div>
                    </div>
                </div>

                <div className="sec-tabbar">
                    <div className="sec-tabs">
                        <button className={`sec-tab ${activeTab==='admin'?'active':''}`} onClick={()=>setActiveTab('admin')}>Admin Access</button>
                        <button className={`sec-tab ${activeTab==='auth'?'active':''}`} onClick={()=>setActiveTab('auth')}>Authentication</button>
                        <button className={`sec-tab ${activeTab==='monitor'?'active':''}`} onClick={()=>setActiveTab('monitor')}>Monitoring</button>
                        <button className={`sec-tab ${activeTab==='protect'?'active':''}`} onClick={()=>setActiveTab('protect')}>Protection</button>
                    </div>
                </div>

                {activeTab === 'admin' && (
                <div className="sec-table-card">
                    <div className="sec-table-header">
                        <div>
                            <div className="sec-table-title">Administrator Accounts</div>
                            <div className="sec-table-sub">Manage admin users and their permissions</div>
                        </div>
                        <button className="sec-add-btn">+ Add Admin</button>
                    </div>
                    <div className="sec-table">
                        <div className="sec-row sec-row-head">
                            <div className="col email">Email</div>
                            <div className="col role">Role</div>
                            <div className="col status">Status</div>
                            <div className="col twofa">2FA</div>
                            <div className="col last">Last Login</div>
                            <div className="col actions">Actions</div>
                        </div>
                        {admins.map((a) => (
                            <div key={a.email} className="sec-row">
                                <div className="col email">{a.email}</div>
                                <div className="col role">{a.role}</div>
                                <div className="col status">
                                    <span className={`badge ${a.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{a.status}</span>
                                </div>
                                <div className="col twofa">
                                    {a.twofa ? (
                                        <span className="twofa-ok" title="2FA enabled">✔</span>
                                    ) : (
                                        <span className="twofa-warn" title="2FA disabled">⚠</span>
                                    )}
                                </div>
                                <div className="col last">{a.lastLogin}</div>
                                <div className="col actions">
                                    <button className="btn-small">Edit</button>
                                    <button className="icon-btn" aria-label="delete">🗑</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {/* Authentication Settings (mocked UI) */}
                {activeTab === 'auth' && (
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-title">Authentication Settings</div>
                        <div className="auth-sub">Configure login security and access controls</div>
                    </div>

                    <div className="auth-row">
                        <div className="auth-labels">
                            <div className="auth-label">Require 2FA for All Admins</div>
                            <div className="auth-help">Enforce two-factor authentication for all admin accounts</div>
                        </div>
                        <label className="auth-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="auth-slider" />
                        </label>
                    </div>

                    <div className="auth-grid">
                        <div className="auth-field">
                            <label className="auth-field-label">Session Timeout (minutes)</label>
                            <input className="auth-input" defaultValue="60" />
                            <div className="auth-field-help">Auto-logout after inactivity (15–480 minutes)</div>
                        </div>
                        <div className="auth-field">
                            <label className="auth-field-label">Max Login Attempts</label>
                            <input className="auth-input" defaultValue="5" />
                            <div className="auth-field-help">Lock account after failed attempts (3–10)</div>
                        </div>
                    </div>

                    <div className="auth-row">
                        <div className="auth-labels">
                            <div className="auth-label">IP Whitelisting</div>
                            <div className="auth-help">Restrict admin access to specific IP addresses</div>
                        </div>
                        <label className="auth-switch">
                            <input type="checkbox" />
                            <span className="auth-slider" />
                        </label>
                    </div>

                    <div className="auth-actions">
                        <button className="auth-save-btn">Save Authentication Settings</button>
                    </div>
                </div>
                )}

                {activeTab === 'monitor' && (
                <div className="monitor-card">
                    <div className="monitor-section">
                        <div className="monitor-header">
                            <div className="monitor-title">Login History</div>
                            <div className="monitor-sub">Monitor admin login activity and detect suspicious behavior</div>
                        </div>
                        <div className="monitor-table">
                            <div className="mrow mhead">
                                <div className="mcol admin">Admin</div>
                                <div className="mcol ip">IP Address</div>
                                <div className="mcol device">Device</div>
                                <div className="mcol location">Location</div>
                                <div className="mcol time">Time</div>
                                <div className="mcol status">Status</div>
                            </div>
                            {[
                                {email:'admin@platform.com', ip:'192.168.1.100', device:'Chrome on Windows', location:'New York, US', time:'2024-01-07 16:30', status:'success'},
                                {email:'manager@platform.com', ip:'10.0.0.50', device:'Safari on macOS', location:'London, UK', time:'2024-01-07 14:20', status:'success'},
                                {email:'admin@platform.com', ip:'203.0.113.1', device:'Firefox on Linux', location:'Unknown', time:'2024-01-07 12:45', status:'failed'},
                                {email:'support@platform.com', ip:'198.51.100.10', device:'Chrome on Android', location:'Toronto, CA', time:'2024-01-05 09:15', status:'success'}
                            ].map((r)=> (
                                <div key={r.email+r.time} className="mrow">
                                    <div className="mcol admin">{r.email}</div>
                                    <div className="mcol ip">{r.ip}</div>
                                    <div className="mcol device">{r.device}</div>
                                    <div className="mcol location">{r.location}</div>
                                    <div className="mcol time">{r.time}</div>
                                    <div className="mcol status"><span className={`pill ${r.status==='success'?'pill-success':'pill-failed'}`}>{r.status==='success'?'Success':'Failed'}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="monitor-section">
                        <div className="monitor-title">Security Alerts</div>
                        <div className="alerts">
                            <div className="alert alert-failed">
                                <div className="alert-title">Failed Login Attempt</div>
                                <div className="alert-desc">Multiple failed login attempts from IP 203.0.113.1</div>
                                <div className="alert-time">2 min ago</div>
                            </div>
                            <div className="alert alert-success">
                                <div className="alert-title">Successful 2FA Setup</div>
                                <div className="alert-desc">manager@platform.com enabled two-factor authentication</div>
                                <div className="alert-time">1 hour ago</div>
                            </div>
                            <div className="alert alert-info">
                                <div className="alert-title">New Login Location</div>
                                <div className="alert-desc">admin@platform.com logged in from new location: London, UK</div>
                                <div className="alert-time">3 hours ago</div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {activeTab === 'protect' && (
                <div className="protect-card">
                    <div className="protect-header">
                        <div className="protect-title">System Protection</div>
                        <div className="protect-sub">Advanced security features and system protection</div>
                    </div>

                    <div className="protect-row">
                        <div className="protect-labels">
                            <div className="protect-label">Audit Logging</div>
                            <div className="protect-help">Log all admin actions and system changes</div>
                        </div>
                        <label className="auth-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="auth-slider" />
                        </label>
                    </div>

                    <div className="protect-grid">
                        <div className="protect-box">
                            <div className="protect-box-title">🔑 Backup Settings</div>
                            <div className="protect-box-sub">Create and manage system backups</div>
                            <button className="protect-btn">Configure Backups</button>
                        </div>
                        <div className="protect-box">
                            <div className="protect-box-title">🚪 Emergency Logout</div>
                            <div className="protect-box-sub">Terminate all active admin sessions</div>
                            <button className="protect-danger">Logout All Sessions</button>
                        </div>
                    </div>

                    <div className="protect-recs">
                        <div className="rec rec-ok">Two-factor authentication enabled</div>
                        <div className="rec rec-ok">Strong password policy enforced</div>
                        <div className="rec rec-warn">Consider enabling IP whitelisting</div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default Security;


