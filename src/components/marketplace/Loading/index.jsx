import React from 'react';
import './index.css';

const Loading = ({ message = "Loading NFTs..." }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default Loading;
