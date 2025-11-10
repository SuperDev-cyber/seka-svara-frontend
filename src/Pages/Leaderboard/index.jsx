import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import apiService from '../../services/api';
import { cleanUsername } from '../../utils/username';
import './index.css';

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState('winners');
    const [winners, setWinners] = useState([]);
    const [players, setPlayers] = useState([]);
    const [mostActive, setMostActive] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'winners') {
                const data = await apiService.getTopWinners();
                setWinners(data || []);
            } else if (activeTab === 'players') {
                const data = await apiService.getTopPlayers();
                setPlayers(data || []);
            } else if (activeTab === 'active') {
                const data = await apiService.getMostActive();
                setMostActive(data || []);
            }
            const stats = await apiService.getStatistics();
            setStatistics(stats);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderWinners = () => (
        <div className="leaderboard-list">
            {winners.map((winner, index) => (
                <div key={winner.id || index} className="leaderboard-item">
                    <div className="rank-section">
                        {index === 0 ? (
                            <div className="rank-crown">👑</div>
                        ) : (
                            <div className="rank-number">{index + 1}</div>
                        )}
                    </div>
                    <div className="player-section">
                        <div className="player-avatar">
                            {winner.avatar ? (
                                <img src={winner.avatar} alt={cleanUsername(winner.username)} />
                            ) : (
                                <div className="avatar-placeholder">
                                    {cleanUsername(winner.username)?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        <div className="player-info">
                            <div className="player-name">{cleanUsername(winner.username) || `Player ${winner.id?.substring(0, 4)}`}</div>
                            <div className="player-stats">
                                <span>Games Won: {winner.totalGamesWon || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="stats-section">
                        <div className="stat-value">
                            {Number(winner.totalWinnings || 0).toLocaleString()} USDT
                        </div>
                        <div className="stat-label">Total Winnings</div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderPlayers = () => (
        <div className="leaderboard-list">
            {players.map((player, index) => (
                <div key={player.id || index} className="leaderboard-item">
                    <div className="rank-section">
                        {index === 0 ? (
                            <div className="rank-crown">👑</div>
                        ) : (
                            <div className="rank-number">{index + 1}</div>
                        )}
                    </div>
                    <div className="player-section">
                        <div className="player-avatar">
                            {player.avatar ? (
                                <img src={player.avatar} alt={cleanUsername(player.username)} />
                            ) : (
                                <div className="avatar-placeholder">
                                    {cleanUsername(player.username)?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        <div className="player-info">
                            <div className="player-name">{cleanUsername(player.username) || `Player ${player.id?.substring(0, 4)}`}</div>
                            <div className="player-stats">
                                <span>Games: {player.totalGamesPlayed || 0}</span>
                                <span>Wins: {player.totalGamesWon || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="stats-section">
                        <div className="stat-value">{player.winRate || 0}%</div>
                        <div className="stat-label">Win Rate</div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMostActive = () => (
        <div className="leaderboard-list">
            {mostActive.map((player, index) => (
                <div key={player.id || index} className="leaderboard-item">
                    <div className="rank-section">
                        {index === 0 ? (
                            <div className="rank-crown">👑</div>
                        ) : (
                            <div className="rank-number">{index + 1}</div>
                        )}
                    </div>
                    <div className="player-section">
                        <div className="player-avatar">
                            {player.avatar ? (
                                <img src={player.avatar} alt={cleanUsername(player.username)} />
                            ) : (
                                <div className="avatar-placeholder">
                                    {cleanUsername(player.username)?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        <div className="player-info">
                            <div className="player-name">{cleanUsername(player.username) || `Player ${player.id?.substring(0, 4)}`}</div>
                            <div className="player-stats">
                                <span>Games Played: {player.totalGamesPlayed || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="stats-section">
                        <div className="stat-value">{player.totalGamesWon || 0}</div>
                        <div className="stat-label">Total Wins</div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="leaderboard-page">
            <Header />
            <div className="leaderboard-page-content">
                <div className="leaderboard-container">
                    <div className="leaderboard-header">
                        <h1 className="leaderboard-title">Leaderboard</h1>
                        <p className="leaderboard-subtitle">Top players competing for real USDT prizes</p>
                    </div>

                    {statistics && (
                        <div className="leaderboard-stats">
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <div className="stat-number">{statistics.totalUsers || 0}</div>
                                    <div className="stat-text">Total Players</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎮</div>
                                <div className="stat-content">
                                    <div className="stat-number">{statistics.totalGames || 0}</div>
                                    <div className="stat-text">Total Games</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <div className="stat-number">{Number(statistics.totalWinnings || 0).toLocaleString()}</div>
                                    <div className="stat-text">Total Winnings (USDT)</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="leaderboard-tabs">
                        <button
                            className={`tab-button ${activeTab === 'winners' ? 'active' : ''}`}
                            onClick={() => setActiveTab('winners')}
                        >
                            Top Winners
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
                            onClick={() => setActiveTab('players')}
                        >
                            Top Players
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
                            onClick={() => setActiveTab('active')}
                        >
                            Most Active
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading leaderboard...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'winners' && renderWinners()}
                            {activeTab === 'players' && renderPlayers()}
                            {activeTab === 'active' && renderMostActive()}
                        </>
                    )}

                    <div className="leaderboard-footer">
                        <Link to="/gamelobby" className="play-now-link">Start Playing Now</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Leaderboard;



