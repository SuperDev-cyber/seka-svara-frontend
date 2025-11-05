import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import crown from '../../../assets/icon/crown.png';

const UserProfileCard = () => {
    const { user, refreshUserProfile } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'Member Since Recently';
        const date = new Date(dateString);
        return `Member Since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    };

    const calculateWinRate = (gamesPlayed, gamesWon) => {
        if (!gamesPlayed || gamesPlayed === 0) return '0%';
        return `${Math.round((gamesWon / gamesPlayed) * 100)}%`;
    };

    const getPlayerRank = (totalWinnings) => {
        if (totalWinnings >= 10000) return 'Diamond Player';
        if (totalWinnings >= 5000) return 'Platinum Player';
        if (totalWinnings >= 1000) return 'Gold Player';
        if (totalWinnings >= 500) return 'Silver Player';
        return 'Bronze Player';
    };

    const getRankBadgeColor = (totalWinnings) => {
        if (totalWinnings >= 10000) return '#00D4FF'; // Diamond
        if (totalWinnings >= 5000) return '#8B5CF6'; // Platinum
        if (totalWinnings >= 1000) return '#FFD700'; // Gold
        if (totalWinnings >= 500) return '#C0C0C0'; // Silver
        return '#CD7F32'; // Bronze
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📷 Starting image upload');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('File:', file);
        
        if (!file) {
            console.log('❌ No file selected');
            return;
        }

        console.log('📁 File details:');
        console.log('   Name:', file.name);
        console.log('   Type:', file.type);
        console.log('   Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error('❌ Invalid file type:', file.type);
            alert('Please select an image file (JPG, PNG, GIF, etc.)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            console.error('❌ File too large:', (file.size / 1024 / 1024).toFixed(2), 'MB');
            alert('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        console.log('⏳ Setting upload state to true...');

        try {
            // Convert image to base64
            console.log('🔄 Converting image to base64...');
            const reader = new FileReader();
            
            reader.onerror = () => {
                console.error('❌ FileReader error');
                alert('Error reading file. Please try again.');
                setIsUploading(false);
            };
            
            reader.onloadend = async () => {
                try {
                    const base64Image = reader.result;
                    console.log('✅ Image converted to base64');
                    console.log('   Length:', base64Image.length, 'characters');
                    console.log('   Preview:', base64Image.substring(0, 50) + '...');

                    // Send to backend using API service (which includes /api/v1 prefix)
                    console.log('📤 Sending PUT request to backend...');
                    const response = await apiService.updateUserProfile({ avatar: base64Image });

                    console.log('✅ Backend response:', response);

                    if (response) {
                        // Refresh user profile to get updated avatar
                        console.log('🔄 Refreshing user profile...');
                        await refreshUserProfile();
                        
                        console.log('✅ Profile image updated successfully!');
                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        
                        alert('✅ Profile image updated successfully!');
                        setShowUploadModal(false);
                    }
                } catch (uploadError) {
                    console.error('❌ Upload error:', uploadError);
                    console.error('   Error message:', uploadError.message);
                    console.error('   Error response:', uploadError.response?.data);
                    alert('Failed to upload image: ' + (uploadError.response?.data?.message || uploadError.message));
                } finally {
                    setIsUploading(false);
                }
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('❌ Unexpected error:', error);
            alert('Failed to upload image. Please try again.');
            setIsUploading(false);
        }
    };

    return (
        <div className='profile-card'>
            <div className='profile-crown'>
                <img src={crown} alt='crown' />
            </div>
            
            {/* ✅ Avatar Display */}
            <div 
                className='profile-avatar' 
                onClick={() => setShowUploadModal(true)}
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '20px auto',
                    cursor: 'pointer',
                    border: '4px solid ' + getRankBadgeColor(user?.totalWinnings || 0),
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    position: 'relative',
                    background: user?.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                {user?.avatar ? (
                    <img 
                        src={user.avatar} 
                        alt='Profile' 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: '#fff',
                    }}>
                        {(user?.username || 'G')[0].toUpperCase()}
                    </div>
                )}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px',
                    fontSize: '10px',
                    textAlign: 'center',
                }}>
                    Click to change
                </div>
            </div>

            <h2 className='profile-name'>{user?.username || 'Guest User'}</h2>
            <p className='member-since'>{formatDate(user?.createdAt)}</p>
            
            <div className='profile-stats'>
                <div className='profile-stat-item'>
                    <span className='stat-number'>{user?.totalGamesPlayed || 0}</span>
                    <span className='stat-label'>Games Play</span>
                </div>
                <div className='profile-stat-item'>
                    <span className='stat-number'>{calculateWinRate(user?.totalGamesPlayed, user?.totalGamesWon)}</span>
                    <span className='stat-label'>Win Rate</span>
                </div>
                <div className='profile-stat-item'>
                    <span className='stat-number'>{user?.level || 1}</span>
                    <span className='stat-label'>Level</span>
                </div>
            </div>

            <div className='profile-divider'></div>

            <div className='total-winnings'>
                <div className='winnings-left'>
                    <span className='winnings-label'>Total Winnings</span>
                    <span className='winnings-rank'>Rank</span>
                </div>
                <div className='winnings-right'>
                    <span className='winnings-amount'>+{user?.totalWinnings || 0}</span>
                    <span 
                        className='winnings-badge'
                        style={{ color: getRankBadgeColor(user?.totalWinnings || 0) }}
                    >
                        {getPlayerRank(user?.totalWinnings || 0)}
                    </span>
                </div>
            </div>

            <button className='edit-profile-btn' onClick={() => setShowUploadModal(true)}>
                Edit Profile
            </button>

            {/* ✅ Upload Modal */}
            {showUploadModal && (
                <div 
                    className='upload-modal-overlay'
                    onClick={() => setShowUploadModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                    }}
                >
                    <div 
                        className='upload-modal'
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(135deg, #1a2332 0%, #12192a 100%)',
                            borderRadius: '20px',
                            padding: '40px',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                            border: '2px solid rgba(76, 175, 80, 0.3)',
                        }}
                    >
                        <h3 style={{
                            color: '#fff',
                            marginBottom: '20px',
                            textAlign: 'center',
                            fontSize: '24px',
                        }}>
                            Upload Profile Image
                        </h3>

                        <div style={{
                            textAlign: 'center',
                            marginBottom: '30px',
                        }}>
                            {user?.avatar && (
                                <div style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    margin: '0 auto 20px',
                                    border: '4px solid ' + getRankBadgeColor(user?.totalWinnings || 0),
                                }}>
                                    <img 
                                        src={user.avatar} 
                                        alt='Current avatar' 
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                            )}
                            <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                                Select an image file (max 5MB)
                            </p>
                        </div>

                        <label 
                            htmlFor='avatar-upload'
                            style={{
                                display: 'block',
                                padding: '15px 30px',
                                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                color: 'white',
                                borderRadius: '10px',
                                cursor: isUploading ? 'not-allowed' : 'pointer',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                marginBottom: '15px',
                                opacity: isUploading ? 0.6 : 1,
                            }}
                        >
                            {isUploading ? 'Uploading...' : 'Choose Image'}
                        </label>
                        <input 
                            id='avatar-upload'
                            type='file'
                            accept='image/*'
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            style={{ display: 'none' }}
                        />

                        <button 
                            onClick={() => setShowUploadModal(false)}
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: 'transparent',
                                border: '2px solid #666',
                                color: '#fff',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileCard;
