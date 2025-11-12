import { useState, useEffect } from 'react';
import { connectWallet, getUSDTBalance, sendUSDT, switchToBSC, Web3State } from '@/lib/web3';

export function useWallet() {
  const [walletState, setWalletState] = useState<Web3State>({
    account: null,
    balance: null,
    chainId: null,
    isConnected: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      // Check if already connected
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            handleAccountChange(accounts);
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', handleChainChange);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountChange);
        window.ethereum?.removeListener('chainChanged', handleChainChange);
      };
    }
  }, []);

  const handleAccountChange = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setWalletState({
        account: null,
        balance: null,
        chainId: null,
        isConnected: false,
      });
    } else {
      const balance = await getUSDTBalance(accounts[0]);
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setWalletState({
        account: accounts[0],
        balance,
        chainId,
        isConnected: true,
      });
    }
  };

  const handleChainChange = (chainId: string) => {
    setWalletState((prev) => ({ ...prev, chainId }));
    window.location.reload();
  };

  const connect = async () => {
    setLoading(true);
    try {
      const account = await connectWallet();
      const balance = await getUSDTBalance(account);
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      setWalletState({
        account,
        balance,
        chainId,
        isConnected: true,
      });
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async () => {
    setLoading(true);
    try {
      await switchToBSC();
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendTip = async (toAddress: string, amount: string) => {
    setLoading(true);
    try {
      const txHash = await sendUSDT(toAddress, amount);
      // Refresh balance
      if (walletState.account) {
        const balance = await getUSDTBalance(walletState.account);
        setWalletState((prev) => ({ ...prev, balance }));
      }
      return txHash;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    ...walletState,
    address: walletState.account || '',
    usdtBalance: walletState.balance ? parseFloat(walletState.balance) : 0,
    bnbBalance: 0, // TODO: Implement BNB balance fetching
    loading,
    connect,
    connectWallet: connect,
    switchNetwork,
    sendTip,
  };
}
