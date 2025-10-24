import React from 'react';
import HeroSection from '../../components/support/HeroSection/index';
import MainContent from '../../components/support/MainContent/index';
import Sidebar from '../../components/support/Sidebar/index';
import './index.css';

const Support = () => {
    return (
        <div className="support-page">
            <div className="support-container">
                <HeroSection />
                
                <div className="support-layout">
                    <MainContent />
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default Support;


