import React, { useState, useEffect } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useSafeAuth } from '../../../contexts/SafeAuthContext';
import apiService from '../../../services/api';

const WithdrawModal = ({ isOpen, onClose, onWithdrawSuccess }) => {
    const { isConnected, account, currentNetwork: connectedNetwork, getBalance } = useWallet();
    const { user } = useAuth();
    const { 
        loggedIn: safeAuthLoggedIn, 
        account: safeAuthAccount, 
        getUSDTBalance: safeAuthGetUSDTBalance,
        getPrivateKey: safeAuthGetPrivateKey 
    } = useSafeAuth();
    
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

    const [selectedNetwork, setSelectedNetwork] = useState('BEP20');

    // Reset withdrawal address to empty when modal opens
    useEffect(() => {
        if (isOpen) {
            setWithdrawalAddress('');
            setAddressError('');
            setAmount('');
            setMessage('');
        }
    }, [isOpen]);

    // ✅ Fetch Web3Auth wallet USDT balance when modal opens (BEP20 only)
    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (isOpen && safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance) {
                try {
                    const balance = await safeAuthGetUSDTBalance();
                    setWalletUSDTBalance(balance);
                    console.log('💰 WithdrawModal - BEP20 USDT Balance:', balance);
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

    // Validate withdrawal address
    const validateAddress = (address) => {
        if (!address || address.trim() === '') {
            return 'Address is required';
        }
        
        const trimmedAddress = address.trim();
        
        // BEP20 uses Ethereum-compatible address format
        // Uses 0x followed by 40 hex characters
        if (selectedNetwork === 'BEP20') {
            if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
                return `Invalid BSC address format. Must be 0x followed by 40 hexadecimal characters.`;
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
            setMessage('Retrieving private key from Web3Auth...');
            setMessageType('info');
            
            // ✅ Get user's private key from Web3Auth
            let userPrivateKey;
            try {
                userPrivateKey = await safeAuthGetPrivateKey();
                console.log('✅ Private key retrieved from Web3Auth');
            } catch (keyError) {
                console.error('❌ Failed to get private key:', keyError);
                setMessage(`Failed to retrieve private key: ${keyError.message}. Please ensure you are logged in to Web3Auth.`);
                setMessageType('error');
                setIsProcessing(false);
                return;
            }

            setMessage('Processing withdrawal...');
            setMessageType('info');
            
            // Use Web3Auth account address as fromAddress (works for both BEP20 and ERC20)
            const fromAddress = safeAuthAccount;
            
            // Call backend to process withdrawal
            // fromAddress: User's Web3Auth account address (BEP20 or ERC20, where funds were deposited)
            // toAddress: User's chosen withdrawal address (where funds will be sent)
            // privateKey: User's private key from Web3Auth (for signing transaction)
            const response = await apiService.post('/wallet/withdraw', {
                network: selectedNetwork,
                amount: withdrawAmount, // Amount in USDT
                fromAddress: fromAddress, // ✅ User's Web3Auth account address (BEP20)
                toAddress: withdrawalAddress.trim(), // User-entered withdrawal address (where funds will be sent)
                privateKey: userPrivateKey // ✅ User's private key from Web3Auth
            });

            console.log('✅ Withdrawal request sent:', {
                network: selectedNetwork,
                amount: withdrawAmount,
                fromAddress: fromAddress, // Web3Auth account address (BEP20)
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
                    {/* Network Selection */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Network</label>
                        <div className="dropdown-container" style={{ position: 'relative' }}>
                            <select
                                value={selectedNetwork}
                                onChange={(e) => setSelectedNetwork(e.target.value)}
                                className="network-dropdown"
                                disabled={isProcessing}
                                style={{
                                    width: '100%',
                                    padding: '12px 40px 12px 12px',
                                    background: '#1a1a1a',
                                    border: '2px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <option value="BEP20">BEP20 (BSC)</option>
                            </select>
                            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <polyline points="6,9 12,15 18,9"/>
                            </svg>
                        </div>
                    </div>

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
                                💰 Source Address (Your Web3Auth BSC Account):
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
                                ✅ Funds will be withdrawn from this Web3Auth BSC account address
                            </div>
                        </div>
                    )}

                    {/* Wallet Address Input - User can enter arbitrary address */}
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
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }} className='withdraw-address-input-container'>
                            <input
                                type="text"
                                value={withdrawalAddress}
                                onChange={handleAddressChange}
                                placeholder="0x..."
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
                                className='withdraw-copy-button'
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
                                ✅ Valid BSC address
                            </div>
                        )}
                        {!safeAuthLoggedIn && (
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#ffa500' }}>
                                ⚠️ Please connect your Web3Auth wallet first
                            </div>
                        )}
                    </div>

                    {/* Balance Information - Redesigned */}
                    <div className="info-box" style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(16, 163, 74, 0.08) 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            marginBottom: '16px',
                            color: '#22c55e',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            <span>Withdrawal Information</span>
                        </div>
                        {loading ? (
                            <div style={{ 
                                padding: '20px', 
                                textAlign: 'center', 
                                color: '#888',
                                fontSize: '14px'
                            }}>
                                <div style={{ 
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    border: '3px solid rgba(34, 197, 94, 0.3)',
                                    borderTopColor: '#22c55e',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginRight: '10px'
                                }}></div>
                                Loading stats...
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{
                                    background: 'rgba(34, 197, 94, 0.15)',
                                    padding: '14px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    color: '#4ade80'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        <strong>Full Balance Available</strong>
                                    </div>
                                    You can withdraw your entire Web3Auth wallet USDT balance with no restrictions.
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    <span style={{ fontSize: '14px', color: '#ccc' }}>Available Balance:</span>
                                    <span style={{ fontWeight: 'bold', color: '#22c55e', fontSize: '16px' }}>
                                        {maxWithdrawable.toFixed(2)} USDT
                                    </span>
                                </div>
                                {totalWagered > 0 && (
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        opacity: 0.7,
                                        color: '#888'
                                    }}>
                                        <span>Total Game Activity (Info Only):</span>
                                        <span style={{ fontWeight: '500', color: '#60a5fa' }}>
                                            {totalWagered.toFixed(0)} Platform Score
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Amount Input - Redesigned */}
                    <div className="form-group" style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)'
                    }}>
                        <div className="label-row" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '12px' 
                        }}>
                            <label className="form-label" style={{ 
                                fontSize: '16px', 
                                fontWeight: '600',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                Amount (USDT)
                            </label>
                            <button 
                                type="button"
                                className="max-button" 
                                onClick={handleMaxAmount}
                                disabled={isProcessing || maxWithdrawable <= 0}
                                style={{
                                    background: (isProcessing || maxWithdrawable <= 0) 
                                        ? 'rgba(68, 68, 68, 0.5)' 
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: (isProcessing || maxWithdrawable <= 0) ? 'not-allowed' : 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    opacity: (isProcessing || maxWithdrawable <= 0) ? 0.5 : 1,
                                    transition: 'all 0.3s ease',
                                    boxShadow: (isProcessing || maxWithdrawable <= 0) ? 'none' : '0 2px 8px rgba(102, 126, 234, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isProcessing && maxWithdrawable > 0) {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isProcessing && maxWithdrawable > 0) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                                    }
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
                            max={maxWithdrawable}
                            disabled={isProcessing}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: '#1a1a1a',
                                border: '2px solid rgba(102, 126, 234, 0.5)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '500',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <div style={{ 
                            color: '#888', 
                            fontSize: '13px', 
                            marginTop: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>Available Balance:</span>
                            <span style={{ 
                                fontWeight: '600', 
                                color: '#22c55e',
                                fontSize: '14px'
                            }}>
                                {maxWithdrawable.toFixed(2)} USDT
                            </span>
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
