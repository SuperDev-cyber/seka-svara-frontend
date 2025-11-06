import React, { useState, useEffect } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import { sekaContract } from '../../../blockchain';
import { ethers, Signer } from 'ethers';

const WithdrawModal = ({ isOpen, onClose, onWithdrawSuccess }) => {
    const { isConnected, account, currentNetwork: connectedNetwork, getBalance } = useWallet();
    const { user } = useAuth();
    
    const [selectedNetwork, setSelectedNetwork] = useState('BEP20');
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
    
    // Wagering stats
    const [totalWagered, setTotalWagered] = useState(0);
    const [totalDeposited, setTotalDeposited] = useState(0);
    const [sekaBalance, setSekaBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const networks = [
        { value: 'BEP20', label: 'BEP20 (BSC)', fee: 0 },
        { value: 'TRC20', label: 'TRC20 (TRON)', fee: 0 }
    ];

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

    // Users can withdraw their full balance - no wagering requirements
    const maxWithdrawable = sekaBalance;
    const currentNetwork = networks.find(network => network.value === selectedNetwork);

    const toBigNum = (value, d = 6) => {
        return ethers.utils.parseUnits(value.toString(), d);
    }

    // const getSigner = useCallback(async () => {
    //     if (!window.ethereum) {
    //       return;
    //     }
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     return provider.getSigner();
    //   }, []);

    const handleWithdraw = async () => {
        

        // Validation
        if (!withdrawAmount || withdrawAmount <= 0) {
            setMessage('Please enter a valid amount');
            setMessageType('error');
            return;
        }

        if (withdrawAmount > sekaBalance) {
            setMessage('Insufficient SEKA balance');
            setMessageType('error');
            return;
        }

        if (!account) {
            setMessage('Please connect your wallet first');
            setMessageType('error');
            return;
        }

        try {
            setIsProcessing(true);
            setMessage('Processing withdrawal...');
            setMessageType('info');
            const withdrawAmount = toBigNum(amount);
            // const signer = await getSigner();
            // if(!signer) {
            //     setMessage('Please connect your wallet first');
            //     setMessageType('error');
            //     return;
            // }
            // const sekaWithSigner = sekaContract.connect(signer);
            // const tx = await sekaWithSigner.withdraw(withdrawAmount);
            // Call backend to process withdrawal
            const response = await apiService.post('/wallet/withdraw', {
                network: selectedNetwork,
                amount: withdrawAmount,
                toAddress: account
            });

            setMessage(`✅ Withdrawal successful! ${withdrawAmount} SEKA will be sent to ${account.substring(0, 6)}...${account.substring(account.length - 4)}`);
            setMessageType('success');
            
            // Call success callback
            if (onWithdrawSuccess) {
                await onWithdrawSuccess();
            }
            
            // Close modal after 3 seconds
            setTimeout(() => {
                onClose();
                setAmount('');
                setMessage('');
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
        setAmount(sekaBalance.toFixed(0));
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
                    {/* Wallet Address Display */}
                    <div className="info-box" style={{
                        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                        border: '2px solid #667eea',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                            📍 Withdrawal Address:
                        </div>
                        <div style={{
                            background: '#1a1a1a',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            wordBreak: 'break-all',
                            fontFamily: 'monospace',
                            color: '#ffd700'
                        }}>
                            {account || 'Not Connected'}
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8 }}>
                            USDT will be sent to your connected wallet address
                        </div>
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
                                    <span style={{fontSize:'12px'}}>Current SEKA Balance:</span>
                                    <span style={{ fontWeight: 'bold', color: '#22c55e', fontSize:'12px' }}>
                                        {sekaBalance.toFixed(0)} SEKA
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{fontSize:'12px'}}>Max Withdrawable:</span>
                                    <span style={{ fontWeight: 'bold', color: '#ffd700', fontSize:'12px' }}>
                                        {maxWithdrawable.toFixed(0)} SEKA
                                    </span>
                                </div>
                                {totalWagered > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', opacity: 0.7 }}>
                                        <span style={{fontSize:'12px'}}>Total Game Activity (Info Only):</span>
                                        <span style={{ fontWeight: 'bold', color: '#60a5fa', fontSize:'12px' }}>
                                            {totalWagered.toFixed(0)} SEKA
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

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

                    <div className="form-group">
                        <div className="label-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label className="form-label">Amount (SEKA)</label>
                            <button 
                                type="button"
                                className="max-button" 
                                onClick={handleMaxAmount}
                                disabled={isProcessing || loading}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            >
                                MAX
                            </button>
                        </div>
                        <input
                            type="number"
                            placeholder={`Enter amount (max: ${sekaBalance.toFixed(0)} SEKA)`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="amount-input"
                            min="0"
                            step="0.01"
                            disabled={isProcessing || loading}
                        />
                        <div style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
                            Available Balance: {sekaBalance.toFixed(0)} SEKA
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
                            <li><strong>Full Balance Available:</strong> You can withdraw your entire SEKA balance with no restrictions</li>
                            <li>SEKA Points will be converted back to USDT (1:1 ratio)</li>
                            <li>USDT will be sent to your connected wallet address</li>
                            <li>Processing time: ~5-10 minutes</li>
                            <li>No withdrawal fees</li>
                        </ul>
                    </div>

                    <button 
                        className="confirm-button"
                        onClick={handleWithdraw}
                        disabled={isProcessing || loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > sekaBalance}
                        style={{
                            background: (isProcessing || loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > sekaBalance) 
                                ? '#444' 
                                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            color: '#fff',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: (isProcessing || loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > sekaBalance) ? 'not-allowed' : 'pointer',
                            width: '100%',
                            opacity: (isProcessing || loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > sekaBalance) ? 0.6 : 1
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
