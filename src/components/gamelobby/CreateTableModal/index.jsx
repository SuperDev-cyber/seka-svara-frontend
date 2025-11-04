import React, { useState } from 'react';
import './index.css';
import InviteFriendsModal from '../InviteFriendsModal';

const CreateTableModal = ({ isOpen, onClose, onCreateTable }) => {
    const [tableName, setTableName] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [entryFee, setEntryFee] = useState(1); // Default 10 SEKA
    const maxPlayers = 6; // Always 6 players - hardcoded
    const [selectedNetwork, setSelectedNetwork] = useState('BEP20');
    const [showInviteModal, setShowInviteModal] = useState(false);

    const networks = [
        { value: 'BEP20', label: 'BEP20 (BSC)' },
        { value: 'TRC20', label: 'TRC20 (TRON)' },
        { value: 'ERC20', label: 'ERC20 (ETH)' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Just show the invite modal, don't create table yet
        setShowInviteModal(true);
    };

    const handleInviteBack = () => {
        setShowInviteModal(false);
    };

    // This function will be called from InviteFriendsModal when CREATE is clicked
    const handleCreateTableWithInvites = async (tableDataWithCreator) => {
        // Call the parent's onCreateTable function with the table data
        const result = await onCreateTable({
            tableName,
            privacy,
            entryFee,
            maxPlayers,
            network: selectedNetwork,
            ...tableDataWithCreator
        });
        
        // Return the created table so InviteFriendsModal can send invites
        return result;
    };

    const totalPot = entryFee * 6;
    const platformFee = totalPot * 0.05; // ✅ 5% platform fee

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {!showInviteModal && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="create-table-modal">
                <div className="modal-header" style={{paddingRight:'75px'}}>
                    <h2 className="modal-title">Create New Table</h2>
                    <p className="modal-subtitle">Set up your game table with custom settings</p>
                    <div className="progress-indicator">
                        <div className="progress-step active"></div>
                        <div className="progress-step"></div>
                        <div className="progress-step"></div>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <form className="modal-content" onSubmit={handleSubmit}>
                    {/* Table Name */}
                    <div className="form-group">
                        <label className="form-label">Table Name</label>
                        <input
                            type="text"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="e.g., High Rollers Only"
                            className="form-input"
                        />
                    </div>

                    {/* Privacy */}
                    <div className="form-group">
                        <label className="form-label">Privacy</label>
                        <div className="privacy-options">
                            <div 
                                className={`privacy-option ${privacy === 'public' ? 'selected' : ''}`}
                                onClick={() => setPrivacy('public')}
                            >
                                <div className="radio-button">
                                    <div className={`radio-dot ${privacy === 'public' ? 'checked' : ''}`}></div>
                                </div>
                                <div className="privacy-content">
                                    <div className="privacy-header">
                                        <svg className="privacy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="2" y1="12" x2="22" y2="12"/>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                        </svg>
                                        <span className="privacy-title">Public Table</span>
                                    </div>
                                    <span className="privacy-description">Anyone can join</span>
                                </div>
                            </div>
                            <div 
                                className={`privacy-option ${privacy === 'private' ? 'selected' : ''}`}
                                onClick={() => setPrivacy('private')}
                            >
                                <div className="radio-button">
                                    <div className={`radio-dot ${privacy === 'private' ? 'checked' : ''}`}></div>
                                </div>
                                <div className="privacy-content">
                                    <div className="privacy-header">
                                        <svg className="privacy-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="4" y="11" width="16" height="10" rx="2" ry="2"/>
                                            <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                                        </svg>
                                        <span className="privacy-title">Private Table</span>
                                    </div>
                                    <span className="privacy-description">Only invited players can join</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Entry Fee */}
                    <div className="form-group">
                        <label className="form-label">Entry Fee (USDT)</label>
                        <div className="slider-container">
                            <div className="slider-wrapper">
                                <div 
                                    className="slider-fill" 
                                    style={{ width: `${((entryFee - 1) / (1000 - 1)) * 100}%` }}
                                ></div>
                                <input
                                    type="range"
                                    min="1"
                                    max="1000"
                                    value={entryFee}
                                    onChange={(e) => setEntryFee(parseInt(e.target.value))}
                                    className="slider"
                                />
                            </div>
                            <div className="slider-labels">
                                <span className="slider-label">{entryFee} USDT</span>
                                <span className="slider-label">1000 USDT</span>
                            </div>
                        </div>
                    </div>

                    {/* Network - All tables are now 6-player tables */}
                    <div className="form-group">
                        <label className="form-label">Network</label>
                        <div className="dropdown-container">
                            <select
                                value={selectedNetwork}
                                onChange={(e) => setSelectedNetwork(e.target.value)}
                                className="form-dropdown"
                            >
                                {networks.map((network) => (
                                    <option key={network.value} value={network.value}>
                                        {network.label}
                                    </option>
                                ))}
                            </select>
                            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9"/>
                            </svg>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                            ℹ️ All tables are 6-player tables. Games auto-start with 2+ players.
                        </p>
                    </div>

                    {/* Summary Box */}
                    <div className="summary-box">
                        <div className="summary-row">
                            <span className="summary-label">Total Pot (if full)</span>
                            <span className="summary-value">{totalPot} USDT</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Platform Fee (5%)</span>
                            <span className="summary-fee">{platformFee.toFixed(3)} USDT</span>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="next-button">
                            Next
                        </button>
                    </div>
                </form>
                    </div>
                </div>
            )}

            {/* Invite Friends Modal */}
            <InviteFriendsModal
                isOpen={showInviteModal}
                onClose={() => {
                    setShowInviteModal(false);
                    onClose(); // Also close parent modal
                }}
                onCreateTable={handleCreateTableWithInvites}
                tableData={{
                    tableName,
                    privacy,
                    entryFee,
                    maxPlayers,
                    network: selectedNetwork
                }}
            />
        </>
    );
};

export default CreateTableModal;
