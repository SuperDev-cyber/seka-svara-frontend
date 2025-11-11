import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useWallet } from '../../../contexts/WalletContext';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';
import DepositModal from '../../wallet/DepositModal';
import apiService from '../../../services/api';
import { cleanUsername } from '../../../utils/username';
import logo from '../../../assets/images/logo.jpg';
import marketplaceIcon from '../../../assets/icon/marketplace-icon.png';
import './index.css';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [sekaBalance, setSekaBalance] = useState(null);
    const [platformScore, setPlatformScore] = useState(0); // ✅ Platform Score (backend database)
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, refreshUserProfile } = useAuth();
    const { isConnected, USDTBalance, balance, currentNetwork, formatAmount, getBalance, getUSDTBalance } = useWallet();
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance, getBNBBalance: safeAuthGetBNBBalance, logout: safeAuthLogout, loginWithWallet: safeAuthLoginWallet } = useSafeAuth();
    const [safeAuthUSDTBalance, setSafeAuthUSDTBalance] = useState('0');
    const [safeAuthBNBBalance, setSafeAuthBNBBalance] = useState('0');
    const userMenuRef = React.useRef(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    // Fetch SafeAuth wallet USDT and BNB balances when connected
    useEffect(() => {
        const fetchSafeAuthBalances = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance && safeAuthGetBNBBalance) {
                try {
                    const [usdtBalance, bnbBalance] = await Promise.all([
                        safeAuthGetUSDTBalance(),
                        safeAuthGetBNBBalance()
                    ]);
                    console.log('✅ Header: Fetched balances:', { usdtBalance, bnbBalance });
                    setSafeAuthUSDTBalance(usdtBalance);
                    setSafeAuthBNBBalance(bnbBalance);
                } catch (error) {
                    console.error('Error fetching SafeAuth balances in Header:', error);
                    setSafeAuthUSDTBalance('0');
                    setSafeAuthBNBBalance('0');
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

    // Fetch Seka contract balance when wallet is connected
    const fetchSekaBalance = async () => {
        if (isConnected && currentNetwork && isAuthenticated) {
            try {
                // getBalance already returns a formatted string, no need to format again
                const balance = await getBalance(currentNetwork);
                
                // ✅ Safely call getUSDTBalance with error handling
                try {
                    if (getUSDTBalance && typeof getUSDTBalance === 'function') {
                        await getUSDTBalance();
                    } else {
                        console.warn('getUSDTBalance not available');
                    }
                } catch (usdtError) {
                    console.error('Error calling getUSDTBalance:', usdtError);
                    // Don't throw - continue with balance update
                }
                
                console.log("Seka contract balance:", balance);
                setSekaBalance(balance);

                // ✅ SYNC CONTRACT BALANCE TO BACKEND DATABASE
                // Convert balance string (e.g., "1020.01") to number
                const balanceNum = parseFloat(balance) || 0;

                if (balanceNum > 0) {
                    try {
                        const result = await apiService.post('/wallet/sync-balance', {
                            contractBalance: balanceNum
                        });

                        console.log("✅ Balance synced to backend:", result);

                        // ✅ Refresh user profile to update platformScore in context
                        // This will automatically update the UI via the useEffect hook
                        if (refreshUserProfile) {
                            await refreshUserProfile();
                        }
                    } catch (syncError) {
                        console.error("❌ Error syncing balance to backend:", syncError);
                    }
                }
            } catch (error) {
                console.error("Error fetching Seka balance:", error);
                setSekaBalance(null);
            }
        } else {
            setSekaBalance(null);
        }
    };

    useEffect(() => {
        fetchSekaBalance();
    }, [isConnected, currentNetwork, getBalance]);

    // ✅ Sync platform score from user context (PRIMARY SOURCE)
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log("🏆 Header - Syncing platformScore from user context:", user.platformScore);
            setPlatformScore(user?.platformScore || 0);
        } else {
            setPlatformScore(0);
        }
    }, [isAuthenticated, user]);

    // ✅ Fetch USDT balance from Web3Auth wallet when connected
    useEffect(() => {
        const fetchSafeAuthUSDTBalance = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance) {
                try {
                    console.log('🔄 Fetching SafeAuth USDT balance for account:', safeAuthAccount);
                    const balance = await safeAuthGetUSDTBalance();
                    console.log('✅ SafeAuth USDT Balance received:', balance);
                    setSafeAuthUSDTBalance(balance);
                } catch (error) {
                    console.error('❌ Error fetching SafeAuth USDT balance:', error);
                    setSafeAuthUSDTBalance('0');
                }
            } else {
                console.log('⚠️ SafeAuth not connected, setting balance to 0', {
                    safeAuthLoggedIn,
                    hasAccount: !!safeAuthAccount,
                    hasFunction: !!safeAuthGetUSDTBalance
                });
                setSafeAuthUSDTBalance('0');
            }
        };

        // Fetch immediately
        fetchSafeAuthUSDTBalance();
        
        // Refresh balance every 5 seconds when SafeAuth is connected (more frequent for testing)
        let interval;
        if (safeAuthLoggedIn && safeAuthAccount) {
            interval = setInterval(fetchSafeAuthUSDTBalance, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [safeAuthLoggedIn, safeAuthAccount, safeAuthGetUSDTBalance]);

    // Callback for when deposit is successful
    const handleDepositSuccess = async () => {
        console.log("✨ Deposit successful! Refreshing platform score...");

        try {
            // ✅ Simply refresh user profile to get updated platform score from backend
            // The backend already added the deposit amount to platform score
            // No need to call fetchSekaBalance()/getBalance() which can cause errors
            if (refreshUserProfile) {
                await refreshUserProfile();
            }

            console.log("✅ Platform score refreshed successfully!");
        } catch (error) {
            console.error("❌ Error refreshing platform score:", error);
        }
    };

    // Simple i18n map and translator
    const i18n = {
        en: {
            home: 'Home',
            marketplace: 'Marketplace',
            gameLobby: 'Game Lobby',
            signIn: 'Sign in / Register',
            deposit: 'Deposit',
            profile: 'Profile',
            logout: 'Logout',
            playNow: 'Play Now',
            english: 'English',
            russian: 'Русский',
            wallet: 'Wallet',
            balance: 'Balance',
        },
        ru: {
            home: 'Главная',
            marketplace: 'Маркетплейс',
            gameLobby: 'Игровой зал',
            signIn: 'Войти / Регистрация',
            deposit: 'Пополнить',
            profile: 'Профиль',
            logout: 'Выйти',
            playNow: 'Играть',
            english: 'English',
            russian: 'Русский',
            wallet: 'Кошелёк',
            balance: 'Баланс',
        },
    };

    const t = (k) => i18n[lang][k] || k;

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    // Determine which balance to display
    const getDisplayBalance = () => {
        const USDTAmount = parseFloat(USDTBalance || 0);
        const nativeAmount = parseFloat(balance || 0);

        // If USDT balance is less than 0.01, show native balance instead
        if (USDTAmount < 0.01 && nativeAmount > 0) {
            const nativeSymbol = currentNetwork === 'BEP20' ? 'BNB' : 'TRX';
            return `${formatAmount(balance)} ${nativeSymbol}`;
        }

        // Otherwise show USDT
        return `${formatAmount(USDTBalance)} USDT`;
    };

    // Debug logging for authentication state
    console.log('🔍 Header: Authentication state:', {
        isAuthenticated,
        user: user ? {
            username: user.username,
            email: user.email,
            balance: user.balance
        } : null
    });

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleLogout = async () => {
        try {
            // Step 1: Logout from backend first (to clear server session)
            try {
                await logout();
            } catch (error) {
                console.error('Backend logout error:', error);
            }
            
            // Step 2: Logout from Web3Auth (clears wallet connection)
            if (safeAuthLoggedIn) {
                try {
                    await safeAuthLogout();
                    console.log('✅ Web3Auth logged out successfully');
                } catch (error) {
                    console.error('Web3Auth logout error:', error);
                }
            }
            
            // Step 3: Clear all state and navigate
            navigate('/');
            setShowUserMenu(false);
            
            if (window.showToast) {
                window.showToast('Logged out successfully', 'success', 2000);
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout fails, clear local state
            navigate('/');
            setShowUserMenu(false);
        }
    };

    const handlePlayNow = () => {
        if (isAuthenticated && safeAuthLoggedIn) {
            navigate('/gamelobby');
        } else {
            // Show wallet connect modal or scroll to wallet connect button
            if (window.showToast) {
                window.showToast('Please connect your wallet to play', 'info', 3000);
            }
            // Scroll to wallet connect section if it exists
            const walletConnectSection = document.querySelector('.wallet-connect');
            if (walletConnectSection) {
                walletConnectSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Handle Connect Wallet button click - opens Web3Auth modal
    const handleConnectWalletClick = async () => {
        // If SafeAuth is already connected, do nothing
        if (safeAuthLoggedIn && safeAuthAccount) {
            if (window.showToast) {
                window.showToast('Wallet already connected!', 'info', 2000);
            }
            return;
        }
        
        // Open Web3Auth modal directly (for both authenticated and unauthenticated users)
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

    return (
        <header className='main-header'>
            <div className='header-container'>
                {/* Logo Section */}
                <div className='logo-section'>
                    <Link to="/" className='logo-link'>
                        <img src={logo} alt='Seka Svara' className='logo-img' />
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <nav className='nav-links desktop-nav'>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        <svg className='nav-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9,22 9,12 15,12 15,22" />
                        </svg>
                        {t('home')}
                    </Link>
                    <Link to="/marketplace" className={`nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`}>
                        <img src={marketplaceIcon} alt="Marketplace" className='nav-icon' />
                        {t('marketplace')}
                    </Link>
                    <Link to="/gamelobby" className={`nav-link ${location.pathname === '/gamelobby' ? 'active' : ''}`}>
                        <svg className='nav-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="9" y1="9" x2="15" y2="9" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        {t('gameLobby')}
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button className='mobile-menu-btn' onClick={toggleMobileMenu}>
                    <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>

                

                {/* Desktop Action Buttons */}
              
                <div className='language-selector'>
                        <svg className='utility-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <select value={lang} onChange={(e) => setLang(e.target.value)} className='lang-select'>
                            <option value="en">{t('english')}</option>
                            <option value="ru">{t('russian')}</option>
                        </select>
                    </div>
                    {/* Desktop Utility Links */}
                <div className='utility-links desktop-utility'>
                    {/* Balance Display - Styled like language selector */}
                    {safeAuthLoggedIn && safeAuthAccount && (
                        <div className='header-balance-display'>
                            <svg className='utility-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>USDT: {parseFloat(safeAuthUSDTBalance || '0').toFixed(2)} | BNB: {parseFloat(safeAuthBNBBalance || '0').toFixed(4)}</span>
                        </div>
                    )}

                    {/* Show user avatar when wallet is connected (WalletConnect handles auto-authentication) */}
                    {safeAuthLoggedIn && safeAuthAccount ? (
                        <>
                            <div className='user-menu-container' ref={userMenuRef}>
                            <button className='user-menu-trigger' onClick={toggleUserMenu}>
                                <div className='user-avatar'>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.username} />
                                    ) : (
                                        <span className='user-avatar-initial'>
                                            {user?.username ? user.username.charAt(0).toUpperCase() : 
                                             user?.email ? user.email.charAt(0).toUpperCase() : 
                                             safeAuthAccount ? safeAuthAccount.charAt(2).toUpperCase() : 'U'}
                                        </span>
                                    )}
                                </div>
                                {/* <span className='user-name'>{user?.username}</span> */}
                                <svg className='dropdown-icon' width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6,9 12,15 18,9" />
                                </svg>
                            </button>

                            {showUserMenu && (
                                <div className='user-menu-dropdown'>
                                    <div className='user-info'>
                                        <div className='user-email'>{user?.email || safeAuthAccount || 'Web3Auth User'}</div>
                                        <div className='user-balance'>
                                            {safeAuthLoggedIn ? (
                                                <>USDT: {parseFloat(safeAuthUSDTBalance || '0').toFixed(2)} | BNB: {parseFloat(safeAuthBNBBalance || '0').toFixed(4)}</>
                                            ) : (
                                                <>USDT: {Number(user?.platformScore || 0).toFixed(2)}</>
                                            )}
                                        </div>
                                    </div>
                                    <div className='user-menu-divider'></div>
                        <Link to="/profile" className='user-menu-item' onClick={() => setShowUserMenu(false)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        {t('profile')}
                                    </Link>
                                    {/* <Link to="/marketplace" className='user-menu-item' onClick={() => setShowUserMenu(false)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6" />
                                        </svg>
                                        {t('marketplace')}
                                    </Link> */}
                                    <button className='user-menu-item logout-item' onClick={handleLogout}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16,17 21,12 16,7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        {t('logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                        </>
                    ) : (
                        <>
                            {/* Show Connect Wallet button when wallet is not connected */}
                            {!safeAuthLoggedIn && (
                                <button 
                                    className='connect-wallet-btn'
                                    onClick={handleConnectWalletClick}
                                >
                                    <svg className='utility-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                                        <line x1="10" y1="9" x2="14" y2="9" />
                                    </svg>
                                    Connect Wallet
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <div className='mobile-menu-content'>
                        {/* Mobile Navigation Links */}
                        <nav className='mobile-nav-links'>
                            <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
                                <svg className='nav-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9,22 9,12 15,12 15,22" />
                                </svg>
                                {t('home')}
                            </Link>
                            <Link to="/marketplace" className={`mobile-nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`} onClick={closeMobileMenu}>
                                <img src={marketplaceIcon} alt="Marketplace" className='nav-icon' />
                                {t('marketplace')}
                            </Link>
                            <Link to="/gamelobby" className={`mobile-nav-link ${location.pathname === '/gamelobby' ? 'active' : ''}`} onClick={closeMobileMenu}>
                                <svg className='nav-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <line x1="9" y1="9" x2="15" y2="9" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                                {t('gameLobby')}
                            </Link>
                        </nav>

                        {/* Mobile Utility Links */}
                        <div className='mobile-utility-links'>
                            {safeAuthLoggedIn && safeAuthAccount ? (
                                <div className='mobile-user-info'>
                                    <div className='mobile-user-avatar'>
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.username} />
                                        ) : (
                                            <span className='user-avatar-initial'>
                                                {user?.username ? user.username.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : safeAuthAccount?.charAt(2).toUpperCase() || 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <div className='mobile-user-details'>
                                        <div className='mobile-user-name'>{user?.username ? cleanUsername(user.username) : user?.email?.split('@')[0] || safeAuthAccount?.substring(0, 6) + '...' || 'User'}</div>
                                        <div className='mobile-user-email'>{user?.email || safeAuthAccount || 'Web3Auth User'}</div>
                                        <div className='mobile-user-balance'>
                                            USDT: {parseFloat(safeAuthUSDTBalance || '0').toFixed(2)} | BNB: {parseFloat(safeAuthBNBBalance || '0').toFixed(4)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                              <></>
                            )}
                            <div className='mobile-language-selector'>
                                <svg className='utility-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                                <select value={lang} onChange={(e) => setLang(e.target.value)} className='lang-select'>
                                    <option value="en">{t('english')}</option>
                                    <option value="ru">{t('russian')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className='mobile-action-buttons'>
                            {/* Show Connect Wallet button when wallet is not connected */}
                            {!safeAuthLoggedIn && (
                                <button 
                                    className='mobile-connect-wallet-btn'
                                    onClick={async () => {
                                        // Close mobile menu when opening Web3Auth modal
                                        closeMobileMenu();
                                        // Small delay to allow menu to close before modal opens
                                        await new Promise(resolve => setTimeout(resolve, 100));
                                        handleConnectWalletClick();
                                    }}
                                >
                                    <svg className='utility-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                                        <line x1="10" y1="9" x2="14" y2="9" />
                                    </svg>
                                    Connect Wallet
                                </button>
                            )}

                            {/* Show Profile and Logout when wallet is connected */}
                            {safeAuthLoggedIn && safeAuthAccount ? (
                                <>
                                    <Link to="/profile" className='mobile-connect-wallet-btn' onClick={closeMobileMenu}>
                                        <svg className='utility-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        {t('profile')}
                                    </Link>
                                    <button className='mobile-logout-btn' onClick={() => { handleLogout(); closeMobileMenu(); }}>
                                        <svg className='utility-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        {t('logout')}
                                    </button>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* Deposit Modal */}
            <DepositModal
                isOpen={showDepositModal}
                onClose={() => setShowDepositModal(false)}
                onDepositSuccess={handleDepositSuccess}
            />
        </header>
    );
};

export default Header;