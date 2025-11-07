import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSafeAuth } from '../../contexts/SafeAuthContext';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

const SocialButtons = () => {
    const { loginWithGoogle: safeAuthLoginGoogle, loginWithWallet: safeAuthLoginWallet, loggedIn: safeAuthLoggedIn } = useSafeAuth();
    const { loginWithGoogle: backendLoginGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleSafeAuthGoogle = async () => {
        try {
            setLoading(true);
            
            // Login with SafeAuth (Web3Auth)
            const result = await safeAuthLoginGoogle();
            
            if (!result || !result.user) {
                throw new Error('Failed to get user info from SafeAuth');
            }

            // Get user email from SafeAuth
            const email = result.user.email || result.user.name || 'user@web3auth.io';
            
            // Register with backend using email
            try {
                const password = 'Web3Auth_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                const username = email.split('@')[0] + '_' + Date.now().toString().substring(10);
                
                const registerResponse = await apiService.post('/auth/register', {
                    username: username,
                    email: email,
                    password: password,
                    confirmPassword: password,
                });

                if (registerResponse.access_token) {
                    if (window.showToast) {
                        window.showToast('Registration successful!', 'success', 3000);
                    }
                    navigate(from, { replace: true });
                }
            } catch (registerError) {
                console.error('Registration error:', registerError);
                // If user already exists, try to login
                if (registerError.response?.status === 409) {
                    try {
                        const loginResponse = await apiService.post('/auth/login', {
                            email: email,
                            password: 'web3auth',
                        });
                        
                        if (loginResponse.access_token) {
                            if (window.showToast) {
                                window.showToast('Login successful!', 'success', 3000);
                            }
                            navigate(from, { replace: true });
                        }
                    } catch (loginError) {
                        throw new Error('Failed to login with existing account');
                    }
                } else {
                    throw new Error('Failed to register with backend');
                }
            }
        } catch (err) {
            console.error('SafeAuth Google registration error:', err);
            if (window.showToast) {
                window.showToast(err.message || 'Google registration failed', 'error', 5000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSafeAuthWallet = async () => {
        try {
            setLoading(true);
            
            // Login with SafeAuth (Web3Auth) using external wallet
            const result = await safeAuthLoginWallet();
            
            if (!result || !result.address) {
                throw new Error('Failed to get wallet address from SafeAuth');
            }

            // Use wallet address as identifier
            const walletAddress = result.address;
            
            // Register with backend using wallet address
            try {
                const password = 'Web3Auth_' + Date.now() + '_' + Math.random().toString(36).substring(7);
                const email = `${walletAddress}@wallet.local`;
                const username = `wallet_${walletAddress.substring(2, 10)}_${Date.now().toString().substring(10)}`;
                
                const registerResponse = await apiService.post('/auth/register', {
                    username: username,
                    email: email,
                    password: password,
                    confirmPassword: password,
                });

                if (registerResponse.access_token) {
                    if (window.showToast) {
                        window.showToast('Registration successful!', 'success', 3000);
                    }
                    navigate(from, { replace: true });
                }
            } catch (registerError) {
                console.error('Registration error:', registerError);
                // If user already exists, try to login
                if (registerError.response?.status === 409) {
                    try {
                        const loginResponse = await apiService.post('/auth/login', {
                            email: `${walletAddress}@wallet.local`,
                            password: 'web3auth',
                        });
                        
                        if (loginResponse.access_token) {
                            if (window.showToast) {
                                window.showToast('Login successful!', 'success', 3000);
                            }
                            navigate(from, { replace: true });
                        }
                    } catch (loginError) {
                        throw new Error('Failed to login with existing account');
                    }
                } else {
                    throw new Error('Failed to register with backend');
                }
            }
        } catch (err) {
            console.error('SafeAuth Wallet registration error:', err);
            if (window.showToast) {
                window.showToast(err.message || 'Wallet registration failed', 'error', 5000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <button
                onClick={handleSafeAuthGoogle}
                disabled={loading || safeAuthLoggedIn}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#fff',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#3c4043',
                }}
            >
                {loading ? (
                    <>🔄 Connecting...</>
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign up with Google
                    </>
                )}
            </button>

            <button
                onClick={handleSafeAuthWallet}
                disabled={loading || safeAuthLoggedIn}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#3c4043',
                }}
            >
                {loading ? (
                    <>🔄 Connecting...</>
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="6" width="20" height="12" rx="2"/>
                            <path d="M6 10h.01M10 10h.01"/>
                        </svg>
                        Sign up with Wallet
                    </>
                )}
            </button>
        </div>
    );
};

export default SocialButtons;
