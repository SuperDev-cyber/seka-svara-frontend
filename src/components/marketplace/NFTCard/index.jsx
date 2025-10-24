import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../../../assets/images/NFT-images/nft-demo-avatar.jpg';
import ethereumIcon from '../../../assets/images/ethereum.png';

const NFTCard = ({ nft }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/nft/${nft.id}` , { state: { nft } });
    };

    const handleBuyNowClick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking buy button
        navigate(`/nft/${nft.id}`, { state: { nft } });
    };

    return (
        <div className='nft-card' onClick={handleCardClick}>
            <div className='nft-image-container'>
                <img src={nft.image} alt={nft.title} className='nft-image' />
                <div className='nft-likes'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>{nft.likes > 1000 ? `${(nft.likes / 1000).toFixed(1)}k` : nft.likes}</span>
                </div>
            </div>
            <div className='nft-details'>
                <div className='creator-info'>
                    <div className='creator-avatar'>
                        <img src={avatarImage} alt="Creator" />
                    </div>
                    <div className='creator-details'>
                        <h3 className='nft-title'>{nft.title}</h3>
                        <p className='creator-handle'>By @{nft.creator}</p>
                    </div>
                </div>
                <div className='price-info'>
                    {nft.onSale && (
                        <div className='on-sale'>
                            <span>On Sale 🔥</span>
                        </div>
                    )}
                    <div className='price-details'>
                        <div className='eth-price-container'>
                            <img src={ethereumIcon} alt="Ethereum" className='ethereum-icon' />
                            <span className='eth-price'>{nft.price} ETH</span>
                        </div>
                        <span className='usd-price'>({nft.usdPrice})</span>
                    </div>
                </div>
                <button className='buy-now-btn' onClick={handleBuyNowClick}>Buy Now</button>
            </div>
        </div>
    );
};

export default NFTCard;
