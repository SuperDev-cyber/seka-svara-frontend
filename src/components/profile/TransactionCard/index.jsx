import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';

const TransactionCard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('All');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = ['All', 'Bets', 'Winnings', 'Deposits', 'Withdrawals'];

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/wallet/transactions');
            setTransactions(response || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Unknown time';
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
    };

    const formatAddress = (address) => {
        if (!address) return 'N/A';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const getTransactionIcon = (type, status) => {
        if (status === 'pending') return 'clock';
        if (status === 'failed') return 'error';
        return 'check';
    };

    const getTransactionName = (type, description) => {
        if (description) return description;
        switch (type) {
            case 'deposit': return '💰 Deposit SEKA Points';
            case 'withdrawal': return '💸 Withdraw to Wallet';
            case 'game_bet': return '🎲 Game Bet/Wager';
            case 'game_win': return '🏆 Game Winnings';
            case 'game_ante': return '🎯 Ante Paid';
            case 'game_raise': return '📈 Raise Bet';
            case 'game_fold': return '🃏 Fold (Refund)';
            case 'bonus': return '🎁 Bonus Received';
            case 'fee': return '💳 Transaction Fee';
            default: return '📝 Transaction';
        }
    };

    const getTransactionAmount = (type, amount) => {
        const formattedAmount = parseFloat(amount || 0).toFixed(2);
        // Positive transactions (money coming in)
        if (type === 'deposit' || type === 'game_win' || type === 'bonus' || type === 'game_fold') {
            return `+${formattedAmount} SEKA`;
        }
        // Negative transactions (money going out)
        return `-${formattedAmount} SEKA`;
    };

    const getTransactionType = (type) => {
        // Positive transactions (money coming in)
        if (type === 'deposit' || type === 'game_win' || type === 'bonus' || type === 'game_fold') {
            return 'positive';
        }
        // Negative transactions (money going out)
        return 'negative';
    };

    const getIcon = (iconType) => {
        const icons = {
            check: (
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            ),
            clock: (
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            ),
            error: (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            )
        };
        return icons[iconType] || icons.check;
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Bets') {
            return transaction.type === 'game_bet' || 
                   transaction.type === 'game_ante' || 
                   transaction.type === 'game_raise';
        }
        if (activeTab === 'Winnings') {
            return transaction.type === 'game_win' || transaction.type === 'game_fold';
        }
        if (activeTab === 'Deposits') return transaction.type === 'deposit';
        if (activeTab === 'Withdrawals') return transaction.type === 'withdrawal';
        return true;
    });

    if (loading) {
        return (
            <div className='transaction-card'>
                <div className='transaction-header'>
                    <h3 className='transaction-title'>Transaction History</h3>
                    <p className='transaction-subtitle'>Loading your wallet activity...</p>
                </div>
                <div className='transaction-list'>
                    <div className='transaction-item'>
                        <div className='transaction-details'>
                            <span className='transaction-name'>Loading transactions...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='transaction-card'>
            <div className='transaction-header'>
                <h3 className='transaction-title'>🎮 SEKA Betting System Transactions</h3>
                <p className='transaction-subtitle'>All your deposits, bets, and winnings</p>
            </div>

            <div className='transaction-tabs'>
                {tabs.map((tab) => (
                    <button 
                        key={tab}
                        className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className='transaction-list'>
                {filteredTransactions.length === 0 ? (
                    <div className='transaction-item' style={{
                        padding: '40px',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎲</div>
                        <div className='transaction-details'>
                            <span className='transaction-name' style={{ fontSize: '16px', fontWeight: '600' }}>
                                No transactions found
                            </span>
                            <div className='transaction-meta' style={{ marginTop: '8px' }}>
                                <span className='transaction-time' style={{ fontSize: '14px', opacity: 0.7 }}>
                                    {activeTab === 'All' 
                                        ? 'Start playing to see your transaction history' 
                                        : `No ${activeTab.toLowerCase()} transactions yet`}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    filteredTransactions.map((transaction) => (
                        <div key={transaction.id} className='transaction-item' style={{
                            borderLeft: `3px solid ${getTransactionType(transaction.type) === 'positive' ? '#22c55e' : '#ef4444'}`
                        }}>
                            <div className='transaction-icon' style={{
                                background: getTransactionType(transaction.type) === 'positive' 
                                    ? 'rgba(34, 197, 94, 0.1)' 
                                    : 'rgba(239, 68, 68, 0.1)',
                                color: getTransactionType(transaction.type) === 'positive' ? '#22c55e' : '#ef4444'
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    {getIcon(getTransactionIcon(transaction.type, transaction.status))}
                                </svg>
                            </div>
                            <div className='transaction-details'>
                                <span className='transaction-name'>
                                    {getTransactionName(transaction.type, transaction.description)}
                                </span>
                                <div className='transaction-meta'>
                                    <span className='transaction-time'>
                                        {formatTimeAgo(transaction.createdAt)}
                                    </span>
                                    {transaction.gameId && (
                                        <span className='transaction-network' style={{
                                            background: 'rgba(102, 126, 234, 0.2)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px'
                                        }}>
                                            🎯 Game #{transaction.gameId.substring(0, 8)}
                                        </span>
                                    )}
                                    {transaction.network && (transaction.type === 'deposit' || transaction.type === 'withdrawal') && (
                                        <span className='transaction-network'>
                                            {transaction.network}
                                        </span>
                                    )}
                                    {(transaction.fromAddress || transaction.toAddress) && (
                                        <span className='transaction-address'>
                                            {formatAddress(transaction.fromAddress || transaction.toAddress)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={`transaction-amount ${getTransactionType(transaction.type)}`} style={{
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}>
                                {getTransactionAmount(transaction.type, transaction.amount)}
                            </div>
                            <div className={`transaction-status ${transaction.status?.toLowerCase() || 'completed'}`} style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                background: transaction.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' :
                                           transaction.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' :
                                           'rgba(239, 68, 68, 0.2)',
                                color: transaction.status === 'completed' ? '#22c55e' :
                                       transaction.status === 'pending' ? '#f59e0b' :
                                       '#ef4444'
                            }}>
                                {transaction.status || 'Completed'}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionCard;
