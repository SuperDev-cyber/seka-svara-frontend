import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import crown from '../../../assets/icon/crown.png';

const UserProfileCard = () => {
    const { user } = useAuth();

    const formatDate = (dateString) => {
        if (!dateString) return 'Member Since Recently';
        const date = new Date(dateString);
        return `Member Since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    };

    const calculateWinRate = (gamesPlayed, gamesWon) => {
        if (!gamesPlayed || gamesPlayed === 0) return '0%';
        return `${Math.round((gamesWon / gamesPlayed) * 100)}%`;
    };

    const getPlayerRank = (totalWinnings) => {
        if (totalWinnings >= 10000) return 'Diamond Player';
        if (totalWinnings >= 5000) return 'Platinum Player';
        if (totalWinnings >= 1000) return 'Gold Player';
        if (totalWinnings >= 500) return 'Silver Player';
        return 'Bronze Player';
    };

    const getRankBadgeColor = (totalWinnings) => {
        if (totalWinnings >= 10000) return '#00D4FF'; // Diamond
        if (totalWinnings >= 5000) return '#8B5CF6'; // Platinum
        if (totalWinnings >= 1000) return '#FFD700'; // Gold
        if (totalWinnings >= 500) return '#C0C0C0'; // Silver
        return '#CD7F32'; // Bronze
    };

    return (
        <div className='profile-card'>
            <div className='profile-crown'>
                <img src={crown} alt='crown' />
            </div>
            <h2 className='profile-name'>{user?.username || 'Guest User'}</h2>
            <p className='member-since'>{formatDate(user?.createdAt)}</p>
            
            <div className='profile-stats'>
                <div className='profile-stat-item'>
                    <span className='stat-number'>{user?.totalGamesPlayed || 0}</span>
                    <span className='stat-label'>Games Play</span>
                </div>
                <div className='profile-stat-item'>
                    <span className='stat-number'>{calculateWinRate(user?.totalGamesPlayed, user?.totalGamesWon)}</span>
                    <span className='stat-label'>Win Rate</span>
                </div>
                <div className='profile-stat-item'>
                    <span className='stat-number'>{user?.level || 1}</span>
                    <span className='stat-label'>Level</span>
                </div>
            </div>

            <div className='profile-divider'></div>

            <div className='total-winnings'>
                <div className='winnings-left'>
                    <span className='winnings-label'>Total Winnings</span>
                    <span className='winnings-rank'>Rank</span>
                </div>
                <div className='winnings-right'>
                    <span className='winnings-amount'>+{user?.totalWinnings || 0}</span>
                    <span 
                        className='winnings-badge'
                        style={{ color: getRankBadgeColor(user?.totalWinnings || 0) }}
                    >
                        {getPlayerRank(user?.totalWinnings || 0)}
                    </span>
                </div>
            </div>

            <button className='edit-profile-btn'>Edit Profile</button>
        </div>
    );
};

export default UserProfileCard;
