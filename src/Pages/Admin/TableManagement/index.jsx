import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import { cleanUsername } from '../../../utils/username';
import './index.css';

const TableManagement = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [tablesData, setTablesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        if (user) {
            fetchTables();
        }
    }, [user, statusFilter]);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const timestamp = new Date().getTime();
            const statusParam = statusFilter !== 'All Status' ? `&status=${statusFilter.toLowerCase()}` : '';
            const response = await apiService.get(`/admin/game-tables?_t=${timestamp}${statusParam}`);
            console.log('✅ Tables data loaded:', response?.tables?.length || 0, 'tables');
            setTablesData(response?.tables || []);
        } catch (error) {
            console.error('Error fetching tables:', error);
            if (window.showToast) {
                window.showToast(`Error loading tables: ${error.message || 'Unknown error'}`, 'error', 5000);
            }
            setTablesData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (table) => {
        setSelectedTable(table);
        setShowDetailsModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedTable(null);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'waiting':
                return '#3B82F6'; // Blue
            case 'playing':
            case 'in_progress':
                return '#10B981'; // Green
            case 'finished':
            case 'completed':
                return '#9CA3AF'; // Gray
            default:
                return '#9CA3AF';
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'waiting':
                return 'Waiting';
            case 'playing':
            case 'in_progress':
                return 'In Progress';
            case 'finished':
            case 'completed':
                return 'Completed';
            default:
                return status || 'Unknown';
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter tables based on search
    const filteredTables = tablesData.filter(table => {
        const matchesSearch = 
            table.tableName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            table.tableId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            table.creator?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            table.creator?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="table-management">
                <div className="table-management-content">
                    <div className="table-management-header">
                        <h1 className="table-management-title">Table Management</h1>
                        <p className="table-management-subtitle">Loading table data...</p>
                    </div>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading tables...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="table-management">
            <div className="table-management-content">
                {/* Header Section */}
                <div className="table-management-header">
                    <h1 className="table-management-title">Table Management</h1>
                    <p className="table-management-subtitle">Monitor all game tables and their activities.</p>
                </div>

                {/* Stats Cards */}
                <div className="table-stats-grid">
                    <div className="table-stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Waiting Tables</p>
                            <h3 className="stat-value">{tablesData.filter(t => t.status === 'waiting').length}</h3>
                        </div>
                    </div>
                    <div className="table-stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Active Games</p>
                            <h3 className="stat-value">{tablesData.filter(t => t.status === 'playing').length}</h3>
                        </div>
                    </div>
                    <div className="table-stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(156, 163, 175, 0.1)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                <path d="M9 11l3 3 8-8"/>
                                <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Completed Games</p>
                            <h3 className="stat-value">{tablesData.filter(t => t.status === 'finished').length}</h3>
                        </div>
                    </div>
                    <div className="table-stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(255, 186, 8, 0.1)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFBA08" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <path d="M3 9h18"/>
                                <path d="M9 3v18"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Tables</p>
                            <h3 className="stat-value">{tablesData.length}</h3>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="table-filters">
                    <div className="filter-search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by table name, ID, or creator..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-dropdown">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option>All Status</option>
                            <option>waiting</option>
                            <option>playing</option>
                            <option>finished</option>
                        </select>
                    </div>
                    <button className="filter-refresh-btn" onClick={fetchTables}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Tables List */}
                <div className="tables-list-container">
                    <table className="tables-table">
                        <thead>
                            <tr>
                                <th>Table ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Creator</th>
                                <th>Players</th>
                                <th>Entry Fee</th>
                                <th>Network</th>
                                <th>Duration</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTables.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                                        No tables found
                                    </td>
                                </tr>
                            ) : (
                                filteredTables.map((table) => (
                                    <tr key={table.tableId}>
                                        <td>
                                            <div className="table-id-cell">
                                                {table.tableId.substring(0, 8)}...
                                            </div>
                                        </td>
                                        <td>
                                            <div className="table-name-cell">
                                                {table.tableName || 'Unnamed Table'}
                                            </div>
                                        </td>
                                        <td>
                                            <span 
                                                className="status-badge" 
                                                style={{ 
                                                    background: `${getStatusColor(table.status)}15`,
                                                    color: getStatusColor(table.status),
                                                    border: `1px solid ${getStatusColor(table.status)}40`
                                                }}
                                            >
                                                {getStatusLabel(table.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="creator-cell">
                                                <div className="creator-name">{cleanUsername(table.creator?.username) || 'Unknown'}</div>
                                                <div className="creator-email">{table.creator?.email || ''}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="players-cell">
                                                {table.currentPlayers}/{table.maxPlayers}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="entry-fee-cell">
                                                {table.entryFee.toLocaleString()} SEKA
                                            </div>
                                        </td>
                                        <td>
                                            <div className="network-cell">
                                                {table.network || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="duration-cell">
                                                {formatDuration(table.gameDuration)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                {formatDate(table.createdAt)}
                                            </div>
                                        </td>
                                        <td>
                                            <button 
                                                className="view-details-btn"
                                                onClick={() => handleViewDetails(table)}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedTable && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Table Details</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="details-section">
                                <h3>Table Information</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Table ID:</span>
                                        <span className="detail-value">{selectedTable.tableId}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Name:</span>
                                        <span className="detail-value">{selectedTable.tableName || 'Unnamed'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Status:</span>
                                        <span className="detail-value">{getStatusLabel(selectedTable.status)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Network:</span>
                                        <span className="detail-value">{selectedTable.network}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Entry Fee:</span>
                                        <span className="detail-value">{selectedTable.entryFee} SEKA</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Players:</span>
                                        <span className="detail-value">{selectedTable.currentPlayers}/{selectedTable.maxPlayers}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Creator:</span>
                                        <span className="detail-value">{cleanUsername(selectedTable.creator?.username) || ''} ({selectedTable.creator?.email})</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Duration:</span>
                                        <span className="detail-value">{formatDuration(selectedTable.gameDuration)}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedTable.game && (
                                <>
                                    <div className="details-section">
                                        <h3>Game Information</h3>
                                        <div className="details-grid">
                                            <div className="detail-item">
                                                <span className="detail-label">Game ID:</span>
                                                <span className="detail-value">{selectedTable.game.gameId}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Game Status:</span>
                                                <span className="detail-value">{selectedTable.game.gameStatus}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Initial Pot:</span>
                                                <span className="detail-value">{selectedTable.game.initialPot} SEKA</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Final Pot:</span>
                                                <span className="detail-value">{selectedTable.game.finalPot} SEKA</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Participants:</span>
                                                <span className="detail-value">{selectedTable.game.participantCount || selectedTable.game.players?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Viewers Tracking */}
                                    {selectedTable.game.cardViewers && selectedTable.game.cardViewers.length > 0 && (
                                        <div className="details-section">
                                            <h3>Card Viewers ({selectedTable.game.cardViewers.length})</h3>
                                            <div className="tracking-list">
                                                {selectedTable.game.cardViewers.map((userId, index) => {
                                                    const player = selectedTable.game.players?.find(p => p.userId === userId);
                                                    return (
                                                        <div key={index} className="tracking-item">
                                                            <span className="tracking-icon">👁️</span>
                                                            <span className="tracking-name">{cleanUsername(player?.username) || userId}</span>
                                                            <span className="tracking-badge">Viewed Cards</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Blind Players Tracking */}
                                    {selectedTable.game.blindPlayers && Object.keys(selectedTable.game.blindPlayers).length > 0 && (
                                        <div className="details-section">
                                            <h3>Blind Bets ({Object.keys(selectedTable.game.blindPlayers).length} players)</h3>
                                            <div className="tracking-list">
                                                {Object.entries(selectedTable.game.blindPlayers).map(([userId, data], index) => {
                                                    const player = selectedTable.game.players?.find(p => p.userId === userId);
                                                    return (
                                                        <div key={index} className="tracking-item">
                                                            <span className="tracking-icon">🎲</span>
                                                            <div className="tracking-details">
                                                                <span className="tracking-name">{cleanUsername(player?.username) || userId}</span>
                                                                <span className="tracking-meta">
                                                                    {data.count} blind bet{data.count > 1 ? 's' : ''} • {data.totalAmount} SEKA
                                                                </span>
                                                            </div>
                                                            <span className="tracking-badge blind">Blind Player</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {selectedTable.game.players && selectedTable.game.players.length > 0 && (
                                        <div className="details-section">
                                            <h3>Players ({selectedTable.game.players.length})</h3>
                                            <div className="players-table-container">
                                                <table className="details-players-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Player</th>
                                                            <th>Position</th>
                                                            <th>Status</th>
                                                            <th>Initial</th>
                                                            <th>Current</th>
                                                            <th>Total Bet</th>
                                                            <th>Winnings</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedTable.game.players.map((player, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="player-info">
                                                                        <div className="player-name">{cleanUsername(player.username)}</div>
                                                                        <div className="player-email">{player.email}</div>
                                                                    </div>
                                                                </td>
                                                                <td>{player.position}</td>
                                                                <td>
                                                                    <span className={`player-status-badge ${player.status}`}>
                                                                        {player.status}
                                                                    </span>
                                                                </td>
                                                                <td>{player.initialBalance} SEKA</td>
                                                                <td>{player.currentBalance} SEKA</td>
                                                                <td>{player.totalBet} SEKA</td>
                                                                <td>
                                                                    <span className={player.isWinner ? 'winnings-positive' : ''}>
                                                                        {player.winnings} SEKA
                                                                        {player.isWinner && ' 🏆'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {selectedTable.game.winners && selectedTable.game.winners.length > 0 && (
                                        <div className="details-section">
                                            <h3>Winners ({selectedTable.game.winners.length})</h3>
                                            <div className="winners-list">
                                                {selectedTable.game.winners.map((winner, index) => (
                                                    <div key={index} className="winner-item">
                                                        <span className="winner-name">{cleanUsername(winner.username)}</span>
                                                        <span className="winner-amount">+{winner.amountWon} SEKA</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableManagement;

