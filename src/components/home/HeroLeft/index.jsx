import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../../contexts/WalletContext';
import { useAuth } from '../../../contexts/AuthContext';

const HeroLeft = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
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
        isMetaMaskInstalled,
        isTronLinkInstalled,
        formatAddress,
        formatAmount,
    } = useWallet();

    const [showWalletDropdown, setShowWalletDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Handle Play Now button click
    const handlePlayNow = () => {
        if (!isAuthenticated) {
            // Show notification for unregistered users
            if (window.showToast) {
                window.showToast('Please sign in to access the game lobby', 'warning', 4000);
            }
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }
        
        if (isConnected) {
            navigate('/gamelobby');
        } else {
            // Show wallet connection prompt
            setShowWalletDropdown(true);
        }
    };

    // Handle wallet connection
    const handleConnectWallet = async (network) => {
        if (!isAuthenticated) {
            setError('Please sign in first to connect your wallet');
            return;
        }
        
        try {
            if (network === 'BEP20') {
                await connectMetaMask();
            } else if (network === 'TRC20') {
                await connectTronLink();
            }
            setShowWalletDropdown(false);
        } catch (error) {
            console.error('Wallet connection failed:', error);
            // Error will be displayed in the dropdown via the WalletContext
        }
    };

    // Handle disconnect
    const handleDisconnect = () => {
        disconnect();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowWalletDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debug TronLink detection
    useEffect(() => {
        const debugTronLink = () => {
            // console.log('TronLink Debug Info:');
            // console.log('- window.tronWeb:', typeof window.tronWeb);
            // console.log('- window.tronLink:', typeof window.tronLink);
            // console.log('- window.tronWeb?.ready:', window.tronWeb?.ready);
            // console.log('- isTronLinkInstalled():', isTronLinkInstalled());
            // console.log('- TronLink extension detected:', document.querySelector('script[src*="tronlink"]') !== null);
        };
        
        // Debug on component mount
        debugTronLink();
        
        // Debug when TronLink state might change
        const interval = setInterval(debugTronLink, 2000);
        
        return () => clearInterval(interval);
    }, [isTronLinkInstalled]);

    return (
        <div className='hero-left'>
            {/* Now Live Tag */}
            <div className='live-tag'>
                <p>🎮</p>
                Now Live on Blockchain
            </div>

            {/* Main Title */}
            <h1 className='main-title'>
                <div className='title-line-1'>
                    <span className='title-text'>PLAY</span>
                    <span className='title-highlight'>SEKA SVARA</span>
                    <span className='title-text'>WIN</span>
                </div>
                <div className='title-line-2'>
                    <span className='title-USDT'>REAL USDT</span>
                </div>
            </h1>

            {/* Description */}
            <p className='description'>
                Compete with players worldwide in the classic 3-card game. Bet smart, play better, and win big on BEP20 or TRC20 networks.
            </p>

            {/* Action Buttons */}
            <div className='action-buttons'>
                <button className='play-now-btn' onClick={handlePlayNow}>
                    <svg className='play-icon' width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Play Now
                </button>
                
                {/* Wallet Connection Button with Dropdown */}
                <div className='wallet-connect-container' ref={dropdownRef}>
                    <button 
                        className='connect-wallet-btn'
                        onClick={() => {
                            if (!isAuthenticated) {
                                // Show notification for unregistered users
                                if (window.showToast) {
                                    window.showToast('Please sign in to connect your wallet', 'warning', 4000);
                                }
                                navigate('/login');
                                return;
                            }
                            setShowWalletDropdown(!showWalletDropdown);
                        }}
                        disabled={loading || !isAuthenticated}
                    >
                        <svg className='wallet-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                            <line x1="10" y1="9" x2="14" y2="9" />
                        </svg>
                        {loading ? 'Connecting...' : !isAuthenticated ? 'Sign In Required' : 'Connect Wallet'}
                        <svg className='dropdown-arrow' width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </button>

                    {/* Wallet Dropdown */}
                    {showWalletDropdown && isAuthenticated && (
                        <div className='wallet-dropdown'>
                            <div className='dropdown-header'>
                                <h3>Connect Wallet</h3>
                                <button 
                                    className='close-btn'
                                    onClick={() => setShowWalletDropdown(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className='wallet-options'>
                                {/* MetaMask Option */}
                                <div className='wallet-option'>
                                    <div className='wallet-info'>
                                        <div className='wallet-icon'>🦊</div>
                                        <div className='wallet-details'>
                                            <h4>MetaMask</h4>
                                            <p>Connect to Binance Smart Chain</p>
                                        </div>
                                    </div>
                                    <button
                                        className='wallet-connect-btn'
                                        onClick={() => handleConnectWallet('BEP20')}
                                        disabled={!isMetaMaskInstalled() || loading}
                                    >
                                        {!isMetaMaskInstalled() ? 'Install MetaMask' : 'Connect'}
                                    </button>
                                </div>
                                
                                {/* TronLink Option */}
                                <div className='wallet-option'>
                                    <div className='wallet-info'>
                                        <div className='wallet-icon'>🔴</div>
                                        <div className='wallet-details'>
                                            <h4>TronLink</h4>
                                            <p>Connect to Tron Network</p>
                                        </div>
                                    </div>
                                    <button
                                        className='wallet-connect-btn'
                                        onClick={() => handleConnectWallet('TRC20')}
                                        disabled={!isTronLinkInstalled() || loading}
                                    >
                                        {!isTronLinkInstalled() ? 'Install TronLink' : 'Connect'}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className='error-message'>
                                    <div className='error-icon'>⚠️</div>
                                    <div className='error-text'>{error}</div>
                                    <button 
                                        className='retry-btn'
                                        onClick={() => {
                                            setError(null);
                                            // Retry connection logic can be added here
                                        }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Connected Wallet Info */}
            {isConnected && (
                <div className='connected-wallet-info'>
                    <div className='wallet-status'>
                        <div className='network-indicator'>
                            {currentNetwork === 'BEP20' ? '🟡' : '🔴'}
                            <span>{currentNetwork === 'BEP20' ? 'BSC' : 'TRON'}</span>
                        </div>
                        <div className='wallet-address'>
                            {formatAddress(account)}
                        </div>
                    </div>
                    <div className='wallet-balance'>
                        <div className='balance-item'>
                            <span className='balance-label'>USDT</span>
                            <span className='balance-value'>{formatAmount(USDTBalance)}</span>
                        </div>
                        <div className='balance-item'>
                            <span className='balance-label'>{currentNetwork === 'BEP20' ? 'BNB' : 'TRX'}</span>
                            <span className='balance-value'>{formatAmount(balance)}</span>
                        </div>
                    </div>
                    <button className='disconnect-btn' onClick={handleDisconnect}>
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeroLeft;