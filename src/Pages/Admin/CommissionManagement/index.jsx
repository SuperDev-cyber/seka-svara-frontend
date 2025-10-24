import React, { useState } from 'react';
import walletIcon from '../../../assets/images/wallet-icon.png';
import './index.css';

const CommissionManagement = () => {
    const [commissionRate, setCommissionRate] = useState(2.5);

    const handleCommissionChange = (e) => {
        setCommissionRate(parseFloat(e.target.value));
    };

    const commissionData = [
        {
            id: 'current-rate',
            title: 'Current Commission Rate',
            value: '2.5%',
            subtitle: 'per Transaction',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    <path d="M12 6v6l4 2"/>
                </svg>
            )
        },
        {
            id: 'total-collected',
            title: 'Total Commission Collected',
            value: '$127,850',
            subtitle: 'All time earning',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <rect x="7" y="7" width="3" height="9"/>
                    <rect x="14" y="7" width="3" height="5"/>
                    <rect x="10.5" y="7" width="3" height="7"/>
                </svg>
            )
        },
        {
            id: 'last-withdrawal',
            title: 'Last Withdrawal',
            value: 'Jan 5, 2025',
            subtitle: '$2,500 withdrawn',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
                    <polyline points="9,11 12,8 15,11"/>
                    <line x1="12" y1="8" x2="12" y2="20"/>
                </svg>
            )
        }
    ];

    return (
        <div className="commission-management">
            <div className="commission-content">
                {/* Header Section */}
                <div className="commission-header">
                    <h1 className="commission-title">Commission Management</h1>
                    <p className="commission-subtitle">Manage platform commission settings and withdraw earnings</p>
                </div>

                {/* Original Commission Cards */}
                <div className="commission-cards-grid">
                    {commissionData.map((item) => (
                        <div key={item.id} className="commission-card">
                            <div className="commission-card-header">
                                <h3 className="commission-card-title">{item.title}</h3>
                                <div className="commission-card-icon">
                                    {item.icon}
                                </div>
                            </div>
                            <div className="commission-card-content">
                                <div className="commission-card-value">{item.value}</div>
                                <div className="commission-card-subtitle">{item.subtitle}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Cards Grid */}
                <div className="commission-main-grid">
                    {/* Set Commission Percentage Card */}
                    <div className="commission-main-card">
                        <div className="commission-main-header">
                            <h2 className="commission-main-title">Set Commission Percentage</h2>
                            <p className="commission-main-subtitle">Adjust the platform commission rate for all transactions</p>
                        </div>
                        
                        <div className="commission-rate-display">
                            <span className="commission-rate-label">Commission Rate :</span>
                            <span className="commission-rate-value">{commissionRate}%</span>
                        </div>

                        <div className="commission-slider-container">
                            <div className="commission-slider-labels">
                                <span>0.1%</span>
                                <span>10%</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="10"
                                step="0.1"
                                value={commissionRate}
                                onChange={handleCommissionChange}
                                className="commission-slider"
                            />
                        </div>

                        <div className="commission-impact">
                            <h4 className="commission-impact-title">Estimated Impact</h4>
                            <ul className="commission-impact-list">
                                <li>Based on current volume: ~$3,200/week</li>
                                <li>User fee per $1000 transaction: $25.00</li>
                                <li>Recommended range: 1.5% - 3.5%</li>
                            </ul>
                        </div>

                        <button className="commission-save-btn">Save Change</button>
                    </div>

                    {/* Available Balance Card */}
                    <div className="commission-main-card">
                        <div className="commission-main-header">
                            <h2 className="commission-main-title">Available Balance</h2>
                            <p className="commission-main-subtitle">Withdraw your commission earnings to external wallet</p>
                        </div>

                        <div className="commission-balance-display">
                            <div className="commission-balance-icon">
                                <img src={walletIcon} alt="Wallet" width="48" height="48" />
                            </div>
                            <div className="commission-balance-info">
                                <div className="commission-balance-amount">$18,450</div>
                                <div className="commission-balance-label">Available for withdrawal</div>
                            </div>
                        </div>

                        <div className="commission-monthly-earnings">
                            <div className="commission-earning-item">
                                <span className="commission-earning-label">This Month</span>
                                <span className="commission-earning-value">$8,754</span>
                            </div>
                            <div className="commission-earning-item">
                                <span className="commission-earning-label">Last Month</span>
                                <span className="commission-earning-value">$9,500</span>
                            </div>
                        </div>

                        <button className="commission-withdraw-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"/>
                            </svg>
                            Withdraw Funds
                        </button>
                    </div>
                </div>

                {/* Commission Transaction History */}
                <div className="commission-history-section">
                    <div className="commission-history-header">
                        <h2 className="commission-history-title">Commission Transaction History</h2>
                        <p className="commission-history-subtitle">Track all commission-related transactions and withdrawals</p>
                    </div>
                    
                    <div className="commission-history-table">
                        <div className="commission-table-header">
                            <div className="commission-table-cell">ID</div>
                            <div className="commission-table-cell">Date</div>
                            <div className="commission-table-cell">Amount</div>
                            <div className="commission-table-cell">Type</div>
                            <div className="commission-table-cell">Status</div>
                            <div className="commission-table-cell">Transaction Hash</div>
                        </div>
                        
                        <div className="commission-table-row">
                            <div className="commission-table-cell">Com001</div>
                            <div className="commission-table-cell">2025-01-09</div>
                            <div className="commission-table-cell">$2500</div>
                            <div className="commission-table-cell">
                                <span className="commission-type-badge commission-type-withdraw">Withdraw</span>
                            </div>
                            <div className="commission-table-cell">
                                <span className="commission-status-badge commission-status-completed">Completed</span>
                            </div>
                            <div className="commission-table-cell">0xabc...def</div>
                        </div>
                        
                        <div className="commission-table-row">
                            <div className="commission-table-cell">Com002</div>
                            <div className="commission-table-cell">2025-01-10</div>
                            <div className="commission-table-cell">$3000</div>
                            <div className="commission-table-cell">
                                <span className="commission-type-badge commission-type-withdraw">Withdraw</span>
                            </div>
                            <div className="commission-table-cell">
                                <span className="commission-status-badge commission-status-completed">Completed</span>
                            </div>
                            <div className="commission-table-cell">0xghi...jkl</div>
                        </div>
                        
                        <div className="commission-table-row">
                            <div className="commission-table-cell">Com003</div>
                            <div className="commission-table-cell">2025-01-11</div>
                            <div className="commission-table-cell">$1500</div>
                            <div className="commission-table-cell">
                                <span className="commission-type-badge commission-type-withdraw">Withdraw</span>
                            </div>
                            <div className="commission-table-cell">
                                <span className="commission-status-badge commission-status-completed">Completed</span>
                            </div>
                            <div className="commission-table-cell">0xmno...pqr</div>
                        </div>
                        
                        <div className="commission-table-row">
                            <div className="commission-table-cell">Com004</div>
                            <div className="commission-table-cell">2025-01-12</div>
                            <div className="commission-table-cell">$500</div>
                            <div className="commission-table-cell">
                                <span className="commission-type-badge commission-type-transfer">Transfer</span>
                            </div>
                            <div className="commission-table-cell">
                                <span className="commission-status-badge commission-status-completed">Completed</span>
                            </div>
                            <div className="commission-table-cell">0xstu...vwx</div>
                        </div>
                        
                        <div className="commission-table-row">
                            <div className="commission-table-cell">Com005</div>
                            <div className="commission-table-cell">2025-01-13</div>
                            <div className="commission-table-cell">$2200</div>
                            <div className="commission-table-cell">
                                <span className="commission-type-badge commission-type-withdraw">Withdraw</span>
                            </div>
                            <div className="commission-table-cell">
                                <span className="commission-status-badge commission-status-pending">Pending</span>
                            </div>
                            <div className="commission-table-cell">0xyc...zab</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommissionManagement;
