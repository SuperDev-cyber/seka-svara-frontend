import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useWallet } from '../../../contexts/WalletContext';
import apiService from '../../../services/api';
import deposit from '../../../assets/icon/deposit-icon.png';
import withdraw from '../../../assets/icon/withdraw-icon.png';
import DepositModal from '../DepositModal';
import WithdrawModal from '../WithdrawModal';

const BalanceCard = () => {
    const { user, refreshUserProfile } = useAuth();
    const { isConnected, currentNetwork, getBalance } = useWallet();
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
        // Refresh balances after successful deposit
        await fetchSekaBalance();
        await fetchWalletData();
        if (refreshUserProfile) {
            await refreshUserProfile();
        }
    };

    const handleWithdrawSuccess = async () => {
        // Refresh balances after successful withdrawal
        await fetchSekaBalance();
        await fetchWalletData();
        if (refreshUserProfile) {
            await refreshUserProfile();
        }
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

    const totalBalance = sekaBalance || user?.balance || 0;
    const virtualBalance = user?.balance || 0;
    const contractBalance = sekaBalance || 0;

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
                        <h3>🏆 Seka-Svara Score</h3>
                        {/* <span className='network-tag' style={{ 
                            background: '#f59e0b',
                            color: '#fff'
                        }}>
                            Seka-Svara-Points
                        </span> */}
                    </div>
                    <div className='card-content'>
                        <div className='main-amount' style={{ color: '#fbbf24' }}>
                            {formatAmount(user?.platformScore || 0)} USDT
                        </div>
                        <div className='network-name' style={{ opacity: 0.9 }}>
                            Mirrors your USDT balance
                        </div>
                        <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
                            Used for admin tracking
                        </div>
                    </div>
                </div>

                <div className='balance-card network-card'>
                    <div className='card-header'>
                        <h3>⛓️ Contract Balance</h3>
                        {/* <span className='network-tag' style={{ 
                            background: isConnected ? '#22c55e' : '#666' 
                        }}>
                            {isConnected ? currentNetwork || 'Connected' : 'Not Connected'}
                        </span> */}
                    </div>
                    <div className='card-content'>
                        <div className='main-amount'>{formatAmount(contractBalance)} USDT</div>
                        <div className='network-name'>Smart Contract</div>
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
