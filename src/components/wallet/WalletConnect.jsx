import React, { useState } from 'react';
import { useSafeAuth } from '../../contexts/SafeAuthContext';
import './WalletConnect.css';

const WalletConnect = () => {
  const {
    loginWithWallet: safeAuthLoginWallet,
    loggedIn: safeAuthLoggedIn,
    account: safeAuthAccount,
    loading: safeAuthLoading,
    initError: safeAuthInitError,
    logout: safeAuthLogout,
  } = useSafeAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Web3Auth wallet connection - PURELY FRONTEND, NO BACKEND CALLS
  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError('');

      // Login with SafeAuth (Web3Auth) - opens modal with Google and wallet options
      // This is purely frontend - no backend calls
      const result = await safeAuthLoginWallet();
      
      if (!result) {
        throw new Error('Failed to connect with SafeAuth');
      }

      // Wallet connected successfully - no backend authentication needed
      if (window.showToast) {
        window.showToast('Wallet connected successfully!', 'success', 3000);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      if (window.showToast) {
        window.showToast(err.message || 'Wallet connection failed', 'error', 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await safeAuthLogout();
      if (window.showToast) {
        window.showToast('Wallet disconnected', 'info', 2000);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  // Show connected state
  if (safeAuthLoggedIn && safeAuthAccount) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <div className="wallet-header">
            <div className="network-badge">
              <span className="network-icon">🔷</span>
              <span className="network-name">BSC</span>
            </div>
            <div className="wallet-address">
              {safeAuthAccount.substring(0, 6)}...{safeAuthAccount.substring(safeAuthAccount.length - 4)}
            </div>
          </div>
        </div>

        <div className="wallet-actions">
          <button
            className="disconnect-btn"
            onClick={handleDisconnect}
            disabled={loading || safeAuthLoading}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  // Show connect button
  return (
    <div className="wallet-connect">
      {safeAuthInitError && (
        <div className="error-message" style={{ marginBottom: '8px' }}>
          <span>⚠️ {safeAuthInitError}</span>
        </div>
      )}
      
      {safeAuthLoading && (
        <div style={{ 
          padding: '8px', 
          backgroundColor: '#eef', 
          border: '1px solid #ccf', 
          borderRadius: '4px',
          color: '#33c',
          fontSize: '12px',
          marginBottom: '8px'
        }}>
          🔄 Initializing Web3Auth...
        </div>
      )}

      <button
        className="connect-btn"
        onClick={handleConnectWallet}
        disabled={loading || safeAuthLoading || !!safeAuthInitError}
      >
        <svg className='wallet-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <line x1="10" y1="9" x2="14" y2="9" />
        </svg>
        {loading || safeAuthLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
