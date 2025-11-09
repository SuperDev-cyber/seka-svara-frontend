import React, { useState, useEffect } from 'react';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';

const BalanceCard = () => {
    const { 
        loggedIn: safeAuthLoggedIn, 
        account: safeAuthAccount, 
        getUSDTBalance: safeAuthGetUSDTBalance,
        getERC20USDTBalance: safeAuthGetERC20USDTBalance
    } = useSafeAuth();
    const [bep20USDTBalance, setBep20USDTBalance] = useState('0');
    const [erc20USDTBalance, setErc20USDTBalance] = useState('0');

    // ✅ Fetch Web3Auth wallet balances (BEP20 and ERC20) when connected
    // Only fetch if Web3Auth is connected (balances will be 0 if not connected)
    useEffect(() => {
        const fetchWalletBalances = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance && safeAuthGetERC20USDTBalance) {
                try {
                    // Fetch BEP20 USDT balance
                    const bep20Balance = await safeAuthGetUSDTBalance();
                    setBep20USDTBalance(bep20Balance);

                    // Fetch ERC20 USDT balance
                    const erc20Balance = await safeAuthGetERC20USDTBalance();
                    setErc20USDTBalance(erc20Balance);

                    console.log('💰 BalanceCard - BEP20 USDT:', bep20Balance, 'ERC20 USDT:', erc20Balance);
                } catch (error) {
                    console.error('Error fetching wallet balances in BalanceCard:', error);
                    setBep20USDTBalance('0');
                    setErc20USDTBalance('0');
                }
            } else {
                // Clear balances when not connected
                setBep20USDTBalance('0');
                setErc20USDTBalance('0');
            }
        };

        fetchWalletBalances();
        
        // Refresh every 5 seconds when SafeAuth is connected
        let interval;
        if (safeAuthLoggedIn && safeAuthAccount) {
            interval = setInterval(fetchWalletBalances, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [safeAuthLoggedIn, safeAuthAccount, safeAuthGetUSDTBalance, safeAuthGetERC20USDTBalance]);

    // Calculate total balance
    const totalBalance = () => {
        if (safeAuthLoggedIn && safeAuthAccount) {
            const bep20 = parseFloat(bep20USDTBalance || '0');
            const erc20 = parseFloat(erc20USDTBalance || '0');
            return (bep20 + erc20).toFixed(2);
        }
        return '0.00';
    };

    return (
        <div className='balance-section balance-section-again'>
            <p className='balance-label'>BALANCE</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p className='balance-amount'>
                    {totalBalance()} USDT
                </p>
                <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', gap: '1rem' }}>
                    <span>BEP20: {parseFloat(bep20USDTBalance || '0').toFixed(2)}</span>
                    <span>ERC20: {parseFloat(erc20USDTBalance || '0').toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default BalanceCard;
