import React, { useState } from 'react';
import './index.css';

const PaymentNetworkModal = ({ isOpen, onClose, nftData, onContinue }) => {
    const [selectedNetwork, setSelectedNetwork] = useState('BEP20');

    const networks = [
        {
            id: 'BEP20',
            name: 'BEP20 (BSC)',
            label: 'Fast',
            labelColor: 'orange',
            icon: 'clock',
            gasFee: '~0.5 USDT'
        },
        {
            id: 'TRC20',
            name: 'TRC20 (TRON)',
            label: 'Low Fee',
            labelColor: 'yellow',
            icon: 'shield',
            gasFee: '~0.1 USDT'
        }
    ];

    const handleContinue = () => {
        const networkFee = selectedNetwork === 'BEP20' ? 0.5 : 0.1;
        const totalAmount = nftData.price.current + networkFee;
        onContinue(selectedNetwork, totalAmount);
    };

    if (!isOpen) return null;

    return (
        <div className="payment-modal-overlay" onClick={onClose}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="payment-modal-header">
                    <div className="payment-modal-title-section">
                        <h2 className="payment-modal-title">Select Payment Network</h2>
                        <p className="payment-modal-subtitle">Choose the network for your USDT payment</p>
                    </div>
                    <button className="payment-close-button" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18"/>
                            <path d="M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Item Details */}
                <div className="item-details">
                    <div className="item-thumbnail">
                        <img src={nftData.image} alt={nftData.title} />
                    </div>
                    <div className="item-info">
                        <h3 className="item-name">{nftData.title}</h3>
                        <p className="item-price">{nftData.price.current} USDT</p>
                    </div>
                </div>

                {/* Network Options */}
                <div className="network-options">
                    {networks.map((network) => (
                        <div
                            key={network.id}
                            className={`network-option ${selectedNetwork === network.id ? 'selected' : ''}`}
                            onClick={() => setSelectedNetwork(network.id)}
                        >
                            <div className="network-radio">
                                <div className={`radio-button ${selectedNetwork === network.id ? 'checked' : ''}`}>
                                    {selectedNetwork === network.id && <div className="radio-dot"></div>}
                                </div>
                            </div>
                            <div className="network-info">
                                <div className="network-header">
                                    <span className="network-name">{network.name}</span>
                                    <span className={`network-label ${network.labelColor}`}>
                                        {network.label}
                                    </span>
                                    <div className="network-icon">
                                        {network.icon === 'clock' ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="12" cy="12" r="10"/>
                                                <polyline points="12,6 12,12 16,14"/>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <p className="gas-fee">Gas Fee: {network.gasFee}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="payment-modal-actions">
                    <button className="payment-cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="payment-continue-button" onClick={handleContinue}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentNetworkModal;
