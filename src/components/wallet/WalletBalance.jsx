import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import './WalletBalance.css';

const WalletBalance = ({ showUsdtOnly = false, className = '' }) => {
  const {
    isConnected,
    currentNetwork,
    getBalance,
    loading,
    formatAmount,
  } = useWallet();
  
  const { user } = useAuth();
  const [sekaBalance, setSekaBalance] = useState(null);

  // Fetch SEKA balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && currentNetwork && getBalance) {
        try {
          const balance = await getBalance(currentNetwork);
          setSekaBalance(balance);
        } catch (error) {
          console.error('Error fetching SEKA balance:', error);
          // Fallback to user balance from backend
          setSekaBalance(user?.balance || 0);
        }
      } else {
        // Use backend balance as fallback
        setSekaBalance(user?.balance || 0);
      }
    };

    fetchBalance();
  }, [isConnected, currentNetwork, getBalance, user]);

  return (
    <div className={`wallet-balance ${className}`} style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: '2px solid #ffd700',
      padding: '15px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <div className="balance-icon" style={{ fontSize: '24px' }}>
        🎮
      </div>
      <div className="balance-content">
        <div className="balance-item">
          <span className="balance-label" style={{ 
            fontWeight: 'bold', 
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            SEKA Points
          </span>
          <span className="balance-value" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#ffd700'
          }}>
            {loading ? '...' : formatAmount(sekaBalance || user?.balance || 0)}
          </span>
        </div>
        <div style={{ 
          fontSize: '10px', 
          opacity: 0.8, 
          marginTop: '4px',
          fontStyle: 'italic'
        }}>
          Used for all games
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;