import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useWallet } from '../../../contexts/WalletContext';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';
import WalletConnect from '../../wallet/WalletConnect';
import DepositModal from '../../wallet/DepositModal';
import apiService from '../../../services/api';
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
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance, logout: safeAuthLogout } = useSafeAuth();
    const [safeAuthUSDTBalance, setSafeAuthUSDTBalance] = useState('0');

    // Fetch SafeAuth wallet USDT balance when connected
    useEffect(() => {
        const fetchSafeAuthBalance = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance && isAuthenticated) {
                try {
                    const balance = await safeAuthGetUSDTBalance();
                    setSafeAuthUSDTBalance(balance);
                } catch (error) {
                    console.error('Error fetching SafeAuth balance in Header:', error);
                    setSafeAuthUSDTBalance('0');
                }
            } else {
                setSafeAuthUSDTBalance('0');
            }
        };

        fetchSafeAuthBalance();
        
        // Refresh every 5 seconds when SafeAuth is connected
        let interval;
        if (safeAuthLoggedIn && safeAuthAccount && isAuthenticated) {
            interval = setInterval(fetchSafeAuthBalance, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [safeAuthLoggedIn, safeAuthAccount, isAuthenticated, safeAuthGetUSDTBalance]);

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
            // Logout from Web3Auth first (if connected)
            if (safeAuthLoggedIn) {
                try {
                    await safeAuthLogout();
                } catch (error) {
                    console.error('Web3Auth logout error:', error);
                }
            }
            
            // Then logout from backend and clear auth state
            await logout();
            
            // Clear all state and navigate
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

                {/* Balance Display - Small, at top of header */}
                {safeAuthLoggedIn && safeAuthAccount && isAuthenticated && (
                    <div className='header-balance-display' style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#fff',
                        padding: '4px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <span style={{ opacity: 0.7 }}>USDT:</span>
                        <span style={{ fontWeight: 'bold', color: '#f0b90b' }}>
                            {parseFloat(safeAuthUSDTBalance || '0').toFixed(2)}
                        </span>
                    </div>
                )}

                {/* Mobile Menu Button */}
                <button className='mobile-menu-btn' onClick={toggleMobileMenu}>
                    <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>

                {/* Desktop Utility Links */}
                <div className='utility-links desktop-utility'>
                    {isAuthenticated ? (
                        <div className='user-menu-container'>
                            <button className='user-menu-trigger' onClick={toggleUserMenu}>
                                <div className='user-avatar'>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.username} />
                                    ) : (
                                        <svg className='user-icon' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="9" r="3" />
                                            <path d="M6.168 18.849A4 4 0 0 1 10.163 16H13.837A4 4 0 0 1 17.832 18.849" />
                                        </svg>
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
                                        <div className='user-email'>{user?.email}</div>
                                        <div className='user-balance'>
                                            Balance: ${safeAuthLoggedIn ? parseFloat(safeAuthUSDTBalance || '0').toFixed(2) : Number(user?.platformScore || 0).toFixed(2)}
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
                                    <Link to="/marketplace" className='user-menu-item' onClick={() => setShowUserMenu(false)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6" />
                                        </svg>
                                        {t('marketplace')}
                                    </Link>
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
                    ) : (
                        <div className='action-buttons desktop-actions'>
                        {/* Hide Connect Wallet buttons when SafeAuth is connected (Web3Auth handles wallet) */}
                        {!safeAuthLoggedIn && (
                            <>
                                {/* Show WalletConnect only when wallet is NOT connected */}
                                {!isConnected && <WalletConnect />}
    
                                {/* Show MY WALLET with balance when wallet IS connected */}
                                {isConnected ? (
                                    <>
                                        <div className='balance-container' style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <button
                                                className='seka-balance-btn'
                                                title={`USDT Points - Used for ALL game activities\nDeposit USDT to get USDT points`}
                                                style={{
                                                    background: 'linear-gradient(135deg, rgb(243 90 0) 33%, rgb(206, 125, 39) 117%)',
                                                    border: '2px solid rgb(249 148 38)',
                                                    fontWeight: 'bold',
                                                    cursor: 'default'
                                                }}
                                            >
                                                USDT: {Number(user?.platformScore || 0).toFixed(0)}
                                            </button>
                                        </div>
                                        <button className='deposit-btn' onClick={() => setShowDepositModal(true)} title='Deposit USDT to get SEKA points for games'>
                                            {t('deposit')}
                                        </button>
                                    </>
                                ) : isAuthenticated ? (
                                    <>
                                        {/* Show deposit button even without wallet connection */}
                                        <button className='deposit-btn' onClick={() => setShowDepositModal(true)} title='Connect wallet to deposit'>
                                            {t('deposit')}
                                        </button>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                        
                        {/* Show balance and deposit when SafeAuth is connected */}
                        {safeAuthLoggedIn && isAuthenticated && (
                            <>
                                <div className='balance-container' style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <button
                                        className='seka-balance-btn'
                                        title={`USDT Balance - Your Web3Auth wallet USDT balance`}
                                        style={{
                                            background: 'linear-gradient(135deg, rgb(243 90 0) 33%, rgb(206, 125, 39) 117%)',
                                            border: '2px solid rgb(249 148 38)',
                                            fontWeight: 'bold',
                                            cursor: 'default'
                                        }}
                                    >
                                        USDT: {safeAuthLoggedIn ? parseFloat(safeAuthUSDTBalance || '0').toFixed(2) : Number(user?.platformScore || 0).toFixed(2)}
                                    </button>
                                </div>
                                <button className='deposit-btn' onClick={() => setShowDepositModal(true)} title='Deposit USDT to get SEKA points for games'>
                                    {t('deposit')}
                                </button>
                            </>
                        )}
                    </div>
                    )}
                   
                </div>

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
                            {isAuthenticated ? (
                                <div className='mobile-user-info'>
                                    <div className='mobile-user-avatar'>
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.username} />
                                        ) : (
                                            <svg className='user-icon' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <circle cx="12" cy="9" r="3" />
                                                <path d="M6.168 18.849A4 4 0 0 1 10.163 16H13.837A4 4 0 0 1 17.832 18.849" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className='mobile-user-details'>
                                        <div className='mobile-user-name'>{user?.username}</div>
                                        <div className='mobile-user-email'>{user?.email}</div>
                                        <div className='mobile-user-balance'>
                                            Balance: ${safeAuthLoggedIn ? parseFloat(safeAuthUSDTBalance || '0').toFixed(2) : Number(user?.platformScore || 0).toFixed(2)}
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
                            {/* Hide Connect Wallet when SafeAuth is connected (Web3Auth handles wallet) */}
                            {!safeAuthLoggedIn && !isConnected && (
                                <div className='mobile-wallet-connect'>
                                    <WalletConnect />
                                </div>
                            )}

                            {/* Show balances when connected */}
                            {isConnected && (
                                <div style={{ width: '100%', marginBottom: '10px' }}>
                                    <button className='mobile-my-wallet-btn' title='Wallet Balance (not used for games)' style={{ opacity: 0.7, marginBottom: '5px' }}>
                                        💼 Wallet: {getDisplayBalance()}
                                    </button>
                                    <button
                                        className='mobile-my-wallet-btn'
                                        title='SEKA Points - Used for ALL games'
                                        style={{
                                            background: 'linear-gradient(135deg, rgb(248 145 32) 0%, rgb(223 254 52) 100%)',
                                            border: '2px solid #ffd700',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        🎮 SEKA: {Number(platformScore || 0).toFixed(0)}
                                    </button>
                                </div>
                            )}

                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" className='mobile-connect-wallet-btn' onClick={closeMobileMenu}>
                                        {t('profile')}
                                    </Link>
                                    <button className='mobile-deposit-btn' onClick={() => { setShowDepositModal(true); closeMobileMenu(); }}>
                                        {t('deposit')}
                                    </button>
                                    <button className='mobile-play-now-btn' onClick={() => { handlePlayNow(); closeMobileMenu(); }}>
                                        {t('playNow')}
                                    </button>
                                    <button className='mobile-logout-btn' onClick={() => { handleLogout(); closeMobileMenu(); }}>
                                        {t('logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className='mobile-play-now-btn' onClick={() => { handlePlayNow(); closeMobileMenu(); }}>
                                        {t('playNow')}
                                    </button>
                                </>
                            )}
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