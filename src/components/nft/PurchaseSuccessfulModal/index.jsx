import React from 'react';
import './index.css';

const PurchaseSuccessfulModal = ({ isOpen, onClose, nftData, transactionDetails }) => {
    if (!isOpen) return null;

    const handleViewInWallet = () => {
        // Navigate to wallet or profile page
        console.log('Navigate to wallet');
        onClose();
    };

    return (
        <div className="success-modal-overlay" onClick={onClose}>
            <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="success-modal-header">
                    <div className="success-modal-title-section">
                        <h2 className="success-modal-title">Purchase Successful!</h2>
                        <p className="success-modal-subtitle">Your NFT has been transferred to your wallet</p>
                    </div>
                    <button className="success-close-button" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18"/>
                            <path d="M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Success Icon */}
                <div className="success-icon-container">
                    <div className="success-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </div>
                </div>

                {/* Congratulations Message */}
                <div className="congratulations-section">
                    <h3 className="congratulations-title">Congratulations!</h3>
                    <p className="nft-name">You now own Luminous Treasure</p>
                </div>

                {/* Transaction Details */}
                <div className="transaction-details">
                    <div className="transaction-row">
                        <span className="transaction-label">Amount Paid</span>
                        <span className="transaction-value">{transactionDetails?.totalAmount || '850.50'} USDT</span>
                    </div>
                    <div className="transaction-row">
                        <span className="transaction-label">Network</span>
                        <span className="transaction-value">{transactionDetails?.network || 'BEP20'}</span>
                    </div>
                    <div className="transaction-row">
                        <span className="transaction-label">Transaction</span>
                        <span className="transaction-hash">{transactionDetails?.hash || '0xe022a3ef...3ef66e89'}</span>
                    </div>
                </div>

                {/* Information Box */}
                <div className="info-box">
                    <p className="info-text">Your NFT will appear in your wallet within a few minutes</p>
                </div>

                {/* Action Button */}
                <div className="success-modal-actions">
                    <button className="view-wallet-button" onClick={handleViewInWallet}>
                        View in Wallet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseSuccessfulModal;
