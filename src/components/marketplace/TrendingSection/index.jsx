import React from 'react';
import NFTGrid from '../NFTGrid';

const TrendingSection = ({ nfts }) => {
    return (
        <div className='trending-section'>
            <div className='section-header'>
                <h2 className='section-title'>Trending NFTs</h2>
                <p className='section-subtitle'>Hottest NFTs Right Now</p>
            </div>
            <NFTGrid nfts={nfts} />
        </div>
    );
};

export default TrendingSection;
