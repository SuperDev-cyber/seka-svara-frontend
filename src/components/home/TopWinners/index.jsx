import React, { useEffect, useState } from 'react';
import apiService from '../../../services/api';
import { cleanUsername } from '../../../utils/username';

const TopWinners = () => {
    const [winners, setWinners] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await apiService.getTopPlayers(); // ordered by totalGamesWon
                const top5 = (data || []).slice(0, 5).map((u, i) => ({
                    rank: i + 1,
                    name: cleanUsername(u.username) || `Player ${u.id.substring(0,4)}`,
                    games: `${u.totalGamesPlayed || 0} games`,
                    winnings: `${Number(u.totalWinnings || 0).toLocaleString()} USDT`,
                    winRate: `${u.winRate || 0}%`,
                    isCrown: i === 0,
                }));
                setWinners(top5);
            } catch (e) {
                setWinners([]);
            }
        };
        load();
    }, []);

    return (
        <div className='top-winners-section'>
            <div className='top-winners-content'>
                <div className='winners-header'>
                    <h2 className='winners-title'>Top Winners</h2>
                    <p className='winners-subtitle'>See who's dominating the tables</p>
                </div>
                
                <div className='winners-list'>
                    {winners.map((winner, index) => (
                        <div key={winner.rank} className='winner-card'>
                            <div className='winner-left'>
                                <div className='rank-container'>
                                    {winner.isCrown ? (
                                        <div className='crown-icon'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
                                                <path d="M12 18l-1.5-2L12 14l1.5 2L12 18z"/>
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className='rank-badge'>
                                            {winner.rank}
                                        </div>
                                    )}
                                </div>
                                <div className='winner-info'>
                                    <h3 className='winner-name'>{winner.name}</h3>
                                    <p className='winner-games'>{winner.games}</p>
                                </div>
                            </div>
                            
                            <div className='winner-right'>
                                <div className='winner-stats'>
                                    <div className='winnings'>{winner.winnings}</div>
                                    <div className='win-rate'>
                                        <span className='rate'>{winner.winRate}</span>
                                        <svg className='trend-icon' width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 14l5-5 5 5"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopWinners;
