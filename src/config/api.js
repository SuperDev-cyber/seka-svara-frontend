// API Configuration
// Ensure VITE_API_URL includes /api/v1 prefix
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  console.log('🔧 [API Config] VITE_API_URL from env:', envUrl);
  console.log('🔧 [API Config] Current hostname:', window.location.hostname);
  console.log('🔧 [API Config] Is production?', window.location.hostname.includes('vercel.app'));
  
  // Determine base URL based on environment
  let baseUrlWithoutPrefix;
  
  if (envUrl) {
    // Use environment variable if provided
    baseUrlWithoutPrefix = envUrl.replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '');
    console.log('🔧 [API Config] Using env var, cleaned URL:', baseUrlWithoutPrefix);
  } else if (window.location.hostname.includes('vercel.app')) {
    // Production/Vercel: use Render backend
    baseUrlWithoutPrefix = 'https://seka-svara-2.onrender.com';
    console.warn('⚠️ [API Config] VITE_API_URL not set, auto-detecting Vercel deployment, using:', baseUrlWithoutPrefix);
  } else {
    // Local development
    baseUrlWithoutPrefix = 'http://localhost:8000';
    console.warn('⚠️ [API Config] VITE_API_URL not set, using localhost default:', baseUrlWithoutPrefix);
  }
  
  // Always append /api/v1
  const baseUrl = `${baseUrlWithoutPrefix}/api/v1`;
  
  console.log('🔧 [API Config] Final BASE_URL:', baseUrl);
  return baseUrl;
};

const BASE_URL = getApiBaseUrl();

// Validate that BASE_URL contains /api/v1
if (!BASE_URL.includes('/api/v1')) {
  console.error('❌ [API Config] ERROR: BASE_URL does not contain /api/v1!', BASE_URL);
  throw new Error(`Invalid API BASE_URL: ${BASE_URL}. Must include /api/v1`);
}

export const API_CONFIG = {
  BASE_URL: BASE_URL,
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

