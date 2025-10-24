import React from 'react';
import './index.css';

const EmptyState = ({ 
    title = "No NFTs Found", 
    message = "Try adjusting your search or filter criteria",
    actionText = "Reset Filters",
    onAction 
}) => {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-message">{message}</p>
            {onAction && (
                <button className="empty-state-action" onClick={onAction}>
                    {actionText}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
