import React from 'react';
import trophyIcon from '../../../assets/icon/icon-4.png';
import rollerIcon from '../../../assets/icon/icon-3.png';
import streakIcon from '../../../assets/icon/icon-1.png';
import securityIcon from '../../../assets/icon/icon-2.png';

const AchievementsCard = () => {
    const achievements = [
        {
            id: 1,
            name: 'First Victory',
            description: 'Win your first game',
            icon: 'trophy',
            status: 'completed',
            progress: null
        },
        {
            id: 2,
            name: 'High Roller',
            description: 'Play in a 100+ USDT table',
            icon: 'target',
            status: 'progress',
            progress: { current: 2, total: 6 }
        },
        {
            id: 3,
            name: 'Streak Master',
            description: 'Win 5 games in a row',
            icon: 'lightning',
            status: 'progress',
            progress: { current: 3, total: 5 }
        },
        {
            id: 4,
            name: 'Security Pro',
            description: 'Enable 2FA and complete KYC',
            icon: 'shield',
            status: 'progress',
            progress: { current: 1, total: 2 }
        }
    ];

    const getIcon = (iconType) => {
        const icons = {
            trophy: (
                <img src={trophyIcon} alt="Achievements" width="35" height="25" />
            ),
            target: (
                <img src={rollerIcon} alt="Achievements" width="35" height="35" />
            ),
            lightning: (
                <img src={streakIcon} alt="Achievements" width="35" height="35" />
            ),
            shield: (
                <img src={securityIcon} alt="Achievements" width="35" height="35" />
            )
        };
        return icons[iconType] || icons.trophy;
    };

    const getProgressPercentage = (progress) => {
        if (!progress) return 0;
        return (progress.current / progress.total) * 100;
    };

    return (
        <div className='achievements-card'>
            <div className='achievements-header'>
                <div className='achievements-icon'>
                    <img src={trophyIcon} alt="Achievements" width="35" height="24" />
                </div>
                <h3 className='achievements-title'>Achievements</h3>
            </div>
            <div className='achievements-list'>
                {achievements.map((achievement) => (
                    <div key={achievement.id} className={`achievement-item ${achievement.status}`}>
                        <div className='achievement-icon'>
                            {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                {getIcon(achievement.icon)}
                            </svg> */}
                            {getIcon(achievement.icon)}
                        </div>
                        <div className='achievement-content'>
                            <span className='achievement-name'>{achievement.name}</span>
                            <span className='achievement-desc'>{achievement.description}</span>
                            {achievement.progress && (
                                <>
                                    <div className='progress-bar'>
                                        <div 
                                            className='progress-fill' 
                                            style={{width: `${getProgressPercentage(achievement.progress)}%`}}
                                        ></div>
                                    </div>
                                    <span className='progress-text'>{achievement.progress.current}/{achievement.progress.total}</span>
                                </>
                            )}
                        </div>
                        <div className='achievement-status'>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsCard;
