import React, { useState, useEffect } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';
import apiService from '../../../services/api';

const WithdrawModal = ({ isOpen, onClose, onWithdrawSuccess }) => {
    const { isConnected, account, currentNetwork: connectedNetwork, getBalance } = useWallet();
    const { user } = useAuth();
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance } = useSafeAuth();
    
    const [selectedNetwork, setSelectedNetwork] = useState('BEP20');
    const [withdrawalAddress, setWithdrawalAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
    const [copied, setCopied] = useState(false);
    const [walletUSDTBalance, setWalletUSDTBalance] = useState('0');
    
    // Wagering stats
    const [totalWagered, setTotalWagered] = useState(0);
    const [totalDeposited, setTotalDeposited] = useState(0);
    const [sekaBalance, setSekaBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const networks = [
        { value: 'BEP20', label: 'BEP20 (BSC)', fee: 0 },
        { value: 'TRC20', label: 'TRC20 (TRON)', fee: 0 }
    ];

    // Reset withdrawal address to empty when modal opens
    useEffect(() => {
        if (isOpen) {
            setWithdrawalAddress('');
            setAddressError('');
            setAmount('');
            setMessage('');
        }
    }, [isOpen]);

    // ✅ Fetch Web3Auth wallet USDT balance when modal opens
    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (isOpen && safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance) {
                try {
                    const balance = await safeAuthGetUSDTBalance();
                    setWalletUSDTBalance(balance);
                    console.log('💰 WithdrawModal - Web3Auth USDT Balance:', balance);
                } catch (error) {
                    console.error('Error fetching wallet balance in WithdrawModal:', error);
                    setWalletUSDTBalance('0');
                }
            } else {
                setWalletUSDTBalance('0');
            }
        };

        if (isOpen) {
            fetchWalletBalance();
            // Refresh every 5 seconds when SafeAuth is connected
            let interval;
            if (safeAuthLoggedIn && safeAuthAccount) {
                interval = setInterval(fetchWalletBalance, 5000);
            }
            return () => {
                if (interval) clearInterval(interval);
            };
        }
    }, [isOpen, safeAuthLoggedIn, safeAuthAccount, safeAuthGetUSDTBalance]);

    // Fetch wagering stats and balance
    useEffect(() => {
        if (isOpen && user) {
            fetchWageringStats();
            fetchSekaBalance();
        }
    }, [isOpen, user]);

    const fetchWageringStats = async () => {
        try {
            setLoading(true);
            // Get wagering stats from backend
            const stats = await apiService.get('/wallet/wagering-stats');
            setTotalWagered(parseFloat(stats.totalWagered || 0));
            setTotalDeposited(parseFloat(stats.totalDeposited || 0));
        } catch (error) {
            console.error('Error fetching wagering stats:', error);
            setTotalWagered(0);
            setTotalDeposited(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchSekaBalance = async () => {
        try {
            if (isConnected && connectedNetwork && getBalance) {
                const balance = await getBalance(connectedNetwork);
                setSekaBalance(parseFloat(balance) || 0);
            } else {
                setSekaBalance(parseFloat(user?.balance) || 0);
            }
        } catch (error) {
            console.error('Error fetching SEKA balance:', error);
            setSekaBalance(parseFloat(user?.balance) || 0);
        }
    };

    // ✅ Users can withdraw their full Web3Auth wallet USDT balance
    // Falls back to Platform Score if Web3Auth is not connected
    const maxWithdrawable = safeAuthLoggedIn && safeAuthAccount && walletUSDTBalance
        ? parseFloat(walletUSDTBalance || '0')
        : Number(user?.platformScore || 0);
    const currentNetwork = networks.find(network => network.value === selectedNetwork);

    // Validate withdrawal address
    const validateAddress = (address) => {
        if (!address || address.trim() === '') {
            return 'Address is required';
        }
        
        const trimmedAddress = address.trim();
        
        // BEP20 (BSC) address validation - Ethereum format (0x followed by 40 hex characters)
        if (selectedNetwork === 'BEP20') {
            if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
                return 'Invalid BSC address format. Must be 0x followed by 40 hexadecimal characters.';
            }
        }
        
        // TRC20 (TRON) address validation - Base58 format, 34 characters starting with T
        if (selectedNetwork === 'TRC20') {
            if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(trimmedAddress)) {
                return 'Invalid TRON address format. Must start with T and be 34 characters.';
            }
        }
        
        return '';
    };

    const handleAddressChange = (e) => {
        const address = e.target.value;
        setWithdrawalAddress(address);
        const error = validateAddress(address);
        setAddressError(error);
    };

    const handleCopyAddress = async () => {
        try {
            if (!withdrawalAddress) {
                throw new Error('No address to copy');
            }
            await navigator.clipboard.writeText(withdrawalAddress);
            setCopied(true);
            if (window.showToast) window.showToast('Address copied!', 'success', 1500);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error('Failed to copy address:', error);
            if (window.showToast) window.showToast('Failed to copy address', 'error', 2000);
        }
    };

    // const getSigner = useCallback(async () => {
    //     if (!window.ethereum) {
    //       return;
    //     }
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     return provider.getSigner();
    //   }, []);

    const handleWithdraw = async () => {
        // Validate withdrawal address first
        const addressError = validateAddress(withdrawalAddress);
        if (addressError) {
            setMessage(addressError);
            setMessageType('error');
            setAddressError(addressError);
            return;
        }

        // Parse and validate amount
        const withdrawAmount = parseFloat(amount);

        // Validation
        if (!amount || withdrawAmount <= 0 || isNaN(withdrawAmount)) {
            setMessage('Please enter a valid amount');
            setMessageType('error');
            return;
        }

        if (withdrawAmount > maxWithdrawable) {
            setMessage(`Insufficient balance. You can withdraw up to ${maxWithdrawable.toFixed(2)} USDT`);
            setMessageType('error');
            return;
        }

        if (!safeAuthLoggedIn || !safeAuthAccount) {
            setMessage('Please connect your Web3Auth wallet first');
            setMessageType('error');
            return;
        }

        try {
            setIsProcessing(true);
            setMessage('Processing withdrawal...');
            setMessageType('info');
            
            // Call backend to process withdrawal
            // fromAddress: User's Web3Auth account address (where funds were deposited)
            // toAddress: User's chosen withdrawal address (where funds will be sent)
            const response = await apiService.post('/wallet/withdraw', {
                network: selectedNetwork,
                amount: withdrawAmount, // Amount in USDT
                fromAddress: safeAuthAccount, // ✅ User's Web3Auth account address (where user deposited funds)
                toAddress: withdrawalAddress.trim() // User-entered withdrawal address (where funds will be sent)
            });

            console.log('✅ Withdrawal request sent:', {
                network: selectedNetwork,
                amount: withdrawAmount,
                fromAddress: safeAuthAccount, // Web3Auth account address
                toAddress: withdrawalAddress.trim() // User's chosen withdrawal address
            });

            setMessage(`✅ Withdrawal successful! ${withdrawAmount.toFixed(2)} USDT will be sent to ${withdrawalAddress.trim().substring(0, 6)}...${withdrawalAddress.trim().substring(withdrawalAddress.trim().length - 4)}`);
            setMessageType('success');
            
            // Call success callback
            if (onWithdrawSuccess) {
                await onWithdrawSuccess();
            }
            
            // Close modal after 3 seconds
            setTimeout(() => {
                onClose();
                setAmount('');
                setWithdrawalAddress('');
                setMessage('');
                setAddressError('');
            }, 3000);

        } catch (error) {
            console.error('Withdrawal error:', error);
            setMessage(error.message || 'Withdrawal failed. Please try again.');
            setMessageType('error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isProcessing) {
            onClose();
        }
    };

    const handleMaxAmount = () => {
        setAmount(maxWithdrawable.toFixed(2));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="withdraw-modal">
                <div className="modal-header">
                    <h2 className="modal-title">💸 Withdraw SEKA</h2>
                    <p className="modal-subtitle">Convert SEKA Points back to USDT</p>
                    <button className="close-button" onClick={onClose} disabled={isProcessing}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-content">
                    {/* Source Address Display - Web3Auth Account (where funds are withdrawn from) */}
                    {safeAuthLoggedIn && safeAuthAccount && (
                        <div className="info-box" style={{
                            background: 'linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)',
                            border: '2px solid #22c55e',
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '14px', color: '#22c55e' }}>
                                💰 Source Address (Your Web3Auth Account):
                            </div>
                            <div style={{
                                background: '#1a1a1a',
                                padding: '10px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                wordBreak: 'break-all',
                                fontFamily: 'monospace',
                                color: '#22c55e'
                            }}>
                                {safeAuthAccount}
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8, color: '#4ade80' }}>
                                ✅ Funds will be withdrawn from this Web3Auth account address
                            </div>
                        </div>
                    )}

                    {/* Network Selection - FIRST */}
                    <div className="form-group">
                        <label className="form-label">Network</label>
                        <div className="dropdown-container">
                            <select
                                value={selectedNetwork}
                                onChange={(e) => setSelectedNetwork(e.target.value)}
                                className="network-dropdown"
                                disabled={isProcessing}
                            >
                                {networks.map((network) => (
                                    <option key={network.value} value={network.value}>
                                        {network.label}
                                    </option>
                                ))}
                            </select>
                            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9"/>
                            </svg>
                        </div> 
                    </div>

                    {/* Wallet Address Input - User can enter arbitrary address - AFTER Network Selection */}
                    <div className="info-box" style={{
                        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                        border: '2px solid #667eea',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                            📍 Withdrawal Address (Destination):
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <input
                                type="text"
                                value={withdrawalAddress}
                                onChange={handleAddressChange}
                                placeholder={selectedNetwork === 'BEP20' ? '0x...' : 'T...'}
                                style={{
                                    flex: 1,
                                    background: '#1a1a1a',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontFamily: 'monospace',
                                    color: addressError ? '#ef4444' : '#ffd700',
                                    border: addressError ? '2px solid #ef4444' : '2px solid #667eea',
                                    wordBreak: 'break-all'
                                }}
                                disabled={isProcessing || !safeAuthLoggedIn}
                            />
                            <button
                                onClick={handleCopyAddress}
                                disabled={!withdrawalAddress || isProcessing}
                                style={{
                                    background: copied ? '#22c55e' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    cursor: (!withdrawalAddress || isProcessing) ? 'not-allowed' : 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    opacity: (!withdrawalAddress || isProcessing) ? 0.6 : 1
                                }}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        {addressError && (
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#ef4444' }}>
                                ⚠️ {addressError}
                            </div>
                        )}
                        {!addressError && withdrawalAddress && (
                            <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8, color: '#22c55e' }}>
                                ✅ Valid {selectedNetwork === 'BEP20' ? 'BSC' : 'TRON'} address
                            </div>
                        )}
                        {!safeAuthLoggedIn && (
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#ffa500' }}>
                                ⚠️ Please connect your Web3Auth wallet first
                            </div>
                        )}
                    </div>

                    {/* Balance Information */}
                    <div className="info-box" style={{
                        background: 'linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)',
                        border: '2px solid #22c55e',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '20px'
                    }}>
                        <h4 style={{ marginBottom: '12px', color: '#22c55e', fontSize: '16px' }}>
                            💰 Withdrawal Information
                        </h4>
                        {loading ? (
                            <div>Loading stats...</div>
                        ) : (
                            <>
                                <div style={{
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginBottom: '12px',
                                    fontSize: '12px',
                                    lineHeight: '1.6',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    color: '#4ade80'
                                }}>
                                    <strong>✅ You can withdraw your full balance!</strong><br/>
                                    All funds in your account are available for withdrawal with no restrictions.
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{fontSize:'12px'}}>Current Web3Auth Wallet Balance:</span>
                                    <span style={{ fontWeight: 'bold', color: '#22c55e', fontSize:'12px' }}>
                                        {maxWithdrawable.toFixed(2)} USDT
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{fontSize:'12px'}}>Max Withdrawable:</span>
                                    <span style={{ fontWeight: 'bold', color: '#ffd700', fontSize:'12px' }}>
                                        {maxWithdrawable.toFixed(2)} USDT
                                    </span>
                                </div>
                                {totalWagered > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', opacity: 0.7 }}>
                                        <span style={{fontSize:'12px'}}>Total Game Activity (Info Only):</span>
                                        <span style={{ fontWeight: 'bold', color: '#60a5fa', fontSize:'12px' }}>
                                            {totalWagered.toFixed(0)} Platform Score
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="label-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label className="form-label">Amount (USDT)</label>
                            <button 
                                type="button"
                                className="max-button" 
                                onClick={handleMaxAmount}
                                disabled={isProcessing || loading || maxWithdrawable <= 0}
                                style={{
                                    background: (isProcessing || loading || maxWithdrawable <= 0) 
                                        ? '#444' 
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: (isProcessing || loading || maxWithdrawable <= 0) ? 'not-allowed' : 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    opacity: (isProcessing || loading || maxWithdrawable <= 0) ? 0.6 : 1
                                }}
                            >
                                MAX
                            </button>
                        </div>
                        <input
                            type="number"
                            placeholder={`Enter amount (max: ${maxWithdrawable.toFixed(2)} USDT)`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="amount-input"
                            min="0"
                            step="0.01"
                            disabled={isProcessing || loading || maxWithdrawable <= 0}
                        />
                        <div style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
                            Available Balance: {maxWithdrawable.toFixed(2)} USDT
                        </div>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            background: messageType === 'success' ? 'rgba(34, 197, 94, 0.2)' : 
                                       messageType === 'error' ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(59, 130, 246, 0.2)',
                            border: `1px solid ${messageType === 'success' ? '#22c55e' : 
                                               messageType === 'error' ? '#ef4444' : '#3b82f6'}`,
                            color: messageType === 'success' ? '#22c55e' : 
                                   messageType === 'error' ? '#ef4444' : '#3b82f6'
                        }}>
                            {message}
                        </div>
                    )}


                    <div className="important-notes" style={{
                        background: '#1a1a1a',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '15px'
                    }}>
                        <h3 style={{ marginBottom: '10px', fontSize: '14px', color: '#22c55e' }}>✅ Withdrawal Information</h3>
                        <ul style={{ fontSize: '12px', lineHeight: '1.8', paddingLeft: '20px' }}>
                            <li><strong>Full Balance Available:</strong> You can withdraw your entire Web3Auth wallet USDT balance with no restrictions</li>
                            <li>Withdrawal amount equals your Web3Auth wallet USDT balance</li>
                            <li><strong>From:</strong> Your Web3Auth account address (where you deposited funds)</li>
                            <li><strong>To:</strong> The withdrawal address you specify above (any address of your choice)</li>
                            <li>Processing time: ~5-10 minutes</li>
                            <li>No withdrawal fees</li>
                        </ul>
                    </div>

                    <button 
                        className="confirm-button"
                        onClick={handleWithdraw}
                        disabled={isProcessing || loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdrawable || !!addressError || !withdrawalAddress || !safeAuthLoggedIn}
                        style={{
                            background: (isProcessing || loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdrawable || !!addressError || !withdrawalAddress || !safeAuthLoggedIn) 
                                ? '#444' 
                                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            color: '#fff',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: (isProcessing || loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdrawable || !!addressError || !withdrawalAddress || !safeAuthLoggedIn) ? 'not-allowed' : 'pointer',
                            width: '100%',
                            opacity: (isProcessing || loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdrawable || !!addressError || !withdrawalAddress || !safeAuthLoggedIn) ? 0.6 : 1
                        }}
                    >
                        {isProcessing ? '⏳ Processing...' : '💸 Confirm Withdrawal'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawModal;
