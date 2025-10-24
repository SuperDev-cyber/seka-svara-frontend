import React, { useState, useEffect } from 'react';
import spadeIcon from '../../../assets/images/suits/spade.svg';
import heartIcon from '../../../assets/images/suits/heart.svg';
import diamondIcon from '../../../assets/images/suits/diamond.svg';
import clubIcon from '../../../assets/images/suits/club.svg';
import cardSeka from '../../../assets/images/card.png';
import CardDealingAnimation from '../CardDealingAnimation';

const Seat = ({ index, player, cardBackSrc, usdtIconSrc, avatarUrl, isEmpty, isCurrentUser, showCards = false, cards = [], isShowdown = false, isDealer = false, handScore = null, handDescription = null, entryFee = 0 }) => {
    if (isEmpty) {
        return (
            <div className={`seat seat-${index} empty-seat`}>
                <div className="player-card" style={{
                    background: 'rgba(26, 35, 50, 0.6)',
                    border: '2px dashed #444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '120px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: 0.5
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        <div className="player-name" style={{ color: '#888', fontSize: '12px' }}>INVITE</div>
                    </div>
                    <div className="each-card">
                        <img className={`each see`} src={cardSeka} alt="" />
                        <img className={`each see`} src={cardSeka} alt="" />
                        <img className={`each see`} src={cardSeka} alt="" />
                    </div>
                </div>
            </div>
        );
    }
    
    // Use actual user data if available, otherwise fallback to email extraction
    const playerName = player.username || player.name || (player.email ? player.email.split('@')[0] : `Player ${index + 1}`);
    const displayName = playerName.charAt(0).toUpperCase() + playerName.slice(1);
    
    // Format userId for display (e.g., "user_hdkh5pt" → "0xhdkh...5pt")
    const userId = player.userId || '';
    const shortUserId = userId.length > 10 
        ? `0x${userId.substring(5, 9)}...${userId.substring(userId.length - 3)}`
        : userId;
    
    // Determine whether to show face-up or face-down cards
    // RULE 1: Current user ALWAYS sees their own cards (when cards exist)
    // RULE 2: During showdown, EVERYONE sees ALL cards
    // RULE 3: Otherwise, show card backs for other players
    const hasCards = cards && Array.isArray(cards) && cards.length > 0;
    const showFaceUp = hasCards && (isCurrentUser || isShowdown);
    
    // Determine player action/status
    const playerStatus = player.status || '';
    const currentBet = player.currentBet || 0;
    const hasActed = player.hasActed || false;
    const isFolded = playerStatus === 'folded' || player.folded;
    const winAmount = player.winnings || 0;
    
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
    
    // Helper to get suit color
    const getSuitColor = (suit) => {
        return (suit === '♥' || suit === '♦' || suit === 'hearts' || suit === 'diamonds') ? '#DC143C' : '#000000';
    };
    
    return (
        <div className={`seat seat-${index} ${isCurrentUser ? 'current-user' : ''} ${isDealer ? 'dealer-seat' : ''} ${isFolded ? 'folded-seat' : ''}`}>
            <div className="player-card" style={{
                opacity: isFolded ? 0.5 : 1,
                filter: isFolded ? 'grayscale(50%)' : 'none'
            }}>
                {/* Top badges row - VIP and Gift icons */}
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 10
                }}>
                    {/* VIP Badge */}
                    <div style={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#000',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        VIP
                    </div>
                    {/* Gift Icon */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        🎁
                    </div>
                </div>
                
                {/* Avatar with dealer indicator */}
                <div style={{ position: 'relative', display: 'inline-block', marginTop: '30px' }}>
                    <img 
                        className="gt-player-avatar" 
                        src={player.avatar || player.profilePicture || avatarUrl} 
                        alt={displayName} 
                        style={{ 
                            borderRadius: '50%', 
                            objectFit: 'cover',
                            width: '60px',
                            height: '60px',
                            border: isDealer ? '3px solid #FFD700' : '3px solid #334155',
                            boxShadow: isDealer ? '0 0 15px rgba(255, 215, 0, 0.6)' : 'none'
                        }} 
                    />
                    {isDealer && (
                        <div style={{
                            position: 'absolute',
                            bottom: '-5px',
                            right: '-5px',
                            backgroundColor: '#FFD700',
                            color: '#000',
                            borderRadius: '50%',
                            width: '26px',
                            height: '26px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            border: '2px solid #FFF',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}>
                            D
                        </div>
                    )}
                </div>
                
                <div className="player-name" style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>{displayName}</div>
                
                {/* Player balance with coin icon */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px'
                }}>
                    <span style={{ fontSize: '18px' }}>🪙</span>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#FFD700' }}>
                        {typeof player.balance === 'object' ? player.balance.availableBalance : (player.balance || 0)}
                    </span>
                </div>
                
                {/* ENTRY PAID label */}
                <div style={{
                    fontSize: '11px',
                    color: '#9CA3AF',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    ENTRY PAID : {entryFee}
                </div>
                
                {/* Action status labels - RAISE, CALL, FOLD, WIN */}
                {!isFolded && winAmount > 0 && isShowdown && (
                    <div style={{
                        fontSize: '13px',
                        color: '#22C55E',
                        marginTop: '6px',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        borderRadius: '8px'
                    }}>
                        WIN : {winAmount}
                    </div>
                )}
                
                {isFolded && (
                    <div style={{
                        fontSize: '13px',
                        color: '#EF4444',
                        marginTop: '6px',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px'
                    }}>
                        FOLD
                    </div>
                )}
                
                {!isFolded && !isShowdown && hasActed && currentBet > 0 && player.action && (
                    <div style={{
                        fontSize: '13px',
                        color: '#F59E0B',
                        marginTop: '6px',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        borderRadius: '8px',
                        textTransform: 'uppercase'
                    }}>
                        {player.action} : {currentBet}
                    </div>
                )}
                
                {!isFolded && !isShowdown && hasActed && currentBet > 0 && !player.action && (
                    <div style={{
                        fontSize: '13px',
                        color: '#3B82F6',
                        marginTop: '6px',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '8px'
                    }}>
                        CALL : {currentBet}
                    </div>
                )}
                
                {/* Hand score display with P badge */}
                {handScore !== null && ((isCurrentUser && player.hasSeenCards) || isShowdown) && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#22C55E',
                        color: '#FFF',
                        padding: '6px 10px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        border: '2px solid #FFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <span style={{ fontSize: '16px' }}>{handScore}</span>
                        <span style={{ 
                            fontSize: '11px',
                            backgroundColor: '#FFF',
                            color: '#22C55E',
                            padding: '2px 6px',
                            borderRadius: '50%',
                            fontWeight: 'bold'
                        }}>P</span>
                    </div>
                )}
                
                {/* Cards stack - positioned above player card - HORIZONTAL LAYOUT */}
                <div className="cards-stack">
                    {showFaceUp ? (
                        // Show actual cards with suits during reveal/showdown - HORIZONTAL
                        cards.map((card, i) => {
                            const suitIcon = getSuitIcon(card.suit);
                            const suitColor = getSuitColor(card.suit);
                            
                            return (
                                <div 
                                    key={i} 
                                    className={`card-face card-${i + 1}`}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '10px',
                                        padding: '12px 8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '4px',
                                        color: suitColor,
                                        width: '55px',
                                        height: '80px',
                                        border: '3px solid #fff',
                                        animation: 'cardFlip 0.6s ease-out',
                                        flex: '0 0 auto'
                                    }}
                                >
                                    <div style={{ fontSize: '24px', lineHeight: '1', fontWeight: 'bold' }}>{card.rank}</div>
                                    {suitIcon && (
                                        <img 
                                            src={suitIcon} 
                                            alt={card.suit}
                                            style={{ 
                                                width: '28px', 
                                                height: '28px',
                                                filter: suitColor === '#DC143C' ? 'brightness(0) saturate(100%) invert(21%) sepia(88%) saturate(4477%) hue-rotate(343deg) brightness(90%) contrast(88%)' : 'none'
                                            }}
                                        />
                                    )}
                                    <div style={{ fontSize: '24px', lineHeight: '1', fontWeight: 'bold', transform: 'rotate(180deg)' }}>{card.rank}</div>
                                </div>
                            );
                        })
                    ) : (
                        // Show card backs - HORIZONTAL LAYOUT
                        <>
                            <img className="card-back card-1" src={cardBackSrc} alt="card" style={{ width: '64px', height: '97px', objectFit: 'cover', borderRadius: '10px', flex: '0 0 auto' }} />
                            <img className="card-back card-2" src={cardBackSrc} alt="card" style={{ width: '64px', height: '97px', objectFit: 'cover', borderRadius: '10px', flex: '0 0 auto' }} />
                            <img className="card-back card-3" src={cardBackSrc} alt="card" style={{ width: '64px', height: '97px', objectFit: 'cover', borderRadius: '10px', flex: '0 0 auto' }} />
                        </>
                    )}
                </div>
                
                {/* Betting chips - show amount bet in current round */}
                {currentBet > 0 && !isFolded && (
                    <div style={{
                        position: 'absolute',
                        bottom: '-35px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        padding: '8px 16px',
                        borderRadius: '25px',
                        border: '3px solid #fff',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                        animation: 'chipPulse 1s ease-in-out'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                            border: '3px solid #fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                        }}>
                            🎰
                        </div>
                        <span style={{ 
                            color: '#fff', 
                            fontWeight: 'bold', 
                            fontSize: '18px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            {currentBet}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const Felt = ({ totalPot, usdtIconSrc, cardBackSrc, players = [], maxPlayers = 6, currentUserId, showCards = false, playerCards = {}, isShowdown = false, dealerId = null, entryFee = 0, isDealingCards = false, onDealingComplete }) => {
    // Load avatars from assets/images/users using Vite's glob importer
    const avatarModules = import.meta.glob('../../../assets/images/users/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });
    const avatarUrls = Object.values(avatarModules);
    
    // State for managing card visibility during dealing
    const [showPlayerCards, setShowPlayerCards] = useState(false);
    
    // playerCards format: { userId: [{ rank: 'A', suit: '♠' }, ...] }
    
    // When dealing starts, hide cards
    useEffect(() => {
        if (isDealingCards) {
            setShowPlayerCards(false);
        }
    }, [isDealingCards]);
    
    // When dealing completes, show cards
    const handleDealingComplete = () => {
        console.log('🎴 Dealing animation complete, showing cards');
        setShowPlayerCards(true);
        if (onDealingComplete) {
            onDealingComplete();
        }
    };
    
    // If not dealing and we have cards, show them
    useEffect(() => {
        if (!isDealingCards && Object.keys(playerCards).length > 0) {
            setShowPlayerCards(true);
        }
    }, [isDealingCards, playerCards]);
    
    // Bottom center seat (where current user should always be)
    const BOTTOM_CENTER_SEAT = 3;
    
    // Seat layout based on maxPlayers
    const seatLayout = {
        2: { bottomCenter: 3, othersAt: [0] },
        3: { bottomCenter: 3, othersAt: [5, 1] },
        4: { bottomCenter: 3, othersAt: [5, 0, 1] },
        5: { bottomCenter: 3, othersAt: [4, 5, 0, 1] },
        6: { bottomCenter: 3, othersAt: [4, 5, 0, 1, 2] }
    };
    
    const layout = seatLayout[maxPlayers] || seatLayout[6];
    
    // Find current user in players list
    const currentUserIndex = players.findIndex(p => p.userId === currentUserId);
    
    // Rotate players so current user is always at bottom center
    let rotatedPlayers = [...players];
    if (currentUserIndex >= 0) {
        rotatedPlayers = [
            ...players.slice(currentUserIndex),
            ...players.slice(0, currentUserIndex)
        ];
    }
    
    // Assign players to seats
    const seatAssignments = Array(6).fill(null);
    
    // Place current user at bottom center
    if (rotatedPlayers.length > 0) {
        seatAssignments[layout.bottomCenter] = {
            player: rotatedPlayers[0],
            isCurrentUser: true
        };
    }
    
    // Place other players in available seats
    for (let i = 1; i < rotatedPlayers.length; i++) {
        const seatIndex = layout.othersAt[i - 1];
        if (seatIndex !== undefined) {
            seatAssignments[seatIndex] = {
                player: rotatedPlayers[i],
                isCurrentUser: false
            };
        }
    }
    
    // Create seats array (only render up to maxPlayers)
    const seatsToRender = [0, 1, 2, 3, 4, 5].filter(i => {
        if (maxPlayers === 2) return i === 0 || i === 3;
        if (maxPlayers === 3) return i === 1 || i === 3 || i === 5;
        if (maxPlayers === 4) return i === 0 || i === 1 || i === 3 || i === 5;
        if (maxPlayers === 5) return i === 0 || i === 1 || i === 3 || i === 4 || i === 5;
        return true; // maxPlayers === 6, show all
    });
    
    // Get active seat indices for dealing animation
    const activeSeatIndices = seatsToRender.filter(i => seatAssignments[i] !== null);
    
    return (
        <div className="table-area">
            <div className="felt">
                {/* Professional TOTAL POT display - Green box like reference */}
                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '41%',
                    transform: 'translate(-50%, -50%)',
                    background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                    padding: '15px 40px',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
                    border: '2px solid #4ade80',
                    zIndex: 10
                }}>
                    <div style={{
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        opacity: 0.9
                    }}>
                        TOTAL POT
                    </div>
                    <div style={{
                        color: '#fff',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                        {totalPot}
                    </div>
                </div>
                {/* Card Dealing Animation */}
                <CardDealingAnimation 
                    activeSeatIndices={activeSeatIndices}
                    onDealingComplete={handleDealingComplete}
                    isDealing={isDealingCards}
                />
                
                <div className="seats">
                    {seatsToRender.map(i => {
                        const assignment = seatAssignments[i];
                        const playerUserId = assignment?.player?.userId;
                        const cards = playerUserId ? playerCards[playerUserId] : [];
                        const isDealer = playerUserId && playerUserId === dealerId;
                        const handScore = assignment?.player?.handScore;
                        const handDescription = assignment?.player?.handDescription;
                        
                        // Only show cards after dealing animation completes or if not dealing
                        const shouldShowCards = showPlayerCards && (showCards || isShowdown);
                        
                        return (
                        <Seat 
                            key={i} 
                            index={i} 
                                player={assignment?.player}
                                isEmpty={!assignment}
                                isCurrentUser={assignment?.isCurrentUser || false}
                                showCards={shouldShowCards}
                                cards={cards}
                                isShowdown={isShowdown}
                                isDealer={isDealer}
                                handScore={handScore}
                                handDescription={handDescription}
                                entryFee={entryFee}
                            cardBackSrc={cardBackSrc} 
                            usdtIconSrc={usdtIconSrc} 
                            avatarUrl={avatarUrls.length ? avatarUrls[i % avatarUrls.length] : ''}
                        />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Felt;
