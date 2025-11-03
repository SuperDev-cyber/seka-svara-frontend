import React, { useState, useEffect } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import apiService from '../../../services/api';
import './index.css';

const DepositModal = ({ isOpen, onClose, onDepositSuccess }) => {
  const {
    isConnected,
    currentNetwork,
    account,
    USDTBalance,
    sendUSDT,
    connectMetaMask,
    connectTronLink,
    sekaContract,
  } = useWallet();

  const [selectedNetwork, setSelectedNetwork] = useState('BEP20');
  const [adminAddress, setAdminAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'sending', 'confirming', 'success'

  // Fetch admin wallet address when modal opens or network changes
  useEffect(() => {
    if (isOpen) {
      fetchAdminAddress();
      setCurrentStep('input');
      setMessage('');
      setAmount('');
    }
  }, [isOpen, selectedNetwork]);

  const fetchAdminAddress = async () => {
    try {
      const response = await apiService.get(`/wallet/admin-addresses?network=${selectedNetwork}`);
      console.log('Admin address response:', response);
      setAdminAddress(response.address || response.data?.address || '');
    } catch (error) {
      console.error('Failed to fetch admin address:', error);
      setMessage('Failed to load deposit address. Please try again.');
      setMessageType('error');
    }
  };

  const handleNetworkChange = (network) => {
    setSelectedNetwork(network);
    setMessage('');
    setAmount('');
  };

  const handleConnectWallet = async () => {
    try {
      setIsProcessing(true);
      setMessage('Connecting wallet...');
      setMessageType('info');

      if (selectedNetwork === 'BEP20') {
        await connectMetaMask();
      } else if (selectedNetwork === 'TRC20') {
        await connectTronLink();
      }

      setMessage('Wallet connected! Now enter the deposit amount.');
      setMessageType('success');
    } catch (error) {
      console.error('Wallet connection error:', error);
      setMessage(error.message || 'Failed to connect wallet');
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutomatedDeposit = async () => {
    const depositAmount = parseFloat(amount);

    // Validation
    if (!depositAmount || depositAmount < 1) {
      setMessage('Minimum deposit amount is 1 USDT');
      setMessageType('error');
      return;
    }

    if (!adminAddress) {
      setMessage('Admin address not loaded. Please try again.');
      setMessageType('error');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('sending');
    setMessage(`🔄 Initiating ${depositAmount} USDT transfer to ${selectedNetwork} wallet...`);
    setMessageType('info');

    try {
      // Step 1: Send USDT transaction via Web3
      console.log('📤 Sending USDT transaction:', {
        to: adminAddress,
        amount: depositAmount,
        network: selectedNetwork,
      });

      const tx = await sendUSDT(adminAddress, depositAmount, selectedNetwork);
      console.log('✅ Transaction completed:', tx);

      // Extract transaction hash based on network
      let txHash = '';
      if (selectedNetwork === 'BEP20') {
        txHash = tx.transactionHash || tx.hash;
      } else if (selectedNetwork === 'TRC20') {
        txHash = tx.txid || tx.transaction?.txID || tx;
      }

      if (!txHash) {
        throw new Error('Transaction hash not found in response');
      }

      console.log('📝 Transaction Hash:', txHash);

      setCurrentStep('confirming');
      setMessage(`✅ Transaction sent! Hash: ${txHash.substring(0, 10)}... \n\n⏳ Confirming with backend...`);
      setMessageType('info');

      // Step 2: Submit to backend for verification
      const depositData = {
        network: selectedNetwork,
        amount: depositAmount,
        fromAddress: account,
        txHash: txHash,
      };

      console.log('📤 Submitting deposit to backend:', depositData);
      const response = await apiService.post('/wallet/deposit', depositData);
      console.log('✅ Backend response:', response);

      setCurrentStep('success');
      setMessage(`🎉 Deposit successful! ${depositAmount} USDT has been credited to your account.\n\n✨ Your SEKA balance is being updated...`);
      setMessageType('success');

      // Call success callback to refresh balances
      if (onDepositSuccess) {
        await onDepositSuccess();
      }

      // Show success toast notification
      if (window.showToast) {
        window.showToast(`🎉 Successfully deposited ${depositAmount} USDT!`, 'success', 4000);
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setAmount('');
        setMessage('');
        setCurrentStep('input');
      }, 2000);

    } catch (error) {
      console.error('❌ Deposit error:', error);
      setCurrentStep('input');
      
      let errorMessage = 'Deposit failed. ';
      if (error.message?.includes('User denied')) {
        errorMessage += 'You rejected the transaction.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage += 'Insufficient funds for transaction + gas fees.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setAmount('');
      setMessage('');
      setCurrentStep('input');
      onClose();
    }
  };

  if (!isOpen) return null;

  const needsWalletConnection = !isConnected || currentNetwork !== selectedNetwork;

  return (
    <div className="modal-overlay" onClick={handleClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="deposit-modal" onClick={(e) => e.stopPropagation()} style={{
        background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="modal-header" style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>💰 Deposit USDT - Automated</h2>
          <button 
            onClick={handleClose} 
            disabled={isProcessing}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '28px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1,
              padding: '4px 8px',
              lineHeight: 1
            }}
          >×</button>
        </div>

        <div className="modal-content" style={{ padding: '24px' }}>
          {/* Network Selection */}
          <div className="network-selection" style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffd700'
            }}>Select Network:</label>
            <div className="network-options" style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <button
                onClick={() => handleNetworkChange('BEP20')}
                disabled={isProcessing}
                style={{
                  padding: '16px',
                  border: selectedNetwork === 'BEP20' ? '2px solid #ffd700' : '2px solid rgba(255, 255, 255, 0.2)',
                  background: selectedNetwork === 'BEP20' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                <span style={{ fontSize: '32px' }}>🟡</span>
                <span style={{ fontWeight: '600' }}>BSC (BEP20)</span>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>Low fees</span>
              </button>
              <button
                onClick={() => handleNetworkChange('TRC20')}
                disabled={isProcessing}
                style={{
                  padding: '16px',
                  border: selectedNetwork === 'TRC20' ? '2px solid #ffd700' : '2px solid rgba(255, 255, 255, 0.2)',
                  background: selectedNetwork === 'TRC20' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                <span style={{ fontSize: '32px' }}>🔴</span>
                <span style={{ fontWeight: '600' }}>TRON (TRC20)</span>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>Very low fees</span>
              </button>
            </div>
          </div>

          {/* Wallet Status */}
          {isConnected && currentNetwork === selectedNetwork && (
            <div style={{
              padding: '16px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.5)',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#22c55e'
            }}>
              ✅ Wallet Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
              <br />
              💰 Your USDT Balance: {parseFloat(USDTBalance || 0).toFixed(0)} USDT
            </div>
          )}

          {needsWalletConnection && (
            <div style={{
              padding: '16px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#f59e0b'
            }}>
              ⚠️ Please connect your {selectedNetwork} wallet to continue
            </div>
          )}

          {/* Admin Address Display */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffd700'
            }}>Your Seka Svara Wallet Address ({selectedNetwork}):</label>
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#60a5fa'
            }}>
              {sekaContract?.address || adminAddress
                ? `${(sekaContract?.address || adminAddress).substring(0, 6)}...${(sekaContract?.address || adminAddress).substring((sekaContract?.address || adminAddress).length - 5)}`
                : 'Loading...'
              }
            </div>
            <p style={{ 
              fontSize: '12px', 
              opacity: 0.7, 
              marginTop: '8px',
              margin: '8px 0 0 0'
            }}>Funds will be sent to this address automatically</p>
          </div>

          {/* Amount Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffd700'
            }}>Amount (USDT):</label>
            <input
              type="text"
              placeholder="Enter amount (min. 1 USDT)"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setAmount(value);
                  setMessage('');
                }
              }}
              disabled={isProcessing || needsWalletConnection}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {isConnected && currentNetwork === selectedNetwork && (
              <p style={{ 
                fontSize: '12px', 
                opacity: 0.7, 
                marginTop: '8px',
                margin: '8px 0 0 0'
              }}>
                Available: {parseFloat(USDTBalance || 0).toFixed(0)} USDT
              </p>
            )}
          </div>

          {/* Progress Steps */}
          {currentStep !== 'input' && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '24px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {currentStep === 'sending' ? '🔄' : '✅'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Sending Transaction</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {currentStep === 'confirming' ? '⏳' : currentStep === 'success' ? '✅' : '⏸'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Backend Confirmation</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {currentStep === 'success' ? '🎉' : '⏸'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Funds Credited</div>
              </div>
            </div>
          )}

          {/* SEKA Points Explanation */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '2px solid #667eea',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#ffd700' }}>🎮 About SEKA USDT:</h4>
            <p style={{ marginBottom: '10px', fontSize: '14px' }}>
              <strong>Your USDT → SEKA USDT → Play Games</strong>
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: '1.8' }}>
              <li>✅ All game activities use <strong>SEKA Points</strong> (virtual balance)</li>
              <li>✅ Your actual wallet funds are <strong>NEVER touched</strong> during games</li>
              <li>✅ No gas fees for bets, antes, or raises</li>
              <li>✅ Faster gameplay with instant balance updates</li>
            </ul>
          </div>

          {/* Instructions */}
          <div style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#60a5fa' }}>📌 How it works:</h4>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
              <li>Select your network (BEP20 or TRC20)</li>
              <li>Connect your wallet (MetaMask or TronLink)</li>
              <li>Enter the amount you want to deposit (min. 1 USDT)</li>
              <li>Click "Deposit Now" - your wallet will open automatically</li>
              <li>Confirm the transaction in your wallet</li>
              <li>SEKA Points will be credited automatically! 🎉</li>
            </ol>
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#f59e0b'
            }}>
              <strong>⚠️ Important:</strong> Make sure you have enough native tokens ({selectedNetwork === 'BEP20' ? 'ETH' : 'TRX'}) for gas fees!
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div style={{
              padding: '16px',
              background: messageType === 'error' ? 'rgba(239, 68, 68, 0.1)' : 
                         messageType === 'success' ? 'rgba(34, 197, 94, 0.1)' : 
                         'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${messageType === 'error' ? 'rgba(239, 68, 68, 0.5)' : 
                                   messageType === 'success' ? 'rgba(34, 197, 94, 0.5)' : 
                                   'rgba(59, 130, 246, 0.5)'}`,
              borderRadius: '8px',
              marginBottom: '20px',
              color: messageType === 'error' ? '#ef4444' : 
                     messageType === 'success' ? '#22c55e' : 
                     '#3b82f6',
              whiteSpace: 'pre-line',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}
        </div>

        <div style={{
          padding: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={handleClose} 
            disabled={isProcessing}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1,
              transition: 'all 0.3s'
            }}
          >
            {currentStep === 'success' ? 'Close' : 'Cancel'}
          </button>
          
          {needsWalletConnection ? (
            <button 
              onClick={handleConnectWallet}
              disabled={isProcessing}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.5 : 1,
                transition: 'all 0.3s'
              }}
            >
              {isProcessing ? '🔄 Connecting...' : `🔗 Connect ${selectedNetwork} Wallet`}
            </button>
          ) : (
            <button 
              onClick={handleAutomatedDeposit}
              disabled={isProcessing || !amount || parseFloat(amount) < 0.00000000001}
              style={{
                padding: '12px 24px',
                background: (isProcessing || !amount || parseFloat(amount) < 0.00000000001) 
                  ? 'rgba(102, 126, 234, 0.3)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (isProcessing || !amount || parseFloat(amount) < 0.00000000001) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {isProcessing ? '🔄 Processing...' : '🚀 Deposit Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
