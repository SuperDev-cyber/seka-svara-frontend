import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import './index.css';

const TransactionManagement = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All type');
    const [networkFilter, setNetworkFilter] = useState('All Network');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [minAmount, setMinAmount] = useState('0');
    const [maxAmount, setMaxAmount] = useState('No Limit');
    const [transactionData, setTransactionData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchTransactionData();
        }
    }, [user]);

    const fetchTransactionData = async () => {
        try {
            setLoading(true);
            const [statsResponse, transactionsResponse] = await Promise.all([
                apiService.get('/admin/transaction-stats'),
                apiService.get('/admin/transactions')
            ]);

            setTransactionData(statsResponse || []);
            setTransactionsData(transactionsResponse || []);
        } catch (error) {
            console.error('Error fetching transaction data:', error);
            // Fallback to static data if API fails
            setTransactionData(getStaticTransactionData());
            setTransactionsData(getStaticTransactionsData());
        } finally {
            setLoading(false);
        }
    };

    const getStaticTransactionData = () => [
        {
            id: 'total-deposits',
            title: 'Total Deposits',
            value: '$198,750',
            subtitle: 'All-time deposits',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <rect x="7" y="7" width="3" height="9"/>
                    <rect x="14" y="7" width="3" height="5"/>
                    <rect x="10.5" y="7" width="3" height="7"/>
                    <text x="12" y="16" fontSize="8" fill="currentColor" textAnchor="middle">$</text>
                </svg>
            )
        },
        {
            id: 'total-withdrawals',
            title: 'Total Withdrawals',
            value: '$156,320',
            subtitle: 'All-time withdrawals',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <rect x="7" y="7" width="3" height="9"/>
                    <rect x="14" y="7" width="3" height="5"/>
                    <rect x="10.5" y="7" width="3" height="7"/>
                    <text x="12" y="16" fontSize="8" fill="currentColor" textAnchor="middle">$</text>
                </svg>
            )
        },
        {
            id: 'todays-volume',
            title: "Today's Volume",
            value: '$12,750',
            subtitle: 'Vs yesterday',
            change: '+8%',
            changeType: 'positive',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <rect x="7" y="7" width="3" height="9"/>
                    <rect x="14" y="7" width="3" height="5"/>
                    <rect x="10.5" y="7" width="3" height="7"/>
                    <text x="12" y="16" fontSize="8" fill="currentColor" textAnchor="middle">$</text>
                </svg>
            )
        }
    ];

    const getStaticTransactionsData = () => [
        {
            id: 'TXN001',
            user: 'John doe',
            amount: '$2500',
            amountType: 'deposit',
            type: 'Deposit',
            network: 'TRON',
            status: 'Completed',
            date: '2024-01-07 14:32'
        },
        {
            id: 'TXN002',
            user: 'Jane Smith',
            amount: '$1500',
            amountType: 'withdrawal',
            type: 'Withdrawal',
            network: 'BSC',
            status: 'Pending',
            date: '2024-01-08 09:15'
        },
        {
            id: 'TXN003',
            user: 'Alice Johnson',
            amount: '$3200',
            amountType: 'deposit',
            type: 'Deposit',
            network: 'BSC',
            status: 'Completed',
            date: '2024-01-09 10:00'
        },
        {
            id: 'TXN004',
            user: 'Bob Brown',
            amount: '$500',
            amountType: 'withdrawal',
            type: 'Withdrawal',
            network: 'TRON',
            status: 'Failed',
            date: '2024-01-10 11:45'
        },
        {
            id: 'TXN005',
            user: 'Charlie White',
            amount: '$1800',
            amountType: 'deposit',
            type: 'Deposit',
            network: 'BSC',
            status: 'Completed',
            date: '2024-01-11 16:20'
        }
    ];


    const getTypeColor = (type) => {
        switch (type) {
            case 'Deposit':
                return '#10B981';
            case 'Withdrawal':
                return '#3B82F6';
            default:
                return '#9CA3AF';
        }
    };

    const getNetworkColor = (network) => {
        switch (network) {
            case 'TRON':
                return '#FF6B35';
            case 'BSC':
                return '#F0B90B';
            default:
                return '#9CA3AF';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return '#10B981';
            case 'Pending':
                return '#3B82F6';
            case 'Failed':
                return '#EF4444';
            default:
                return '#9CA3AF';
        }
    };

    // Filter transactions based on search and filters
    const filteredTransactions = transactionsData.filter(transaction => {
        const matchesSearch = transaction.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All type' || transaction.type === typeFilter;
        const matchesNetwork = networkFilter === 'All Network' || transaction.network === networkFilter;
        const matchesStatus = statusFilter === 'All Status' || transaction.status === statusFilter;
        
        const amount = parseFloat(transaction.amount?.replace(/[^0-9.]/g, '') || 0);
        const minAmountNum = parseFloat(minAmount || 0);
        const maxAmountNum = maxAmount === 'No Limit' ? Infinity : parseFloat(maxAmount || 0);
        const matchesAmount = amount >= minAmountNum && amount <= maxAmountNum;
        
        return matchesSearch && matchesType && matchesNetwork && matchesStatus && matchesAmount;
    });

    // Totals for summary (can later be tied to filters)
    const summarize = () => {
        const depositSum = filteredTransactions
            .filter(t => t.type === 'Deposit')
            .reduce((sum, t) => sum + Number((t.amount || '0').replace(/[^0-9.]/g, '')), 0);
        const withdrawalSum = filteredTransactions
            .filter(t => t.type === 'Withdrawal')
            .reduce((sum, t) => sum + Number((t.amount || '0').replace(/[^0-9.]/g, '')), 0);
        const totalCount = filteredTransactions.length;
        return { depositSum, withdrawalSum, totalCount };
    };
    const { depositSum, withdrawalSum, totalCount } = summarize();

    if (loading) {
        return (
            <div className="transaction-management">
                <div className="transaction-management-content">
                    <div className="transaction-management-header">
                        <h1 className="transaction-management-title">Transaction Management</h1>
                        <p className="transaction-management-subtitle">Loading transaction data...</p>
                    </div>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading transactions...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="transaction-management">
            <div className="transaction-management-content">
                {/* Header Section */}
                <div className="transaction-management-header">
                    <h1 className="transaction-management-title">Transaction Management</h1>
                    <p className="transaction-management-subtitle">Monitor and export all platform financial activity.</p>
                </div>

                {/* Transaction Cards Grid */}
                <div className="transaction-cards-grid">
                    {transactionData.map((item) => (
                        <div key={item.id} className="transaction-card">
                            <div className="transaction-card-header">
                                <h3 className="transaction-card-title">{item.title}</h3>
                                <div className="transaction-card-icon">
                                    {item.icon}
                                </div>
                            </div>
                            <div className="transaction-card-content">
                                <div className="transaction-card-value">{item.value}</div>
                                <div className="transaction-card-subtitle">
                                    {item.change && (
                                        <div className="transaction-change">
                                            <svg className="transaction-change-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
                                            </svg>
                                            <span className={`transaction-change-text ${item.changeType}`}>
                                                {item.change}
                                            </span>
                                        </div>
                                    )}
                                    <span className="transaction-subtitle-text">{item.subtitle}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search and Filter Section */}
                <div className="transaction-search-filter-section">
                    <div className="transaction-search-filters-container">
                        <div className="transaction-search-container">
                            <div className="transaction-search-input-wrapper">
                                <svg className="transaction-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="M21 21l-4.35-4.35"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by User, ID, or hash...."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="transaction-search-input"
                                />
                            </div>
                        </div>
                        
                        <div className="transaction-filters-row">
                            <div className="transaction-filter-dropdown">
                                <select 
                                    value={typeFilter} 
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="transaction-filter-select"
                                >
                                    <option value="All type">All type</option>
                                    <option value="Deposit">Deposit</option>
                                    <option value="Withdrawal">Withdrawal</option>
                                </select>
                                <svg className="transaction-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6,9 12,15 18,9"/>
                                </svg>
                            </div>

                            <div className="transaction-filter-dropdown">
                                <select 
                                    value={networkFilter} 
                                    onChange={(e) => setNetworkFilter(e.target.value)}
                                    className="transaction-filter-select"
                                >
                                    <option value="All Network">All Network</option>
                                    <option value="TRON">TRON</option>
                                    <option value="BSC">BSC</option>
                                </select>
                                <svg className="transaction-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6,9 12,15 18,9"/>
                                </svg>
                            </div>

                            <div className="transaction-filter-dropdown">
                                <select 
                                    value={statusFilter} 
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="transaction-filter-select"
                                >
                                    <option value="All Status">All Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Failed">Failed</option>
                                </select>
                                <svg className="transaction-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6,9 12,15 18,9"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="transaction-amount-filters">
                        <div className="transaction-amount-input-group">
                            <label className="transaction-amount-label">Min Amount (USD)</label>
                            <input
                                type="text"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                                className="transaction-amount-input"
                            />
                        </div>
                        <div className="transaction-amount-input-group">
                            <label className="transaction-amount-label">Max Amount (USD)</label>
                            <input
                                type="text"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                className="transaction-amount-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Transactions Table Section */}
                <div className="transaction-table-section">
                    <div className="transaction-table-header">
                        <h2 className="transaction-table-title">Transactions ({transactionsData.length})</h2>
                        <p className="transaction-table-subtitle">All platform financial transactions</p>
                    </div>
                    
                    <div className="transaction-table-container">
                        <div className="transaction-table">
                            {/* Table Header */}
                            <div className="transaction-table-header-row">
                                <div className="transaction-table-cell transaction-header-cell">Trans ID</div>
                                <div className="transaction-table-cell transaction-header-cell">User</div>
                                <div className="transaction-table-cell transaction-header-cell">Amount</div>
                                <div className="transaction-table-cell transaction-header-cell">Type</div>
                                <div className="transaction-table-cell transaction-header-cell">Network</div>
                                <div className="transaction-table-cell transaction-header-cell">Status</div>
                                <div className="transaction-table-cell transaction-header-cell">Date</div>
                            </div>

                            {/* Table Rows */}
                            {filteredTransactions.map((transaction) => (
                                <div key={transaction.id} className="transaction-table-row">
                                    <div className="transaction-table-cell transaction-id-cell">
                                        {transaction.id}
                                    </div>
                                    <div className="transaction-table-cell transaction-user-cell">
                                        {transaction.user}
                                    </div>
                                    <div className={`transaction-table-cell transaction-amount-cell ${transaction.amountType}`}>
                                        {transaction.amount}
                                    </div>
                                    <div className="transaction-table-cell transaction-type-cell">
                                        <span 
                                            className="transaction-type-badge"
                                            style={{ backgroundColor: getTypeColor(transaction.type) }}
                                        >
                                            {transaction.type}
                                        </span>
                                    </div>
                                    <div className="transaction-table-cell transaction-network-cell">
                                        <span 
                                            className="transaction-network-badge"
                                            style={{ backgroundColor: getNetworkColor(transaction.network) }}
                                        >
                                            {transaction.network}
                                        </span>
                                    </div>
                                    <div className="transaction-table-cell transaction-status-cell">
                                        <span 
                                            className="transaction-status-badge"
                                            style={{ backgroundColor: getStatusColor(transaction.status) }}
                                        >
                                            {transaction.status}
                                        </span>
                                    </div>
                                    <div className="transaction-table-cell transaction-date-cell">
                                        {transaction.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transaction Summary Section */}
                <div className="transaction-summary-section">
                    <div className="transaction-summary-header">
                        <h2 className="transaction-summary-title">Transaction Summary</h2>
                        <p className="transaction-summary-subtitle">Quick overview of filtered transactions</p>
                    </div>

                    <div className="transaction-summary-grid">
                        <div className="summary-card">
                            <div className="summary-value positive">${depositSum.toLocaleString()}</div>
                            <div className="summary-label">Total Deposits</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-value negative">${withdrawalSum.toLocaleString()}</div>
                            <div className="summary-label">Total Withdrawals</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-value positive">{String(totalCount).padStart(2, '0')}</div>
                            <div className="summary-label">Total Transactions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionManagement;
