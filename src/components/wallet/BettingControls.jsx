import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import './BettingControls.css';

const BettingControls = ({ 
  onBet, 
  onFold, 
  onCall, 
  onRaise, 
  onAllIn,
  onBlind, // Added blind betting callback
  currentBet = 0,
  minBet = 25,
  maxBet = 1000,
  potSize = 0,
  isPlayerTurn = false,
  playerBalance,
  hasSeenCards = false, // Track if player has seen cards
  // ✅ NEW: Props for VIEW CARDS functionality
  gameActions,
  userId,
  playerCards,
  players,
  setPlayerCards,
  setPlayers,
  setHasViewedCards,
  setCardsDealt,
  setCardViewers,
  cardsDealt,
  cardViewers
}) => {
  const { isConnected, getBalance, currentNetwork, loading, balance,   } = useWallet();
  const { user } = useAuth();
  const [betMultiplier, setBetMultiplier] = useState(1); // ✅ Multiplier: 1x, 2x, 3x, etc.
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [error, setError] = useState(null);
  const [sekaBalance, setSekaBalance] = useState(null);
  
  // ✅ Calculate minimum raise: 2x current bet, or minBet if no current bet
  const minRaise = currentBet > 0 ? currentBet * 2 : minBet;
  
  // ✅ Calculate bet amount based on minRaise * multiplier
  const betAmount = minRaise * betMultiplier;
  console.log('playerBalance', playerBalance);
  console.log('balance----------------------', sekaBalance); console.log('playerBalance', playerBalance);
  console.log('currentBet', currentBet);
  console.log('minBet', minBet);
  console.log('maxBet', maxBet);
  console.log('potSize', potSize);
  console.log('isPlayerTurn', isPlayerTurn);
  console.log('hasSeenCards', hasSeenCards);
  console.log('onBet', onBet);
  console.log('onFold', onFold);
  console.log('onCall', onCall);
  console.log('onRaise', onRaise);
  console.log('onAllIn', onAllIn);
  console.log('onBlind', onBlind);
  // Fetch SEKA balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && currentNetwork && getBalance) {
        try {
          const balance = await getBalance(currentNetwork);
          setSekaBalance(parseFloat(balance) || 0);
        } catch (error) {
          console.error('Error fetching SEKA balance2:', error);
          setSekaBalance(parseFloat(user?.balance) || 0);
        }
      } else {
        setSekaBalance(parseFloat(user?.balance) || 0);
      }
    };

    fetchBalance();
  }, [isConnected, currentNetwork, getBalance, user]);

  // ✅ Use in-game balance (playerBalance prop) instead of total platformScore
  // playerBalance = amount currently at the table (e.g., 90 SEKA from coin display)
  // NOT the total Seka Svara score in header (e.g., 2320 SEKA)
  const availableBalance = playerBalance || 0;
  const canBet = isConnected && availableBalance >= minRaise && isPlayerTurn;
  const canCall = currentBet > 0 && availableBalance >= currentBet;
  const canRaise = availableBalance > currentBet;
  const canAllIn = availableBalance > 0;

  // ✅ Calculate maximum multiplier based on available balance and minRaise
  const maxMultiplier = Math.max(1, Math.floor(Math.min(maxBet, availableBalance) / minRaise));
  
  const handleBetMultiplierChange = useCallback((multiplier) => {
    const validMultiplier = Math.max(1, Math.min(maxMultiplier, multiplier));
    setBetMultiplier(validMultiplier);
    setError(null);
  }, [maxMultiplier]);

  const handleBet = useCallback(async () => {
    if (!canBet) return;

    try {
      setIsPlacingBet(true);
      setError(null);

      // All bets use SEKA Points, not actual wallet funds
      if (betAmount > availableBalance) {
        throw new Error('Insufficient SEKA balance');
      }

      // ✅ Direct SEKA points betting (no blockchain transaction needed)
      onBet(betAmount);
      setBetMultiplier(1); // Reset to 1x after betting
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  }, [canBet, betAmount, availableBalance, onBet]);

  const handleFold = useCallback(() => {
    if (onFold) onFold();
  }, [onFold]);

  const handleCall = useCallback(async () => {
    if (!canCall) return;

    try {
      setIsPlacingBet(true);
      setError(null);

      if (currentBet > availableBalance) {
        throw new Error('Insufficient SEKA balance');
      }

      // ✅ Direct SEKA points betting (no blockchain transaction needed)
      onCall(currentBet);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  }, [canCall, currentBet, availableBalance, onCall]);

  const handleRaise = useCallback(async () => {
    if (!canRaise) return;

    try {
      setIsPlacingBet(true);
      setError(null);

      if (betAmount > availableBalance) {
        throw new Error('Insufficient SEKA balance');
      }

      // ✅ Direct SEKA points betting (no blockchain transaction needed)
      onRaise(betAmount);
      setBetMultiplier(1); // Reset to 1x after raising
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  }, [canRaise, betAmount, availableBalance, onRaise]);

  const handleAllIn = useCallback(async () => {
    if (!canAllIn) return;

    try {
      setIsPlacingBet(true);
      setError(null);

      const allInAmount = availableBalance;
      
      // ✅ Direct SEKA points betting (no blockchain transaction needed)
      onAllIn(allInAmount);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  }, [canAllIn, availableBalance, onAllIn]);

  const handleBlind = useCallback(async () => {
    if (!isPlayerTurn || isPlacingBet) return;

    try {
      setIsPlacingBet(true);
      setError(null);

      // ✅ BLIND amount = 2 × current pot
      const blindAmount = potSize * 2;

      if (blindAmount > availableBalance) {
        throw new Error('Insufficient SEKA balance');
      }

      // ✅ Direct SEKA points betting (no blockchain transaction needed)
      if (onBlind) {
        onBlind(blindAmount); // Bet 2× the pot
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  }, [isPlayerTurn, isPlacingBet, potSize, availableBalance, onBlind]);

  if (!user) {
    return (
      <div className="betting-controls-disconnected">
        <div className="disconnected-message">
          <span>🔒</span>
          <span>Sign in to place bets with SEKA Points</span>
        </div>
      </div>
    );
  }

  if (availableBalance === 0) {
    return (
      <div className="betting-controls-disconnected">
        <div className="disconnected-message" style={{
          background: 'linear-gradient(135deg, #ff6b6b40 0%, #ee5a6f40 100%)',
          border: '2px solid #ff6b6b', padding: '20px 0',
          borderRadius: '20px'
        }}>
          <span>⚠️</span>
          <span>No SEKA USDT! Deposit USDT to get SEKA USDT</span>
        </div>
      </div>
    );
  }

  // ✅ VIEW CARDS handler
  const handleViewCards = useCallback(async () => {
    if (!gameActions || !userId) {
      console.error('❌ Missing gameActions or userId');
      return;
    }

    try {
      setIsPlacingBet(true);
      const response = await gameActions.viewCards();
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('👁️ VIEW CARDS - Response received from hook');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 CURRENT USER WHO CLICKED:');
      console.log('   userId:', userId);
      console.log('');
      console.log('📍 RESPONSE FROM BACKEND:');
      console.log('   response:', response);
      console.log('   response.hand:', response?.hand);
      console.log('   response.handScore:', response?.handScore);
      console.log('   response.handDescription:', response?.handDescription);
      console.log('');
      console.log('📍 CURRENT STATE BEFORE UPDATE:');
      console.log('   playerCards:', playerCards);
      console.log('   players:', players.map(p => ({
        userId: p.userId,
        email: p.email,
        hasSeenCards: p.hasSeenCards
      })));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // ✅ UPDATE: Extract cards from response and update playerCards state
      if (response && response.hand && Array.isArray(response.hand) && response.hand.length > 0) {
        setPlayerCards(prev => {
          const updated = { ...prev, [userId]: response.hand };
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('🎴 UPDATING playerCards STATE:');
          console.log('   Previous:', prev);
          console.log('   Adding cards for userId:', userId);
          console.log('   New cards:', response.hand);
          console.log('   Updated state:', updated);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          return updated;
        });
      } else {
        console.error('❌ Invalid response.hand:', response?.hand);
      }
      
      // ✅ UPDATE: Mark player as having seen cards in players state
      setPlayers(prevPlayers => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👥 UPDATING players STATE:');
        console.log('   Previous players:', prevPlayers.map(p => ({
          userId: p.userId,
          email: p.email,
          hasSeenCards: p.hasSeenCards
        })));
        console.log('   Looking for userId:', userId);
        
        const updated = prevPlayers.map(p => {
          if (p.userId === userId) {
            console.log('   ✅ FOUND MATCH! Updating player:', p.userId);
            console.log('      Setting hasSeenCards: false → true');
            console.log('      Setting hand:', response.hand);
            console.log('      Setting handScore:', response.handScore);
            console.log('      Setting handDescription:', response.handDescription);
            return { 
              ...p, 
              hasSeenCards: true, 
              hand: response.hand, 
              handScore: response.handScore, 
              handDescription: response.handDescription 
            };
          } else {
            console.log('   ⏭️  Skipping player:', p.userId, '(not the current user)');
            return p;
          }
        });
        
        console.log('   Updated players:', updated.map(p => ({
          userId: p.userId,
          email: p.email,
          hasSeenCards: p.hasSeenCards
        })));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return updated;
      });
      
      setHasViewedCards(true);
      setCardsDealt(true);
      
      // ✅ UPDATE: Extract cardViewers array from backend response
      if (response?.gameState?.cardViewers) {
        setCardViewers(response.gameState.cardViewers);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👁️ UPDATED cardViewers STATE FROM BACKEND:');
        console.log('   cardViewers:', response.gameState.cardViewers);
        console.log('   Total viewers:', response.gameState.cardViewers.length);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ ALL STATE UPDATES COMPLETED');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.error('❌ View cards failed:', error.message);
      setError(`Failed to view cards: ${error.message}`);
    } finally {
      setIsPlacingBet(false);
    }
  }, [gameActions, userId, playerCards, players, setPlayerCards, setPlayers, setHasViewedCards, setCardsDealt, setCardViewers]);

  return (
    <div className="betting-controls">
      {error && (
        <div className="betting-error">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* ✅ BEFORE viewing cards: Show VIEW CARDS and BLIND buttons */}
      {!hasSeenCards && (
        <>
          {/* VIEW CARDS Button */}
          {cardsDealt && !cardViewers?.includes(userId) && (
            <div className="view-cards-prompt" style={{
              // padding: '20px',
              // background: 'linear-gradient(135deg, #1a2332, #12192a)',
              // borderRadius: '15px',
              // border: '3px solid #4caf50',
              // boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              // textAlign: 'center',
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}>
              <button 
                className="view-cards-btn"
                onClick={handleViewCards}
                disabled={isPlacingBet}
                style={{
                  padding: '18px 40px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4caf50, #45a049)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  cursor: isPlacingBet ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                  opacity: isPlacingBet ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  width: '100%',
                  height: '60px'
                }}
              >
                VIEW 
              </button>
              <button
              className="betting-btn blind-btn"
              onClick={handleBlind}
              disabled={!isPlayerTurn || isPlacingBet}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                border: '2px solid #9F7AEA',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '18px 40px',
                borderRadius: '12px',
                color: 'white',
                cursor: !isPlayerTurn || isPlacingBet ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                height: '60px'
              }}
            >
              BLIND
            </button>
            </div>
          )}
          
          {/* BLIND Button */}
          <div className="betting-actions">
            
          </div>
        </>
      )}

      {/* ✅ AFTER viewing cards: Show ALL betting controls */}
      {hasSeenCards && (
        <>
          <div className="betting-actions">
            <button
              className="betting-btn fold-btn"
              onClick={handleFold}
              disabled={!isPlayerTurn || isPlacingBet}
            >
              Fold
            </button>

            {canCall && (
              <button
                className="betting-btn call-btn"
                onClick={handleCall}
                disabled={!isPlayerTurn || isPlacingBet}
              >
                Call {Math.round(currentBet)} USDT
              </button>
            )}

            <button
              className="betting-btn bet-btn"
              onClick={handleBet}
              disabled={!canBet || isPlacingBet}
            >
              {currentBet > 0 ? 'Bet' : 'Bet'} {Math.round(betAmount)} USDT
            </button>
          </div>

          <div className="betting-slider">
            <div className="slider-header" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '14px', color: '#aaa' }}>Multiplier: {betMultiplier}x</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffd700' }}>
                Bet: {Math.round(betAmount)} USDT
              </span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min={1}
                max={Math.max(1, maxMultiplier)}
                step={1}
                value={betMultiplier}
                onChange={(e) => handleBetMultiplierChange(parseInt(e.target.value))}
                className="betting-slider-input"
                disabled={!isPlayerTurn || isPlacingBet}
              />
              <div className="slider-labels">
                <span>1x ({Math.round(minRaise)} USDT)</span>
                <span>{maxMultiplier}x ({Math.round(minRaise * maxMultiplier)} USDT)</span>
              </div>
            </div>
          </div>

          <div className="betting-actions-secondary">
            <button
              className="betting-btn raise-btn"
              onClick={handleRaise}
              disabled={!canRaise || isPlayerTurn || isPlacingBet}
            >
              Raise {Math.round(betAmount)} USDT
            </button>

            <button
              className="betting-btn allin-btn"
              onClick={handleAllIn}
              disabled={!canAllIn || !isPlayerTurn || isPlacingBet}
            >
              All In ({Math.round(availableBalance)} USDT)
            </button>
          </div>
        </>
      )}

      {isPlacingBet && (
        <div className="betting-loading">
          <div className="loading-spinner"></div>
          <span>Processing transaction...</span>
        </div>
      )}
    </div>
  );
};

export default BettingControls;
