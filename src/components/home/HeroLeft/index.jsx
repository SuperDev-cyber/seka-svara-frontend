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
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance, getBNBBalance: safeAuthGetBNBBalance, loginWithWallet: safeAuthLoginWallet } = useSafeAuth();
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
        
        // Navigate to game lobby (Web3Auth wallet connection is handled separately)
        navigate('/gamelobby');
    };

    // Handle Connect Wallet button click - opens Web3Auth modal
    const handleConnectWalletClick = async () => {
        if (!isAuthenticated) {
            // Show notification for unregistered users
            if (window.showToast) {
                window.showToast('Please sign in to connect your wallet', 'warning', 4000);
            }
            navigate('/login');
            return;
        }

        // If SafeAuth is already connected, do nothing
        if (safeAuthLoggedIn && safeAuthAccount) {
            if (window.showToast) {
                window.showToast('Wallet already connected!', 'info', 2000);
            }
            return;
        }

        // Open Web3Auth modal
        try {
            await safeAuthLoginWallet();
            if (window.showToast) {
                window.showToast('Wallet connected successfully!', 'success', 3000);
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            if (window.showToast) {
                window.showToast(error.message || 'Failed to connect wallet', 'error', 5000);
            }
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

    // ✅ Fetch SafeAuth wallet balances when connected
    useEffect(() => {
        const fetchSafeAuthBalances = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance && safeAuthGetBNBBalance) {
                try {
                    // Fetch USDT balance
                    const usdtBalance = await safeAuthGetUSDTBalance();
                    setSafeAuthUSDTBalance(usdtBalance);

                    // Fetch BNB balance
                    const bnbBalance = await safeAuthGetBNBBalance();
                    setSafeAuthBNBBalance(bnbBalance);
                } catch (error) {
                    console.error('Error fetching SafeAuth balances:', error);
                }
            } else {
                setSafeAuthUSDTBalance('0');
                setSafeAuthBNBBalance('0');
            }
        };

        fetchSafeAuthBalances();
        
        // Refresh every 5 seconds when SafeAuth is connected
        let interval;
        if (safeAuthLoggedIn && safeAuthAccount) {
            interval = setInterval(fetchSafeAuthBalances, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [safeAuthLoggedIn, safeAuthAccount, safeAuthGetUSDTBalance, safeAuthGetBNBBalance]);

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
                
                {/* Wallet Connection Button - Opens Web3Auth Modal */}
                {!safeAuthLoggedIn && (
                    <button 
                        className='connect-wallet'
                        onClick={handleConnectWalletClick}
                        disabled={loading || !isAuthenticated}
                    >
                        <svg className='wallet-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                            <line x1="10" y1="9" x2="14" y2="9" />
                        </svg>
                        {loading ? 'Connecting...' : !isAuthenticated ? 'Sign In Required' : 'Connect Wallet'}
                    </button>
                )}
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