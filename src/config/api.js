// API Configuration
// Ensure VITE_API_URL includes /api/v1 prefix
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Remove trailing slashes
    const cleanUrl = envUrl.replace(/\/+$/, '');
    
    // Check if /api/v1 is already included
    if (cleanUrl.endsWith('/api/v1')) {
      return cleanUrl;
    }
    
    // Otherwise, append /api/v1
    return `${cleanUrl}/api/v1`;
  }
  // Default to localhost with /api/v1
  return 'http://localhost:8000/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Application Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Seka Svara',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.VITE_NODE_ENV || 'development',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    PROFILE: '/users/profile',
    BY_ID: (id) => `/users/${id}`,
  },
  GAME: {
    TABLES: '/tables',
    TABLE_BY_ID: (id) => `/tables/${id}`,
    GAME_STATE: (id) => `/game/${id}/state`,
    GAME_ACTION: (id) => `/game/${id}/action`,
    USER_HISTORY: '/game/user/history',
  },
  WALLET: {
    BALANCE: '/wallet/balance',
    DEPOSIT: '/wallet/deposit',
    WITHDRAW: '/wallet/withdraw',
    TRANSACTIONS: '/wallet/transactions',
  },
  NFT: {
    LIST: '/nft',
    BY_ID: (id) => `/nft/${id}`,
    BUY: (id) => `/nft/${id}/buy`,
  },
  LEADERBOARD: {
    TOP_WINNERS: '/leaderboard/top-winners',
    TOP_PLAYERS: '/leaderboard/top-players',
    MOST_ACTIVE: '/leaderboard/most-active',
    STATISTICS: '/leaderboard/statistics',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD: '/notifications/unread',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
};

