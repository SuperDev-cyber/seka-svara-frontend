import React, { useState } from 'react';
import './index.css';

const Controls = ({ 
    socket, 
    tableId, 
    userId, 
    gameStatus = 'waiting', 
    isMyTurn = false, 
    currentBet = 0, 
    myBalance = 1000,
    minRaise = 10,
    hasSeenCards = false, // For blind betting
    players = [] // To show who is playing blind
}) => {
    const [raiseAmount, setRaiseAmount] = useState(minRaise);
    const [isProcessing, setIsProcessing] = useState(false);

    // Don't show controls if game hasn't started or it's not our turn
    const controlsDisabled = gameStatus !== 'in_progress' || !isMyTurn || isProcessing;

    const handleAction = (action, amount = 0) => {
        if (!socket || controlsDisabled) return;
        
        setIsProcessing(true);
        console.log(`🎲 Player action: ${action}`, { tableId, userId, amount });
        
        socket.emit('player_action', {
            tableId,
            userId,
            action,
            amount
        }, (response) => {
            console.log('📥 Player action response:', response);
            setIsProcessing(false);
            
            if (!response?.success) {
                const msg = response?.message || response?.error || 'Unknown error';
                alert(`Action failed: ${msg}`);
            }
        });
    };

    const handleFold = () => handleAction('fold');
    const handleCheck = () => handleAction('check');
    const handleCall = () => handleAction('call', currentBet);
    const handleRaise = () => handleAction('raise', raiseAmount);
    const handleAllIn = () => handleAction('all_in', myBalance);

    // Handle "VIEW CARDS" action (exits blind mode)
    const handleViewCards = () => {
        if (!socket || isProcessing) return;
        
        setIsProcessing(true);
        console.log('👁️ Player viewing cards (exiting blind mode)');
        
        socket.emit('player_view_cards', {
            tableId,
            userId
        }, (response) => {
            console.log('📥 View cards response:', response);
            setIsProcessing(false);
            
            if (!response?.success) {
                const msg = response?.message || response?.error || 'Unknown error';
                alert(`Failed to view cards: ${msg}`);
            }
        });
        
    };

    // Handle "BLIND BET" action (play without seeing cards)
    const handleBlindBet = (action, amount = 0) => {
        if (!socket || isProcessing) return;
        
        setIsProcessing(true);
        console.log(`🎲 Player blind action: ${action}`, { tableId, userId, amount });
        
        socket.emit('player_play_blind', {
            tableId,
            userId,
            action,
            amount
        }, (response) => {
            console.log('📥 Blind action response:', response);
            setIsProcessing(false);
            
            if (!response?.success) {
                const msg = response?.message || response?.error || 'Unknown error';
                alert(`Blind action failed: ${msg}`);
            }
        });
    };

    // Handle "SEE CARDS" action
    const handleSeeCards = () => {
        if (!socket) return;
        
        setIsProcessing(true);
        console.log('👁️ Requesting to see cards...');
        
        socket.emit('see_cards', { tableId, userId }, (response) => {
            console.log('📥 See cards response:', response);
            setIsProcessing(false);
            
            if (!response.success) {
                alert(`Failed: ${response.message}`);
            } else {
                console.log('✅ You can now see your cards!', response.hand);
            }
        });
    };

    // Calculate raise slider percentage
    const maxRaise = myBalance;
    const raisePercentage = maxRaise > 0 ? ((raiseAmount - minRaise) / (maxRaise - minRaise)) * 100 : 0;

    return (
    <div className="controls">
            {gameStatus === 'waiting' ? (
        <div className="controls-bar">
                    <div style={{
                        color: '#888',
                        fontSize: '16px',
                        textAlign: 'center',
                        width: '100%',
                        padding: '20px'
                    }}>
                        Waiting for game to start...
                    </div>
                </div>
            ) : gameStatus === 'in_progress' && !hasSeenCards ? (
                // Show View and Blind buttons when game starts but player hasn't seen cards
                <div className="controls-bar">
                    <div style={{
                        color: '#fff',
                        fontSize: '16px',
                        textAlign: 'center',
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px'
                    }}>
                        🎰 Game Started! Choose your action:
                    </div>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button 
                            className="control-btn view-cards-btn"
                            onClick={handleViewCards}
                            disabled={isProcessing}
                        >
                            👁️ VIEW CARDS
                        </button>
                        <button 
                            className="control-btn blind-bet-btn"
                            onClick={() => handleBlindBet('call', currentBet)}
                            disabled={isProcessing || currentBet === 0}
                        >
                            🎲 BLIND BET
                        </button>
                    </div>
                </div>
            ) : !isMyTurn ? (
                <div className="controls-bar">
                    <div style={{
                        color: '#888',
                        fontSize: '16px',
                        textAlign: 'center',
                        width: '100%',
                        padding: '20px'
                    }}>
                        Waiting for other players...
                    </div>
            </div>
            ) : (
                /* PROFESSIONAL BETTING INTERFACE - Matches reference UI */
                <div className="controls-bar" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#1a1a1a',
                    border: '2px solid #333',
                    borderRadius: '12px',
                    padding: '20px 30px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                    marginTop: '65px',
                    marginLeft: '-350px'
                }}>
                    {/* SEE CARDS - Green button (only if not seen yet) */}
                    {!hasSeenCards && (
                        <button 
                            onClick={handleSeeCards}
                            disabled={controlsDisabled}
                            style={{
                                backgroundColor: '#22c55e',
                                color: '#000',
                                padding: '14px 28px',
                                fontSize: '16px',
                                fontWeight: '700',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: controlsDisabled ? 'not-allowed' : 'pointer',
                                opacity: controlsDisabled ? 0.5 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            SEE CARDS
                        </button>
                    )}
                    
                    {/* FOLD */}
                    <button 
                        onClick={handleFold}
                        disabled={controlsDisabled}
                        style={{
                            backgroundColor: '#2a2a2a',
                            color: '#fff',
                            padding: '14px 32px',
                            fontSize: '16px',
                            fontWeight: '700',
                            border: '1px solid #444',
                            borderRadius: '8px',
                            cursor: controlsDisabled ? 'not-allowed' : 'pointer',
                            opacity: controlsDisabled ? 0.5 : 1,
                            minWidth: '100px'
                        }}
                    >
                        FOLD
                    </button>
                    
                    {/* CALL or CHECK */}
                    {currentBet === 0 ? (
                        <button 
                            onClick={handleCheck}
                            disabled={controlsDisabled}
                            style={{
                                backgroundColor: '#2a2a2a',
                                color: '#fff',
                                padding: '14px 32px',
                                fontSize: '16px',
                                fontWeight: '700',
                                border: '1px solid #444',
                                borderRadius: '8px',
                                cursor: controlsDisabled ? 'not-allowed' : 'pointer',
                                opacity: controlsDisabled ? 0.5 : 1,
                                minWidth: '120px'
                            }}
                        >
                            CHECK
                        </button>
                    ) : (
                        <button 
                            onClick={handleCall}
                            disabled={controlsDisabled || currentBet > myBalance}
                            style={{
                                backgroundColor: '#2a2a2a',
                                color: '#fff',
                                padding: '14px 32px',
                                fontSize: '16px',
                                fontWeight: '700',
                                border: '1px solid #444',
                                borderRadius: '8px',
                                cursor: (controlsDisabled || currentBet > myBalance) ? 'not-allowed' : 'pointer',
                                opacity: (controlsDisabled || currentBet > myBalance) ? 0.5 : 1,
                                minWidth: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <div>CALL</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentBet}</div>
                        </button>
                    )}
                    
                    {/* RAISE with custom amount */}
                    <button 
                        onClick={() => handleAction('raise', raiseAmount)}
                        disabled={controlsDisabled || raiseAmount > myBalance}
                        style={{
                            backgroundColor: '#2a2a2a',
                            color: '#fff',
                            padding: '14px 32px',
                            fontSize: '16px',
                            fontWeight: '700',
                            border: '1px solid #444',
                            borderRadius: '8px',
                            cursor: (controlsDisabled || raiseAmount > myBalance) ? 'not-allowed' : 'pointer',
                            opacity: (controlsDisabled || raiseAmount > myBalance) ? 0.5 : 1,
                            minWidth: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <div>RAISE</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{raiseAmount}</div>
                    </button>
                    
                    {/* QUICK BET BUTTONS: 2X, 5X, MAX */}
                    <button 
                        onClick={() => {
                            const amount = minRaise * 2;
                            setRaiseAmount(amount);
                            handleAction('raise', amount);
                        }}
                        disabled={controlsDisabled}
                        style={{
                            backgroundColor: '#1e3a8a',
                            color: '#fff',
                            padding: '12px 20px',
                            fontSize: '14px',
                            fontWeight: '700',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: controlsDisabled ? 'not-allowed' : 'pointer',
                            opacity: controlsDisabled ? 0.5 : 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px'
                        }}
                    >
                        <div style={{ fontSize: '16px' }}>2X</div>
                        <div style={{ fontSize: '12px' }}>{minRaise * 2}</div>
                    </button>
                    
                    <button 
                        onClick={() => {
                            const amount = minRaise * 5;
                            setRaiseAmount(amount);
                            handleAction('raise', amount);
                        }}
                        disabled={controlsDisabled}
                        style={{
                            backgroundColor: '#1e3a8a',
                            color: '#fff',
                            padding: '12px 20px',
                            fontSize: '14px',
                            fontWeight: '700',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: controlsDisabled ? 'not-allowed' : 'pointer',
                            opacity: controlsDisabled ? 0.5 : 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px'
                        }}
                    >
                        <div style={{ fontSize: '16px' }}>5X</div>
                        <div style={{ fontSize: '12px' }}>{minRaise * 5}</div>
                    </button>
                    
                    <button 
                        onClick={() => {
                            setRaiseAmount(myBalance);
                            handleAction('all_in', myBalance);
                        }}
                        disabled={controlsDisabled}
                        style={{
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            padding: '12px 20px',
                            fontSize: '14px',
                            fontWeight: '700',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: controlsDisabled ? 'not-allowed' : 'pointer',
                            opacity: controlsDisabled ? 0.5 : 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px'
                        }}
                    >
                        <div style={{ fontSize: '16px' }}>MAX</div>
                        <div style={{ fontSize: '12px' }}>{myBalance}</div>
                    </button>
                    
                    {/* Hidden slider for future use */}
                    <input
                        type="range"
                        min={minRaise}
                        max={myBalance}
                        value={raiseAmount}
                        onChange={(e) => setRaiseAmount(parseInt(e.target.value))}
                        style={{ display: 'none' }}
                    />
                </div>
            )}
    </div>
);
};

export default Controls;
