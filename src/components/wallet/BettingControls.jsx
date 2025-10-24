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
  currentBet = 0,
  minBet = 25,
  maxBet = 1000,
  potSize = 0,
  isPlayerTurn = false,
  playerBalance = 0
}) => {
  const { isConnected, getBalance, currentNetwork, loading } = useWallet();
  const { user } = useAuth();
  const [betAmount, setBetAmount] = useState(minBet);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [error, setError] = useState(null);
  const [sekaBalance, setSekaBalance] = useState(null);

  // Fetch SEKA balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && currentNetwork && getBalance) {
        try {
          const balance = await getBalance(currentNetwork);
          setSekaBalance(parseFloat(balance) || 0);
        } catch (error) {
          console.error('Error fetching SEKA balance:', error);
          setSekaBalance(parseFloat(user?.balance) || 0);
        }
      } else {
        setSekaBalance(parseFloat(user?.balance) || 0);
      }
    };

    fetchBalance();
  }, [isConnected, currentNetwork, getBalance, user]);

  const availableBalance = sekaBalance || parseFloat(user?.balance) || 0;
  const canBet = isConnected && availableBalance >= minBet && isPlayerTurn;
  const canCall = currentBet > 0 && availableBalance >= currentBet;
  const canRaise = availableBalance > currentBet;
  const canAllIn = availableBalance > 0;

  const handleBetAmountChange = useCallback((value) => {
    const amount = Math.max(minBet, Math.min(maxBet, value));
    setBetAmount(amount);
    setError(null);
  }, [minBet, maxBet]);

  const handleBet = useCallback(async () => {
    if (!canBet) return;

    try {
      setIsPlacingBet(true);
      setError(null);

      // All bets use SEKA Points, not actual wallet funds
      if (betAmount > availableBalance) {
        throw new Error('Insufficient SEKA balance');
      }

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onBet(betAmount);
      setBetAmount(minBet);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  }, [canBet, betAmount, availableBalance, onBet, minBet]);

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

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onRaise(betAmount);
      setBetAmount(minBet);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  }, [canRaise, betAmount, availableBalance, onRaise, minBet]);

  const handleAllIn = useCallback(async () => {
    if (!canAllIn) return;

    try {
      setIsPlacingBet(true);
      setError(null);

      const allInAmount = availableBalance;
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onAllIn(allInAmount);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  }, [canAllIn, availableBalance, onAllIn]);

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
          <span>No SEKA Points! Deposit USDT to get SEKA Points</span>
        </div>
      </div>
    );
  }

  return (
    <div className="betting-controls">
      {error && (
        <div className="betting-error">
          <span>⚠️ {error}</span>
        </div>
      )}

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
            Call {currentBet} SEKA
          </button>
        )}

        <button
          className="betting-btn bet-btn"
          onClick={handleBet}
          disabled={!canBet || isPlacingBet}
        >
          {currentBet > 0 ? 'Bet' : 'Bet'} {betAmount} SEKA
        </button>
      </div>

      <div className="betting-slider">
        <div className="slider-header">
          <span>Bet Amount: {betAmount} SEKA</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={minBet}
            max={Math.min(maxBet, availableBalance)}
            value={betAmount}
            onChange={(e) => handleBetAmountChange(parseInt(e.target.value))}
            className="betting-slider-input"
            disabled={!isPlayerTurn || isPlacingBet}
          />
          <div className="slider-labels">
            <span>{minBet}</span>
            <span>{Math.min(maxBet, availableBalance)}</span>
          </div>
        </div>
      </div>

      <div className="betting-actions-secondary">
        <button
          className="betting-btn raise-btn"
          onClick={handleRaise}
          disabled={!canRaise || isPlayerTurn || isPlacingBet}
        >
          Raise {betAmount} SEKA
        </button>

        <button
          className="betting-btn allin-btn"
          onClick={handleAllIn}
          disabled={!canAllIn || !isPlayerTurn || isPlacingBet}
        >
          All In ({availableBalance.toFixed(2)} SEKA)
        </button>
      </div>

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
