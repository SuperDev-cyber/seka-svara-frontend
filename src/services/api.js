/**
 * Main API Service
 * Handles all API calls to the backend
 */

import { API_CONFIG } from '../config/api.js';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Debug logging for API configuration
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  fullConfig: API_CONFIG
});

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🔧 ApiService initialized with baseURL:', this.baseURL);
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Set authentication tokens
   */
  setTokens(accessToken, refreshToken) {
    console.log('💾 setTokens called with:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
    try {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('✅ Tokens stored in localStorage');
      console.log('🔍 localStorage authToken:', localStorage.getItem('authToken'));
      console.log('🔍 localStorage refreshToken:', localStorage.getItem('refreshToken'));
    } catch (error) {
      console.error('❌ Error storing tokens:', error);
    }
  }

  /**
   * Clear authentication tokens
   */
  clearTokens() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Get user data from localStorage
   */
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Set user data
   */
  setUser(user) {
    console.log('👤 setUser called with:', user);
    try {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ User stored in localStorage');
      console.log('🔍 localStorage user:', localStorage.getItem('user'));
    } catch (error) {
      console.error('❌ Error storing user:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getAuthToken();
    console.log('🔍 isAuthenticated check:', { hasToken: !!token, token: token ? 'present' : 'missing' });
    return !!token;
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
      // Ensure baseURL has /api/v1
      if (!this.baseURL.includes('/api/v1')) {
        console.error('❌ [API Service] ERROR: baseURL missing /api/v1!', this.baseURL);
        throw new Error(`Invalid API baseURL: ${this.baseURL}. Must include /api/v1`);
      }
      
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log('🌐 API Request:', { 
        method: config.method || 'GET', 
        url: fullUrl, 
        endpoint, 
        baseURL: this.baseURL,
        envVar: import.meta.env.VITE_API_URL
      });
      const response = await fetch(fullUrl, config);
      
      // If token expired, try to refresh
      if (response.status === 401 && this.getRefreshToken()) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers.Authorization = `Bearer ${this.getAuthToken()}`;
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, config);
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${retryResponse.status}`);
          }
          return await retryResponse.json();
        }
      }
      
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
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.clearTokens();
        return false;
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access_token, refreshToken);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  // Authentication endpoints
  async register(userData) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    console.log('Registration response:', response);
    console.log('Access token present:', !!response.access_token);
    console.log('Refresh token present:', !!response.refresh_token);
    console.log('User data present:', !!response.user);
    
    if (response.access_token) {
      this.setTokens(response.access_token, response.refresh_token);
      this.setUser(response.user);
      console.log('Tokens stored successfully');
    } else {
      console.error('No access token in response:', response);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access_token) {
      this.setTokens(response.access_token, response.refresh_token);
      this.setUser(response.user);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  async forgotPassword(email) {
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, newPassword) {
    return this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async verifyEmail(token) {
    return this.makeRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.makeRequest('/users/profile');
  }

  async updateUserProfile(userData) {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserById(userId) {
    return this.makeRequest(`/users/${userId}`);
  }

  // Game endpoints
  async getGameTables() {
    return this.makeRequest('/tables');
  }

  async getGameTable(tableId) {
    return this.makeRequest(`/tables/${tableId}`);
  }

  async createGameTable(tableData) {
    return this.makeRequest('/tables', {
      method: 'POST',
      body: JSON.stringify(tableData),
    });
  }

  async joinGameTable(tableId) {
    return this.makeRequest(`/tables/${tableId}/join`, {
      method: 'POST',
    });
  }

  async leaveGameTable(tableId) {
    return this.makeRequest(`/tables/${tableId}/leave`, {
      method: 'POST',
    });
  }

  async getGameState(gameId) {
    return this.makeRequest(`/game/${gameId}/state`);
  }

  async performGameAction(gameId, action) {
    return this.makeRequest(`/game/${gameId}/action`, {
      method: 'POST',
      body: JSON.stringify(action),
    });
  }

  async getUserGameHistory() {
    return this.makeRequest('/game/user/history');
  }

  // Wallet endpoints
  async getWallet() {
    return this.makeRequest('/wallet');
  }

  async getWalletBalance() {
    return this.makeRequest('/wallet/balance');
  }

  async deposit(depositData) {
    return this.makeRequest('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  }

  async withdraw(withdrawalData) {
    return this.makeRequest('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    });
  }

  async getTransactions() {
    return this.makeRequest('/wallet/transactions');
  }

  // NFT endpoints
  async getNFTs() {
    return this.makeRequest('/nft');
  }

  async getNFTById(nftId) {
    return this.makeRequest(`/nft/${nftId}`);
  }

  async createNFT(nftData) {
    return this.makeRequest('/nft', {
      method: 'POST',
      body: JSON.stringify(nftData),
    });
  }

  async buyNFT(nftId) {
    return this.makeRequest(`/nft/${nftId}/buy`, {
      method: 'POST',
    });
  }

  // Leaderboard endpoints
  async getTopWinners() {
    return this.makeRequest('/leaderboard/top-winners');
  }

  async getTopPlayers() {
    return this.makeRequest('/leaderboard/top-players');
  }

  async getMostActive() {
    return this.makeRequest('/leaderboard/most-active');
  }

  async getStatistics() {
    return this.makeRequest('/leaderboard/statistics');
  }

  // Notifications endpoints
  async getNotifications() {
    return this.makeRequest('/notifications');
  }

  async getUnreadNotifications() {
    return this.makeRequest('/notifications/unread');
  }

  async markNotificationAsRead(notificationId) {
    return this.makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.makeRequest('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Generic HTTP methods
  async get(endpoint) {
    return this.makeRequest(endpoint, {
      method: 'GET',
    });
  }

  async post(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }

  // Email endpoints
  async sendEmailInvite(inviteData) {
    return this.post('/email/invite', inviteData);
  }

  async sendEmailNotification(notificationData) {
    return this.post('/email/notification', notificationData);
  }

  // Google OAuth
  async verifyGoogleToken(idToken) {
    console.log('🌐 API Service: Starting Google token verification...');
    console.log('🔑 API Service: ID Token:', idToken ? 'Token provided' : 'No token');
    
    const response = await this.makeRequest('/auth/google/verify', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    
    console.log('📥 API Service: Google verification response:', response);
    console.log('🔑 API Service: Access token present:', !!response.access_token);
    console.log('🔄 API Service: Refresh token present:', !!response.refresh_token);
    
    if (response.access_token) {
      console.log('💾 API Service: Storing tokens in localStorage...');
      this.setTokens(response.access_token, response.refresh_token);
      this.setUser(response.user);
      console.log('✅ API Service: Tokens stored successfully!');
    } else {
      console.error('❌ API Service: No access token in response!');
    }
    
    return response;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
