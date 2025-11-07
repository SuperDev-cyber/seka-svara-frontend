import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useWallet } from '../../../contexts/WalletContext';
import apiService from '../../../services/api';
import deposit from '../../../assets/icon/deposit-icon.png';
import withdraw from '../../../assets/icon/withdraw-icon.png';
import DepositModal from '../../wallet/DepositModal';
import WithdrawModal from '../WithdrawModal';

const BalanceCard = () => {
    const { user, refreshUserProfile } = useAuth();
    const { isConnected, currentNetwork, USDTBalance } = useWallet();
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [sekaBalance, setSekaBalance] = useState(0);
    const [walletData, setWalletData] = useState(null);
    const [addresses, setAddresses] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchWalletData();
            fetchSekaBalance();
        }
    }, [user, isConnected, currentNetwork]);

    const fetchSekaBalance = async () => {
        try {
            if (isConnected && currentNetwork && getBalance) {
                const balance = await getBalance(currentNetwork);
                setSekaBalance(parseFloat(balance) || 0);
            } else {
                setSekaBalance(parseFloat(user?.balance) || 0);
            }
        } catch (error) {
            console.error('Error fetching SEKA balance:', error);
            setSekaBalance(parseFloat(user?.balance) || 0);
        }
    };

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
                            <h3>USDT Balance</h3>
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

    // ✅ Use platform score from user context (updated by backend after deposits/withdrawals)
    const platformScore = Number(user?.platformScore || 0);

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
                        <h3>🏆 Platform Score</h3>
                    </div>
                    <div className='card-content'>
                        <div className='main-amount' style={{ color: '#fbbf24' }}>
                            {Number(user?.platformScore || 0).toFixed(0)} USDT
                        </div>
                        <div className='network-name' style={{ opacity: 0.9 }}>
                            Seka-Svara Score
                        </div>
                        <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
                            Used for all game activities
                        </div>
                    </div>
                </div>

                <div className='balance-card network-card' style={{
                    background: 'linear-gradient(135deg, rgb(245 76 11) 0%, rgb(217, 119, 6) 100%)',
                    border: '2px solid #fbbf24'
                }}>
                    <div className='card-header'>
                        <h3>🏆 Platform Score</h3>
                    </div>
                    <div className='card-content'>
                        <div className='main-amount' style={{ color: '#fbbf24' }}>
                            {Number(user?.platformScore || 0).toFixed(0)} USDT
                        </div>
                        <div className='network-name' style={{ opacity: 0.9 }}>
                            Contract Balance
                        </div>
                        <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
                            Mirrors your USDT balance
                        </div>
                    </div>
                </div>
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
