import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Divider from './Divider.jsx';
import SocialButtons from './SocialButtons.jsx';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { register, clearError } = useAuth();
    const navigate = useNavigate();

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

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters long');
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            setError('Username can only contain letters, numbers, and underscores');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(formData.password)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, and one number or special character');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!agreedToTerms) {
            setError('You must agree to the terms of service');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await register(formData);
            // Show success toast
            if (window.showToast) {
                window.showToast('Registration successful! Welcome to Seka Svara!', 'success', 4000);
            }
            navigate('/');
        } catch (error) {
            const errorMessage = error.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            // Show error toast
            if (window.showToast) {
                window.showToast(errorMessage, 'error', 5000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='register-form'>
            <h3>Get started for Free</h3>
            
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
                    <label htmlFor='username'>Username</label>
                    <input 
                        type='text' 
                        id='username' 
                        name='username'
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder='Enter username'
                        className='form-input'
                        required
                        disabled={isLoading}
                    />
                </div>
            
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
                            onClick={() => togglePasswordVisibility('password')}
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

                <div className='form-group'>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <div className='password-container'>
                        <input 
                            type={showConfirmPassword ? 'text' : 'password'}
                            id='confirmPassword' 
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder='Confirm password'
                            className='form-input'
                            required
                            disabled={isLoading}
                        />
                        <button 
                            type='button'
                            className='password-toggle'
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
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
                                {showConfirmPassword ? (
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

                <div className='form-group checkbox-group'>
                    <label className='checkbox-label'>
                        <input 
                            type='checkbox' 
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            disabled={isLoading}
                        />
                        <span className='checkmark'></span>
                        I agree to the <a href='#' className='link'>terms of service</a>
                    </label>
                </div>

                <button 
                    type='submit' 
                    className='signup-btn'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className='spinner-small'></div>
                            Creating Account...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>
            </form>

            <p className='login-text'>
                Already have an account? <Link to='/login' className='link'>Login</Link>
            </p>

            <Divider />
            <SocialButtons />
        </div>
    );
};

export default RegisterForm;
