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
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getBNBBalance: safeAuthGetBNBBalance, loginWithWallet: safeAuthLoginWallet } = useSafeAuth();
    const [safeAuthBNBBalance, setSafeAuthBNBBalance] = useState('0');

    // Removed showWalletDropdown and dropdownRef - no longer needed with Web3Auth

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

    // Handle disconnect (for MetaMask/TronLink wallets, if still used)
    const handleDisconnect = () => {
        disconnect();
    };

    // ✅ Fetch SafeAuth BNB balance when connected (USDT now uses Platform Score)
    useEffect(() => {
        const fetchSafeAuthBNBBalance = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetBNBBalance) {
                try {
                    // Fetch BNB balance (native gas token)
                    const bnbBalance = await safeAuthGetBNBBalance();
                    setSafeAuthBNBBalance(bnbBalance);
                } catch (error) {
                    console.error('Error fetching SafeAuth BNB balance:', error);
                    setSafeAuthBNBBalance('0');
                }
            } else {
                setSafeAuthBNBBalance('0');
            }
        };

        fetchSafeAuthBNBBalance();
        
        // Refresh every 5 seconds when SafeAuth is connected
        let interval;
        if (safeAuthLoggedIn && safeAuthAccount) {
            interval = setInterval(fetchSafeAuthBNBBalance, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [safeAuthLoggedIn, safeAuthAccount, safeAuthGetBNBBalance]);

    // Removed dropdown click-outside handler and TronLink debug - no longer needed with Web3Auth

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
                            <span className='balance-value'>{Number(user?.platformScore || 0).toFixed(2)}</span>
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