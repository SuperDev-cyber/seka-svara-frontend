import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationToast from '../NotificationToast';
import './index.css';

const NotificationManager = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [position, setPosition] = useState('top-right');

  // Listen for incoming notifications
  useEffect(() => {
    console.log('🔌 NotificationManager: useEffect triggered, socket:', socket);
    console.log('🔌 NotificationManager: user:', user);
    
    if (!socket) {
      console.log('🔌 NotificationManager: No socket available');
      return;
    }

    // Wait for socket to be connected before setting up listeners
    const setupListeners = () => {
      console.log('🔌 NotificationManager: Checking socket connection...', {
        socket: !!socket,
        connected: socket?.connected,
        id: socket?.id
      });
      
      if (!socket.connected) {
        console.log('🔌 NotificationManager: Socket not connected yet, waiting...');
        setTimeout(setupListeners, 100);
        return;
      }

      console.log('🔌 NotificationManager: Setting up socket listeners');
      console.log('🔌 NotificationManager: Socket connected:', socket.connected);
      console.log('🔌 NotificationManager: Socket ID:', socket.id);

      const handleGameInvitation = (data) => {
        console.log('🎯 NotificationManager: Received REAL game invitation:', data);
        console.log('🎯 Inviter:', data.inviterName, 'Table:', data.tableName);
        console.log('🎯 Full invitation data:', JSON.stringify(data, null, 2));
        
        const notification = {
          id: `invitation-${Date.now()}-${Math.random()}`,
          type: 'game_invitation',
          inviterName: data.inviterName,
          inviterId: data.inviterId,
          tableName: data.tableName,
          tableId: data.tableId,
          entryFee: data.entryFee,
          gameUrl: data.gameUrl,
          tableSettings: data.tableSettings, // Include table settings for on-demand creation
          timestamp: new Date(),
          status: 'pending'
        };

        console.log('🔔 Adding notification to state:', notification);
        setNotifications(prev => {
          const updated = [...prev, notification];
          console.log('🔔 Updated notifications array:', updated);
          return updated;
        });

        // Auto-remove after 30 seconds if not responded
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 30000);
      };

      const handleNotificationResponse = (data) => {
        console.log('📨 Notification response:', data);
        // Remove the notification if it was responded to
        setNotifications(prev => prev.filter(n => n.id !== data.notificationId));
      };

      // Listen for game invitations
      console.log('🔌 NotificationManager: Adding game_invitation listener');
      socket.on('game_invitation', handleGameInvitation);
      socket.on('notification_response', handleNotificationResponse);
      
      // Debug: Query current socket ID from backend (temporary)
      socket.emit('debug_socket_id');
      socket.on('debug_socket_id_response', (data) => {
        console.log('🔌 NotificationManager: Backend confirmed socket ID:', data);
      });

      return () => {
        console.log('🔌 NotificationManager: Cleaning up socket listeners');
        socket.off('game_invitation', handleGameInvitation);
        socket.off('notification_response', handleNotificationResponse);
      };
    };

    // Start setting up listeners
    setupListeners();
  }, [socket]);

  const handleAccept = useCallback((notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ACCEPTING INVITATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Table ID:', notification.tableId);
    console.log('Table Name:', notification.tableName);
    console.log('Inviter:', notification.inviterName);
    console.log('Table Settings:', notification.tableSettings);

    // Send acceptance response
    if (socket) {
      socket.emit('respond_to_invitation', {
        notificationId,
        response: 'accepted',
        tableId: notification.tableId,
        inviterId: notification.inviterId
      });
    }

    // Store table info (will be created on-demand when navigating)
    sessionStorage.setItem('pendingTableId', notification.tableId);
    if (notification.tableSettings) {
      sessionStorage.setItem('pendingTableData', JSON.stringify(notification.tableSettings));
    }
    
    // Navigate to game table (will create table on-demand)
    const gameUrl = `/game/${notification.tableId}?userId=${user?.id || user?.userId}&email=${encodeURIComponent(user?.email)}&tableName=${encodeURIComponent(notification.tableName)}&invited=true`;
    console.log('🚀 Navigating to:', gameUrl);
    console.log('   Table will be created on-demand if needed');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    window.location.href = gameUrl;

    // Remove notification
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, [notifications, socket, user]);

  const handleDecline = useCallback((notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    console.log('❌ Declining invitation:', notification);

    // Send decline response
    if (socket) {
      socket.emit('respond_to_invitation', {
        notificationId,
        response: 'declined',
        tableId: notification.tableId,
        inviterId: notification.inviterId
      });
    }

    // Remove notification
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, [notifications, socket]);

  const handleClose = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Group notifications by position to avoid overlap
  const groupedNotifications = notifications.reduce((acc, notification, index) => {
    const topOffset = 4 + (index * 20); // 4rem base + 5rem per notification
    return {
      ...acc,
      [index]: { ...notification, topOffset }
    };
  }, {});

  return (
    <div className="notification-manager">
      {Object.values(groupedNotifications).map((notification, index) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onClose={handleClose}
          position={position}
          style={{ 
            top: `${notification.topOffset}rem`,
            zIndex: 1000 - index 
          }}
        />
      ))}
    </div>
  );
};

export default NotificationManager;
