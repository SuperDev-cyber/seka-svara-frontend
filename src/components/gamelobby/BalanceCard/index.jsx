import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import { useWallet } from '../../../contexts/WalletContext';
const BalanceCard = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sekaBalance, setSekaBalance] = useState(0);
    const { isConnected, currentNetwork, getBalance } = useWallet();
    const fetchSekaBalance = async () => {
        if (isConnected && currentNetwork) {
            try {
                // getBalance already returns a formatted string, no need to format again
                const balance = await getBalance(currentNetwork);
                console.log("Seka contract balance:", balance);
                setSekaBalance(balance);
                
                // ✅ SYNC CONTRACT BALANCE TO BACKEND DATABASE
                const balanceNum = parseFloat(balance) || 0;
                
                if (balanceNum > 0) {
                    try {
                        const result = await apiService.post('/wallet/sync-balance', {
                            contractBalance: balanceNum
                        });
                        
                        console.log("✅ Balance synced to backend:", result);
                        // Refresh balance from backend
                        fetchBalance();
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

    useEffect(() => {
        if (user) {
            fetchBalance();
        }
    }, [user]);

    const fetchBalance = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/wallet/balance');
            console.log("response", response);
            
            setBalance(response?.balance || user?.balance || 0);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setBalance(user?.balance || 0);
        } finally {
            setLoading(false);
        }
    };

    const formatBalance = (amount) => {
        return `${sekaBalance ? sekaBalance : '0.00'} SEKA`;
    };

    return (
        <div className='balance-section'>
            <p className='balance-label'>Balance</p>
            <p className='balance-amount'>
                {loading ? 'Loading...' : formatBalance(balance)}
            </p>
        </div>
    );
};

export default BalanceCard;
