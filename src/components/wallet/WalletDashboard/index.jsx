import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import './index.css';

const WalletDashboard = () => {
    const { user } = useAuth();
    const [walletData, setWalletData] = useState(null);
    const [addresses, setAddresses] = useState(null);
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (user) {
            fetchWalletData();
        }
    }, [user]);

    const fetchWalletData = async () => {
        try {
            setIsLoading(true);
            const [walletResponse, addressesResponse, statsResponse, transactionsResponse] = await Promise.all([
                apiService.getWallet(),
                apiService.get('/wallet/addresses'),
                apiService.get('/wallet/stats'),
                apiService.get('/wallet/transactions')
            ]);

            setWalletData(walletResponse);
            setAddresses(addressesResponse);
            setStats(statsResponse);
            setTransactions(transactionsResponse);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
        alert('Address copied to clipboard!');
    };

    const formatAmount = (amount) => {
        return parseFloat(amount).toFixed(8);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (isLoading) {
        return (
            <div className="wallet-dashboard">
                <div className="loading">Loading wallet data...</div>
            </div>
        );
    }

    return (
        <div className="wallet-dashboard">
            <div className="wallet-header">
                <h2>💰 Wallet Dashboard</h2>
                <p>Manage your tokens and view transaction history</p>
            </div>

            <div className="wallet-tabs">
                <button 
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={activeTab === 'addresses' ? 'active' : ''}
                    onClick={() => setActiveTab('addresses')}
                >
                    Deposit Addresses
                </button>
                <button 
                    className={activeTab === 'transactions' ? 'active' : ''}
                    onClick={() => setActiveTab('transactions')}
                >
                    Transactions
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="wallet-overview">
                    <div className="balance-cards">
                        <div className="balance-card total">
                            <h3>Total Balance</h3>
                            <div className="amount">{formatAmount(walletData?.balance || 0)}</div>
                        </div>
                        <div className="balance-card available">
                            <h3>Available</h3>
                            <div className="amount">{formatAmount(walletData?.availableBalance || 0)}</div>
                        </div>
                        <div className="balance-card locked">
                            <h3>Locked</h3>
                            <div className="amount">{formatAmount(walletData?.lockedBalance || 0)}</div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <h4>Total Deposits</h4>
                            <div className="stat-value">{formatAmount(stats?.totalDeposits || 0)}</div>
                        </div>
                        <div className="stat-item">
                            <h4>Total Withdrawals</h4>
                            <div className="stat-value">{formatAmount(stats?.totalWithdrawals || 0)}</div>
                        </div>
                        <div className="stat-item">
                            <h4>Transaction Count</h4>
                            <div className="stat-value">{stats?.transactionCount || 0}</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'addresses' && (
                <div className="wallet-addresses">
                    <div className="address-section">
                        <h3>🔗 BEP20 (BSC) Deposit Address</h3>
                        <div className="address-card">
                            <div className="address-value">{addresses?.BEP20 || 'Generating...'}</div>
                            <button 
                                className="copy-btn"
                                onClick={() => copyToClipboard(addresses?.BEP20)}
                                disabled={!addresses?.BEP20}
                            >
                                📋 Copy
                            </button>
                        </div>
                        <p className="address-note">
                            Send BEP20 tokens to this address. They will be credited to your wallet after confirmation.
                        </p>
                    </div>

                    <div className="address-section">
                        <h3>🔗 TRC20 (Tron) Deposit Address</h3>
                        <div className="address-card">
                            <div className="address-value">{addresses?.TRC20 || 'Generating...'}</div>
                            <button 
                                className="copy-btn"
                                onClick={() => copyToClipboard(addresses?.TRC20)}
                                disabled={!addresses?.TRC20}
                            >
                                📋 Copy
                            </button>
                        </div>
                        <p className="address-note">
                            Send TRC20 tokens to this address. They will be credited to your wallet after confirmation.
                        </p>
                    </div>

                    <div className="withdrawal-section">
                        <h3>💸 Withdraw Tokens</h3>
                        <div className="withdrawal-form">
                            <div className="form-group">
                                <label>Network</label>
                                <select>
                                    <option value="BEP20">BEP20 (BSC)</option>
                                    <option value="TRC20">TRC20 (Tron)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input type="number" placeholder="0.00000000" />
                            </div>
                            <div className="form-group">
                                <label>Destination Address</label>
                                <input type="text" placeholder="Enter destination address" />
                            </div>
                            <button className="withdraw-btn">Withdraw</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="wallet-transactions">
                    <h3>📊 Transaction History</h3>
                    {transactions.length === 0 ? (
                        <div className="no-transactions">No transactions found</div>
                    ) : (
                        <div className="transactions-list">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="transaction-item">
                                    <div className="transaction-info">
                                        <div className="transaction-type">
                                            <span className={`type-badge ${tx.type}`}>
                                                {tx.type.toUpperCase()}
                                            </span>
                                            <span className={`status-badge ${tx.status}`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                        <div className="transaction-amount">
                                            {tx.type === 'deposit' ? '+' : '-'}{formatAmount(tx.amount)}
                                        </div>
                                    </div>
                                    <div className="transaction-details">
                                        <div className="transaction-description">{tx.description}</div>
                                        <div className="transaction-date">{formatDate(tx.createdAt)}</div>
                                        {tx.txHash && (
                                            <div className="transaction-hash">
                                                Hash: {tx.txHash.substring(0, 20)}...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WalletDashboard;
