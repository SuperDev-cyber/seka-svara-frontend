import React from 'react';
import NFTCard from '../NFTCard';

const NFTGrid = ({ nfts }) => {
    return (
        <div className='nft-grid'>
            {nfts.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
            ))}
        </div>
    );
};

export default NFTGrid;
