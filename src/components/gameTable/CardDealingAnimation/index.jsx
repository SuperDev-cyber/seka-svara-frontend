import React, { useEffect, useRef, useState } from 'react';
import './index.css';

const CardDealingAnimation = ({ 
    players = [], 
    onComplete, 
    isDealing = false,
    cardBackImage = '/card-back.png'
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [animationProgress, setAnimationProgress] = useState(0);

    useEffect(() => {
        if (!isDealing || players.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        // Card dimensions
        const cardWidth = 50;
        const cardHeight = 73;

        // Center point (deck position)
        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate player positions in a circle
        const numPlayers = players.length;
        const radius = Math.min(width, height) * 0.35;
        
        const playerPositions = players.map((player, index) => {
            // Start from top and go clockwise
            const angle = (index / numPlayers) * Math.PI * 2 - Math.PI / 2;
            return {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                playerId: player.userId,
                index
            };
        });

        // Animation state
        const cards = [];
        const cardsPerPlayer = 3;
        const totalCards = numPlayers * cardsPerPlayer;
        const cardDelay = 150; // ms between each card
        const cardDuration = 600; // ms for card to travel

        // Create card objects
        for (let round = 0; round < cardsPerPlayer; round++) {
            for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
                const cardIndex = round * numPlayers + playerIndex;
                cards.push({
                    targetPlayer: playerIndex,
                    startTime: cardIndex * cardDelay,
                    duration: cardDuration,
                    round
                });
            }
        }

        const startTime = performance.now();
        const totalDuration = (totalCards * cardDelay) + cardDuration;

        // Easing function (ease-out cubic)
        const easeOutCubic = (t) => {
            return 1 - Math.pow(1 - t, 3);
        };

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);

            ctx.clearRect(0, 0, width, height);

            // Draw each card
            cards.forEach((card) => {
                const cardElapsed = elapsed - card.startTime;
                
                if (cardElapsed < 0) return; // Card hasn't started yet
                if (cardElapsed > card.duration) {
                    // Card has reached destination - draw it there
                    const targetPos = playerPositions[card.targetPlayer];
                    const offsetX = (card.round - 1) * 15; // Spread cards slightly
                    
                    ctx.fillStyle = '#2d3748';
                    ctx.strokeStyle = '#4a5568';
                    ctx.lineWidth = 2;
                    
                    ctx.save();
                    ctx.translate(targetPos.x + offsetX, targetPos.y);
                    ctx.rotate((card.round - 1) * 0.1); // Slight rotation
                    
                    // Draw card back
                    ctx.beginPath();
                    ctx.roundRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 4);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Draw pattern
                    ctx.fillStyle = '#1a202c';
                    ctx.beginPath();
                    ctx.roundRect(-cardWidth/2 + 4, -cardHeight/2 + 4, cardWidth - 8, cardHeight - 8, 2);
                    ctx.fill();
                    
                    ctx.restore();
                    return;
                }

                // Card is in flight
                const t = easeOutCubic(cardElapsed / card.duration);
                const targetPos = playerPositions[card.targetPlayer];
                
                const x = centerX + (targetPos.x - centerX) * t;
                const y = centerY + (targetPos.y - centerY) * t;
                const rotation = t * Math.PI * 2; // Spin during flight
                const scale = 0.5 + (0.5 * t); // Start small, grow to full size

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotation);
                ctx.scale(scale, scale);

                // Draw card with shadow
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;

                ctx.fillStyle = '#2d3748';
                ctx.strokeStyle = '#4a5568';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.roundRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 4);
                ctx.fill();
                ctx.stroke();

                // Draw card back pattern
                ctx.fillStyle = '#1a202c';
                ctx.beginPath();
                ctx.roundRect(-cardWidth/2 + 4, -cardHeight/2 + 4, cardWidth - 8, cardHeight - 8, 2);
                ctx.fill();

                ctx.restore();
            });

            // Draw deck (remaining cards)
            const dealtCards = Math.floor(elapsed / cardDelay);
            const remainingCards = Math.max(0, totalCards - dealtCards);
            
            for (let i = 0; i < Math.min(remainingCards, 5); i++) {
                ctx.fillStyle = '#2d3748';
                ctx.strokeStyle = '#4a5568';
                ctx.lineWidth = 2;
                
                ctx.save();
                ctx.translate(centerX, centerY - i * 0.5);
                
                ctx.beginPath();
                ctx.roundRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 4);
                ctx.fill();
                ctx.stroke();
                
                ctx.restore();
            }

            setAnimationProgress(progress);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Animation complete
                if (onComplete) {
                    setTimeout(() => onComplete(), 300);
                }
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isDealing, players, onComplete]);

    if (!isDealing) return null;

    return (
        <div className="card-dealing-overlay">
            <canvas 
                ref={canvasRef}
                className="dealing-canvas"
            />
            <div className="dealing-text">
                Dealing Cards... {Math.round(animationProgress * 100)}%
            </div>
        </div>
    );
};

export default CardDealingAnimation;
