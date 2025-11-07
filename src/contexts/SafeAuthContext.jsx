import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
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

  // Web3Auth Client ID from project settings
  const clientId = 'BDYU7Pkurgm7StMwMbJl3upFO06-0Xgm6e0-VIsVSjjmWP7_j583kzMx4Op0dIP2tlmOw1yhHA7rmBOni8fCbl';

  // Get current origin for redirect URLs
  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://sekasvara.io';
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
          rpcTarget: `https://api.web3auth.io/infura-service/v1/0x38/${clientId}`, // Web3Auth bundled RPC
          displayName: 'Binance Smart Chain',
          blockExplorerUrl: 'https://bscscan.com',
          ticker: 'BNB',
          tickerName: 'BNB',
          logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
        };

        // Create private key provider
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        // Initialize Web3Auth
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Using Sapphire Mainnet as shown in project settings
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
        });

        await web3authInstance.init();
        setWeb3auth(web3authInstance);

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
        console.error('Error initializing Web3Auth:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    if (!web3auth) {
      throw new Error('Web3Auth not initialized');
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
    if (!web3auth) {
      throw new Error('Web3Auth not initialized');
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

  const value = {
    web3auth,
    provider,
    loggedIn,
    loading,
    user,
    account,
    chainId,
    loginWithGoogle,
    loginWithWallet,
    logout,
    getProvider,
    getSigner,
  };

  return (
    <SafeAuthContext.Provider value={value}>
      {children}
    </SafeAuthContext.Provider>
  );
};

