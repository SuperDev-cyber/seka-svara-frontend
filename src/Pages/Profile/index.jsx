import React from 'react';
import './index.css';
import ProfileHeader from '../../components/profile/ProfileHeader';
import UserProfileCard from '../../components/profile/UserProfileCard';
import AchievementsCard from '../../components/profile/AchievementsCard';
import BalanceCard from '../../components/profile/BalanceCard';
import TransactionCard from '../../components/profile/TransactionCard';

const Profile = () => {
    return (
        <div className='profile-page'>
            <div className='profile-container'>
                <ProfileHeader />
                
                <div className='profile-content'>
                    {/* Left Column - User Profile and Achievements */}
                    <div className='profile-left'>
                        <UserProfileCard />
                        <AchievementsCard />
                    </div>

                    {/* Right Column - Wallet Balance and Transaction History */}
                    <div className='profile-right'>
                        <BalanceCard />
                        <TransactionCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
