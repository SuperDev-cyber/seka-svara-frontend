import React, { useState } from 'react';
import { useSafeAuth } from '../../contexts/SafeAuthContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const { login, register, refreshUserProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Web3Auth wallet connection
  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError('');

      // If user is not authenticated, redirect to login
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // Login with SafeAuth (Web3Auth) - opens modal with Google and wallet options
      const result = await safeAuthLoginWallet();
      
      if (!result) {
        throw new Error('Failed to connect with SafeAuth');
      }

      // Get user info - could be from Google login or wallet
      const userEmail = result.user?.email || result.user?.name || null;
      const walletAddress = result.address;
      
      // Determine identifier: prefer email (from Google) over wallet address
      const identifier = userEmail || `${walletAddress}@wallet.local`;
      
      // Use consistent password for Web3Auth users
      const web3AuthPassword = 'Web3Auth_Default_Password_2024';
      
      // Register/Login with backend using AuthContext functions
      // This ensures AuthContext state is properly updated
      try {
        // Try to login first (user might already exist)
        try {
          await login({
            email: identifier,
            password: web3AuthPassword,
          });
          
          // Refresh user profile to ensure UI updates
          if (refreshUserProfile) {
            await refreshUserProfile();
          }
          
          if (window.showToast) {
            window.showToast('Wallet connected successfully!', 'success', 3000);
          }
        } catch (loginError) {
          console.log('Login failed, trying to register...', loginError);
          
          // Register new user with consistent password
          const isGoogleLogin = !!userEmail;
          const email = identifier;
          const username = isGoogleLogin 
            ? (userEmail.split('@')[0] + '_' + Date.now().toString().substring(10))
            : `wallet_${walletAddress.substring(2, 10)}_${Date.now().toString().substring(10)}`;
          
          await register({
            username: username,
            email: email,
            password: web3AuthPassword,
            confirmPassword: web3AuthPassword,
          });

          // Refresh user profile to ensure UI updates
          if (refreshUserProfile) {
            await refreshUserProfile();
          }

          if (window.showToast) {
            window.showToast('Wallet registered successfully!', 'success', 3000);
          }
        }
      } catch (authError) {
        console.error('Authentication error:', authError);
        // If registration fails because user exists, try login again
        if (authError.message?.includes('already exists') || authError.response?.status === 409) {
          try {
            await login({
              email: identifier,
              password: web3AuthPassword,
            });
            
            if (refreshUserProfile) {
              await refreshUserProfile();
            }
            
            if (window.showToast) {
              window.showToast('Wallet connected successfully!', 'success', 3000);
            }
          } catch (retryLoginError) {
            console.error('Retry login also failed:', retryLoginError);
            throw new Error('Failed to authenticate with backend');
          }
        } else {
          throw new Error('Failed to authenticate with backend');
        }
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
        disabled={loading || safeAuthLoading || !!safeAuthInitError || !isAuthenticated}
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

      {!isAuthenticated && (
        <div style={{ 
          marginTop: '8px',
          fontSize: '12px',
          color: '#ffa500',
          textAlign: 'center'
        }}>
          Please sign in first
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
