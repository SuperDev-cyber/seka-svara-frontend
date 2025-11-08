import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSafeAuth } from '../../contexts/SafeAuthContext';
import { useAuth } from '../../contexts/AuthContext';
// apiService no longer needed - using AuthContext functions instead

const SocialButtons = () => {
    const { 
        loginWithGoogle: safeAuthLoginGoogle, 
        loginWithWallet: safeAuthLoginWallet, 
        loggedIn: safeAuthLoggedIn,
        loading: safeAuthLoading,
        initError: safeAuthInitError
    } = useSafeAuth();
    const { login, register, refreshUserProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';
    
    // Disable buttons if SafeAuth is still loading or has initialization errors
    const isDisabled = loading || safeAuthLoading || safeAuthLoggedIn || !!safeAuthInitError;
  
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
            
            // Use consistent password for Web3Auth users
            const web3AuthPassword = 'Web3Auth_Default_Password_2024';
            
            // Register/Login with backend using AuthContext functions
            // This ensures AuthContext state is properly updated
            try {
                // Try to login first (user might already exist)
                try {
                    await login({
                        email: email,
                        password: web3AuthPassword, // Consistent password for Web3Auth users
                    });
                    
                    // Refresh user profile to ensure UI updates
                    if (refreshUserProfile) {
                        await refreshUserProfile();
                    }
                    
                    if (window.showToast) {
                        window.showToast('Login successful!', 'success', 3000);
                    }
                    navigate(from, { replace: true });
                    return;
                } catch (loginError) {
                    // User doesn't exist, try to register
                    console.log('Login failed, trying to register...', loginError);
                }

                // Register new user with consistent password
                const username = email.split('@')[0] + '_' + Date.now().toString().substring(10);
                
                await register({
                    username: username,
                    email: email,
                    password: web3AuthPassword, // Use same password for consistency
                    confirmPassword: web3AuthPassword,
                });

                // Refresh user profile to ensure UI updates
                if (refreshUserProfile) {
                    await refreshUserProfile();
                }

                if (window.showToast) {
                    window.showToast('Registration successful!', 'success', 3000);
                }
                navigate(from, { replace: true });
            } catch (authError) {
                console.error('Authentication error:', authError);
                // If registration fails because user exists, try login again
                if (authError.message?.includes('already exists') || authError.response?.status === 409) {
                    try {
                        await login({
                            email: email,
                            password: web3AuthPassword,
                        });
                        
                        if (refreshUserProfile) {
                            await refreshUserProfile();
                        }
                        
                        if (window.showToast) {
                            window.showToast('Login successful!', 'success', 3000);
                        }
                        navigate(from, { replace: true });
                        return;
                    } catch (retryLoginError) {
                        console.error('Retry login also failed:', retryLoginError);
                    }
                }
                throw new Error('Failed to authenticate with backend');
            }
        } catch (err) {
            console.error('SafeAuth Google login error:', err);
            if (window.showToast) {
                window.showToast(err.message || 'Google sign-in failed', 'error', 5000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSafeAuthWallet = async () => {
        try {
            setLoading(true);
            
            // Login with SafeAuth (Web3Auth) - opens modal with Google and wallet options
            const result = await safeAuthLoginWallet();
            
            if (!result) {
                throw new Error('Failed to connect with SafeAuth');
            }

            // Get user info - could be from Google login or wallet
            const userEmail = result.user?.email || result.user?.name || null;
            const walletAddress = result.address;
            
            // Determine identifier: prefer email (from Google) over wallet address
            const identifier = userEmail || `${walletAddress}@wallet.local`;
            const isGoogleLogin = !!userEmail;
            
            // Use consistent password for Web3Auth users
            // This ensures login works even if user was previously registered
            const web3AuthPassword = 'Web3Auth_Default_Password_2024';
            
            // Register/Login with backend using AuthContext functions
            // This ensures AuthContext state is properly updated
            try {
                // Try to login first (user might already exist)
                try {
                    await login({
                        email: identifier,
                        password: web3AuthPassword, // Consistent password for Web3Auth users
                    });
                    
                    // Refresh user profile to ensure UI updates
                    if (refreshUserProfile) {
                        await refreshUserProfile();
                    }
                    
                    if (window.showToast) {
                        window.showToast('Login successful!', 'success', 3000);
                    }
                    navigate(from, { replace: true });
                    return;
                } catch (loginError) {
                    console.log('Login failed, trying to register...', loginError);
                }

                // Register new user with consistent password
                const email = identifier;
                const username = isGoogleLogin 
                    ? (userEmail.split('@')[0] + '_' + Date.now().toString().substring(10))
                    : `wallet_${walletAddress.substring(2, 10)}_${Date.now().toString().substring(10)}`;
                
                await register({
                    username: username,
                    email: email,
                    password: web3AuthPassword, // Use same password for consistency
                    confirmPassword: web3AuthPassword,
                });

                // Refresh user profile to ensure UI updates
                if (refreshUserProfile) {
                    await refreshUserProfile();
                }

                if (window.showToast) {
                    window.showToast('Registration successful!', 'success', 3000);
                }
                navigate(from, { replace: true });
            } catch (authError) {
                console.error('Authentication error:', authError);
                // If registration fails because user exists, try login again
                if (authError.message?.includes('already exists') || authError.response?.status === 409) {
                    try {
                        await login({
                            email: identifier,
                            password: web3AuthPassword,
                        });
                        
                        if (refreshUserProfile) {
                            await refreshUserProfile();
                        }
                        
                        if (window.showToast) {
                            window.showToast('Login successful!', 'success', 3000);
                        }
                        navigate(from, { replace: true });
                        return;
                    } catch (retryLoginError) {
                        console.error('Retry login also failed:', retryLoginError);
                        // If user exists but password doesn't match, they might have an old random password
                        // Show helpful error message
                        const errorMsg = retryLoginError.message?.includes('Invalid credentials') 
                            ? 'Account exists but authentication failed. Please contact support or use password reset.'
                            : 'Failed to authenticate with existing account';
                        throw new Error(errorMsg);
                    }
                }
                throw new Error('Failed to authenticate with backend');
            }
        } catch (err) {
            console.error('SafeAuth login error:', err);
            if (window.showToast) {
                window.showToast(err.message || 'Sign-in failed', 'error', 5000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {safeAuthInitError && (
                <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#fee', 
                    border: '1px solid #fcc', 
                    borderRadius: '4px',
                    color: '#c33',
                    fontSize: '12px',
                    marginBottom: '8px'
                }}>
                    ⚠️ {safeAuthInitError}
                </div>
            )}
            {safeAuthLoading && (
                <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#eef', 
                    border: '1px solid #ccf', 
                    borderRadius: '4px',
                    color: '#33c',
                    fontSize: '12px',
                    marginBottom: '8px'
                }}>
                    🔄 Initializing Web3Auth...
                </div>
            )}
            {/* Removed standalone Google button - Google login is available in the Web3Auth modal */}
            <button
                onClick={handleSafeAuthWallet}
                disabled={isDisabled}
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
                {loading || safeAuthLoading ? (
                    <>🔄 {safeAuthLoading ? 'Initializing...' : 'Connecting...'}</>
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="6" width="20" height="12" rx="2"/>
                            <path d="M6 10h.01M10 10h.01"/>
                        </svg>
                        Sign in with Wallet or Google
                    </>
                )}
            </button>
        </div>
    );
};

export default SocialButtons;
