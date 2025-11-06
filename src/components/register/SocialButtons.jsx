import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../contexts/AuthContext';

const SocialButtons = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const idToken = credentialResponse?.credential;
            
            if (!idToken) {
                throw new Error('No Google credential received');
            }
            
            // Basic token validation
            if (typeof idToken !== 'string' || !idToken.includes('.')) {
                throw new Error('Invalid token format');
            }
            
            const response = await loginWithGoogle(idToken);
            
            if (window.showToast) {
                window.showToast('Google registration successful!', 'success', 3000);
            }
            
            // Navigate to the intended destination or home page
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Google OAuth error:', err);
            if (window.showToast) {
                window.showToast(err.message || 'Google registration failed', 'error', 5000);
            }
        }
    };

    const handleGoogleError = (error) => {
        console.error('Google OAuth error:', error);
        
        let errorMessage = 'Google registration failed';
        if (error.error === 'popup_closed_by_user') {
            errorMessage = 'Registration was cancelled';
        } else if (error.error === 'access_denied') {
            errorMessage = 'Access denied by user';
        }
        
        if (window.showToast) {
            window.showToast(errorMessage, 'error', 4000);
        }
    };

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '485100795433-qcoglh1idiih80k2ptc49g2fuv526lqo.apps.googleusercontent.com';

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={true}
                    text="signup_with"
                    shape="rectangular"
                    theme="outline"
                    size="large"
                    width="100%"
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default SocialButtons;
