// API Configuration for mobile app
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Determine base URL based on environment
  let baseUrlWithoutPrefix;
  
  if (envUrl) {
    baseUrlWithoutPrefix = envUrl.replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '');
  } else if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    baseUrlWithoutPrefix = 'https://seka-svara-2.onrender.com';
  } else {
    baseUrlWithoutPrefix = 'http://localhost:8000';
  }
  
  return `${baseUrlWithoutPrefix}/api/v1`;
};

const BASE_URL = getApiBaseUrl();

export const apiService = {
  baseUrl: BASE_URL,
  
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },
  
  async getUserProfile() {
    return this.request('/users/profile');
  },
  
  async loginWithWeb3Auth(walletAddress: string, email?: string, name?: string) {
    return this.request('/auth/web3auth', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, email, name }),
    });
  },
};

