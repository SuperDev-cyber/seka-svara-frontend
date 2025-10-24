import { useState, useEffect, useCallback } from 'react';
import walletApi from '../services/walletApi';

/**
 * Custom hook for wallet operations
 * Provides wallet state management and API integration
 */
export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch wallet data
   */
  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const walletData = await walletApi.getWallet();
      setWallet(walletData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch wallet:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch wallet balance
   */
  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const balanceData = await walletApi.getBalance();
      setBalance(balanceData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch balance:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch wallet addresses
   */
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const addressesData = await walletApi.getAddresses();
      setAddresses(addressesData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch wallet statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await walletApi.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch transactions
   */
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const transactionsData = await walletApi.getTransactions();
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate deposit address
   */
  const generateDepositAddress = useCallback(async (network) => {
    try {
      setLoading(true);
      setError(null);
      const result = await walletApi.generateDepositAddress(network);
      // Refresh addresses after generating new one
      await fetchAddresses();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to generate deposit address:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAddresses]);

  /**
   * Process deposit
   */
  const processDeposit = useCallback(async (depositData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await walletApi.processDeposit(depositData);
      // Refresh balance after deposit
      await fetchBalance();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to process deposit:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  /**
   * Request withdrawal
   */
  const requestWithdrawal = useCallback(async (withdrawalData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await walletApi.requestWithdrawal(withdrawalData);
      // Refresh balance after withdrawal
      await fetchBalance();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to request withdrawal:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  /**
   * Lock funds for betting
   */
  const lockFunds = useCallback(async (amount) => {
    try {
      setLoading(true);
      setError(null);
      const result = await walletApi.lockFunds(amount);
      // Refresh balance after locking
      await fetchBalance();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to lock funds:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  /**
   * Unlock funds after game
   */
  const unlockFunds = useCallback(async (amount) => {
    try {
      setLoading(true);
      setError(null);
      const result = await walletApi.unlockFunds(amount);
      // Refresh balance after unlocking
      await fetchBalance();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to unlock funds:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  /**
   * Add winnings
   */
  const addWinnings = useCallback(async (amount) => {
    try {
      setLoading(true);
      setError(null);
      const result = await walletApi.addWinnings(amount);
      // Refresh balance after adding winnings
      await fetchBalance();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to add winnings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  /**
   * Deactivate wallet
   */
  const deactivateWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await walletApi.deactivateWallet();
      // Refresh wallet data
      await fetchWallet();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to deactivate wallet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallet]);

  /**
   * Reactivate wallet
   */
  const reactivateWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await walletApi.reactivateWallet();
      // Refresh wallet data
      await fetchWallet();
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to reactivate wallet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallet]);

  /**
   * Refresh all wallet data
   */
  const refreshWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchWallet(),
        fetchBalance(),
        fetchAddresses(),
        fetchStats(),
        fetchTransactions(),
      ]);
    } catch (err) {
      setError(err.message);
      console.error('Failed to refresh wallet:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchWallet, fetchBalance, fetchAddresses, fetchStats, fetchTransactions]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data on mount
  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  return {
    // State
    wallet,
    balance,
    addresses,
    stats,
    transactions,
    loading,
    error,

    // Actions
    fetchWallet,
    fetchBalance,
    fetchAddresses,
    fetchStats,
    fetchTransactions,
    generateDepositAddress,
    processDeposit,
    requestWithdrawal,
    lockFunds,
    unlockFunds,
    addWinnings,
    deactivateWallet,
    reactivateWallet,
    refreshWallet,
    clearError,

    // Utility functions
    formatAmount: walletApi.formatAmount,
    formatAddress: walletApi.formatAddress,
    validateAddress: walletApi.validateAddress,
  };
};
