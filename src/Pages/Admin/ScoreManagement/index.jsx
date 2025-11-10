import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import './index.css';

const ScoreManagement = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;
    
    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editForm, setEditForm] = useState({ amount: 0, type: '', description: '' });
    
    // Delete confirmation state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingTransaction, setDeletingTransaction] = useState(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, page]);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching score management data...');
            
            // Add cache-busting timestamp to force fresh data from server
            const timestamp = new Date().getTime();
            
            // Fetch transactions with cache-busting
            const transactionsResponse = await apiService.get(
                `/admin/score-transactions?page=${page}&limit=${limit}&_t=${timestamp}`
            );
            console.log('✅ Transactions response:', transactionsResponse);
            setTransactions(transactionsResponse.transactions || []);
            setTotal(transactionsResponse.total || 0);

            // Fetch statistics with cache-busting
            const statsResponse = await apiService.get(`/admin/score-statistics?_t=${timestamp}`);
            console.log('✅ Statistics response:', statsResponse);
            setStatistics(statsResponse);
        } catch (error) {
            console.error('❌ Error fetching score data:', error);
            if (window.showToast) {
                window.showToast(`Error loading data: ${error.message || 'Unknown error'}`, 'error', 5000);
            } else {
                alert(`Error loading score data: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'earned':
                return '💰';
            case 'spent':
                return '🛒';
            case 'bonus':
                return '🎁';
            case 'penalty':
                return '⚠️';
            case 'refund':
                return '↩️';
            default:
                return '📝';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'earned':
            case 'bonus':
            case 'refund':
                return 'positive';
            case 'spent':
            case 'penalty':
                return 'negative';
            default:
                return 'neutral';
        }
    };

    // Edit transaction handlers
    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
        setEditForm({
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description || '',
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async () => {
        try {
            console.log('✏️ Updating transaction:', editingTransaction.id, editForm);
            await apiService.put(`/admin/score-transactions/${editingTransaction.id}`, editForm);
            
            if (window.showToast) {
                window.showToast('Transaction updated successfully!', 'success', 3000);
            }
            
            setShowEditModal(false);
            setEditingTransaction(null);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('❌ Error updating transaction:', error);
            if (window.showToast) {
                window.showToast(`Error: ${error.message || 'Failed to update transaction'}`, 'error', 5000);
            }
        }
    };

    // Delete transaction handlers
    const handleDeleteClick = (transaction) => {
        setDeletingTransaction(transaction);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            console.log('🗑️ Deleting transaction:', deletingTransaction.id);
            await apiService.delete(`/admin/score-transactions/${deletingTransaction.id}`);
            
            if (window.showToast) {
                window.showToast('Transaction deleted successfully!', 'success', 3000);
            }
            
            setShowDeleteConfirm(false);
            setDeletingTransaction(null);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('❌ Error deleting transaction:', error);
            if (window.showToast) {
                window.showToast(`Error: ${error.message || 'Failed to delete transaction'}`, 'error', 5000);
            }
        }
    };

    const totalPages = Math.ceil(total / limit);

    if (loading && !transactions.length) {
        return (
            <div className="score-management-container">
                <div className="loading-state" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    fontSize: '24px',
                    color: '#fff'
                }}>
                    <div className="spinner" style={{
                        width: '60px',
                        height: '60px',
                        border: '6px solid rgba(255,255,255,0.1)',
                        borderTopColor: '#4CAF50',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px'
                    }}></div>
                    <p style={{ fontSize: '20px', fontWeight: 'bold' }}>🔄 Loading Score Management Data...</p>
                    <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="score-management-container">
            {/* Header */}
            <div className="score-header">
                <div className="score-header-content">
                    <h1>🏆 Seka-Svara Score Management</h1>
                    <p>Monitor and manage user Seka-Svara Scores and transaction history</p>
                </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="score-statistics">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <div className="stat-value">{statistics.totalUsers}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">💎</div>
                        <div className="stat-content">
                            <div className="stat-value">{statistics.totalScore?.toLocaleString()}</div>
                            <div className="stat-label">Total Seka-Svara Score</div>
                        </div>
                    </div>

                    <div className="stat-card positive">
                        <div className="stat-icon">➕</div>
                        <div className="stat-content">
                            <div className="stat-value">{statistics.totalScoreEarned?.toLocaleString()}</div>
                            <div className="stat-label">Total Earned</div>
                        </div>
                    </div>

                    <div className="stat-card negative">
                        <div className="stat-icon">➖</div>
                        <div className="stat-content">
                            <div className="stat-value">{statistics.totalScoreSpent?.toLocaleString()}</div>
                            <div className="stat-label">Total Spent</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <div className="stat-value">{statistics.totalTransactions}</div>
                            <div className="stat-label">Total Transactions</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="score-transactions-section">
                <div className="section-header">
                    <h2>Score Transactions ({total})</h2>
                    <button className="refresh-button" onClick={fetchData}>
                        🔄 Refresh
                    </button>
                </div>

                <div className="transactions-table-container">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Balance Before</th>
                                <th>Balance After</th>
                                <th>Description</th>
                                <th>Reference</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="no-data" style={{
                                        textAlign: 'center',
                                        padding: '60px 20px',
                                        fontSize: '18px',
                                        color: '#999',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>No Score Transactions Yet</div>
                                        <div style={{ fontSize: '14px' }}>Transactions will appear here when users earn or spend Seka-Svara Scores</div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>
                                            <div className={`transaction-type ${getTypeColor(transaction.type)}`}>
                                                <span className="type-icon">{getTypeIcon(transaction.type)}</span>
                                                <span className="type-text">{transaction.type}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-name">{(transaction.username || '').replace(/_google$/i, '').replace(/_web3$/i, '')}</div>
                                                <div className="user-email">{transaction.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                                                {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                                            </div>
                                        </td>
                                        <td>{transaction.balanceBefore.toLocaleString()}</td>
                                        <td>{transaction.balanceAfter.toLocaleString()}</td>
                                        <td className="description">{transaction.description}</td>
                                        <td>
                                            {transaction.referenceType && (
                                                <div className="reference">
                                                    <span className="reference-type">{transaction.referenceType}</span>
                                                    {transaction.referenceId && (
                                                        <span className="reference-id">
                                                            {transaction.referenceId.substring(0, 8)}...
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="date">{formatDate(transaction.createdAt)}</td>
                                        <td className="actions">
                                            <button
                                                className="action-button edit-button"
                                                onClick={() => handleEditClick(transaction)}
                                                title="Edit transaction"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="action-button delete-button"
                                                onClick={() => handleDeleteClick(transaction)}
                                                title="Delete transaction"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="pagination-button"
                        >
                            ← Previous
                        </button>
                        <span className="pagination-info">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="pagination-button"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Edit Transaction</h3>
                            <button className="close-button" onClick={() => setShowEditModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Amount:</label>
                                <input
                                    type="number"
                                    value={editForm.amount}
                                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Type:</label>
                                <select
                                    value={editForm.type}
                                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                    className="form-select"
                                >
                                    <option value="earned">Earned</option>
                                    <option value="spent">Spent</option>
                                    <option value="bonus">Bonus</option>
                                    <option value="penalty">Penalty</option>
                                    <option value="refund">Refund</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="form-textarea"
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-button" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </button>
                            <button className="submit-button" onClick={handleEditSubmit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🗑️ Delete Transaction</h3>
                            <button className="close-button" onClick={() => setShowDeleteConfirm(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: '16px', marginBottom: '16px' }}>
                                Are you sure you want to delete this transaction?
                            </p>
                            {deletingTransaction && (
                                <div className="delete-info">
                                    <div><strong>User:</strong> {(deletingTransaction.username || '').replace(/_google$/i, '').replace(/_web3$/i, '')}</div>
                                    <div><strong>Amount:</strong> {deletingTransaction.amount}</div>
                                    <div><strong>Type:</strong> {deletingTransaction.type}</div>
                                    <div><strong>Description:</strong> {deletingTransaction.description}</div>
                                </div>
                            )}
                            <p style={{ color: '#ef4444', marginTop: '16px', fontSize: '14px' }}>
                                ⚠️ This action will also adjust the user's Seka-Svara Score and cannot be undone.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </button>
                            <button className="delete-confirm-button" onClick={handleDeleteConfirm}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoreManagement;

