import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PaymentNetworkModal from '../../components/nft/PaymentNetworkModal';
import ConfirmPurchaseModal from '../../components/nft/ConfirmPurchaseModal';
import PurchaseSuccessfulModal from '../../components/nft/PurchaseSuccessfulModal';
import './index.css';

const NFTDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const passedNft = location?.state?.nft;
    const [activeTab, setActiveTab] = useState('Details');
    const [liked, setLiked] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [transactionDetails, setTransactionDetails] = useState(null);

    // Ensure only one modal is open at a time
    useEffect(() => {
        const openModals = [isPaymentModalOpen, isConfirmModalOpen, isSuccessModalOpen].filter(Boolean).length;
        if (openModals > 1) {
            console.warn('Multiple modals are open simultaneously. This should not happen.');
        }
    }, [isPaymentModalOpen, isConfirmModalOpen, isSuccessModalOpen]);

    // Mock NFT data - in real app, this would come from API
    const fallbackData = {
        id: parseInt(id),
        title: 'Layla Banks',
        description: 'Introducing A Legendary Dragon Card That Embodies Power And Mystique! This Exclusive NFT Not Only Boasts Breathtaking Artwork But Also Unlocks Exclusive Benefits In The Seka Svara Card Game. As A Prized Member Of The Dragon Collection, It Offers Unique Magical Properties That Set It Apart From The Rest.',
        image: '/src/assets/images/NFT-images/nft-1.jpg', // This would be dynamic based on ID
        creator: {
            name: 'CryptoArtist',
            avatar: 'C',
            verified: true,
            level: 29
        },
        owner: {
            name: 'DragonLord',
            avatar: 'D',
            level: 15
        },
        price: {
            current: 850,
            original: 1200,
            usd: 867
        },
        stats: {
            likes: 687,
            views: 2100,
            created: '9/24/2025'
        },
        collection: {
            name: 'Dragon Legends',
            totalItems: 10000,
            floorPrice: 450
        },
        history: [
            {
                type: 'Sale',
                icon: '🟢',
                from: 'CryptoArtist',
                to: 'DragonLord',
                price: '850 USDT',
                date: '9/25/2025'
            },
            {
                type: 'Listed',
                icon: '⭐',
                from: 'DragonLord',
                to: null,
                price: '850 USDT',
                date: '9/25/2025'
            },
            {
                type: 'Transfer',
                icon: '👤',
                from: 'CryptoArtist',
                to: 'DragonLord',
                price: '850 USDT',
                date: '9/23/2025'
            },
            {
                type: 'Minted',
                icon: '🟣',
                from: 'CryptoArtist',
                to: null,
                price: null,
                date: '9/20/2025'
            }
        ]
    };

    const normalizedFromState = passedNft ? {
        id: passedNft.id ?? parseInt(id),
        title: passedNft.title || passedNft.name || 'Untitled NFT',
        description: passedNft.description || passedNft.details || 'No description provided.',
        image: passedNft.image || passedNft.img || passedNft.thumbnail || '/src/assets/images/NFT-images/nft-1.jpg',
        creator: {
            name: passedNft.creator?.name || passedNft.author || 'Unknown',
            avatar: (passedNft.creator && passedNft.creator.avatar) ? passedNft.creator.avatar[0] : 'U',
            verified: !!passedNft.creator?.verified,
            level: passedNft.creator?.level || 1
        },
        owner: {
            name: passedNft.owner?.name || passedNft.owner || 'Unknown',
            avatar: (passedNft.owner && passedNft.owner.avatar) ? passedNft.owner.avatar[0] : 'U',
            level: passedNft.owner?.level || 1
        },
        price: {
            current: passedNft.price?.current || passedNft.currentPrice || passedNft.price || fallbackData.price.current,
            original: passedNft.price?.original || passedNft.originalPrice || fallbackData.price.original,
            usd: passedNft.price?.usd || passedNft.usd || fallbackData.price.usd
        },
        stats: {
            likes: passedNft.likes || fallbackData.stats.likes,
            views: passedNft.views || fallbackData.stats.views,
            created: passedNft.created || fallbackData.stats.created
        },
        collection: {
            name: passedNft.collection?.name || passedNft.collectionName || fallbackData.collection.name,
            totalItems: passedNft.collection?.totalItems || passedNft.totalItems || fallbackData.collection.totalItems,
            floorPrice: passedNft.collection?.floorPrice || passedNft.floorPrice || fallbackData.collection.floorPrice
        },
        history: fallbackData.history
    } : null;

    const nftData = normalizedFromState || fallbackData;

    const handleBackToMarketplace = () => {
        navigate('/marketplace');
    };

    const handleBuyNow = () => {
        setIsPaymentModalOpen(true);
    };

    const handlePaymentContinue = (network, totalAmount) => {
        console.log('Payment network selected:', network);
        console.log('Total amount:', totalAmount);
        setSelectedNetwork(network);
        
        // Show transition state
        setIsTransitioning(true);
        setIsPaymentModalOpen(false);
        
        // Use setTimeout to ensure smooth transition between modals
        setTimeout(() => {
            setIsTransitioning(false);
            setIsConfirmModalOpen(true);
        }, 200);
    };

    const handleClosePaymentModal = () => {
        closeAllModals();
    };

    const handleConfirmPurchase = (network, totalAmount) => {
        console.log('Confirming purchase for NFT:', nftData.id);
        console.log('Network:', network);
        console.log('Total amount:', totalAmount);
        
        // Simulate transaction processing
        const mockTransactionDetails = {
            totalAmount: totalAmount,
            network: network,
            hash: '0xe022a3ef...3ef66e89'
        };
        
        setTransactionDetails(mockTransactionDetails);
        
        // Show transition state
        setIsTransitioning(true);
        setIsConfirmModalOpen(false);
        
        // Use setTimeout to ensure smooth transition between modals
        setTimeout(() => {
            setIsTransitioning(false);
            setIsSuccessModalOpen(true);
        }, 200);
    };

    const handleCloseConfirmModal = () => {
        closeAllModals();
    };

    const handleCloseSuccessModal = () => {
        closeAllModals();
    };

    // Function to close all modals
    const closeAllModals = () => {
        setIsPaymentModalOpen(false);
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(false);
        setIsTransitioning(false);
        setTransactionDetails(null);
        setSelectedNetwork('');
    };

    const handleAddToWishlist = () => {
        setLiked(!liked);
        // Handle wishlist logic
        console.log('Wishlist toggled for NFT:', nftData.id);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Attributes':
                return (
                    <div className="tab-content">
                        <div className="attributes-grid">
                            <div className="attribute-card">
                                <div className="attribute-label">Rarity</div>
                                <div className="attribute-value">Legendary</div>
                            </div>
                            <div className="attribute-card">
                                <div className="attribute-label">Power</div>
                                <div className="attribute-value">95</div>
                            </div>
                            <div className="attribute-card">
                                <div className="attribute-label">Magic</div>
                                <div className="attribute-value">88</div>
                            </div>
                            <div className="attribute-card">
                                <div className="attribute-label">Element</div>
                                <div className="attribute-value">Fire</div>
                            </div>
                            <div className="attribute-card">
                                <div className="attribute-label">Type</div>
                                <div className="attribute-value">Dragon</div>
                            </div>
                            <div className="attribute-card">
                                <div className="attribute-label">Generation</div>
                                <div className="attribute-value">Gen 1</div>
                            </div>
                        </div>
                    </div>
                );
            case 'History':
                return (
                    <div className="tab-content">
                        <h3>Price History</h3>
                        <div className="history-chart">
                            <p>Price chart would be displayed here</p>
                        </div>
                    </div>
                );
            case 'Details':
                return (
                    <div className="tab-content">
                        <h3>Ownership History</h3>
                        <div className="ownership-history">
                            {nftData.history.map((item, index) => (
                                <div key={index} className="history-item">
                                    <div className="history-icon">{item.icon}</div>
                                    <div className="history-details">
                                        <div className="history-action">
                                            {item.type} {item.to ? `From ${item.from} To ${item.to}` : `From ${item.from}`}
                                            {item.price && ` ${item.price}`}
                                        </div>
                                        <div className="history-date">{item.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Activity':
                return (
                    <div className="tab-content">
                        <h3>Recent Activity</h3>
                        <div className="activity-list">
                            <p>Recent activity would be displayed here</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="nft-detail-page">
            <div className="nft-detail-container">
                {/* Back Navigation */}
                <div className="back-navigation">
                    <button className="back-button" onClick={handleBackToMarketplace}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5"/>
                            <polyline points="12,19 5,12 12,5"/>
                        </svg>
                        Back to Marketplace
                    </button>
                </div>

                {/* Main Content */}
                <div className="nft-detail-content">
                    {/* Left Side - NFT Image */}
                    <div className="nft-image-section">
                        <div className="main-image-container">
                            <img src={nftData.image} alt={nftData.title} className="main-nft-image" />
                            <button 
                                className={`like-button ${liked ? 'liked' : ''}`}
                                onClick={handleAddToWishlist}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                                {nftData.stats.likes}
                            </button>
                        </div>
                        <div className="thumbnail-images">
                            <img src={nftData.image} alt="Thumbnail 1" className="thumbnail" />
                            <img src={nftData.image} alt="Thumbnail 2" className="thumbnail" />
                            <img src={nftData.image} alt="Thumbnail 3" className="thumbnail" />
                            <img src={nftData.image} alt="Thumbnail 4" className="thumbnail" />
                        </div>
                    </div>

                    {/* Right Side - NFT Details */}
                    <div className="nft-info-section">
                        <div className="nft-header">
                            <h1 className="nft-title">{nftData.title}</h1>
                            <p className="nft-description">{nftData.description}</p>
                        </div>

                        <div className="nft-stats">
                            <div className="nft-stat-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                                <span>{nftData.stats.likes} likes</span>
                            </div>
                            <div className="nft-stat-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                <span>{nftData.stats.views} views</span>
                            </div>
                            <div className="nft-stat-item">
                                <span>Created {nftData.stats.created}</span>
                            </div>
                        </div>

                        <div className="creator-owner-info">
                            <div className="info-section">
                                <h4>Creator</h4>
                                <div className="user-info">
                                    <div className="user-avatar">{nftData.creator.avatar}</div>
                                    <div className="user-details">
                                        <span className="user-name">
                                            {nftData.creator.name}
                                            {nftData.creator.verified && <span className="verified">✓</span>}
                                        </span>
                                        <span className="user-level">Level {nftData.creator.level}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="info-section">
                                <h4>Owner</h4>
                                <div className="user-info">
                                    <div className="user-avatar">{nftData.owner.avatar}</div>
                                    <div className="user-details">
                                        <span className="user-name">{nftData.owner.name}</span>
                                        <span className="user-level">Level {nftData.owner.level}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="price-section">
                            <h4>Current Price</h4>
                            <div className="price-display">
                                <div className="current-price">
                                    <span className="price-amount">{nftData.price.current} USDT</span>
                                    <span className="original-price">{nftData.price.original} USDT</span>
                                </div>
                                <div className="usd-price">≈ ${nftData.price.usd} USD</div>
                            </div>
                            
                            <div className="action-buttons">
                                <button className="buy-now-button" onClick={handleBuyNow}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="9" cy="21" r="1"/>
                                        <circle cx="20" cy="21" r="1"/>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                    </svg>
                                    Buy Now
                                </button>
                                <button className="wishlist-button" onClick={handleAddToWishlist}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                    Add To Wish List
                                </button>
                            </div>
                        </div>

                        <div className="collection-info">
                            <h4>Collection</h4>
                            <div className="collection-details">
                                <div className="collection-item">
                                    <span className="collection-label">Name:</span>
                                    <span className="collection-value">{nftData.collection.name}</span>
                                </div>
                                <div className="collection-item">
                                    <span className="collection-label">Total Items:</span>
                                    <span className="collection-value">{nftData.collection.totalItems.toLocaleString()}</span>
                                </div>
                                <div className="collection-item">
                                    <span className="collection-label">Floor Price:</span>
                                    <span className="collection-value">{nftData.collection.floorPrice} USDT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Tabs */}
                <div className="tabs-section">
                    <div className="tabs-header">
                        <button 
                            className={`tab-button ${activeTab === 'Attributes' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Attributes')}
                        >
                            Attributes
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'History' ? 'active' : ''}`}
                            onClick={() => setActiveTab('History')}
                        >
                            History
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'Details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Details')}
                        >
                            Details
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'Activity' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Activity')}
                        >
                            Activity
                        </button>
                    </div>
                    <div className="tabs-content">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Payment Network Modal */}
            <PaymentNetworkModal
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                nftData={nftData}
                onContinue={handlePaymentContinue}
            />

            {/* Confirm Purchase Modal */}
            <ConfirmPurchaseModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmModal}
                nftData={nftData}
                selectedNetwork={selectedNetwork}
                onConfirm={handleConfirmPurchase}
            />

            {/* Purchase Successful Modal */}
            <PurchaseSuccessfulModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
                nftData={nftData}
                transactionDetails={transactionDetails}
            />

            {/* Transition Loading Indicator */}
            {isTransitioning && (
                <div className="transition-loading">
                    <div className="loading-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default NFTDetail;
