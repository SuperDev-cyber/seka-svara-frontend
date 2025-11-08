import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSafeAuth } from '../../contexts/SafeAuthContext';
import apiService from '../../services/api';
import './DepositModal.css';
import { ethers } from 'ethers';

// ✅ Using Web3Auth account address as deposit address

const DepositModal = ({ isOpen, onClose, onDepositSuccess }) => {
  const {
    isConnected,
    currentNetwork,
    account,
    USDTBalance,
    sendUSDT,
    connectMetaMask,
    connectTronLink,
    networks,
  } = useWallet();
  const { user } = useAuth();
  const { account: safeAuthAccount, loggedIn: safeAuthLoggedIn } = useSafeAuth();

  const [selectedNetwork, setSelectedNetwork] = useState('BEP20');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'sending', 'confirming', 'success'
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState({ BEP20: null, TRC20: null });
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Get deposit address based on selected network
  // For BEP20: Use Web3Auth account address (Ethereum-compatible, works on BSC)
  // For TRC20: Use backend-generated TRC20 address (TRON format: T...)
  const depositAddress = selectedNetwork === 'BEP20' && safeAuthAccount 
    ? safeAuthAccount 
    : selectedNetwork === 'TRC20' 
      ? (walletAddresses.TRC20 || '')
      : '';

  // Fetch wallet addresses from backend when modal opens or network changes
  useEffect(() => {
    const fetchAddresses = async () => {
      if (isOpen && user) {
        try {
          setLoadingAddresses(true);
          const addresses = await apiService.get('/wallet/addresses');
          setWalletAddresses({
            BEP20: addresses.BEP20 || null,
            TRC20: addresses.TRC20 || null,
          });
          
          // If TRC20 address doesn't exist, generate it
          if (selectedNetwork === 'TRC20' && !addresses.TRC20) {
            try {
              const generated = await apiService.post('/wallet/generate-address', { network: 'TRC20' });
              setWalletAddresses(prev => ({ ...prev, TRC20: generated.address || generated.TRC20 }));
            } catch (error) {
              console.error('Failed to generate TRC20 address:', error);
            }
          }
        } catch (error) {
          console.error('Failed to fetch wallet addresses:', error);
        } finally {
          setLoadingAddresses(false);
        }
      }
    };

    fetchAddresses();
  }, [isOpen, user, selectedNetwork]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('input');
      setMessage('');
      setAmount('');
      setCopied(false);
      setShowQR(false);
      
      // Check if Web3Auth is connected
      if (!safeAuthLoggedIn || !safeAuthAccount) {
        setMessage('Please connect your Web3Auth wallet first using the "Connect Wallet" button in the header.');
        setMessageType('warning');
      } else {
        setMessage('');
        setMessageType('');
      }
    }
  }, [isOpen, safeAuthLoggedIn, safeAuthAccount]);

  const handleNetworkChange = async (network) => {
    setSelectedNetwork(network);
    setMessage('');
    setAmount('');
    
    // If switching to TRC20 and address doesn't exist, generate it
    if (network === 'TRC20' && !walletAddresses.TRC20 && user) {
      try {
        setLoadingAddresses(true);
        const generated = await apiService.post('/wallet/generate-address', { network: 'TRC20' });
        setWalletAddresses(prev => ({ ...prev, TRC20: generated.address || generated.TRC20 }));
      } catch (error) {
        console.error('Failed to generate TRC20 address:', error);
        setMessage('Failed to generate TRC20 address. Please try again.');
        setMessageType('error');
      } finally {
        setLoadingAddresses(false);
      }
    }
  };

  // Removed handleConnectWallet and handleAutomatedDeposit
  // Deposit flow is now manual: user copies address and sends funds from external wallet
  // Backend will monitor transactions to Web3Auth addresses and transfer to platform account

  // Legacy function kept for reference (not used in new flow)
  const handleAutomatedDeposit = async () => {
    const depositAmount = parseFloat(amount);

    // Validation
    if (!depositAmount || depositAmount < 1) {
      setMessage('Minimum deposit amount is 1 Platform Score');
      setMessageType('error');
      return;
    }

    const userBalance = parseFloat(USDTBalance || 0);
    // if (userBalance < depositAmount) {
    //   setMessage(`Insufficient USDT balance. You have ${userBalance} USDT.`);
    //   setMessageType('error');
    //   return;
    // }

    if (!depositAddress) {
      setMessage('Deposit address not loaded. Please try again.');
      setMessageType('error');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('sending');
    setMessage(`🔄 Initiating ${depositAmount} USDT transfer to ${selectedNetwork} wallet...`);
    setMessageType('info');

    try {
      // ✅ Step 1: Send USDT transaction to user's unique deposit address
      // All deposits now go to the user's unique address (simplified flow)
      if (!depositAddress) {
        throw new Error('Deposit address not available. Please try again.');
      }
      
      console.log('📤 Sending USDT transaction:', {
        to: depositAddress, // ✅ Using user's unique address
        amount: depositAmount,
        network: selectedNetwork,
      });

      const tx = await sendUSDT(depositAddress, depositAmount, selectedNetwork);
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

  const networkCaption = selectedNetwork === 'BEP20' ? 'BEP-20 (BSC)' : 'TRC-20 (TRON)';

  // Separate copy handlers to avoid duplicate toasts
  const handleCopyAddress = async () => {
    try {
      // ✅ Copy Web3Auth account address
      if (!depositAddress) {
        throw new Error('Web3Auth wallet not connected');
      }
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      // Only show toast for the button next to address, not for footer button
      if (window.showToast) window.showToast('Address copied!', 'success', 1500);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy address:', error);
      if (window.showToast) window.showToast('Failed to copy address', 'error', 2000);
    }
  };

  const handleCopyAddressFooter = async () => {
    try {
      // ✅ Copy Web3Auth account address (footer button)
      if (!depositAddress) {
        throw new Error('Web3Auth wallet not connected');
      }
      await navigator.clipboard.writeText(depositAddress);
      // Footer button shows different message
      if (window.showToast) window.showToast('Address copied! Send USDT to this address from any external wallet.', 'info', 5000);
    } catch (error) {
      console.error('Failed to copy address:', error);
      if (window.showToast) window.showToast('Failed to copy address', 'error', 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="deposit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💰 Deposit USDT</h2>
          <button className="close-btn" onClick={handleClose} disabled={isProcessing}>×</button>
        </div>

        <div className="modal-content">
          {/* Network Selection */}
          <div className="network-selection">
            <label>Select Network:</label>
            <div className="network-options">
              <button
                className={`network-btn ${selectedNetwork === 'BEP20' ? 'active' : ''}`}
                onClick={() => handleNetworkChange('BEP20')}
                disabled={isProcessing}
              >
                <span className="network-icon">🟡</span>
                <span>BSC (BEP20)</span>
                <span className="network-fee">Low fees</span>
              </button>
              <button
                className={`network-btn ${selectedNetwork === 'TRC20' ? 'active' : ''}`}
                onClick={() => handleNetworkChange('TRC20')}
                disabled={isProcessing}
              >
                <span className="network-icon">🔴</span>
                <span>TRON (TRC20)</span>
                <span className="network-fee">Very low fees</span>
              </button>
            </div>
          </div>

          {/* Wallet Status */}
          {safeAuthLoggedIn && safeAuthAccount && (
            <div className="wallet-status success">
              ✅ Web3Auth Wallet Connected: {safeAuthAccount.substring(0, 6)}...{safeAuthAccount.substring(safeAuthAccount.length - 4)}
              <br />
              💰 Your Platform Score: {Number(user?.platformScore || 0).toFixed(0)} Platform Score
            </div>
          )}

          {(!safeAuthLoggedIn || !safeAuthAccount) && (
            <div className="wallet-status warning">
              ⚠️ Please connect your Web3Auth wallet using the "Connect Wallet" button in the header
            </div>
          )}

          {/* User Deposit Address Display */}
          <div className="address-section">
            <label>
              Your Deposit Address — {networkCaption} 
              {selectedNetwork === 'BEP20' ? ' (Web3Auth Account)' : ' (TRON Address)'}
            </label>
            <div className="address-container">
              <div className="address-text">
                <code style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                  {loadingAddresses && selectedNetwork === 'TRC20' 
                    ? 'Loading TRC20 address...' 
                    : depositAddress 
                      ? depositAddress
                      : selectedNetwork === 'BEP20'
                        ? (safeAuthLoggedIn && !safeAuthAccount ? 'Loading...' : 'Please connect Web3Auth wallet')
                        : 'Generating TRC20 address...'}
                </code>
              </div>
              <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyAddress} disabled={!depositAddress || loadingAddresses}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className='copy-btn' onClick={() => setShowQR(true)} disabled={!depositAddress || loadingAddresses}>
                Show QR
              </button>
            </div>
            <p className="address-hint">
              {selectedNetwork === 'BEP20' 
                ? 'Send USDT to this address (your Web3Auth account). Funds will be stored in your Web3Auth wallet and then transferred to the platform account.'
                : 'Send USDT to this TRC20 address. Funds will be automatically detected and credited to your Platform Score.'}
            </p>
          </div>

          {/* Amount Input - Optional, for reference only */}
          <div className="input-group">
            <label>Amount (Platform Score) - Optional:</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter amount for reference (min. 1 Platform Score)"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setAmount(value);
                  setMessage('');
                }
              }}
              disabled={isProcessing || !safeAuthLoggedIn || !safeAuthAccount}
            />
            {safeAuthLoggedIn && safeAuthAccount && (
              <p className="input-hint">
                Current Platform Score: {Number(user?.platformScore || 0).toFixed(0)} Platform Score
              </p>
            )}
          </div>

          {/* Progress Steps */}
          {currentStep !== 'input' && (
            <div className="progress-steps">
              <div className={`step ${currentStep === 'sending' ? 'active' : currentStep === 'confirming' || currentStep === 'success' ? 'completed' : ''}`}>
                <div className="step-icon">
                  {currentStep === 'sending' ? '🔄' : '✅'}
                </div>
                <div className="step-label">Sending Transaction</div>
              </div>
              <div className={`step ${currentStep === 'confirming' ? 'active' : currentStep === 'success' ? 'completed' : ''}`}>
                <div className="step-icon">
                  {currentStep === 'confirming' ? '⏳' : currentStep === 'success' ? '✅' : '⏸'}
                </div>
                <div className="step-label">Backend Confirmation</div>
              </div>
              <div className={`step ${currentStep === 'success' ? 'completed' : ''}`}>
                <div className="step-icon">
                  {currentStep === 'success' ? '🎉' : '⏸'}
                </div>
                <div className="step-label">Funds Credited</div>
              </div>
            </div>
          )}

          {/* SEKA Points Explanation */}
          <div className="info-box" style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', border: '2px solid #667eea' }}>
            <h4>🎮 About SEKA Points:</h4>
            <p style={{ marginBottom: '10px' }}>
              <strong>Your USDT → SEKA USDT → Play Games</strong>
            </p>
            <ul style={{ listStyle: 'none', padding: 0, fontSize:'12px' }}>
              <li>✅ All game activities use <strong>SEKA Points</strong> (virtual balance)</li>
              <li>✅ Your actual wallet funds are <strong>NEVER touched</strong> during games</li>
              <li>✅ No gas fees for bets, antes, or raises</li>
              <li>✅ Faster gameplay with instant balance updates</li>
            </ul>
          </div>

          {/* Instructions */}
          <div className="info-box">
            <h4>📌 How it works:</h4>
            <ol>
              <li>Connect your Web3Auth wallet using the "Connect Wallet" button in the header</li>
              <li>Select your network (BEP20 or TRC20)</li>
              <li>Copy your Web3Auth account address or scan the QR code</li>
              <li>Send USDT from any external wallet to your Web3Auth account address</li>
              <li>Funds will be stored in your Web3Auth wallet</li>
              <li>Funds will then be automatically transferred to the platform account</li>
              <li>SEKA Points will be credited automatically! 🎉</li>
            </ol>
            <div className="warning-box">
              <strong>⚠️ Important:</strong> Make sure you have enough native tokens ({selectedNetwork === 'BEP20' ? 'ETH' : 'TRX'}) for gas fees!
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`message ${messageType}`}>
              <div style={{ whiteSpace: 'pre-line' }}>{message}</div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose} disabled={isProcessing}>
            {currentStep === 'success' ? 'Close' : 'Cancel'}
          </button>
          
          {!safeAuthLoggedIn || !safeAuthAccount ? (
            <button 
              className="btn btn-primary" 
              onClick={() => {
                onClose();
                if (window.showToast) {
                  window.showToast('Please connect Web3Auth wallet first', 'info', 3000);
                }
              }}
              disabled={isProcessing}
            >
              Connect Web3Auth Wallet First
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleCopyAddressFooter}
              disabled={!depositAddress}
            >
              📋 Copy Address
            </button>
          )}
        </div>
      </div>
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div className="deposit-modal" style={{ maxWidth: 360 }} onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>QR Code</h2>
              <button className="close-btn" onClick={() => setShowQR(false)}>×</button>
            </div>
            <div className="modal-content" style={{ textAlign:'center' }}>
              <p style={{color:'#aaa', marginBottom:12}}>{networkCaption}</p>
              {/* ✅ QR code uses user's unique deposit address */}
              {depositAddress ? (
                <>
                  <img alt="QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(depositAddress)}`} style={{ background:'#fff', padding:8, borderRadius:8 }} />
                  <div className="address-display-box" style={{marginTop:16}}>
                    <code style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{depositAddress}</code>
                  </div>
                </>
              ) : (
                <p>Loading address...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositModal;
