import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const BalanceCard = () => {
    const { user } = useAuth();
    const [platformScore, setPlatformScore] = useState(0); // Seka-Svara Score (managed in admin)

    // ✅ Sync platform score from user context (PRIMARY SOURCE)
    // This updates in real-time via socket when balance changes
    useEffect(() => {
        if (user?.platformScore !== undefined && user?.platformScore !== null) {
            console.log("💰 BalanceCard - Syncing platformScore from user context:", user.platformScore);
            setPlatformScore(user.platformScore);
        } else {
            setPlatformScore(0);
        }
    }, [user]);

    const formatBalance = () => {
        // ✅ Display platform score
        if (platformScore === null || platformScore === undefined || isNaN(platformScore)) {
            return '0 USDT';
        }
        return `${Number(platformScore).toFixed(0)} Platform Score`;
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
