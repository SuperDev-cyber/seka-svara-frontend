/**
 * Wallet API Service
 * Handles all wallet-related API calls to the backend
 */

import { API_CONFIG } from '../config/api.js';

const API_BASE_URL = API_CONFIG.BASE_URL;

class WalletApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Make authenticated API request
   */
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get user wallet information
   */
  async getWallet() {
    return this.makeRequest('/wallet');
  }

  /**
   * Get wallet balance
   */
  async getBalance() {
    return this.makeRequest('/wallet/balance');
  }

  /**
   * Get wallet addresses
   */
  async getAddresses() {
    return this.makeRequest('/wallet/addresses');
  }

  /**
   * Get wallet statistics
   */
  async getStats() {
    return this.makeRequest('/wallet/stats');
  }

  /**
   * Generate deposit address for a specific network
   * @param {string} network - 'BEP20' or 'TRC20'
   */
  async generateDepositAddress(network) {
    return this.makeRequest('/wallet/generate-address', {
      method: 'POST',
      body: JSON.stringify({ network }),
    });
  }

  /**
   * Process a deposit
   * @param {Object} depositData - { network, amount, txHash }
   */
  async processDeposit(depositData) {
    return this.makeRequest('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  }

  /**
   * Request a withdrawal
   * @param {Object} withdrawalData - { network, amount, toAddress }
   */
  async requestWithdrawal(withdrawalData) {
    return this.makeRequest('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    });
  }

  /**
   * Get wallet transactions
   */
  async getTransactions() {
    return this.makeRequest('/wallet/transactions');
  }

  /**
   * Lock funds for betting
   * @param {number} amount - Amount to lock
   */
  async lockFunds(amount) {
    return this.makeRequest('/wallet/lock-funds', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  /**
   * Unlock funds after game
   * @param {number} amount - Amount to unlock
   */
  async unlockFunds(amount) {
    return this.makeRequest('/wallet/unlock-funds', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  /**
   * Add winnings to wallet
   * @param {number} amount - Amount of winnings
   */
  async addWinnings(amount) {
    return this.makeRequest('/wallet/add-winnings', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  /**
   * Deactivate wallet
   */
  async deactivateWallet() {
    return this.makeRequest('/wallet/deactivate', {
      method: 'POST',
    });
  }

  /**
   * Reactivate wallet
   */
  async reactivateWallet() {
    return this.makeRequest('/wallet/reactivate', {
      method: 'POST',
    });
  }

  /**
   * Validate blockchain address
   * @param {string} address - Address to validate
   * @param {string} network - Network type ('BEP20' or 'TRC20')
   */
  validateAddress(address, network) {
    if (network === 'BEP20') {
      // Ethereum/BSC address validation
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    } else if (network === 'TRC20') {
      // Tron address validation
      return /^T[A-Za-z1-9]{33}$/.test(address);
    }
    return false;
  }

  /**
   * Format amount for display
   * @param {number} amount - Amount to format
   * @param {number} decimals - Number of decimal places
   */
  formatAmount(amount, decimals = 2) {
    return parseFloat(amount).toFixed(decimals);
  }

  /**
   * Format address for display (show first 6 and last 4 characters)
   * @param {string} address - Address to format
   */
  formatAddress(address) {
    if (!address) return '';
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

// Create and export a singleton instance
const walletApi = new WalletApiService();
export default walletApi;
