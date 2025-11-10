import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './index.css';

const Tournament = () => {
    const [activeFilter, setActiveFilter] = useState('upcoming');

    // Mock tournament data - replace with API call when backend is ready
    const tournaments = [
        {
            id: 1,
            name: 'Weekly Championship',
            status: 'upcoming',
            startDate: '2025-01-15',
            endDate: '2025-01-22',
            entryFee: 50,
            prizePool: 5000,
            participants: 0,
            maxParticipants: 100,
            description: 'Compete in this weekly tournament for a chance to win from a 5000 USDT prize pool!',
            rules: 'Best of 10 games. Top 10 players share the prize pool.'
        },
        {
            id: 2,
            name: 'Monthly Grand Slam',
            status: 'upcoming',
            startDate: '2025-02-01',
            endDate: '2025-02-28',
            entryFee: 100,
            prizePool: 25000,
            participants: 0,
            maxParticipants: 500,
            description: 'The biggest tournament of the month! Compete for a massive 25,000 USDT prize pool.',
            rules: 'Best of 20 games. Top 20 players share the prize pool.'
        },
        {
            id: 3,
            name: 'New Year Special',
            status: 'ongoing',
            startDate: '2025-01-01',
            endDate: '2025-01-10',
            entryFee: 25,
            prizePool: 10000,
            participants: 45,
            maxParticipants: 200,
            description: 'Celebrate the new year with this special tournament!',
            rules: 'Best of 15 games. Top 15 players share the prize pool.'
        },
        {
            id: 4,
            name: 'Winter Classic',
            status: 'completed',
            startDate: '2024-12-15',
            endDate: '2024-12-31',
            entryFee: 75,
            prizePool: 15000,
            participants: 150,
            maxParticipants: 200,
            description: 'The Winter Classic tournament has concluded.',
            rules: 'Best of 20 games. Top 20 players shared the prize pool.',
            winner: 'jackson19990427'
        }
    ];

    const filteredTournaments = tournaments.filter(t => {
        if (activeFilter === 'upcoming') return t.status === 'upcoming';
        if (activeFilter === 'ongoing') return t.status === 'ongoing';
        if (activeFilter === 'completed') return t.status === 'completed';
        return true;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming':
                return <span className="status-badge upcoming">Upcoming</span>;
            case 'ongoing':
                return <span className="status-badge ongoing">Ongoing</span>;
            case 'completed':
                return <span className="status-badge completed">Completed</span>;
            default:
                return null;
        }
    };

    return (
        <div className="tournament-page">
            <Header />
            <div className="tournament-page-content">
                <div className="tournament-container">
                    <div className="tournament-header">
                        <h1 className="tournament-title">Tournaments</h1>
                        <p className="tournament-subtitle">Compete in tournaments and win big USDT prizes</p>
                    </div>

                    <div className="tournament-filters">
                        <button
                            className={`filter-button ${activeFilter === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`filter-button ${activeFilter === 'ongoing' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('ongoing')}
                        >
                            Ongoing
                        </button>
                        <button
                            className={`filter-button ${activeFilter === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('completed')}
                        >
                            Completed
                        </button>
                    </div>

                    <div className="tournament-list">
                        {filteredTournaments.length > 0 ? (
                            filteredTournaments.map((tournament) => (
                                <div key={tournament.id} className="tournament-card">
                                    <div className="tournament-card-header">
                                        <div className="tournament-title-section">
                                            <h2 className="tournament-name">{tournament.name}</h2>
                                            {getStatusBadge(tournament.status)}
                                        </div>
                                    </div>

                                    <div className="tournament-card-body">
                                        <p className="tournament-description">{tournament.description}</p>

                                        <div className="tournament-details">
                                            <div className="detail-item">
                                                <span className="detail-icon">📅</span>
                                                <div className="detail-content">
                                                    <div className="detail-label">Start Date</div>
                                                    <div className="detail-value">{new Date(tournament.startDate).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">🏁</span>
                                                <div className="detail-content">
                                                    <div className="detail-label">End Date</div>
                                                    <div className="detail-value">{new Date(tournament.endDate).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">💰</span>
                                                <div className="detail-content">
                                                    <div className="detail-label">Entry Fee</div>
                                                    <div className="detail-value">{tournament.entryFee} USDT</div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">🏆</span>
                                                <div className="detail-content">
                                                    <div className="detail-label">Prize Pool</div>
                                                    <div className="detail-value prize">{tournament.prizePool.toLocaleString()} USDT</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tournament-participants">
                                            <div className="participants-info">
                                                <span className="participants-count">{tournament.participants}</span>
                                                <span className="participants-separator">/</span>
                                                <span className="participants-max">{tournament.maxParticipants}</span>
                                                <span className="participants-label">Participants</span>
                                            </div>
                                            <div className="participants-progress">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="tournament-rules">
                                            <strong>Rules:</strong> {tournament.rules}
                                        </div>

                                        {tournament.winner && (
                                            <div className="tournament-winner">
                                                <strong>Winner:</strong> {tournament.winner}
                                            </div>
                                        )}
                                    </div>

                                    <div className="tournament-card-footer">
                                        {tournament.status === 'upcoming' && (
                                            <button className="register-button">
                                                Register Now
                                            </button>
                                        )}
                                        {tournament.status === 'ongoing' && (
                                            <button className="join-button">
                                                Join Tournament
                                            </button>
                                        )}
                                        {tournament.status === 'completed' && (
                                            <button className="view-results-button" disabled>
                                                View Results
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-tournaments">
                                <p>No tournaments found in this category.</p>
                            </div>
                        )}
                    </div>

                    <div className="tournament-footer">
                        <p>Want to create your own tournament?</p>
                        <Link to="/support" className="contact-link">Contact Us</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Tournament;



