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

    let timeoutId = null;
    let retryCount = 0;
    const MAX_RETRIES = 50; // 5 seconds (50 * 100ms)
    let cleanupFn = null;

    // Wait for socket to be connected before setting up listeners
    const setupListeners = () => {
      console.log('🔌 NotificationManager: Checking socket connection...', {
        socket: !!socket,
        connected: socket?.connected,
        id: socket?.id,
        retry: retryCount
      });
      
      if (!socket.connected) {
        retryCount++;
        if (retryCount >= MAX_RETRIES) {
          console.warn('⚠️ NotificationManager: Socket not connected after 5 seconds, giving up');
          return;
        }
        console.log(`🔌 NotificationManager: Socket not connected yet, retry ${retryCount}/${MAX_RETRIES}...`);
        timeoutId = setTimeout(setupListeners, 100);
        return;
      }

      console.log('✅ NotificationManager: Setting up socket listeners');
      console.log('🔌 NotificationManager: Socket connected:', socket.connected);
      console.log('🔌 NotificationManager: Socket ID:', socket.id);

      const handleGameInvitation = (data) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 NotificationManager: GAME INVITATION RECEIVED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📩 From:', data.inviterName);
        console.log('📋 Table:', data.tableName);
        console.log('💰 Entry Fee:', data.entryFee);
        console.log('🆔 Table ID:', data.tableId);
        console.log('🔗 Game URL:', data.gameUrl);
        console.log('⏰ Pending:', data.pending);
        console.log('📦 Full data:', JSON.stringify(data, null, 2));
        
        const notification = {
          id: `invitation-${Date.now()}-${Math.random()}`,
          type: 'game_invitation',
          inviterName: data.inviterName,
          inviterId: data.inviterId,
          tableName: data.tableName,
          tableId: data.tableId,
          entryFee: data.entryFee,
          gameUrl: data.gameUrl,
          pending: data.pending || false, // ✅ Add pending flag
          tableSettings: data.tableSettings, // Include table settings for on-demand creation
          timestamp: new Date(),
          status: 'pending'
        };

        console.log('🔔 Creating notification object:', notification);
        setNotifications(prev => {
          const updated = [...prev, notification];
          console.log('🔔 Updated notifications array (count:', updated.length, ')');
          console.log('🔔 All notifications:', updated);
          return updated;
        });

        console.log('✅ Notification added to state successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Auto-remove after 30 seconds if not responded
        setTimeout(() => {
          console.log('⏰ Auto-removing notification after 30s:', notification.id);
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

      cleanupFn = () => {
        console.log('🔌 NotificationManager: Cleaning up socket listeners');
        socket.off('game_invitation', handleGameInvitation);
        socket.off('notification_response', handleNotificationResponse);
        socket.off('debug_socket_id_response');
      };
    };

    // Start setting up listeners
    setupListeners();

    // Cleanup function to clear timeout and socket listeners
    return () => {
      console.log('🔌 NotificationManager: useEffect cleanup');
      if (timeoutId) {
        console.log('🔌 Clearing pending timeout');
        clearTimeout(timeoutId);
      }
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [socket]);

  const handleAccept = useCallback((notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ACCEPTING INVITATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Pending:', notification.pending);
    console.log('Table ID:', notification.tableId);
    console.log('Table Name:', notification.tableName);
    console.log('Inviter:', notification.inviterName);
    console.log('Table Settings:', notification.tableSettings);

    // ✅ NEW FLOW: Table already exists (inviter created it)
    // Just join the existing table like clicking JOIN TABLE button
    if (!notification.tableId) {
      console.error('❌ No table ID in invitation');
      alert('Invalid invitation: No table ID');
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      return;
    }

    console.log('📋 Table exists - joining now...');
    
    if (!socket) {
      console.error('❌ Socket not available');
      return;
    }

    // ✅ Join the inviter's table (same as JOIN TABLE button)
    socket.emit('join_table', {
      tableId: notification.tableId,
      userId: user?.id || user?.userId,
      userEmail: user?.email,
      username: user?.username || user?.name || user?.email?.split('@')[0],
      avatar: user?.avatar,
      tableName: notification.tableName,
      entryFee: notification.entryFee
    }, (joinResponse) => {
      console.log('🎮 Join table response:', joinResponse);
      
      if (joinResponse && joinResponse.success) {
        console.log('✅ Successfully joined inviter\'s table');
        
        // Send acceptance response
        if (socket) {
          socket.emit('respond_to_invitation', {
            notificationId,
            response: 'accepted',
            tableId: notification.tableId,
            inviterId: notification.inviterId
          });
        }
        
        // Navigate to the table
        const gameUrl = `/game/${notification.tableId}?userId=${user?.id || user?.userId}&email=${encodeURIComponent(user?.email)}&tableName=${encodeURIComponent(notification.tableName)}&invited=true`;
        console.log('🚀 Navigating to inviter\'s table:', gameUrl);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        window.location.href = gameUrl;
      } else {
        console.error('❌ Failed to join table:', joinResponse?.message);
        alert('Failed to join table: ' + (joinResponse?.message || 'Unknown error'));
      }
    });

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
