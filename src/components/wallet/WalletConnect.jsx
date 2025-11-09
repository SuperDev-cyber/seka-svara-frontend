import React, { useState, useEffect } from 'react';
import { useSafeAuth } from '../../contexts/SafeAuthContext';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import LegalLinks from '../legal/LegalLinks';
import './WalletConnect.css';

const WalletConnect = () => {
  const {
    loginWithWallet: safeAuthLoginWallet,
    loggedIn: safeAuthLoggedIn,
    account: safeAuthAccount,
    user: safeAuthUser,
    loading: safeAuthLoading,
    initError: safeAuthInitError,
    logout: safeAuthLogout,
  } = useSafeAuth();
  const { refreshUserProfile, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-authenticate with backend if Web3Auth is already connected but backend is not authenticated
  useEffect(() => {
    const autoAuth = async () => {
      if (safeAuthLoggedIn && safeAuthAccount && !isAuthenticated && !loading && !safeAuthLoading) {
        console.log('🔄 Web3Auth connected but backend not authenticated, auto-authenticating...');
        try {
          const userInfo = safeAuthUser;
          const email = userInfo?.email;
          const name = userInfo?.name;
          
          const authResponse = await apiService.loginWithWeb3Auth(safeAuthAccount, email, name);
          console.log('✅ Auto-authentication successful:', authResponse);
          
          await refreshUserProfile();
        } catch (error) {
          console.error('❌ Auto-authentication failed:', error);
        }
      }
    };

    autoAuth();
  }, [safeAuthLoggedIn, safeAuthAccount, isAuthenticated, safeAuthUser, loading, safeAuthLoading, refreshUserProfile]);

  // Handle Web3Auth wallet connection - AUTOMATICALLY REGISTERS/LOGS IN USER
  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Login with SafeAuth (Web3Auth) - opens modal with Google and wallet options
      const result = await safeAuthLoginWallet();
      
      if (!result) {
        throw new Error('Failed to connect with SafeAuth');
      }

      // Get wallet address from result or from safeAuthAccount
      const walletAddress = result.address || safeAuthAccount;
      if (!walletAddress) {
        throw new Error('Failed to get wallet address from Web3Auth');
      }

      // Get user info from result or from safeAuthUser
      const userInfo = result.user || safeAuthUser;
      const email = userInfo?.email;
      const name = userInfo?.name;

      console.log('✅ Web3Auth connected:', { walletAddress, email, name });

      // Step 2: Automatically register/login user on backend
      try {
        const authResponse = await apiService.loginWithWeb3Auth(walletAddress, email, name);
        console.log('✅ Backend authentication successful:', authResponse);
        
        // Step 3: Refresh user profile to get latest data
        await refreshUserProfile();
        
        if (window.showToast) {
          window.showToast('Wallet connected and authenticated successfully!', 'success', 3000);
        }
      } catch (authError) {
        console.error('❌ Backend authentication error:', authError);
        // Even if backend auth fails, wallet is still connected
        if (window.showToast) {
          window.showToast('Wallet connected, but authentication failed. Please try again.', 'error', 5000);
        }
        throw authError;
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
      // Logout from backend first
      try {
        await apiService.logout();
      } catch (error) {
        console.error('Backend logout error:', error);
      }
      
      // Then logout from Web3Auth
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

      <LegalLinks variant="modal" />
    </div>
  );
};

export default WalletConnect;
