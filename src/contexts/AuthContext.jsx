import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ Skip auto-auth on admin login page to allow fresh admin login
        if (window.location.pathname === '/admin/login') {
          console.log('🎛️ AuthContext: Skipping auto-auth on admin login page');
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          return;
        }
        
        console.log('🔍 AuthContext: Checking authentication on app load...');
        const hasToken = apiService.isAuthenticated();
        console.log('🔍 AuthContext: Has token:', hasToken);
        
        if (hasToken) {
          const user = apiService.getUser();
          console.log('🔍 AuthContext: User from localStorage:', user);
          
          if (user) {
            console.log('✅ AuthContext: Setting user from localStorage');
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user },
            });
          } else {
            // Check if token is a Web3Auth temporary token
            const token = localStorage.getItem('authToken');
            try {
              const tokenData = JSON.parse(atob(token));
              if (tokenData.isWeb3Auth && tokenData.walletAddress) {
                // This is a Web3Auth token, user should be authenticated via wallet
                console.log('✅ AuthContext: Web3Auth token found, user authenticated via wallet');
                // Don't try to fetch from API, wallet connection is sufficient
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                return;
              }
            } catch (e) {
              // Not a Web3Auth token, continue with normal flow
            }
            
            console.log('🔄 AuthContext: Getting user profile from API...');
            // Try to get user profile
            try {
              const userProfile = await apiService.getUserProfile();
              console.log('📥 AuthContext: User profile from API:', userProfile);
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: userProfile },
              });
            } catch (apiError) {
              // API call failed, but if we have a Web3Auth token, user is still authenticated
              console.log('⚠️ AuthContext: API call failed, but user may be authenticated via wallet');
              dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
          }
        } else {
          console.log('❌ AuthContext: No token found, user not authenticated');
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('❌ AuthContext: Auth check failed:', error);
        // Don't clear tokens if it's a Web3Auth authentication
        const token = localStorage.getItem('authToken');
        try {
          const tokenData = JSON.parse(atob(token));
          if (tokenData.isWeb3Auth) {
            console.log('✅ AuthContext: Web3Auth token preserved despite error');
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            return;
          }
        } catch (e) {
          // Not a Web3Auth token, clear it
        }
        apiService.clearTokens();
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // ✅ Handle Web3Auth immediate authentication (wallet connection = authentication)
      if (credentials.isWeb3Auth && credentials.user) {
        // Wallet connection is immediate authentication - no backend call needed upfront
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: credentials.user },
        });
        
        // Store wallet user in localStorage
        apiService.setUser(credentials.user);
        // Create a temporary token for session management
        const tempToken = btoa(JSON.stringify({ 
          walletAddress: credentials.walletAddress, 
          timestamp: Date.now(),
          isWeb3Auth: true 
        }));
        localStorage.setItem('authToken', tempToken);
        
        console.log('✅ User authenticated immediately via wallet connection');
        return { user: credentials.user, access_token: tempToken };
      }
      
      // Traditional login flow
      const response = await apiService.login(credentials);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: response.user },
      });
      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      console.log('Starting registration process...');
      const response = await apiService.register(userData);
      console.log('Registration response received:', response);
      
      if (!response.access_token) {
        throw new Error('Registration failed: No access token received');
      }
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user: response.user },
      });
      console.log('Registration successful, user state updated');
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: { error: error.message },
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user function
  const updateUser = async (userData) => {
    try {
      const updatedUser = await apiService.updateUserProfile(userData);
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser,
      });
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  // Refresh user profile from server
  const refreshUserProfile = async () => {
    try {
      console.log('🔄 Refreshing user profile...');
      const userProfile = await apiService.getUserProfile();
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: userProfile,
      });
      console.log('✅ User profile refreshed:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('❌ Failed to refresh user profile:', error);
      throw error;
    }
  };

  // ✅ Update platform score (for real-time balance updates)
  const updatePlatformScore = (newScore) => {
    console.log(`💰 Updating platform score: ${newScore}`);
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: { platformScore: newScore },
    });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      return await apiService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (token, newPassword) => {
    try {
      return await apiService.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Verify email function
  const verifyEmail = async (token) => {
    try {
      return await apiService.verifyEmail(token);
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  };

  // Google OAuth function
  const loginWithGoogle = async (idToken) => {
    try {
      console.log('🔄 AuthContext: Starting Google OAuth login...');
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      console.log('📡 AuthContext: Calling API service verifyGoogleToken...');
      const response = await apiService.verifyGoogleToken(idToken);
      console.log('📥 AuthContext: Received response from API service:', response);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: response.user },
      });
      
      console.log('✅ AuthContext: Google OAuth login successful!');
      return response;
    } catch (error) {
      console.error('❌ AuthContext: Google OAuth login failed:', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshUserProfile,
    updatePlatformScore, // ✅ Export for real-time balance updates
    clearError,
    forgotPassword,
    resetPassword,
    verifyEmail,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

