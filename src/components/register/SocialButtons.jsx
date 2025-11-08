import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';

const SocialButtons = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                throw new Error('No credential received from Google');
            }

            // Use AuthContext's loginWithGoogle which handles backend authentication
            await loginWithGoogle(credentialResponse.credential);
            
            if (window.showToast) {
                window.showToast('Registration successful!', 'success', 3000);
            }
            
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Google registration error:', error);
            if (window.showToast) {
                window.showToast(error.message || 'Google sign-up failed', 'error', 5000);
            }
        }
    };

    const handleGoogleError = () => {
        if (window.showToast) {
            window.showToast('Google sign-up was cancelled', 'info', 3000);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <div className='google-login-container'>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                />
            </div>
        </div>
    );
};

export default SocialButtons;
