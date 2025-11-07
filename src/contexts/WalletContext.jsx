import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import TronWeb from 'tronweb';
import { useAuth } from './AuthContext';
import { GAME_ESCROW_ABI } from '../blockchain/abi';
import { CONTRACT_ADDRESS } from '../blockchain/config';
import { sekaContract, USDTContract } from '../blockchain';
import { ethers } from 'ethers';

// "contractAddress": "0xd079BbF34fD2BECa098c8C48D4742B7ef1D62A80",
// "usdtAddress": "0x5823F41428500c2CE218DD4ff42c24F3a3Fed52B",
// Network configurations
const NETWORKS = {
  BEP20: {
    name: 'Binance Smart Chain',
    chainId: '0x38', // 56 in decimal (BSC Mainnet)
    rpcUrl: 'https://bsc-dataseed.binance.org/', // Official BSC RPC (CORS-friendly)
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    USDTContract: '0x55d398326f99059fF775485246999027B3197955', // ✅ Official USDT on BSC Mainnet
    sekaContract: '0xd079BbF34fD2BECa098c8C48D4742B7ef1D62A80', // Seka contract on BSC Mainnet
  },
  TRC20: {
    name: 'Tron Network',
    chainId: '0x2b6653dc', // 728 in decimal
    rpcUrl: 'https://api.trongrid.io',
    blockExplorer: 'https://tronscan.org',
    nativeCurrency: {
      name: 'TRX',
      symbol: 'TRX',
      decimals: 6,
    },
    USDTContract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT on Tron
    sekaContract: 'TBA_ADD_YOUR_TRON_SEKA_CONTRACT_HERE', // TODO: Add Seka contract address on Tron
  },
};

