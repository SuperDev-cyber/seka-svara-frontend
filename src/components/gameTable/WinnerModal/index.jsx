import React from 'react';
import './index.css';
import spadeIcon from '../../../assets/images/suits/spade.svg';
import heartIcon from '../../../assets/images/suits/heart.svg';
import diamondIcon from '../../../assets/images/suits/diamond.svg';
import clubIcon from '../../../assets/images/suits/club.svg';
import { useSocket } from '../../../contexts/SocketContext';

const WinnerModal = ({ show, winnerData, onClose, currentUserId, tableId }) => {
    const { socket } = useSocket();
    
    if (!show || !winnerData) return null;

    const isWinner = winnerData.winners.includes(currentUserId);
    const winnerPlayers = winnerData.players.filter(p => p.isWinner);
    const isMultipleWinners = winnerData.winners.length > 1;

    // Helper to get suit icon
    const getSuitIcon = (suit) => {
        switch(suit) {
            case '♠': case 'spades': return spadeIcon;
            case '♥': case 'hearts': return heartIcon;
            case '♦': case 'diamonds': return diamondIcon;
            case '♣': case 'clubs': return clubIcon;
            default: return null;
        }
    };

    // Helper to get card color
    const getCardColor = (suit) => {
        return (suit === '♥' || suit === '♦' || suit === 'hearts' || suit === 'diamonds') ? '#DC143C' : '#000000';
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        console.log('amount----------------------', amount);
        // ✅ Parse and round to prevent decimal errors
        const numAmount = Math.round(Number(amount) || 0);
        console.log('numAmount----------------------', numAmount);
        return numAmount.toLocaleString('en-US');
    };

    // ✅ Handle close - emit socket event to track modal closure
    const handleClose = () => {
        console.log('🎯 Player closing winner modal');
        
        if (socket && tableId && currentUserId) {
            socket.emit('player_modal_closed', {
                tableId,
                userId: currentUserId,
            });
            console.log('✅ Emitted player_modal_closed event');
        }
        
        // Call parent onClose handler
        onClose();
    };

    return (
        <div className="winner-modal-overlay" onClick={onClose}>
            <div className="winner-modal" onClick={(e) => e.stopPropagation()}>
                {/* Confetti animation for winners */}
                {isWinner && <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className="confetti" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            backgroundColor: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#32CD32'][Math.floor(Math.random() * 5)]
                        }}/>
                    ))}
                </div>}

                <div className="winner-modal-content">
                    {/* Header */}
                    <div className={`winner-header ${isWinner ? 'winner-header-won' : 'winner-header-lost'}`}>
                        <h1>{isWinner ? '🎉 YOU WON! 🎉' : '😔 You Lost'}</h1>
                        {isMultipleWinners && <p className="tie-message">Tie Game - Pot Split!</p>}
                    </div>

                    {/* Winner(s) Details */}
                    <div className="winners-section">
                        <h2>Winners</h2>
                        {winnerPlayers.map((winner) => {
                            const winnerId = winner.userId;
                            const isCurrentUser = winnerId === currentUserId;
                            const displayName = isCurrentUser ? 'You' : winner.userId.substring(5, 11);

                            return (
                                <div key={winnerId} className={`winner-card ${isCurrentUser ? 'winner-card-you' : ''}`}>
                                    <div className="winner-info">
                                        <div className="winner-name">{displayName}</div>
                                        <div className="winner-winnings">
                                            Won: <span className="amount">{formatCurrency(winner.winnings)} USDT</span>
                                        </div>
                                    </div>
                                    
                                    {/* Winner's Hand */}
                                    <div className="winner-hand">
                                        {winner.hand && winner.hand.map((card, i) => {
                                            const suitIcon = getSuitIcon(card.suit);
                                            const suitColor = getCardColor(card.suit);
                                            
                                            return (
                                                <div 
                                                    key={i} 
                                                    className="winner-card-display"
                                                    style={{
                                                        color: suitColor
                                                    }}
                                                >
                                                    <div className="card-rank">{card.rank}</div>
                                                    <div className="card-suit">
                                                        {suitIcon ? (
                                                            <img 
                                                                src={suitIcon} 
                                                                alt={card.suit}
                                                                style={{ 
                                                                    width: '32px', 
                                                                    height: '32px',
                                                                    filter: suitColor === '#DC143C' ? 'brightness(0) saturate(100%) invert(21%) sepia(88%) saturate(4477%) hue-rotate(343deg) brightness(90%) contrast(88%)' : 'none'
                                                                }}
                                                            />
                                                        ) : card.suit}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Hand Evaluation */}
                                    {winner.evaluatedHand && (
                                        <div className="hand-evaluation">
                                            <div className="hand-description">{winner.evaluatedHand.description}</div>
                                            <div className="hand-points">{winner.evaluatedHand.value} points</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pot Details */}
                    <div className="pot-details">
                        <div className="pot-row">
                            <span>🎰 Total Pot:</span>
                            <span className="pot-value" style={{ color: '#ffd700', fontWeight: 'bold' }}>
                                {formatCurrency(winnerData.pot)} USDT
                            </span>
                        </div>
                    </div>

                    {/* All Players' Hands (for reference) */}
                    <div className="all-hands-section">
                        <h3>All Hands</h3>
                        <div className="all-hands-grid">
                            {winnerData.players.map((player) => {
                                const playerId = player.userId;
                                const isCurrentUser = playerId === currentUserId;
                                const displayName = isCurrentUser ? 'You' : playerId.substring(5, 11);
                                const isPlayerWinner = player.isWinner;

                                return (
                                    <div 
                                        key={playerId} 
                                        className={`player-hand-card ${isPlayerWinner ? 'player-hand-winner' : ''} ${isCurrentUser ? 'player-hand-you' : ''}`}
                                    >
                                        <div className="player-hand-name">
                                            {displayName} {isPlayerWinner && '👑'}
                                        </div>
                                        <div className="player-hand-cards">
                                            {player.hand && player.hand.map((card, i) => {
                                                const suitIcon = getSuitIcon(card.suit);
                                                const suitColor = getCardColor(card.suit);
                                                
                                                return (
                                                    <div 
                                                        key={i} 
                                                        className="small-card"
                                                        style={{ 
                                                            color: suitColor,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '2px'
                                                        }}
                                                    >
                                                        <span>{card.rank}</span>
                                                        {suitIcon ? (
                                                            <img 
                                                                src={suitIcon} 
                                                                alt={card.suit}
                                                                style={{ 
                                                                    width: '14px', 
                                                                    height: '14px',
                                                                    filter: suitColor === '#DC143C' ? 'brightness(0) saturate(100%) invert(21%) sepia(88%) saturate(4477%) hue-rotate(343deg) brightness(90%) contrast(88%)' : 'none'
                                                                }}
                                                            />
                                                        ) : <span>{card.suit}</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {player.evaluatedHand && (
                                            <div className="player-hand-points">
                                                {player.evaluatedHand.value} pts
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Close Button */}
                    <button className="winner-modal-close" onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinnerModal;

