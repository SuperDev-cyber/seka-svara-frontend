import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const GameTableCard = ({ table, onJoinTable, onInviteFriends }) => {
    const navigate = useNavigate();

    // Generate table name from ID (e.g., "SOFIA #89")
    const generateTableName = (tableId) => {
        if (!tableId) return 'TABLE #0';
        // Extract a number from the UUID or use a hash
        const hash = tableId.split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0);
        }, 0);
        const tableNumber = (hash % 1000) + 1;
        return `SOFIA #${tableNumber}`;
    };

    // Parse player count (format: "1/6" or "currentPlayers/maxPlayers")
    const parsePlayerCount = (playerCount) => {
        if (typeof playerCount === 'string') {
            const [current, max] = playerCount.split('/').map(Number);
            return { current: current || 0, max: max || 6 };
        }
        return { current: 0, max: 6 };
    };

    // Parse entry fee (format: "1 USDT" or number)
    const parseEntryFee = (entryFee) => {
        if (typeof entryFee === 'string') {
            const match = entryFee.match(/(\d+(?:\.\d+)?)/);
            return match ? parseFloat(match[1]) : 0;
        }
        return entryFee || 0;
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'waiting':
                return 'status-waiting';
            case 'in progress':
            case 'playing':
                return 'status-in-progress';
            default:
                return 'status-waiting';
        }
    };

    // Use tableName if available, otherwise generate from ID
    const tableName = table.tableName || generateTableName(table.id);
    const { current, max } = parsePlayerCount(table.playerCount);
    const entryFee = parseEntryFee(table.entryFee);
    const status = table.status || 'WAITING';

    // Generate seat indicators (occupied vs available)
    const seats = Array.from({ length: max }, (_, index) => ({
        index: index + 1,
        occupied: index < current
    }));

    return (
        <div className='game-table-card-new'>
            {/* Table ID */}
            <div className='table-card-header'>
                <h3 className='table-name'>{tableName}</h3>
                <div className={`status-badge-new ${getStatusClass(status)}`}>
                    {status.toUpperCase()}
                </div>
            </div>

            {/* Divider */}
            <div className='table-card-divider'></div>

            {/* Participation Fee */}
            <div className='participation-fee-section'>
                <span className='min-sum-label'>Min. sum</span>
                <div className='fee-amount'>
                    <span className='chip-icon'>🪙</span>
                    <span className='fee-value'>{entryFee}</span>
                </div>
            </div>

            {/* Divider */}
            <div className='table-card-divider'></div>

            {/* Visual Poker Table with Seats */}
            <div className='poker-table-visual'>
                <div className='table-surface'>
                    <span className='game-type-text'>3 CARD POKER</span>
                    <div className='seats-container'>
                        {seats.map((seat) => (
                            <div
                                key={seat.index}
                                className={`seat-indicator ${seat.occupied ? 'seat-occupied' : 'seat-available'}`}
                                title={seat.occupied ? 'Occupied' : 'Available'}
                            >
                                {seat.occupied ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Player Count */}
            <div className='player-count-section'>
                <span className='player-icon'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </span>
                <span className='player-count-text'>Players {current} of {max}</span>
            </div>

            {/* Join Table Button */}
            <button 
                className='join-table-btn-new' 
                onClick={() => onJoinTable ? onJoinTable(table) : navigate(`/game/${table.id}`, { state: { table } })}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
                Join Table
            </button>
        </div>
    );
};

export default GameTableCard;