// USDT Contract ABI (minimal for balance, transfer, and approve)
const USDT_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
];

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [USDTBalance, setUSDTBalance] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [tronWeb, setTronWeb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window.ethereum !== 'undefined';
  }, []);

  // Check if TronLink is installed
  const isTronLinkInstalled = useCallback(() => {
    // Check multiple ways TronLink might be available
    const hasTronWeb = typeof window.tronWeb !== 'undefined';
    const hasTronLink = typeof window.tronLink !== 'undefined';
    const hasTronWebReady = window.tronWeb && window.tronWeb.ready;
    const hasTronLinkScript = document.querySelector('script[src*="tronlink"]') !== null;
    const hasTronWebInjected = document.querySelector('script[src*="tronweb"]') !== null;
    
    // Also check for TronLink in the extensions
    const hasTronLinkExtension = window.tronLink && window.tronLink.tronWeb;
    
    // Check for TronLink extension in a different way
    const hasTronLinkExtensionAlt = window.tronLink && typeof window.tronLink.request === 'function';
    
    // Check if TronLink is available but might not be ready
    const hasTronLinkAvailable = window.tronLink || window.tronWeb;
    
    // console.log('TronLink Detection:', {
    //   hasTronWeb,
    //   hasTronLink,
    //   hasTronWebReady,
    //   hasTronLinkScript,
    //   hasTronWebInjected,
    //   hasTronLinkExtension,
    //   hasTronLinkExtensionAlt,
    //   hasTronLinkAvailable,
    //   windowTronWeb: !!window.tronWeb,
    //   windowTronLink: !!window.tronLink,
    //   windowKeys: Object.keys(window).filter(key => key.toLowerCase().includes('tron'))
    // });
    
    return (
      hasTronWeb ||
      hasTronLink ||
      hasTronWebReady ||
      hasTronLinkScript ||
      hasTronWebInjected ||
      hasTronLinkExtension ||
      hasTronLinkExtensionAlt ||
      hasTronLinkAvailable
    );
  }, []);

  const fromBigNum = (value, d = 6) => {
    if (!value) return 0; // Prevents NaN errors
    return parseFloat(ethers.utils.formatUnits(value.toString(), d));
  }

  const fromEthersBigNum = (value, d = 6) => {
    // if (!value) return 0; // Prevents NaN errors
    return parseFloat(ethers.utils.formatUnits(value.toString(), d));
  }

  // Get ethers signer from MetaMask
  const getSigner = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  }, []);

  // ✅ UNIFIED FUNCTION: Returns the Seka contract balance of the user using getPlayerBalance
  // This is the SINGLE SOURCE OF TRUTH for fetching SEKA balance from the blockchain
  // Moved before getUSDTBalance to resolve dependency order
  const getBalance = useCallback(async (network) => {
    try {
      if(!account) {
        console.warn('getBalance: No account available');
        return 0;
      }
      if(!network) {
        console.warn('getBalance: No network specified');
        return 0;
      }
      
      setLoading(true);
      setError(null);
      
      if (network === 'BEP20') {
        // ✅ Check if sekaContract is available
        if (!sekaContract) {
          console.error('getBalance: sekaContract not initialized');
          setError('Contract not initialized. Please refresh the page.');
          return 0;
        }
        
        // ✅ Check if getSigner is available
        if (!getSigner || typeof getSigner !== 'function') {
          console.error('getBalance: getSigner function not available');
          setError('Wallet signer function not available. Please reconnect your wallet.');
          return 0;
        }
        
        // For MetaMask/ETH network: ethers contract call
        let signer;
        try {
          signer = await getSigner();
        } catch (signerError) {
          console.error('getBalance: Failed to get signer:', signerError);
          setError('Failed to get wallet signer. Please reconnect your wallet.');
          return 0;
        }
        
        // ✅ FIX: Check if signer is available before using it
        if (!signer) {
          console.error('getBalance: Signer not available for BEP20 network');
          setError('Wallet signer not available. Please reconnect your wallet.');
          return 0;
        }
        
        // ✅ Check if connect method exists on contract
        if (!sekaContract.connect || typeof sekaContract.connect !== 'function') {
          console.error('getBalance: sekaContract.connect is not a function');
          setError('Contract connection method not available.');
          return 0;
        }
        
        const sekaWithSigner = sekaContract.connect(signer);
        
        // ✅ Check if getPlayerBalance method exists
        if (!sekaWithSigner.getPlayerBalance || typeof sekaWithSigner.getPlayerBalance !== 'function') {
          console.error('getBalance: getPlayerBalance method not available on contract');
          setError('Contract method not available.');
          return 0;
        }
        
        // Use getPlayerBalance (correct method name from contract ABI)
        const userBalance = await sekaWithSigner.getPlayerBalance(account);
        return fromEthersBigNum(userBalance);
      } else if (network === 'TRC20') {
        // For Tron: use tronWeb contract call
        if (!tronWeb || !tronWeb.ready) {
          console.error('getBalance: TronWeb not ready');
          setError('TronWeb not ready. Please reconnect your wallet.');
          return 0;
        }
        
        const contract = await tronWeb.contract(
          require('../blockchain/abis/Seka.json'),
          NETWORKS.TRC20.sekaContract
        );
        // getPlayerBalance returns string value in sun; convert to TRX
        const userBalance = await contract.getPlayerBalance(account).call();
        return tronWeb.fromSun(userBalance);
      } else {
        throw new Error('Invalid network or wallet not connected');
      }
    } catch (error) {
      console.error('getBalance error:', error);
      setError(error.message || 'Failed to fetch balance');
      return 0; // Return 0 instead of throwing to prevent UI crashes
    } finally {
      setLoading(false);
    }
  }, [account, sekaContract, tronWeb, getSigner]);

  // ✅ REFACTORED: Get SEKA balance (unified approach)
  // This function now uses the unified getBalance() function instead of directly calling the contract
  // Note: Despite the name "USDTBalance", this actually fetches SEKA balance from the contract
  // Can be called with or without parameters - uses context values as fallback
  const getUSDTBalance = useCallback(async (web3Instance, account, network) => {
    console.log("getUSDTBalance: Using unified getBalance() function");
    try {
      // ✅ Ensure getBalance is available
      if (!getBalance || typeof getBalance !== 'function') {
        console.error('getUSDTBalance: getBalance function not available');
        setUSDTBalance('0');
        return;
      }
      
      // Use network from parameter or fall back to currentNetwork from context
      const targetNetwork = network || currentNetwork;
      if (!targetNetwork) {
        console.warn('getUSDTBalance: No network specified');
        setUSDTBalance('0');
        return;
      }
      
      // ✅ Use the unified getBalance() function instead of directly calling the contract
      const balance = await getBalance(targetNetwork);
      const formattedBalance = balance ? parseFloat(balance.toString()) : 0;
      console.log("SEKA Balance (from unified getBalance):", formattedBalance);
      setUSDTBalance(formattedBalance.toString());
    } catch (error) {
      console.error('Error getting SEKA balance via getUSDTBalance:', error);
      setUSDTBalance('0');
    }
  }, [getBalance, currentNetwork]);

  // Connect to MetaMask for BEP20
  const connectMetaMask = useCallback(async () => {
    if (!isAuthenticated) {
      const errorMsg = 'Please sign in first to connect your wallet';
      setError(errorMsg);
      // Show notification
      if (window.showToast) {
        window.showToast(errorMsg, 'warning', 4000);
      }
      throw new Error(errorMsg);
    }
    
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      setLoading(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      // Check if we're on BSC network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== NETWORKS.BEP20.chainId) {
        try {
          // Try to switch to BSC network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NETWORKS.BEP20.chainId }],
          });
        } catch (switchError) {
          // If switch fails, try to add the network
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: NETWORKS.BEP20.chainId,
                  chainName: NETWORKS.BEP20.name,
                  nativeCurrency: NETWORKS.BEP20.nativeCurrency,
                  rpcUrls: [NETWORKS.BEP20.rpcUrl],
                  blockExplorerUrls: [NETWORKS.BEP20.blockExplorer],
                }],
              });
            } catch (addError) {
              throw new Error('Failed to add Binance Smart Chain network to MetaMask. Please add it manually.');
            }
          } else {
            throw new Error('Failed to switch to Binance Smart Chain network.');
          }
        }
      }

      // Initialize Web3
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Get account and balance
      const account = accounts[0];
      setAccount(account);
      setCurrentNetwork('BEP20');

      // Get native balance
      const balance = await web3Instance.eth.getBalance(account);
      setBalance(web3Instance.utils.fromWei(balance, 'ether'));

      // Get USDT balance
      await getUSDTBalance(web3Instance, account, 'BEP20');

      setIsConnected(true);
      
      // Save wallet connection to localStorage for persistence
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletNetwork', 'BEP20');
      
      return { account, network: 'BEP20' };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isMetaMaskInstalled, getUSDTBalance]);

  // Connect to TronLink for TRC20
  const connectTronLink = useCallback(async () => {
    if (!isAuthenticated) {
      const errorMsg = 'Please sign in first to connect your wallet';
      setError(errorMsg);
      // Show notification
      if (window.showToast) {
        window.showToast(errorMsg, 'warning', 4000);
      }
      throw new Error(errorMsg);
    }
    
    // Try to detect TronLink with a small delay
    let tronLinkDetected = isTronLinkInstalled();
    
    if (!tronLinkDetected) {
      console.log('TronLink not detected immediately, waiting 1 second...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      tronLinkDetected = isTronLinkInstalled();
    }
    
    if (!tronLinkDetected) {
      throw new Error('TronLink is not installed. Please install TronLink to continue.');
    }

    try {
      setLoading(true);
      setError(null);

      // Wait for TronLink to be ready with better detection
      let attempts = 0;
      let tronWebInstance = null;

      console.log('Starting TronLink connection attempt...');

      while (attempts < 30) { // Increased attempts
        console.log(`TronLink connection attempt ${attempts + 1}/30`);
        console.log('Current state:', {
          hasTronWeb: !!window.tronWeb,
          hasTronLink: !!window.tronLink,
          tronWebReady: window.tronWeb?.ready,
          tronLinkTronWeb: !!window.tronLink?.tronWeb
        });
        
        // Check different ways TronLink might be available
        if (window.tronWeb && window.tronWeb.ready) {
          tronWebInstance = window.tronWeb;
          console.log('Found TronWeb ready');
          break;
        } else if (window.tronLink && window.tronLink.tronWeb) {
          tronWebInstance = window.tronLink.tronWeb;
          console.log('Found TronLink.tronWeb');
          break;
        } else if (window.tronWeb) {
          console.log('TronWeb exists but not ready, waiting...');
          await new Promise(resolve => setTimeout(resolve, 300));
        } else if (window.tronLink) {
          console.log('TronLink exists but no tronWeb, waiting...');
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          console.log('No TronLink detected, waiting...');
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        attempts++;
      }

      if (!tronWebInstance) {
        console.error('TronLink not ready after 30 attempts');
        throw new Error('TronLink is not ready. Please make sure TronLink is unlocked and try again.');
      }

      setTronWeb(tronWebInstance);

      // Get account
      const account = tronWebInstance.defaultAddress?.base58;
      if (!account) {
        throw new Error('No account found. Please unlock your TronLink wallet and try again.');
      }

      setAccount(account);
      setCurrentNetwork('TRC20');

      // Get TRX balance
      const balance = await tronWebInstance.trx.getBalance(account);
      setBalance(tronWebInstance.fromSun(balance));

      // Get USDT balance
      await getUSDTBalance(tronWebInstance, account, 'TRC20');

      setIsConnected(true);
      
      // Save wallet connection to localStorage for persistence
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletNetwork', 'TRC20');
      
      return { account, network: 'TRC20' };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isTronLinkInstalled, getUSDTBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setCurrentNetwork(null);
    setAccount(null);
    setBalance(null);
    setUSDTBalance(null);
    setWeb3(null);
    setTronWeb(null);
    setError(null);
    
    // Clear wallet connection from localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletNetwork');
  }, []);

  const toBigNum = (value, d = 6) => {
    return ethers.utils.parseUnits(value.toString(), d);
  }

  // ✅ Send USDT transaction to specified address (for deposits)
  const sendUSDT = useCallback(async (to, amount, network) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!to || to.length < 20) {
      throw new Error('Invalid recipient address');
    }

    try {
      setLoading(true);
      setError(null);

      if (network === 'BEP20' && web3) {
        // ✅ Get signer from MetaMask
        const signer = await getSigner();
        
        // ✅ Get the signer's address first (this is the actual address that will send the transaction)
        const signerAddress = await signer.getAddress();
        console.log(`👤 Signer address: ${signerAddress}`);
        console.log(`👤 Context account: ${account}`);
        
        // ✅ Create a fresh USDT contract instance connected to the signer
        // This ensures we're using the correct network and provider
        const USDTWithSigner = USDTContract.connect(signer);
        
        // ✅ Get decimals dynamically from the contract
        // Official BSC USDT (0x55d398326f99059fF775485246999027B3197955) uses 18 decimals
        let decimals = 18; // Default fallback for BSC USDT
        try {
          if (USDTWithSigner && typeof USDTWithSigner.decimals === 'function') {
            decimals = await USDTWithSigner.decimals();
            console.log(`✅ USDT contract decimals: ${decimals} (Official BSC USDT should be 18)`);
          }
        } catch (decimalsError) {
          console.warn(`⚠️ Could not get decimals from contract, using default 18: ${decimalsError.message}`);
          decimals = 18; // Official BSC USDT uses 18 decimals
        }
        
        const amountWithDecimals = toBigNum(amount, decimals);
        console.log(`📤 Transferring ${amount} USDT (${amountWithDecimals.toString()} with ${decimals} decimals) to ${to}`);
        
        // ✅ Check user's USDT balance using the signer's address (the actual sender)
        // IMPORTANT: Get fresh balance from blockchain (not cached)
        const userBalance = await USDTWithSigner.balanceOf(signerAddress);
        const userBalanceFormatted = ethers.utils.formatUnits(userBalance, decimals);
        
        console.log(`💰 User USDT balance (from signer address): ${userBalanceFormatted} USDT`);
        console.log(`💰 User USDT balance (raw BigNumber): ${userBalance.toString()}`);
        console.log(`📤 Amount to transfer (raw BigNumber): ${amountWithDecimals.toString()}`);
        
        // ✅ Also check BNB balance for gas fees
        const bnbBalance = await signer.provider.getBalance(signerAddress);
        const bnbBalanceFormatted = ethers.utils.formatEther(bnbBalance);
        console.log(`⛽ BNB balance for gas: ${bnbBalanceFormatted} BNB`);
        
        if (parseFloat(bnbBalanceFormatted) < 0.001) {
          throw new Error(`Insufficient BNB for gas fees. You have ${bnbBalanceFormatted} BNB, but need at least 0.001 BNB for gas fees. Please add BNB to your wallet.`);
        }
        
        // ✅ Compare BigNumber values directly (amountWithDecimals is already a BigNumber from toBigNum)
        // Add a small buffer (1 wei) to account for any rounding issues
        const oneWei = ethers.BigNumber.from(1);
        if (userBalance.lt(amountWithDecimals)) {
          throw new Error(`Insufficient USDT balance. You have ${userBalanceFormatted} USDT, but need ${amount} USDT. Please check your balance on BSCScan: https://bscscan.com/address/${signerAddress}`);
        }
        
        // ✅ Additional safety check: ensure we have at least the amount + a small buffer
        const requiredAmount = amountWithDecimals.add(oneWei);
        if (userBalance.lt(requiredAmount)) {
          console.warn(`⚠️ Balance is very close to required amount. Proceeding with caution...`);
        }
        
        // ✅ Final balance check right before transfer (in case balance changed)
        const finalBalanceCheck = await USDTWithSigner.balanceOf(signerAddress);
        if (finalBalanceCheck.lt(amountWithDecimals)) {
          const finalBalanceFormatted = ethers.utils.formatUnits(finalBalanceCheck, decimals);
          throw new Error(`Balance changed! Current balance: ${finalBalanceFormatted} USDT, but need ${amount} USDT. Please try again.`);
        }
        
        // ✅ Verify contract has transfer method before calling
        if (!USDTWithSigner.transfer || typeof USDTWithSigner.transfer !== 'function') {
          throw new Error('USDT contract does not support transfer method. Please check the contract address.');
        }
        
        // ✅ Transfer USDT directly to the specified address (for deposits)
        // IMPORTANT: This is a direct transfer, NOT an approve call
        console.log(`🔄 Calling transfer(${to}, ${amountWithDecimals.toString()}) on USDT contract...`);
        console.log(`📋 Transfer details:`, {
          from: signerAddress,
          to: to,
          amount: amountWithDecimals.toString(),
          contractAddress: USDTContract.address || USDTContract.target,
        });
        
        const tx = await USDTWithSigner.transfer(to, amountWithDecimals);
        console.log(`⏳ Waiting for transaction to be mined...`);
        const receipt = await tx.wait(); // Wait for transaction to be mined

        console.log('✅ USDT transfer successful:', {
          to,
          amount,
          txHash: receipt.transactionHash,
        });

        // Refresh balance after transaction
        await getUSDTBalance(web3, account, 'BEP20');
        
        return {
          transactionHash: receipt.transactionHash,
          hash: receipt.transactionHash,
          ...receipt,
        };
      } else if (network === 'TRC20' && tronWeb) {
        // ✅ Transfer USDT on Tron network
        const contract = await tronWeb.contract(USDT_ABI, NETWORKS.TRC20.USDTContract);
        const amountSun = tronWeb.toSun(amount);
        
        const tx = await contract.transfer(to, amountSun).send({
          from: account,
        });

        console.log('✅ USDT transfer successful (Tron):', {
          to,
          amount,
          txHash: tx,
        });

        // Refresh balance after transaction
        await getUSDTBalance(tronWeb, account, 'TRC20');
        
        return {
          txid: tx,
          transactionHash: tx,
          hash: tx,
        };
      } else {
        throw new Error('Invalid network or wallet not connected');
      }
    } catch (error) {
      console.error('❌ USDT transfer error:', error);
      
      // ✅ Provide more helpful error messages
      let errorMessage = error.message || 'Failed to send USDT';
      
      // Check for specific blockchain errors
      if (error.reason && error.reason.includes('transfer amount exceeds balance')) {
        errorMessage = `Insufficient USDT balance. The blockchain reports your balance is too low for this transfer. Please check your actual balance on BSCScan: https://bscscan.com/address/${account || 'your-wallet'}`;
      } else if (error.data && error.data.message && error.data.message.includes('transfer amount exceeds balance')) {
        errorMessage = `Insufficient USDT balance. The blockchain reports your balance is too low. Please verify your balance on BSCScan.`;
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT' || error.message?.includes('UNPREDICTABLE_GAS_LIMIT')) {
        if (error.reason && error.reason.includes('transfer amount exceeds balance')) {
          errorMessage = `Transaction failed: Insufficient USDT balance. Please check your actual balance on BSCScan and ensure you have enough USDT for the transfer plus gas fees.`;
        } else {
          errorMessage = `Transaction failed: Cannot estimate gas. ${error.reason ? `Reason: ${error.reason}` : 'The transaction would likely fail. Please check your balance and try again.'}`;
        }
      } else if (error.code === -32603 && error.data && error.data.message) {
        errorMessage = `Blockchain error: ${error.data.message}. Please check your balance and try again.`;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isConnected, web3, tronWeb, account, getUSDTBalance, getSigner, USDTContract]);

  // Approve USDT spending for GameEscrow contract
  const approveGameEscrow = useCallback(async (amount) => {
    if (!isConnected || currentNetwork !== 'BEP20') {
      throw new Error('Please connect to Binance Smart Chain network');
    }

    try {
      setLoading(true);
      setError(null);

      const signer = await getSigner();
      const amountWithDecimals = toBigNum(amount, 6); // USDT uses 6 decimals

      const USDTWithSigner = USDTContract.connect(signer);
      const tx = await USDTWithSigner.approve(NETWORKS.BEP20.sekaContract, amountWithDecimals);
      await tx.wait();

      return tx;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isConnected, currentNetwork, getSigner]);

  // Check USDT allowance for GameEscrow contract
  const checkGameEscrowAllowance = useCallback(async () => {
    if (!isConnected || currentNetwork !== 'BEP20' || !account) {
      return 0;
    }

    try {
      const allowance = await USDTContract.allowance(account, NETWORKS.BEP20.sekaContract);
      // Convert from 6 decimals to regular number
      return Number(ethers.utils.formatUnits(allowance, 6));
    } catch (error) {
      console.error('Error checking allowance:', error);
      return 0;
    }
  }, [isConnected, currentNetwork, account]);

  // Deposit to game room via GameEscrow contract
  const depositToGameRoom = useCallback(async (roomId, amount) => {
    if (!isConnected || currentNetwork !== 'BEP20') {
      throw new Error('Please connect to Binance Smart Chain network');
    }

    try {
      setLoading(true);
      setError(null);

      // Check if approval is needed
      const allowance = await checkGameEscrowAllowance();
      if (allowance < amount) {
        // Need to approve first
        throw new Error(`Insufficient allowance. Please approve ${amount} USDT first.`);
      }

      const signer = await getSigner();
      const sekaWithSigner = sekaContract.connect(signer);
      
      // Convert roomId to bytes32
      const roomIdBytes32 = ethers.utils.formatBytes32String(roomId);
      
      // Convert amount to USDT decimals (6 decimals)
      const amountWithDecimals = toBigNum(amount, 6);

      // Call gamePlayDeposit function
      const tx = await sekaWithSigner.gamePlayDeposit(roomIdBytes32, amountWithDecimals);
      await tx.wait();

      // Refresh balance after transaction
      await getUSDTBalance(web3, account, 'BEP20');

      return tx;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isConnected, currentNetwork, web3, account, checkGameEscrowAllowance, getUSDTBalance, getSigner]);

  // Join game room via GameEscrow contract
  const joinGameRoom = useCallback(async (roomId) => {
    if (!isConnected || currentNetwork !== 'BEP20') {
      throw new Error('Please connect to Binance Smart Chain network');
    }

    try {
      setLoading(true);
      setError(null);

      const roomIdBytes32 = ethers.utils.formatBytes32String(roomId);

      // Get room details to check entry fee
      const room = await sekaContract.getRoom(roomIdBytes32);
      const entryFee = Number(ethers.utils.formatUnits(room[1], 6)); // Convert from 6 decimals

      // Check if approval is needed
      const allowance = await checkGameEscrowAllowance();
      if (allowance < entryFee) {
        throw new Error(`Insufficient allowance. Please approve ${entryFee} USDT first.`);
      }

      const signer = await getSigner();
      const sekaWithSigner = sekaContract.connect(signer);

      // Call joinRoom function
      const tx = await sekaWithSigner.joinRoom(roomIdBytes32);
      await tx.wait();

      // Refresh balance after transaction
      await getUSDTBalance(web3, account, 'BEP20');

      return tx;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isConnected, currentNetwork, web3, account, checkGameEscrowAllowance, getUSDTBalance, getSigner]);

  // Create game room via GameEscrow contract
  const createGameRoom = useCallback(async (roomId, entryFee, maxPlayers, roomType, invitedPlayers = []) => {
    if (!isConnected || currentNetwork !== 'BEP20') {
      throw new Error('Please connect to Binance Smart Chain network');
    }

    try {
      setLoading(true);
      setError(null);
      
      const roomIdBytes32 = ethers.utils.formatBytes32String(roomId);
      const entryFeeWithDecimals = toBigNum(entryFee, 6);

      // Check if approval is needed for entry fee
      const allowance = await checkGameEscrowAllowance();
      if (allowance < entryFee) {
        throw new Error(`Insufficient allowance. Please approve ${entryFee} USDT first.`);
      }

      const signer = await getSigner();
      const sekaWithSigner = sekaContract.connect(signer);

      const tx = await sekaWithSigner.createRoom(
        roomIdBytes32,
        entryFeeWithDecimals,
        maxPlayers,
        roomType,
        invitedPlayers
      );
      await tx.wait();

      // Refresh balance after transaction
      await getUSDTBalance(web3, account, 'BEP20');

      return tx;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isConnected, currentNetwork, web3, account, checkGameEscrowAllowance, getUSDTBalance, getSigner]);

  // Refresh balances
  const refreshBalances = useCallback(async () => {
    if (!isConnected || !account) return;

    try {
      if (currentNetwork === 'BEP20' && web3) {
        const balance = await web3.eth.getBalance(account);
        setBalance(web3.utils.fromWei(balance, 'ether'));
        await getUSDTBalance(web3, account, 'BEP20');
      } else if (currentNetwork === 'TRC20' && tronWeb) {
        const balance = await tronWeb.trx.getBalance(account);
        setBalance(tronWeb.fromSun(balance));
        await getUSDTBalance(tronWeb, account, 'TRC20');
      }
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  }, [isConnected, account, currentNetwork, web3, tronWeb, getUSDTBalance]);

  // Auto-reconnect wallet on page load if previously connected
  useEffect(() => {
    const autoReconnect = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      const savedNetwork = localStorage.getItem('walletNetwork');
      
      if (wasConnected === 'true' && savedNetwork && isAuthenticated && !isConnected && !isAutoConnecting) {
        console.log('Auto-reconnecting to', savedNetwork);
        setIsAutoConnecting(true);
        
        try {
          if (savedNetwork === 'BEP20') {
            await connectMetaMask();
          } else if (savedNetwork === 'TRC20') {
            await connectTronLink();
          }
        } catch (error) {
          console.error('Auto-reconnect failed:', error);
          // Clear localStorage if auto-reconnect fails
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletNetwork');
        } finally {
          setIsAutoConnecting(false);
        }
      }
    };

    // Only attempt auto-reconnect if user is authenticated
    if (isAuthenticated) {
      autoReconnect();
    }
  }, [isAuthenticated, isConnected, isAutoConnecting, connectMetaMask, connectTronLink]);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled() && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          refreshBalances();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account, disconnect, refreshBalances, isMetaMaskInstalled]);

  // Auto-refresh balances every 30 seconds
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, refreshBalances]);

  // Periodically check for TronLink availability
  useEffect(() => {
    const checkTronLink = () => {
      if (isTronLinkInstalled()) {
        console.log('TronLink detected!');
      }
    };

    // Check immediately
    checkTronLink();

    // Check every 2 seconds for the first 10 seconds
    const interval = setInterval(checkTronLink, 2000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isTronLinkInstalled]);

  const value = {
    // State
    isConnected,
    currentNetwork,
    account,
    balance,
    USDTBalance,
    loading,
    error,
    isAutoConnecting,
    networks: NETWORKS,
    sekaContract,
    USDTContract,

    // Actions
    connectMetaMask,
    connectTronLink,
    disconnect,
    sendUSDT,
    refreshBalances,
    getBalance,
    // GameEscrow Actions
    approveGameEscrow,
    checkGameEscrowAllowance,
    depositToGameRoom,
    joinGameRoom,
    createGameRoom,

    // Utilities
    isMetaMaskInstalled,
    isTronLinkInstalled,
    formatAddress: (address) => {
      if (!address) return '';
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
    formatAmount: (amount, decimals = 2) => {
      return parseFloat(amount).toFixed(decimals);
    },
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
