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

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full mx-4
        ${getPositionClasses()}
        transform transition-all duration-500 ease-out
        ${isVisible && !isLeaving ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
      `}
    >
      {/* Glass morphism container */}
      <div className="relative dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        {/* Header with premium gradient */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <span className="text-white text-xl">🎮</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Game Invitation</h3>
                <p className="text-white/90 text-sm font-medium">Seka Svara</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-full p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content with premium styling */}
        <div className="relative p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20">
              <span className="text-white font-bold text-lg">
                {notification.inviterName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 dark:text-white font-semibold text-base leading-relaxed">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  {notification.inviterName || 'Someone'}
                </span>
                {' '}invited you to play!
              </p>
              <div className="mt-3 space-y-1">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-200">Table:</span>{' '}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{notification.tableName}</span>
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Entry Fee:</span>{' '}
                  <span className="font-bold text-green-600 dark:text-green-400">{notification.entryFee} USDT</span>
                </p>
              </div>
            </div>
          </div>

          {/* Premium Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-emerald-400/20"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Accept</span>
              </span>
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-red-400/20"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Decline</span>
              </span>
            </button>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="relative h-1 bg-gray-200/50 dark:bg-gray-700/50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-30000 ease-linear"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
