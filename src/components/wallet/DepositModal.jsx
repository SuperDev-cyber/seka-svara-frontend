import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './DepositModal.css';
import { ethers } from 'ethers';

// ✅ Removed hardcoded addresses - now using user's unique deposit address for everything

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

  const [selectedNetwork, setSelectedNetwork] = useState('BEP20');
  const [depositAddress, setDepositAddress] = useState(''); // User-specific deposit address
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'sending', 'confirming', 'success'
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Fetch user-specific deposit address when modal opens or network changes
  useEffect(() => {
    if (isOpen) {
      fetchUserDepositAddress();
      setCurrentStep('input');
      setMessage('');
      setAmount('');
    }
  }, [isOpen, selectedNetwork]);

  const fetchUserDepositAddress = async () => {
    try {
      // First, try to get existing user addresses
      const addressesResponse = await apiService.get('/wallet/addresses');
      console.log('User addresses response:', addressesResponse);
      
      let addr = addressesResponse[selectedNetwork] || addressesResponse.BEP20 || addressesResponse.TRC20 || '';
      
      // If address doesn't exist, generate one
      if (!addr) {
        console.log(`Generating ${selectedNetwork} address for user...`);
        const generateResponse = await apiService.post('/wallet/generate-address', {
          network: selectedNetwork
        });
        addr = generateResponse.address || generateResponse[selectedNetwork] || '';
      }
      
      // Ensure EIP-55 checksum for BSC
      if (addr && selectedNetwork === 'BEP20') {
        try { addr = ethers.utils.getAddress(addr); } catch {}
      }
      
      setDepositAddress(addr);
      console.log(`✅ User deposit address (${selectedNetwork}):`, addr);
    } catch (error) {
      console.error('Failed to fetch user deposit address:', error);
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

  const needsWalletConnection = !isConnected || currentNetwork !== selectedNetwork;

  const networkCaption = selectedNetwork === 'BEP20' ? 'BEP-20 (BSC)' : 'TRC-20 (TRON)';

  const handleCopy = async () => {
    try {
      // ✅ Copy user's unique deposit address
      if (!depositAddress) {
        throw new Error('Deposit address not available');
      }
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      if (window.showToast) window.showToast('Copied!', 'success', 1500);
      setTimeout(() => setCopied(false), 1500);
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
          {isConnected && currentNetwork === selectedNetwork && (
            <div className="wallet-status success">
              ✅ Wallet Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
              <br />
              💰 Your Platform Score: {Number(user?.platformScore || 0).toFixed(0)} Platform Score
            </div>
          )}

          {needsWalletConnection && (
            <div className="wallet-status warning">
              ⚠️ Please connect your {selectedNetwork} wallet to continue
            </div>
          )}

          {/* User Deposit Address Display */}
          <div className="address-section">
            <label>Your Deposit Address — {networkCaption}</label>
            <div className="address-container">
              <div className="address-text">
                <code style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{depositAddress || 'Loading...'}</code>
              </div>
              <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} disabled={!depositAddress}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className='copy-btn' onClick={() => setShowQR(true)} disabled={!depositAddress}>Show QR</button>
            </div>
            <p className="address-hint">Send USDT to this address. Your unique address is fully displayed above.</p>
          </div>

          {/* Amount Input */}
          <div className="input-group">
            <label>Amount (Platform Score):</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter amount (min. 1 Platform Score)"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setAmount(value);
                  setMessage('');
                }
              }}
              disabled={isProcessing || needsWalletConnection}
            />
            {isConnected && currentNetwork === selectedNetwork && (
              <p className="input-hint">
                Available: {Number(user?.platformScore || 0).toFixed(0)} Platform Score
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
              <li>Select your network (BEP20 or TRC20)</li>
              <li>Connect your wallet (MetaMask or TronLink)</li>
              <li>Enter the amount you want to deposit (min. 1 USDT)</li>
              <li>Click "Deposit Now" - your wallet will open automatically</li>
              <li>Confirm the transaction in your wallet</li>
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
          
          {needsWalletConnection ? (
            <button 
              className="btn btn-primary" 
              onClick={handleConnectWallet}
              disabled={isProcessing}
            >
              {isProcessing ? '🔄 Connecting...' : `🔗 Connect ${selectedNetwork} Wallet`}
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleAutomatedDeposit}
              disabled={isProcessing || !amount || parseFloat(amount) < 0.00000000001}
            >
              {isProcessing ? '🔄 Processing...' : '🚀 Deposit Now'}
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
