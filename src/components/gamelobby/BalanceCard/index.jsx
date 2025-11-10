import React, { useState, useEffect } from 'react';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';

const BalanceCard = () => {
    const { 
        loggedIn: safeAuthLoggedIn, 
        account: safeAuthAccount, 
        getUSDTBalance: safeAuthGetUSDTBalance,
        isTestnet
    } = useSafeAuth();
    const [bep20USDTBalance, setBep20USDTBalance] = useState('0');

    // ✅ Fetch Web3Auth wallet balance (BEP20 only) when connected
    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance) {
                try {
                    // Fetch BEP20 USDT balance
                    const bep20Balance = await safeAuthGetUSDTBalance();
                    setBep20USDTBalance(bep20Balance);

                    console.log('💰 BalanceCard - BEP20 USDT:', bep20Balance);
                } catch (error) {
                    console.error('Error fetching wallet balance in BalanceCard:', error);
                    setBep20USDTBalance('0');
                }
            } else {
                // Clear balance when not connected
                setBep20USDTBalance('0');
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
        if (safeAuthLoggedIn && safeAuthAccount) {
            return parseFloat(bep20USDTBalance || '0').toFixed(2);
        }
        return '0.00';
    };

    return (
        <div className='balance-section balance-section-again'>
            <p className='balance-label'>BALANCE</p>
            <p className='balance-amount'>
                {formatBalance()} {isTestnet ? 'Testnet USDT' : 'USDT'}
            </p>
        </div>
    );
};

export default BalanceCard;
