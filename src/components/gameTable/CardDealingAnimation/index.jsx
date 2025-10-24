import React, { useState, useEffect } from 'react';
import cardBackImg from '../../../assets/images/card.png';

/**
 * CardDealingAnimation Component
 * 
 * Handles the card dealing animation when game starts.
 * Cards are dealt sequentially from the center (dealer position) to each player.
 * 
 * @param {Array} activeSeatIndices - Array of seat indices that have players (e.g., [0, 1, 3, 5])
 * @param {Function} onDealingComplete - Callback when all cards are dealt
 * @param {boolean} isDealing - Whether dealing animation should start
 */
const CardDealingAnimation = ({ activeSeatIndices = [], onDealingComplete, isDealing = false }) => {
    const [dealingCards, setDealingCards] = useState([]);
    const [dealingPhase, setDealingPhase] = useState(0); // 0-2 (3 cards per player)

    useEffect(() => {
        if (!isDealing || activeSeatIndices.length === 0) {
            return;
        }

        console.log('🎴 Starting card dealing animation...');
        setDealingCards([]);
        setDealingPhase(0);

        // Deal 3 cards to each player
        let cardIndex = 0;
        const totalCards = activeSeatIndices.length * 3;
        const DEAL_DELAY = 250; // milliseconds between each card

        const dealNextCard = () => {
            if (cardIndex >= totalCards) {
                // All cards dealt, wait for last animation to complete
                setTimeout(() => {
                    console.log('✅ Card dealing complete!');
                    setDealingCards([]);
                    if (onDealingComplete) {
                        onDealingComplete();
                    }
                }, 600); // Wait for last card animation
                return;
            }

            // Determine which round (0, 1, or 2) and which player
            const round = Math.floor(cardIndex / activeSeatIndices.length);
            const playerIndexInRound = cardIndex % activeSeatIndices.length;
            const seatIndex = activeSeatIndices[playerIndexInRound];

            console.log(`🎴 Dealing card ${cardIndex + 1}/${totalCards} - Round ${round + 1}, Seat ${seatIndex}`);

            // Add new card to animation
            const newCard = {
                id: `card-${cardIndex}`,
                seatIndex,
                round,
            };

            setDealingCards(prev => [...prev, newCard]);
            setDealingPhase(round);

            // Remove card after animation completes
            setTimeout(() => {
                setDealingCards(prev => prev.filter(c => c.id !== newCard.id));
            }, 650);

            cardIndex++;
            setTimeout(dealNextCard, DEAL_DELAY);
        };

        // Start dealing after a short delay
        const dealingTimeout = setTimeout(dealNextCard, 300);

        return () => {
            clearTimeout(dealingTimeout);
        };
    }, [isDealing, activeSeatIndices, onDealingComplete]);

    if (!isDealing || dealingCards.length === 0) {
        return null;
    }

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 999,
            pointerEvents: 'none'
        }}>
            {dealingCards.map(card => (
                <div
                    key={card.id}
                    className={`dealing-card dealing-card-to-seat-${card.seatIndex}`}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-27.5px',
                        marginTop: '-40px',
                        backgroundImage: `url(${cardBackImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            ))}
        </div>
    );
};

export default CardDealingAnimation;

