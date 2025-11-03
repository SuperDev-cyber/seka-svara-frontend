import React, { useEffect } from 'react';
import './index.css';

/**
 * PlayerActionModal
 * Shows a notification when another player takes an action (fold, call, raise, etc.)
 */
const PlayerActionModal = ({ action, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !action) return null;

  const getActionIcon = (actionType) => {
    switch (actionType?.toLowerCase()) {
      case 'fold':
        return '🚫';
      case 'call':
        return '✅';
      case 'raise':
        return '📈';
      case 'all_in':
      case 'allin':
        return '💰';
      case 'blind':
        return '🎲';
      default:
        return '🎮';
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType?.toLowerCase()) {
      case 'fold':
        return '#ff4444';
      case 'call':
        return '#44ff44';
      case 'raise':
        return '#ffaa44';
      case 'all_in':
      case 'allin':
        return '#ff44ff';
      case 'blind':
        return '#44aaff';
      default:
        return '#ffffff';
    }
  };

  return (
    <div className="player-action-modal-overlay">
      <div 
        className="player-action-modal"
        style={{ borderColor: getActionColor(action.actionType) }}
      >
        <div className="action-icon">
          {getActionIcon(action.actionType)}
        </div>
        <div className="action-content">
          <div className="action-player">
            {action.playerName || action.playerEmail?.split('@')[0] || 'Player'}
          </div>
          <div className="action-type" style={{ color: getActionColor(action.actionType) }}>
            {action.actionType?.toUpperCase()}
          </div>
          {action.amount > 0 && (
            <div className="action-amount">
              {Math.round(Number(action.amount) || 0)} SEKA
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerActionModal;

