import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useSafeAuth } from './SafeAuthContext';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated, updatePlatformScore } = useAuth();
  const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, user: safeAuthUser } = useSafeAuth();

  useEffect(() => {
    console.log('🔌 SocketContext: useEffect triggered, isAuthenticated:', isAuthenticated, 'user:', user, 'safeAuthLoggedIn:', safeAuthLoggedIn, 'safeAuthAccount:', safeAuthAccount);

    // Consider wallet connection as authentication for sockets too
    const hasWalletAuth = safeAuthLoggedIn && safeAuthAccount;
    const effectiveUser = user || (hasWalletAuth
      ? {
          id: safeAuthAccount,
          userId: safeAuthAccount,
          email: safeAuthUser?.email || `${safeAuthAccount}@web3auth.local`,
          username: safeAuthUser?.name || safeAuthUser?.email?.split('@')[0] || `user_${safeAuthAccount.substring(2, 10)}`,
          avatar: null,
        }
      : null);

    if ((isAuthenticated && user) || hasWalletAuth) {
      console.log('🔌 Connecting to game server...');
      
      // Use VITE_API_URL or default to localhost:8000 (backend port)
      const socketUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
        : 'http://localhost:8000';
      
      console.log('🔌 Socket URL:', socketUrl);
      
      const newSocket = io(socketUrl, {
        transports: ['websocket'],
        upgrade: true,
        rememberUpgrade: true
      });
      
      console.log('🔌 SocketContext: Socket created:', newSocket);

      newSocket.on('connect', () => {
        console.log('✅ Connected to game server');
        console.log('✅ Socket ID:', newSocket.id);
        console.log('✅ Socket connected:', newSocket.connected);
        setIsConnected(true);
        
        // Join lobby and authenticate
        newSocket.emit('user_online', {
          userId: effectiveUser.id || effectiveUser.userId,
          email: effectiveUser.email,
          username: effectiveUser.username || effectiveUser.name,
          avatar: effectiveUser.avatar || effectiveUser.profilePicture
        });
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from game server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('🔌 Connection error:', error);
        setIsConnected(false);
      });

      // ✅ Listen for real-time balance updates
      newSocket.on('balance_updated', (data) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💰 BALANCE UPDATE RECEIVED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Data:', data);
        console.log('Current user ID:', user?.id || user?.userId);
        
        if (data.userId === (user?.id || user?.userId)) {
          console.log(`✅ Updating platform score: ${data.platformScore} SEKA`);
          console.log(`   Reason: ${data.reason}`);
          updatePlatformScore(data.platformScore);
        } else {
          console.log(`⚠️ Balance update for different user: ${data.userId}`);
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      });

      setSocket(newSocket);

      return () => {
        console.log('🔌 Disconnecting from game server...');
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Clean up socket if user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user, safeAuthLoggedIn, safeAuthAccount, safeAuthUser]);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
