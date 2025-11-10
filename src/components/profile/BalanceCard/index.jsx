import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useWallet } from '../../../contexts/WalletContext';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';
import apiService from '../../../services/api';
import deposit from '../../../assets/icon/deposit-icon.png';
import withdraw from '../../../assets/icon/withdraw-icon.png';
import DepositModal from '../../wallet/DepositModal';
import WithdrawModal from '../WithdrawModal';

const BalanceCard = () => {
    const { user, refreshUserProfile } = useAuth();
    const { isConnected, currentNetwork, USDTBalance } = useWallet();
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance, isTestnet } = useSafeAuth();
    const [walletUSDTBalance, setWalletUSDTBalance] = useState('0');
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [walletData, setWalletData] = useState(null);
    const [addresses, setAddresses] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch Web3Auth wallet USDT balance when connected
    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance) {
                try {
                    const balance = await safeAuthGetUSDTBalance();
                    setWalletUSDTBalance(balance);
                    console.log('💰 BalanceCard - Web3Auth USDT Balance:', balance);
                } catch (error) {
                    console.error('Error fetching wallet balance in BalanceCard:', error);
                    setWalletUSDTBalance('0');
                }
            } else {
                setWalletUSDTBalance('0');
            }
        };

        fetchWalletBalance();
        
        // Refresh every 5 seconds when SafeAuth is connected
        let interval;
        if (safeAuthLoggedIn && safeAuthAccount) {
            interval = setInterval(fetchWalletBalance, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [safeAuthLoggedIn, safeAuthAccount, safeAuthGetUSDTBalance]);

    useEffect(() => {
        if (user) {
            fetchWalletData();
            // ✅ Don't call getBalance() - just use platform score from user context
            // The platform score is already updated by the backend after deposits/withdrawals
        }
    }, [user, isConnected, currentNetwork]);

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const [walletResponse, addressesResponse] = await Promise.all([
                apiService.get('/wallet/balance'),
                apiService.get('/wallet/addresses')
            ]);

            setWalletData(walletResponse);
            setAddresses(addressesResponse);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDepositSuccess = async () => {
        // ✅ Simply refresh user profile to get updated platform score from backend
        // The backend already added the deposit amount to platform score
        // No need to call getBalance() which can cause errors
        if (refreshUserProfile) {
            await refreshUserProfile();
        }
        await fetchWalletData();
    };

    const handleWithdrawSuccess = async () => {
        // ✅ Simply refresh user profile to get updated platform score from backend
        // The backend already deducted the withdrawal amount from platform score
        // No need to call getBalance() which can cause errors
        if (refreshUserProfile) {
            await refreshUserProfile();
        }
        await fetchWalletData();
    };

    const formatAmount = (amount) => {
        return parseFloat(amount || 0).toFixed(0);
    };

    const formatUSDTEquivalent = (amount) => {
        return `≈ $${(parseFloat(amount || 0) * 1.0).toFixed(0)}`; // Assuming 1:1 USDT to USDT
    };
    if (loading) {
        return (
            <div className='balance-section'>
                <div className='balance-cards'>
                    <div className='balance-card total-balance-card'>
                        <div className='card-header'>
                            <h3>{isTestnet ? 'Testnet USDT' : 'USDT'} Balance</h3>
                        </div>
                        <div className='card-content'>
                            <div className='main-amount gold-text'>Loading...</div>
                            <div className='USDT-equivalent'>Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Use Web3Auth wallet USDT balance (real-time from blockchain)
    // Falls back to Platform Score if Web3Auth is not connected
    const displayBalance = safeAuthLoggedIn && safeAuthAccount 
        ? parseFloat(walletUSDTBalance || '0') 
        : Number(user?.platformScore || 0);

    return (
        <div className='balance-section'>
            <div className='balance-cards'>
                {/* <div className='balance-card total-balance-card' style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: '2px solid #ffd700'
                }}>
                    <div className='card-header'>
                        <h3>🎮 SEKA Points</h3>
                    </div>
                    <div className='card-content'>
                        <div className='main-amount gold-text' style={{ color: '#ffd700' }}>
                            {formatAmount(totalBalance)} SEKA
                        </div>
                        <div className='USDT-equivalent'>{formatUSDTEquivalent(totalBalance)}</div>
                        <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.9 }}>
                            Used for all game activities
                        </div>
                    </div>
                </div> */}

                <div className='balance-card network-card' style={{
                    background: 'linear-gradient(135deg, rgb(245 76 11) 0%, rgb(217, 119, 6) 100%)',
                    border: '2px solid #fbbf24'
                }}>
                    <div className='card-header'>
                        <h3>🏆 Platform USDT</h3>
                    </div>
                    <div className='card-content'>
                        <div className='main-amount' style={{ color: '#fbbf24' }}>
                            {safeAuthLoggedIn && safeAuthAccount 
                                ? `${displayBalance.toFixed(2)} ${isTestnet ? 'Testnet USDT' : 'USDT'}`
                                : `${displayBalance.toFixed(0)} ${isTestnet ? 'Testnet USDT' : 'USDT'}`}
                        </div>
                        <div className='network-name' style={{ opacity: 0.9 }}>
                            {safeAuthLoggedIn && safeAuthAccount ? 'Web3Auth Wallet Balance' : 'Platform Score'}
                        </div>
                        <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
                            {safeAuthLoggedIn && safeAuthAccount 
                                ? 'Your Web3Auth wallet USDT balance'
                                : 'Used for all game activities'}
                        </div>
                    </div>
                </div>

                {/* <div className='balance-card network-card' style={{
                    background: 'linear-gradient(135deg, rgb(245 76 11) 0%, rgb(217, 119, 6) 100%)',
                    border: '2px solid #fbbf24'
                }}>
                    <div className='card-header'>
                        <h3>🏆 Platform Score</h3>
                    </div>
                    <div className='card-content'>
                        <div className='main-amount' style={{ color: '#fbbf24' }}>
                            {Number(user?.platformScore || 0).toFixed(0)} {isTestnet ? 'Testnet USDT' : 'USDT'}
                        </div>
                        <div className='network-name' style={{ opacity: 0.9 }}>
                            Contract Balance
                        </div>
                        <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
                            Mirrors your USDT balance
                        </div>
                    </div>
                </div> */}
            </div>

            <div className='balance-actions'>
                <button 
                    className='deposit-btn'
                    onClick={() => setIsDepositModalOpen(true)}
                    style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: '#fff'
                    }}
                >
                    <img src={deposit} alt='deposit' width={30} />
                    Deposit USDT
                </button>
                <button 
                    className='withdraw-btn'
                    onClick={() => setIsWithdrawModalOpen(true)}
                    style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        color: '#fff'
                    }}
                >
                    <img src={withdraw} alt='withdraw' width={30} />
                    Withdraw USDT
                </button>
            </div>

            <DepositModal 
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                onDepositSuccess={handleDepositSuccess}
            />

            <WithdrawModal 
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onWithdrawSuccess={handleWithdrawSuccess}
            />
        </div>
    );
};

export default BalanceCard;
