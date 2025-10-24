import React, { useState, useEffect } from 'react';
import './index.css';

const DealerDisplay = ({ dealerEmail, dealerAvatar, isDealing, onDealComplete, playerPositions = [] }) => {
    const [showDealer, setShowDealer] = useState(false);
    const [deckCards, setDeckCards] = useState([]);

    useEffect(() => {
        // Show dealer after a short delay
        const timer = setTimeout(() => {
            setShowDealer(true);
            // Initialize deck cards - 3 cards per player
            const numPlayers = Math.max(playerPositions.length, 2);
            const cards = Array(numPlayers * 3).fill(null).map((_, i) => ({
                id: i,
                delay: i * 80, // Stagger each card
                playerIndex: i % numPlayers, // Which player gets this card
                cardNumber: Math.floor(i / numPlayers) + 1 // Which card (1, 2, or 3)
            }));
            setDeckCards(cards);
        }, 100);

        return () => clearTimeout(timer);
    }, [playerPositions]);

    useEffect(() => {
        if (isDealing && showDealer) {
            // Trigger card dealing animation
            const dealTimer = setTimeout(() => {
                if (onDealComplete) {
                    onDealComplete();
                }
            }, 3000); // Animation completes after 3 seconds

            return () => clearTimeout(dealTimer);
        }
    }, [isDealing, showDealer, onDealComplete]);

    const dealerName = dealerEmail ? dealerEmail.split('@')[0] : 'Dealer';
    const displayName = dealerName.charAt(0).toUpperCase() + dealerName.slice(1);

    return (
        <div className={`dealer-display ${showDealer ? 'visible' : ''} ${isDealing ? 'dealing' : ''}`}>
            {/* Dealer Avatar with Glow */}
            <div className="dealer-avatar-container">
                <div className="dealer-glow"></div>
                <div className="dealer-avatar-wrapper">
                    <img 
                        src={dealerAvatar} 
                        alt={displayName}
                        className="dealer-avatar"
                    />
                    <div className="dealer-badge">
                        <span className="dealer-icon">👑</span>
                    </div>
                </div>
                <div className="dealer-name">{displayName}</div>
                <div className="dealer-title">Dealer</div>
            </div>

            {/* Card Deck */}
            <div className="card-deck-container">
                {deckCards.map((card) => (
                    <div
                        key={card.id}
                        className={`deck-card ${isDealing ? 'flying' : ''} player-${card.playerIndex}`}
                        style={{
                            '--card-delay': `${card.delay}ms`,
                            transform: `translateZ(${-card.id * 2}px) translateY(${-card.id * 0.5}px)`,
                            zIndex: deckCards.length - card.id
                        }}
                    />
                ))}
            </div>

            {/* Magical Particles */}
            {isDealing && (
                <div className="magic-particles">
                    {Array(20).fill(null).map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                '--particle-delay': `${i * 100}ms`,
                                '--particle-x': `${Math.random() * 200 - 100}px`,
                                '--particle-y': `${Math.random() * 200 - 100}px`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DealerDisplay;

