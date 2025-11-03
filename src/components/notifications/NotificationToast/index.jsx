import React, { useState, useEffect } from 'react';
import './index.css';

const NotificationToast = ({ 
  notification, 
  onClose, 
  onAccept, 
  onDecline,
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const handleAccept = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onAccept(notification.id);
    }, 300);
  };

  const handleDecline = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDecline(notification.id);
    }, 300);
  };

  return (
    <div
      className={`notification-toast-container ${isVisible && !isLeaving ? 'visible' : ''} ${isLeaving ? 'leaving' : ''}`}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        maxWidth: '500px',
        width: '90%'
      }}
    >
      {/* Cool notification card with glassmorphism */}
      <div className="notification-card">
        {/* Animated background particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Animated border gradient */}
        <div className="animated-border"></div>
        
        {/* Close button */}
        <button onClick={handleClose} className="close-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 8.586L3.707 2.293 2.293 3.707 8.586 10l-6.293 6.293 1.414 1.414L10 11.414l6.293 6.293 1.414-1.414L11.414 10l6.293-6.293-1.414-1.414L10 8.586z"/>
          </svg>
        </button>

        {/* Header with game icon */}
        <div className="notification-header">
          <div className="game-icon">
            <div className="icon-glow"></div>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="url(#gradient1)" />
              <path d="M15 12h10a3 3 0 013 3v10a3 3 0 01-3 3H15a3 3 0 01-3-3V15a3 3 0 013-3z" fill="white" fillOpacity="0.2"/>
              <circle cx="17" cy="18" r="2" fill="white"/>
              <circle cx="23" cy="18" r="2" fill="white"/>
              <path d="M14 23c0-3 2.5-5 6-5s6 2 6 5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="100%" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header-text">
            <h3 className="notification-title">🎮 Game Invitation</h3>
            <p className="notification-subtitle">Seka Svara Card Game</p>
          </div>
        </div>

        {/* Content */}
        <div className="notification-content">
          <div className="inviter-info">
            <div className="avatar">
              <div className="avatar-glow"></div>
              <span className="avatar-letter">
                {notification.inviterName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="invite-message">
              <p className="main-message">
                <span className="inviter-name">{notification.inviterName || 'Someone'}</span>
                <span className="message-text"> invited you to join the table!</span>
              </p>
            </div>
          </div>

          <div className="game-details">
            <div className="detail-item">
              <div className="detail-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <div className="detail-text">
                <span className="detail-label">Table Name</span>
                <span className="detail-value">{notification.tableName}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon coin-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
                </svg>
              </div>
              <div className="detail-text">
                <span className="detail-label">Entry Fee</span>
                <span className="detail-value fee">{notification.entryFee} USDT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button onClick={handleAccept} className="btn btn-accept">
            <span className="btn-shimmer"></span>
            <span className="btn-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </span>
            <span className="btn-text">Accept Invite</span>
          </button>

          <button onClick={handleDecline} className="btn btn-decline">
            <span className="btn-shimmer"></span>
            <span className="btn-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </span>
            <span className="btn-text">Decline</span>
          </button>
        </div>

        {/* Animated progress indicator */}
        <div className="progress-indicator">
          <div className="progress-bar"></div>
        </div>
      </div>

      {/* Dark overlay */}
      <div className="notification-overlay" onClick={handleClose}></div>
    </div>
  );
};

export default NotificationToast;
