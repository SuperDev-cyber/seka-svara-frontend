import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import ToastContainer from '../../../components/common/ToastContainer';
import './index.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // ✅ SPECIAL: Auto-create admin account if using master admin credentials
            const MASTER_ADMIN_EMAIL = 'superadmin@seka.com';
            const MASTER_ADMIN_PASSWORD = 'Kingtiger19990427!';
            
            if (formData.email === MASTER_ADMIN_EMAIL && formData.password === MASTER_ADMIN_PASSWORD) {
                console.log('🔑 Master admin credentials detected - clearing old tokens');
                
                // ✅ CRITICAL: Clear ALL stored tokens to avoid refresh token conflicts
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                sessionStorage.clear();
                
                console.log('✅ Old tokens cleared - attempting fresh login');
                
                try {
                    // Try to login first
                    const response = await login(formData);
                    
                    if (response.user.role === 'admin') {
                        console.log('✅ Master admin login successful');
                        if (window.showToast) {
                            window.showToast('Admin login successful!', 'success', 3000);
                        }
                        navigate('/admin', { replace: true });
                        setIsLoading(false);
                        return;
                    }
                } catch (loginError) {
                    // If login fails (user doesn't exist), auto-register
                    console.log('📝 Master admin not found - auto-registering...');
                    
                    try {
                        await register({
                            username: 'admin',
                            email: MASTER_ADMIN_EMAIL,
                            password: MASTER_ADMIN_PASSWORD,
                            confirmPassword: MASTER_ADMIN_PASSWORD
                        });
                        
                        console.log('✅ Master admin account created - logging in...');
                        
                        // Now login with the newly created account
                        const response = await login(formData);
                        
                        if (window.showToast) {
                            window.showToast('Admin account created and logged in!', 'success', 3000);
                        }
                        navigate('/admin', { replace: true });
                        setIsLoading(false);
                        return;
                    } catch (registerError) {
                        console.error('Failed to auto-register admin:', registerError);
                        // Fall through to normal login flow
                    }
                }
            }
            
            // Normal login flow for other users
            const response = await login(formData);
            
            // Check if user is admin
            if (response.user.role === 'admin') {
                console.log('✅ Admin login successful');
                if (window.showToast) {
                    window.showToast('Admin login successful!', 'success', 3000);
                }
                navigate('/admin', { replace: true });
            } else {
                setError('Access denied. Admin privileges required.');
                if (window.showToast) {
                    window.showToast('Access denied. Admin privileges required.', 'error', 5000);
                }
            }
        } catch (error) {
            const errorMessage = error.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            if (window.showToast) {
                window.showToast(errorMessage, 'error', 5000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="admin-login-container">
                <div className="admin-login-background">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <div className="admin-icon">
                            🎛️
                        </div>
                        <h1>Admin Panel</h1>
                        <p>Sign in to access the administration dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        {error && (
                            <div className="admin-error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <div className="admin-form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@sekasvara.com"
                                required
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="admin-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                        </div>

                        <button 
                            type="submit"
                            className="admin-login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    🔐 Sign In to Admin Panel
                                </>
                            )}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <button 
                            onClick={() => navigate('/')}
                            className="back-to-site-button"
                        >
                            ← Back to Main Site
                        </button>
                    </div>
                </div>

                <div className="admin-login-info">
                    <div className="info-badge">
                        <span className="badge-icon">🔒</span>
                        <span>Secure Admin Access</span>
                    </div>
                    <p className="info-text">
                        This area is restricted to authorized administrators only. 
                        All login attempts are monitored and logged.
                    </p>
                </div>
            </div>
        </div>
        </>
    );
};

export default AdminLogin;

