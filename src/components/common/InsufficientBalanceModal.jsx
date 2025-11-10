import React from 'react';
import { Link } from 'react-router-dom';
import './InsufficientBalanceModal.css';

const InsufficientBalanceModal = ({ isOpen, onClose, requiredAmount, currentBalance, onDeposit }) => {
    if (!isOpen) return null;

    return (
        <div className="insufficient-balance-overlay" onClick={onClose}>
            <div className="insufficient-balance-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon-wrapper">
                        <svg className="modal-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-content">
                    <h2 className="modal-title">Insufficient USDT Balance</h2>
                    <p className="modal-description">
                        You don't have enough USDT to join this table. Please deposit more USDT to continue playing.
                    </p>

                    <div className="balance-details">
                        <div className="balance-item">
                            <div className="balance-label">Required</div>
                            <div className="balance-value required">{requiredAmount.toFixed(2)} USDT</div>
                        </div>
                        <div className="balance-divider"></div>
                        <div className="balance-item">
                            <div className="balance-label">Your Balance</div>
                            <div className="balance-value current">{currentBalance.toFixed(2)} USDT</div>
                        </div>
                    </div>

                    <div className="balance-shortage">
                        <span className="shortage-label">Shortage:</span>
                        <span className="shortage-amount">
                            {(requiredAmount - currentBalance).toFixed(2)} USDT
                        </span>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="deposit-btn" onClick={onDeposit}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Deposit USDT
                    </button>
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsufficientBalanceModal;


