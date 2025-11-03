import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Divider from './Divider.jsx';
import SocialButtons from './SocialButtons.jsx';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) {
            setError('');
            clearError();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(formData);
            // Show success toast
            if (window.showToast) {
                window.showToast('Login successful! Welcome back!', 'success', 3000);
            }
            
            // Navigate to the intended destination or home page
            navigate(from, { replace: true });
        } catch (error) {
            const errorMessage = error.message || 'Login failed. Please try again.';
            setError(errorMessage);
            // Show error toast
            if (window.showToast) {
                window.showToast(errorMessage, 'error', 5000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // TODO: Implement forgot password modal/page
        console.log('Forgot password clicked');
    };

    return (
        <div className='login-form'>
            <h3>Login to Seka Svara</h3>
            
            {error && (
                <div className='error-message'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input 
                        type='email' 
                        id='email' 
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='Enter email address'
                        className='form-input'
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <div className='password-container'>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            id='password' 
                            name='password'
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder='Enter password'
                            className='form-input'
                            required
                            disabled={isLoading}
                        />
                        <button 
                            type='button'
                            className='password-toggle'
                            onClick={togglePasswordVisibility}
                            title={showPassword ? 'Hide password' : 'Show password'}
                            disabled={isLoading}
                        >
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                {showPassword ? (
                                    <>
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </>
                                ) : (
                                    <>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='forgot-password'>
                    <button 
                        type='button' 
                        onClick={handleForgotPassword}
                        className='forgot-password-link'
                    >
                        Forgot Password?
                    </button>
                </div>

                <button 
                    type='submit' 
                    className='login-btn'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className='spinner-small'></div>
                            Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>

            <p className='signup-text'>
                Don't have an account? <Link to='/register' className='link'>Sign Up</Link>
            </p>

            <Divider />
            <SocialButtons />
        </div>
    );
};

export default LoginForm;
