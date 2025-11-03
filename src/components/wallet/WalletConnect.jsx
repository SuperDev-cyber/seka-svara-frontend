import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import './WalletConnect.css';

const WalletConnect = () => {
  const {
    isConnected,
    currentNetwork,
    account,
    balance,
    USDTBalance,
    loading,
    error,
    connectMetaMask,
    connectTronLink,
    disconnect,
    refreshBalances,
    isMetaMaskInstalled,
    isTronLinkInstalled,
    formatAddress,
    formatAmount,
  } = useWallet();

  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  const handleConnect = async (network) => {
    try {
      if (network === 'BEP20') {
        await connectMetaMask();
      } else if (network === 'TRC20') {
        await connectTronLink();
      }
      setShowNetworkSelector(false);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleRefresh = () => {
    refreshBalances();
  };

  if (isConnected) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <div className="wallet-header">
            <div className="network-badge">
              <span className="network-icon">
                {currentNetwork === 'BEP20' ? '🦊' : '🔴'}
              </span>
              <span className="network-name">
                {currentNetwork === 'BEP20' ? 'BSC' : 'Tron'}
              </span>
            </div>
            <div className="wallet-address">
              {formatAddress(account)}
            </div>
          </div>

          {/* <div className="wallet-balances">
            <div className="balance-item">
              <span className="balance-label">Native:</span>
              <span className="balance-value">
                {formatAmount(balance)} {currentNetwork === 'BEP20' ? 'BNB' : 'TRX'}
              </span>
            </div>
            <div className="balance-item">
              <span className="balance-label">USDT:</span>
              <span className="balance-value">
                {formatAmount(USDTBalance)} USDT
              </span>
            </div>
          </div> */}
        </div>

        <div className="wallet-actions">
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh balances"
          >
            🔄
          </button>
          <button
            className="disconnect-btn"
            onClick={handleDisconnect}
            disabled={loading}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      {!showNetworkSelector ? (
        <button
          className="connect-btn"
          onClick={() => setShowNetworkSelector(true)}
          disabled={loading}
        >
          <svg className='wallet-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <line x1="10" y1="9" x2="14" y2="9" />
          </svg>
          {loading ? 'Connecting...' : 'Connect Wallet'}
          <svg className='dropdown-arrow' width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
      ) : (
        <div className="network-selector">
          <div className="selector-header">
            <h3>Choose Network</h3>
            <button
              className="close-btn"
              onClick={() => setShowNetworkSelector(false)}
            >
              ✕
            </button>
          </div>

          <div className="network-options">
            <div className="network-option">
              <div className="network-info">
                <div className="network-icon">🦊</div>
              </div>
              <button
                className="network-btn"
                onClick={() => handleConnect('BEP20')}
                disabled={!isMetaMaskInstalled() || loading}
              >
                {!isMetaMaskInstalled() ? 'MetaMask Required' : 'Connect'}
              </button>
            </div>

            <div className="network-option">
              <div className="network-info">
                <div className="network-icon">🔴</div>
              </div>
              <button
                className="network-btn"
                onClick={() => handleConnect('TRC20')}
                disabled={!isTronLinkInstalled() || loading}
              >
                {!isTronLinkInstalled() ? 'TronLink Required' : 'Connect'}
              </button>
            </div>
          </div>

          <div className="wallet-instructions">
            <p>Don't have a wallet? Install one:</p>
            <div className="wallet-links">
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="wallet-link"
              >
                Install MetaMask
              </a>
              <a
                href="https://www.tronlink.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="wallet-link"
              >
                Install TronLink
              </a>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
