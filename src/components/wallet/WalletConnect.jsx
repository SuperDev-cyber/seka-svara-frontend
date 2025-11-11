import React, { useState, useEffect } from 'react';
import { useSafeAuth } from '../../contexts/SafeAuthContext';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
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
  const { refreshUserProfile, isAuthenticated, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-authenticate if Web3Auth is already connected but AuthContext is not authenticated
  // ✅ WALLET CONNECTION = IMMEDIATE AUTHENTICATION
  useEffect(() => {
    let isMounted = true;
    let retryTimeout = null;
    
    const autoAuth = async () => {
      if (safeAuthLoggedIn && safeAuthAccount && !isAuthenticated && !loading && !safeAuthLoading) {
        console.log('🔄 Web3Auth connected, authenticating immediately...');
        try {
          const userInfo = safeAuthUser;
          const email = userInfo?.email;
          const name = userInfo?.name;
          
          // ✅ STEP 1: Register/login on backend FIRST (blocking)
          // This ensures user is stored in database before frontend authentication
          console.log('📡 Registering/authenticating with backend...');
          let authResponse;
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries && isMounted) {
            try {
              authResponse = await apiService.loginWithWeb3Auth(safeAuthAccount, email, name);
              console.log('✅ Backend registration successful:', authResponse);
              break; // Success, exit retry loop
            } catch (error) {
              retryCount++;
              console.error(`❌ Backend registration failed (attempt ${retryCount}/${maxRetries}):`, error);
              
              if (retryCount < maxRetries) {
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
              } else {
                // All retries failed, but continue with temporary authentication
                console.error('❌ Backend registration failed after all retries, using temporary auth');
              }
            }
          }
          
          // ✅ STEP 2: Authenticate frontend with backend user data (if available) or wallet data
          const userData = authResponse?.user || {
            id: safeAuthAccount,
            username: email ? email.split('@')[0] + '_web3' : 'user_' + safeAuthAccount.substring(2, 10),
            email: email || `${safeAuthAccount}@web3auth.local`,
            bep20WalletAddress: safeAuthAccount,
            platformScore: 0,
            balance: 0,
            role: 'USER',
          };

          if (isMounted) {
            await login({
              walletAddress: safeAuthAccount,
              email,
              name,
              isWeb3Auth: true,
              user: userData
            });

            console.log('✅ User authenticated via wallet connection');

            // ✅ STEP 3: Refresh user profile to get latest data from backend
            if (authResponse) {
              try {
                await refreshUserProfile();
                console.log('✅ User profile refreshed from backend');
              } catch (err) {
                console.error('⚠️ Profile refresh failed (non-critical):', err);
              }
            }
          }
        } catch (error) {
          console.error('❌ Auto-authentication failed:', error);
        }
      }
    };

    autoAuth();
    
    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [safeAuthLoggedIn, safeAuthAccount, isAuthenticated, safeAuthUser, loading, safeAuthLoading, login, refreshUserProfile]);

  // Handle Web3Auth wallet connection - WALLET CONNECTION = IMMEDIATE AUTHENTICATION
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

      // Step 2: Register/login user on backend FIRST (blocking)
      // This ensures user is stored in database before frontend authentication
      console.log('📡 Registering/authenticating with backend...');
      let authResponse;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          authResponse = await apiService.loginWithWeb3Auth(walletAddress, email, name);
          console.log('✅ Backend authentication successful:', authResponse);
          break; // Success, exit retry loop
        } catch (authError) {
          retryCount++;
          console.error(`❌ Backend authentication error (attempt ${retryCount}/${maxRetries}):`, authError);
          
          if (retryCount < maxRetries) {
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
          } else {
            // All retries failed, but continue with temporary authentication
            console.error('❌ Backend authentication failed after all retries, using temporary auth');
          }
        }
      }
      
      // Step 3: Authenticate frontend with backend user data (if available) or create wallet user
      const userData = authResponse?.user || {
        id: walletAddress, // Use wallet address as temporary ID
        username: email ? email.split('@')[0] + '_web3' : 'user_' + walletAddress.substring(2, 10),
        email: email || `${walletAddress}@web3auth.local`,
        bep20WalletAddress: walletAddress,
        platformScore: 0,
        balance: 0,
        role: 'USER',
      };
      
      await login({
        walletAddress,
        email,
        name,
        isWeb3Auth: true,
        user: userData
      });

      console.log('✅ User authenticated via wallet connection');

      if (window.showToast) {
        window.showToast('Wallet connected! You are now authenticated.', 'success', 3000);
      }

      // Step 4: Refresh user profile to get latest data from backend
      if (authResponse) {
        try {
          await refreshUserProfile();
          console.log('✅ User profile refreshed from backend');
        } catch (err) {
          console.error('⚠️ Profile refresh failed (non-critical):', err);
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
    </div>
  );
};

export default WalletConnect;
