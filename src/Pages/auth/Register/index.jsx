import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import RegisterHeader from '../../../components/register/RegisterHeader.jsx';
import WelcomeTitle from '../../../components/register/WelcomeTitle.jsx';
import RegisterForm from '../../../components/register/RegisterForm.jsx';
import Footer from '../../../components/register/Footer.jsx';

const Register = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/')
    };

    return (
        <div className='register-page'>
            <div className='register-container'>
                <RegisterHeader />
                <div className='register-body'>
                    <button className='back-button' onClick={handleBackClick}>
                        <div className='back-icon-circle'>
                            <svg className='back-icon' width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                        </div>
                        <span className='back-text'>Back</span>
                    </button>
                    <WelcomeTitle />
                    <RegisterForm />
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Register