import React from 'react';
import './index.css';

const ConfirmPurchaseModal = ({ isOpen, onClose, nftData, selectedNetwork, onConfirm }) => {
    const networkFee = selectedNetwork === 'BEP20' ? 0.5 : 0.1;
    const totalAmount = nftData.price.current + networkFee;
    const walletBalance = 2450.00; // Mock wallet balance

    const handleConfirm = () => {
        onConfirm(selectedNetwork, totalAmount);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="confirm-modal-header">
                    <div className="confirm-modal-title-section">
                        <h2 className="confirm-modal-title">Confirm Purchase</h2>
                        <p className="confirm-modal-subtitle">Review your purchase details before confirming</p>
                    </div>
                    <button className="confirm-close-button" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18"/>
                            <path d="M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Purchase Details */}
                <div className="purchase-details">
                    <div className="detail-row">
                        <span className="detail-label">NFT Price</span>
                        <span className="detail-value">{nftData.price.current} USDT</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Network Fee ({selectedNetwork})</span>
                        <span className="detail-value">{networkFee} USDT</span>
                    </div>
                    <div className="detail-separator"></div>
                    <div className="detail-row total-row">
                        <span className="detail-label">Total</span>
                        <span className="detail-value total-amount">{totalAmount} USDT</span>
                    </div>
                </div>

                {/* Secure Transaction */}
                <div className="secure-transaction">
                    <div className="secure-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <div className="secure-content">
                        <h3 className="secure-title">Secure Transaction</h3>
                        <p className="secure-description">This transaction is protected by smart contract escrow</p>
                    </div>
                </div>

                {/* Wallet Balance */}
                <div className="wallet-balance">
                    <div className="wallet-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                            <path d="M3 5v14a2 2 0 0 0 2 2h14v-5"/>
                            <path d="M18 12a2 2 0 0 0 0 4"/>
                        </svg>
                    </div>
                    <div className="wallet-content">
                        <span className="wallet-label">Wallet Balance</span>
                        <span className="wallet-amount">{walletBalance.toLocaleString()} USDT</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="confirm-modal-actions">
                    <button className="confirm-back-button" onClick={onClose}>
                        Back
                    </button>
                    <button className="confirm-button" onClick={handleConfirm}>
                        Confirm & Pay {totalAmount} USDT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPurchaseModal;
