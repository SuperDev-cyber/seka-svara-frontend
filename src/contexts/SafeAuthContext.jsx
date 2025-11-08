import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { ethers } from 'ethers';

const SafeAuthContext = createContext();

export const useSafeAuth = () => {
  const context = useContext(SafeAuthContext);
  if (!context) {
    throw new Error('useSafeAuth must be used within a SafeAuthProvider');
  }
  return context;
};

export const SafeAuthProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [initError, setInitError] = useState(null);

  // Web3Auth Client ID from project settings
  const clientId = 'BDYU7Pkurgm7StMwMbJl3upFOo6-0Xgm6e0-VIsVSjjmWP7_j583kzMx4Op0dIP2tlmOw1yhHA7rmBOni8fCb0Q';

  // Get current origin for redirect URLs
  // Must match whitelisted origin: https://www.sekasvara.io
  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      // Normalize to www subdomain to match whitelisted origin
      const origin = window.location.origin;
      if (origin.includes('sekasvara.io') && !origin.includes('www.')) {
        return 'https://www.sekasvara.io';
      }
      return origin;
    }
    return 'https://www.sekasvara.io';
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // Configure chain for BSC (Binance Smart Chain)
        // Using Web3Auth's bundled RPC service for better reliability and higher limits
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0x38', // BSC Mainnet (56 in decimal)
          rpcTarget: `https://api.web3auth.io/infura-service/v1/0x38/BDYU7Pkurgm7StMwMbJl3upFOo6-0Xgm6e0-VIsVSjjmWP7_j583kzMx4Op0dIP2tlmOw1yhHA7rmBOni8fCb0Q`, // Web3Auth bundled RPC
          displayName: 'Binance Smart Chain',
          blockExplorerUrl: 'https://bscscan.com',
          ticker: 'BNB',
          tickerName: 'BNB',
          logo: 'https://images.web3auth.io/chains/56.svg',
        };

        // Create private key provider
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        // Configure OpenloginAdapter for social logins (Google, etc.)
        // This is REQUIRED for Google login and other social authentication methods
        // The adapter handles social login providers configured in the Web3Auth dashboard
        // IMPORTANT: Create adapter AFTER privateKeyProvider but BEFORE Web3Auth instance in v9
        // IMPORTANT: OpenloginAdapter needs privateKeyProvider in adapterSettings
        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
            uxMode: 'popup', // Use popup mode for better UX
            chainConfig, // Pass chainConfig to adapter
            privateKeyProvider, // CRITICAL: Pass privateKeyProvider to adapter
            // loginConfig is optional - Google should be configured in Web3Auth dashboard
          },
        });

        // Initialize Web3Auth
        // Use SAPPHIRE_MAINNET to match the project environment
        // IMPORTANT: Using @web3auth/modal requires MODAL mode in dashboard, not EMBED mode
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          chainConfig,
          privateKeyProvider,
          uiConfig: {
            appName: 'SEKA SVARA',
            mode: 'light',
            logoLight: 'https://sekasvara.io/logo.png',
            logoDark: 'https://sekasvara.io/logo.png',
            defaultLanguage: 'en',
            loginGridCol: 3,
            primaryButton: 'externalLogin',
          },
          // Account Abstraction (Smart Accounts) Configuration
          // Temporarily commented out - may conflict with adapter registration in v9
          // Uncomment if Smart Accounts are properly configured in dashboard
          // accountAbstractionConfig: {
          //   chainConfig: [{
          //     chainId: '0x38', // BSC Mainnet (56 in decimal)
          //     rpcTarget: `https://api.web3auth.io/infura-service/v1/0x38/${clientId}`, // Web3Auth bundled RPC
          //   }],
          // },
        });

        // Register the OpenloginAdapter with Web3Auth instance
        // IMPORTANT: Must be called BEFORE initModal() in v9
        try {
          web3authInstance.configureAdapter(openloginAdapter);
          console.log('✅ OpenloginAdapter registered successfully');
        } catch (adapterError) {
          console.warn('⚠️ Adapter registration warning (may be non-critical):', adapterError.message);
          // Continue initialization even if adapter registration has warnings
        }

        console.log('🔄 Initializing Web3Auth with:', {
          clientId: clientId.substring(0, 20) + '...',
          fullClientId: clientId,
          network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          chainId: chainConfig.chainId,
        });
        
        // In v9, use initModal() instead of init()
        await web3authInstance.initModal();
        console.log('✅ Web3Auth initialized successfully');
        setWeb3auth(web3authInstance);
        setInitError(null); // Clear any previous errors

        // Check if user is already logged in
        if (web3authInstance.connected) {
          setProvider(web3authInstance.provider);
          setLoggedIn(true);
          const userInfo = await web3authInstance.getUserInfo();
          setUser(userInfo);
          
          // Get account address
          if (web3authInstance.provider) {
            const ethersProvider = new ethers.providers.Web3Provider(web3authInstance.provider);
            const signer = ethersProvider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
            
            const network = await ethersProvider.getNetwork();
            setChainId(network.chainId.toString());
          }
        }
      } catch (error) {
        console.error('❌ Error initializing Web3Auth:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack,
          clientId: clientId.substring(0, 20) + '...',
        });
        
        let errorMessage = 'Failed to initialize Web3Auth. ';
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          errorMessage += 'Project not found. Please verify your Client ID and network configuration in the Web3Auth dashboard.';
        } else if (error.message?.includes('network')) {
          errorMessage += 'Network configuration error. Please check your network settings.';
        } else {
          errorMessage += error.message || 'Please check your configuration.';
        }
        
        setInitError(errorMessage);
        // Don't set web3auth to null - keep it so we can retry
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    if (loading) {
      throw new Error('Web3Auth is still initializing. Please wait...');
    }
    if (!web3auth) {
      throw new Error('Web3Auth not initialized. Please refresh the page or check your configuration.');
    }

    try {
      setLoading(true);
      const web3authProvider = await web3auth.connectTo('openlogin', {
        loginProvider: 'google',
        redirectUrl: getRedirectUrl(),
      });

      if (web3authProvider) {
        setProvider(web3authProvider);
        setLoggedIn(true);
        
        const userInfo = await web3auth.getUserInfo();
        setUser(userInfo);

        // Get account address
        const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const network = await ethersProvider.getNetwork();
        setChainId(network.chainId.toString());

        return { provider: web3authProvider, user: userInfo, address };
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [web3auth]);

  // Login with Wallet (external wallet like MetaMask)
  const loginWithWallet = useCallback(async () => {
    if (loading) {
      throw new Error('Web3Auth is still initializing. Please wait...');
    }
    if (!web3auth) {
      throw new Error('Web3Auth not initialized. Please refresh the page or check your configuration.');
    }

    try {
      setLoading(true);
      // For external wallet, use the connect() method which opens the modal
      const web3authProvider = await web3auth.connect();

      if (web3authProvider) {
        setProvider(web3authProvider);
        setLoggedIn(true);
        
        const userInfo = await web3auth.getUserInfo();
        setUser(userInfo);

        // Get account address
        const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const network = await ethersProvider.getNetwork();
        setChainId(network.chainId.toString());

        return { provider: web3authProvider, user: userInfo, address };
      } else {
        throw new Error('Failed to connect wallet');
      }
    } finally {
      setLoading(false);
    }
  }, [web3auth]);

  // Logout
  const logout = useCallback(async () => {
    if (!web3auth) {
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setUser(null);
      setAccount(null);
      setChainId(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }, [web3auth]);

  // Get ethers provider
  const getProvider = useCallback(() => {
    if (!provider) {
      return null;
    }
    return new ethers.providers.Web3Provider(provider);
  }, [provider]);

  // Get signer
  const getSigner = useCallback(async () => {
    const ethersProvider = getProvider();
    if (!ethersProvider) {
      throw new Error('Provider not available');
    }
    return ethersProvider.getSigner();
  }, [getProvider]);

  // Get USDT balance from Web3Auth wallet
  const getUSDTBalance = useCallback(async () => {
    if (!provider || !account) {
      console.log('⚠️ getUSDTBalance: Missing provider or account', { hasProvider: !!provider, hasAccount: !!account });
      return '0';
    }

    try {
      const ethersProvider = getProvider();
      if (!ethersProvider) {
        console.error('❌ getUSDTBalance: Failed to get ethers provider');
        return '0';
      }

      // ✅ Official USDT contract address on BSC Mainnet
      const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
      
      console.log('🔍 Fetching USDT balance:', {
        account: account,
        usdtContract: USDT_ADDRESS,
        network: await ethersProvider.getNetwork().catch(() => 'unknown')
      });
      
      // Minimal USDT ABI for balanceOf
      const USDT_ABI = [
        {
          "constant": true,
          "inputs": [{"name": "_owner", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"name": "balance", "type": "uint256"}],
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "decimals",
          "outputs": [{"name": "", "type": "uint8"}],
          "type": "function"
        }
      ];

      const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, ethersProvider);
      
      // Fetch balance and decimals
      const [balance, decimals] = await Promise.all([
        usdtContract.balanceOf(account),
        usdtContract.decimals()
      ]);
      
      console.log('💰 Raw USDT balance:', {
        balance: balance.toString(),
        decimals: decimals.toString(),
        account: account
      });
      
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      const finalBalance = parseFloat(formattedBalance).toFixed(2);
      
      console.log('✅ USDT Balance formatted:', finalBalance);
      return finalBalance;
    } catch (error) {
      console.error('❌ Error fetching USDT balance from Web3Auth wallet:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        account: account,
        hasProvider: !!provider
      });
      return '0';
    }
  }, [provider, account, getProvider]);

  const value = {
    web3auth,
    provider,
    loggedIn,
    loading,
    user,
    account,
    chainId,
    initError,
    loginWithGoogle,
    loginWithWallet,
    logout,
    getProvider,
    getSigner,
    getUSDTBalance,
  };

  return (
    <SafeAuthContext.Provider value={value}>
      {children}
    </SafeAuthContext.Provider>
  );
};

