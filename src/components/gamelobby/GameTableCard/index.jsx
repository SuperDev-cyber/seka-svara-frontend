import React from 'react';
import { useNavigate } from 'react-router-dom';
// Import avatar images
import avatar1 from '../../../assets/images/user-avatars/avatar1.png';
import avatar2 from '../../../assets/images/user-avatars/avatar2.png';
import avatar3 from '../../../assets/images/user-avatars/avatar3.png';
import avatar4 from '../../../assets/images/user-avatars/avatar4.png';
import avatar5 from '../../../assets/images/user-avatars/avatar5.png';

const GameTableCard = ({ table, onJoinTable, onInviteFriends }) => {
    const navigate = useNavigate();
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'waiting':
                return 'status-waiting';
            case 'in progress':
                return 'status-in-progress';
            default:
                return 'status-waiting';
        }
    };

    // Avatar mapping
    const avatarImages = {
        1: avatar1,
        2: avatar2,
        3: avatar3,
        4: avatar4,
        5: avatar5
    };

    const getAvatarImage = (playerId) => {
        return avatarImages[playerId] || null;
    };

    return (
        <div className='game-table-card'>
            <div className='table-header'>
                <h3 className='table-id'>{table.id}</h3>
                <div className={`status-badge ${getStatusClass(table.status)}`}>
                    {table.status}
                </div>
            </div>
            
            <div className='players-section'>
                <div className='player-avatars'>
                    {table.players.map((player, index) => {
                        const avatarImage = getAvatarImage(player.id);
                        return (
                            <div key={player.id} className='gl-player-avatar'>
                                {avatarImage ? (
                                    <img 
                                        src={avatarImage} 
                                        alt={`Player ${player.id}`}
                                        className='avatar-image'
                                    />
                                ) : (
                                    <span className='avatar-initial'>{index + 1}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <span className='player-count'>{table.playerCount} Players</span>
            </div>
            
            <div className='table-details'>
                <div className='detail-item'>
                    <p className='detail-label'>Entry Fee</p>
                    <p className='detail-value'>{table.entryFee}</p>
                </div>
                <div className='detail-item'>
                    <p className='detail-label'>Total Pot</p>
                    <p className='detail-value gold'>{table.totalPot}</p>
                </div>
            </div>
            
            <div className='network-tag'>{table.network}</div>
            
            <button 
                className='join-table-btn' 
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
