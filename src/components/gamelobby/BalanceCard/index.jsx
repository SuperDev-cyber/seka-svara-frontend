import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';

const BalanceCard = () => {
    const { user } = useAuth();
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance } = useSafeAuth();
    const [walletUSDTBalance, setWalletUSDTBalance] = useState('0');

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

    const formatBalance = () => {
        // ✅ Display Web3Auth wallet USDT balance (real-time from blockchain)
        if (safeAuthLoggedIn && safeAuthAccount) {
            const balance = parseFloat(walletUSDTBalance || '0');
            return `${balance.toFixed(2)} USDT`;
        }
        // Fallback to Platform Score if wallet not connected
        const platformScore = Number(user?.platformScore || 0);
        return `${platformScore.toFixed(2)} USDT`;
    };

    return (
        <div className='balance-section balance-section-again'>
            <p className='balance-label'>BALANCE</p>
            <p className='balance-amount'>
                {formatBalance()}
            </p>
        </div>
    );
};

export default BalanceCard;
