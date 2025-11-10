import { useCallback } from 'react';

/**
 * Custom hook for handling all player game actions
 * Consolidates all action emitting logic in one place
 * Now includes private key for USDT transfers
 */
export const useGameActions = (socket, tableId, userId, getPrivateKey) => {
  // Generic action emitter with Promise-based response handling
  const emitAction = useCallback(async (action, amount = 0) => {
    if (!socket || !socket.connected) {
      console.error('❌ Socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }
    
    // ✅ Get private key for USDT transfers (except for fold/check which don't require transfers)
    let privateKey = null;
    if (action !== 'fold' && action !== 'check' && getPrivateKey) {
      try {
        privateKey = await getPrivateKey();
        console.log('✅ Private key retrieved for action:', action);
      } catch (error) {
        console.error('❌ Failed to get private key:', error);
        // Continue without private key - backend will handle gracefully
      }
    }
    
    console.log(`🎲 Emitting ${action} action:`, { tableId, userId, amount, hasPrivateKey: !!privateKey });
    
    return new Promise((resolve, reject) => {
      socket.emit(
        'player_action', 
        { tableId, userId, action, amount, privateKey },
        (response) => {
          if (response?.success) {
            console.log(`✅ ${action} action successful:`, response);
            resolve(response);
          } else {
            const errorMsg = response?.message || response?.error || 'Action failed';
            console.error(`❌ ${action} action failed:`, errorMsg);
            reject(new Error(errorMsg));
          }
        }
      );
    });
  }, [socket, tableId, userId, getPrivateKey]);
  
  // Specific action methods
  const fold = useCallback(() => {
    console.log('🚫 Player folding...');
    return emitAction('fold', 0);
  }, [emitAction]);
  
  const call = useCallback((amount) => {
    console.log('✅ Player calling:', amount);
    return emitAction('call', amount);
  }, [emitAction]);
  
  const raise = useCallback((amount) => {
    console.log('📈 Player raising:', amount);
    return emitAction('raise', amount);
  }, [emitAction]);
  
  const allIn = useCallback((amount) => {
    console.log('💰 Player going all in:', amount);
    return emitAction('all_in', amount);
  }, [emitAction]);
  
  const viewCards = useCallback(() => {
    if (!socket || !socket.connected) {
      console.error('❌ Socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }
    
    console.log('👁️ Player viewing cards...');
    
    return new Promise((resolve, reject) => {
      socket.emit(
        'player_view_cards',
        { tableId, userId },
        (response) => {
          if (response?.success) {
            console.log('✅ View cards successful:', response);
            resolve(response);
          } else {
            const errorMsg = response?.message || response?.error || 'Failed to view cards';
            console.error('❌ View cards failed:', errorMsg);
            reject(new Error(errorMsg));
          }
        }
      );
    });
  }, [socket, tableId, userId]);
  
  const blindBet = useCallback((amount) => {
    if (!socket || !socket.connected) {
      console.error('❌ Socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }
    
    console.log('🎲 Player blind betting:', amount);
    
    return new Promise((resolve, reject) => {
      socket.emit(
        'player_play_blind',
        { 
          tableId, 
          userId, 
          action: 'bet', // Backend requires action field (bet, call, raise, etc.)
          amount 
        },
        (response) => {
          if (response?.success) {
            console.log('✅ Blind bet successful:', response);
            resolve(response);
          } else {
            const errorMsg = response?.message || response?.error || 'Blind bet failed';
            console.error('❌ Blind bet failed:', errorMsg);
            reject(new Error(errorMsg));
          }
        }
      );
    });
  }, [socket, tableId, userId]);
  
  return {
    // Player actions
    fold,
    call,
    raise,
    allIn,
    viewCards,
    blindBet,
    
    // Generic emitter (for advanced use)
    emitAction,
  };
};

export default useGameActions;

