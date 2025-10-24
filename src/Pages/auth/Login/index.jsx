import React from 'react';
import './index.css';
import LoginHeader from '../../../components/login/LoginHeader.jsx';
import WelcomeTitle from '../../../components/login/WelcomeTitle.jsx';
import LoginForm from '../../../components/login/LoginForm.jsx';
import Footer from '../../../components/login/Footer.jsx';

const Login = () => {
    return (
        <div className='login-page'>
            <div className='login-container'>
                <LoginHeader />
                <div className='login-body'>
                    <WelcomeTitle />
                    <LoginForm />
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Login
