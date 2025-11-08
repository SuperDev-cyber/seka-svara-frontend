import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../../contexts/WalletContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';

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
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance, getBNBBalance: safeAuthGetBNBBalance } = useSafeAuth();
    const [safeAuthUSDTBalance, setSafeAuthUSDTBalance] = useState('0');
    const [safeAuthBNBBalance, setSafeAuthBNBBalance] = useState('0');

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

    // Detect browser and redirect to appropriate store
    const getInstallUrl = (walletType) => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isChrome = /chrome|crios/i.test(userAgent) && !/edge|edg|opr|firefox/i.test(userAgent);
        const isFirefox = /firefox|fxios/i.test(userAgent);
        const isEdge = /edge|edg/i.test(userAgent);
        const isSafari = /safari/i.test(userAgent) && !/chrome|crios|firefox|fxios|edge|edg/i.test(userAgent);
        const isIOS = /iphone|ipad|ipod/i.test(userAgent);
        const isAndroid = /android/i.test(userAgent);

        if (walletType === 'metamask') {
            if (isMobile) {
                if (isIOS) {
                    return 'https://apps.apple.com/app/metamask/id1438144202';
                } else if (isAndroid) {
                    return 'https://play.google.com/store/apps/details?id=io.metamask';
                }
            } else {
                if (isChrome || isEdge) {
                    return 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
                } else if (isFirefox) {
                    return 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/';
                } else if (isSafari) {
                    return 'https://metamask.io/download/';
                } else {
                    return 'https://metamask.io/download/';
                }
            }
        } else if (walletType === 'tronlink') {
            if (isMobile) {
                if (isIOS) {
                    return 'https://apps.apple.com/app/tronlink/id1550840174';
                } else if (isAndroid) {
                    return 'https://play.google.com/store/apps/details?id=com.tronlink';
                }
            } else {
                if (isChrome || isEdge) {
                    return 'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec';
                } else if (isFirefox) {
                    return 'https://addons.mozilla.org/en-US/firefox/addon/tronlink/';
                } else {
                    return 'https://www.tronlink.org/';
                }
            }
        }
        return '#';
    };

    // Handle wallet connection or installation
    const handleConnectWallet = async (network) => {
        if (!isAuthenticated) {
            setError('Please sign in first to connect your wallet');
            return;
        }
        
        // Check if wallet needs to be installed
        if (network === 'BEP20' && !isMetaMaskInstalled()) {
            window.open(getInstallUrl('metamask'), '_blank', 'noopener,noreferrer');
            return;
        }
        
        if (network === 'TRC20' && !isTronLinkInstalled()) {
            window.open(getInstallUrl('tronlink'), '_blank', 'noopener,noreferrer');
            return;
        }
        
        // Wallet is installed, proceed with connection
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
                        className='connect-wallet'
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
                                        disabled={loading}
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
                                        disabled={loading}
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

            {/* Connected Wallet Info - Show SafeAuth wallet if connected, otherwise show MetaMask/TronLink */}
            {(safeAuthLoggedIn && safeAuthAccount) ? (
                <div className='connected-wallet-info'>
                    <div className='wallet-status'>
                        <div className='network-indicator'>
                            🟡
                            <span>BSC</span>
                        </div>
                        <div className='wallet-address'>
                            {safeAuthAccount ? `${safeAuthAccount.substring(0, 6)}...${safeAuthAccount.substring(safeAuthAccount.length - 4)}` : ''}
                        </div>
                    </div>
                    <div className='wallet-balance'> 
                        <div className='balance-item'>
                            <span className='balance-label'>USDT</span>
                            <span className='balance-value'>{parseFloat(safeAuthUSDTBalance || '0').toFixed(2)}</span>
                        </div>
                        <div className='balance-item'>
                            <span className='balance-label'>BNB</span>
                            <span className='balance-value'>{parseFloat(safeAuthBNBBalance || '0').toFixed(4)}</span>
                        </div>
                    </div>
                </div>
            ) : isConnected ? (
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
            ) : null}
        </div>
    );
};

export default HeroLeft;