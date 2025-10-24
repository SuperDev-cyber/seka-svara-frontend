import React from 'react';
import './index.css';
import HeroLeft from '../../components/home/HeroLeft';
import ReviewSection from '../../components/home/ReviewSection';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import LiveGameTables from '../../components/home/LiveGameTables';
import TopWinners from '../../components/home/TopWinners';
import CallToAction from '../../components/home/CallToAction';

const Home = () => {
    return (
        <div className='home-page'>
            <div className='home-container'>
                <div className='home-content'>
                    <HeroLeft />
                </div>
                <ReviewSection />
            </div>
            <HowItWorksSection />
            <LiveGameTables />
            <TopWinners />
            <CallToAction />
        </div>
    );
};

export default Home;