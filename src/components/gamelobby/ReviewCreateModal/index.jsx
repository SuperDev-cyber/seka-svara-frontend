import React from 'react';
import './index.css';

const ReviewCreateModal = ({ isOpen, onClose, onBack, onCreateTable, tableData }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="review-modal-overlay" onClick={handleOverlayClick}>
            <div className="review-create-modal">
                <div className="review-modal-header">
                    <h2 className="review-modal-title">Review & Create</h2>
                    <p className="review-modal-subtitle">Review your table settings and start the game</p>
                    <div className="review-progress-indicator">
                        <div className="review-progress-step completed"></div>
                        <div className="review-progress-step completed"></div>
                        <div className="review-progress-step active"></div>
                    </div>
                    <button className="review-close-button" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div className="review-modal-content">
                    {/* Table Settings Section */}
                    <div className="review-table-settings">
                        <h3 className="review-section-title">Table Settings</h3>
                        <div className="review-settings-grid">
                            <div className="review-setting-item">
                                <span className="review-setting-label">Table Name</span>
                                <span className="review-setting-value">{tableData?.tableName || 'New'}</span>
                            </div>
                            <div className="review-setting-item">
                                <span className="review-setting-label">Privacy</span>
                                <div className="review-privacy-badge">
                                    <svg className="review-privacy-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="2" y1="12" x2="22" y2="12"/>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                    </svg>
                                    <span>{tableData?.privacy === 'public' ? 'Public' : 'Private'}</span>
                                </div>
                            </div>
                            <div className="review-setting-item">
                                <span className="review-setting-label">Entry Fee</span>
                                <span className="review-setting-value">{tableData?.entryFee || 10} USDT</span>
                            </div>
                            <div className="review-setting-item">
                                <span className="review-setting-label">Max Players</span>
                                <span className="review-setting-value">{tableData?.maxPlayers || 6}</span>
                            </div>
                            <div className="review-setting-item">
                                <span className="review-setting-label">Network</span>
                                <span className="review-setting-value">{tableData?.network || 'BEP20'}</span>
                            </div>
                            <div className="review-setting-item">
                                <span className="review-setting-label">Total Pot</span>
                                <span className="review-total-pot">{(tableData?.entryFee || 10) * (tableData?.maxPlayers || 6)} USDT</span>
                            </div>
                        </div>
                    </div>

                    {/* Ready to Start Section */}
                    <div className="review-ready-section">
                        <div className="review-ready-header">
                            <svg className="review-ready-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <path d="M20 8v6"/>
                                <path d="M23 11h-6"/>
                            </svg>
                            <h3 className="review-ready-title">Ready to Start!</h3>
                        </div>
                        <p className="review-ready-description">
                            Once you create the table, you'll be taken to the waiting room. The game will start when all players join or you choose to start with fewer players.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="review-modal-actions">
                        <button className="review-back-button" onClick={onBack}>
                            Back
                        </button>
                        <button className="review-create-button" onClick={onCreateTable}>
                            Create & Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCreateModal;
