import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './GameLobby.css';

const API_BASE = 'http://localhost:8000/api/v1';
const SOCKET_URL = 'http://localhost:8000';

function GameLobby() {
  // User state
  const [userEmail, setUserEmail] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userId, setUserId] = useState('');
  
  // Socket & Connection
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Online users
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // Table creation modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Settings, 2: Invites
  
  // Table settings
  const [tableName, setTableName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [entryFee, setEntryFee] = useState(10);
  const [maxPlayers, setMaxPlayers] = useState(3);
  const [network, setNetwork] = useState('BEP20 (BSC)');
  
  // Invites
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]); // Invites I received
  
  // Game state
  const [currentGame, setCurrentGame] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);

  // Generate random user credentials on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail');
    const storedToken = sessionStorage.getItem('userToken');
    const storedUserId = sessionStorage.getItem('userId');
    
    if (storedEmail && storedToken && storedUserId) {
      setUserEmail(storedEmail);
      setUserToken(storedToken);
      setUserId(storedUserId);
    } else {
      // Generate random credentials
      const randomNum = Math.floor(Math.random() * 10000);
      const email = `player${randomNum}@seka.game`;
      const token = 'token_' + Math.random().toString(36).substring(2, 15);
      const id = 'user_' + Math.random().toString(36).substring(2, 9);
      
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userToken', token);
      sessionStorage.setItem('userId', id);
      
      setUserEmail(email);
      setUserToken(token);
      setUserId(id);
    }
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      auth: {
        userId: userId,
        email: userEmail,
        token: userToken
      }
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to game server');
      setIsConnected(true);
      newSocket.emit('user_online', { userId, email: userEmail });
      
      // ✅ Request existing active tables from server WITH userId for privacy filtering
      newSocket.emit('get_active_tables', { userId }, (response) => {
        console.log('📋 Active tables response:', response);
        if (response.success && response.tables) {
          setAvailableTables(response.tables);
          console.log(`✅ Loaded ${response.tables.length} existing tables (filtered by privacy)`);
        }
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    // Listen for online users updates
    newSocket.on('users_online', (users) => {
      console.log('👥 Online users:', users);
      setOnlineUsers(users.filter(u => u.userId !== userId));
    });

    // Listen for game invites
    newSocket.on('game_invite', (data) => {
      console.log('📨 Received invite:', data);
      setPendingInvites(prev => [...prev, data]);
      
      // Show browser notification if supported
      if (Notification.permission === 'granted') {
        new Notification('Game Invite', {
          body: `${data.fromEmail} invited you to join their game!`,
          icon: '/favicon.ico'
        });
      }
    });

    // Listen for invite responses
    newSocket.on('invite_accepted', (data) => {
      console.log('✅ Invite accepted:', data);
      // Add user to invited list
      setInvitedUsers(prev => [...prev, data.userId]);
    });

    newSocket.on('invite_declined', (data) => {
      console.log('❌ Invite declined:', data);
    });

    // Listen for real-time table updates
    newSocket.on('table_created', (data) => {
      console.log('🎮 New table created:', data);
      // ✅ Only add if: public table OR user is creator OR user is invited
      const isPublic = !data.isPrivate && data.privacy !== 'private';
      const isCreator = data.creatorId === userId;
      const isInvited = data.invitedPlayers?.includes(userId);
      
      if (isPublic || isCreator || isInvited) {
        console.log('✅ Adding table to lobby (access granted)');
        setAvailableTables(prev => [...prev, data]);
      } else {
        console.log('🔒 Skipping private table (no access)');
      }
    });

    newSocket.on('table_updated', (data) => {
      console.log('🔄 Table updated:', data);
      setAvailableTables(prev => 
        prev.map(table => table.id === data.id ? data : table)
      );
    });

    newSocket.on('table_removed', (data) => {
      console.log('🗑️ Table removed:', data);
      setAvailableTables(prev => prev.filter(table => table.id !== data.id));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId, userEmail, userToken]);

  // Fetch initial tables on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_BASE}/games/pending`);
        if (response.ok) {
          const tables = await response.json();
          console.log('📋 Initial tables loaded:', tables);
          setAvailableTables(tables.map(game => ({
            id: game.id,
            tableName: game.tableId || `Table ${game.id.substring(0, 8)}`,
            entryFee: game.ante || 10,
            currentPlayers: game.currentPlayers || game.players?.length || 0,
            maxPlayers: game.maxPlayers || 6,
            status: game.status
          })));
        }
      } catch (error) {
        console.error('❌ Error fetching tables:', error);
      }
    };

    if (userId) {
      fetchTables();
    }
  }, [userId]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Mark user as invited (actual invite sent when game is created)
  const sendInvite = (targetUser) => {
    // Just mark user as invited - actual invite with gameId sent during game creation
    setInvitedUsers(prev => [...prev, targetUser.userId]);
    console.log('📝 Marked for invite:', targetUser.email);
  };

  // Accept invite
  const acceptInvite = async (invite) => {
    if (!socket) return;
    
    socket.emit('accept_invite', {
      inviteId: invite.timestamp,
      fromUserId: invite.fromUserId,
      userId: userId
    });
    
    // Remove from pending
    setPendingInvites(prev => prev.filter(i => i.timestamp !== invite.timestamp));
    
    console.log('✅ Accepted invite from:', invite.fromEmail);
    
    // Join the game using gameId from invite
    try {
      const gameId = invite.gameId;
      
      if (!gameId) {
        alert('Invalid invite: missing game ID');
        return;
      }
      
      // Join the game using correct endpoint: POST /games/:id/players
      const joinResponse = await fetch(`${API_BASE}/games/${gameId}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId  // Backend expects 'userId', not 'playerId'
        })
      });
      
      if (joinResponse.ok) {
        const joinedGame = await joinResponse.json();
        console.log('🎮 Joined game:', joinedGame);
        
        // Navigate to game table
        window.location.href = `/game/${gameId}?userId=${userId}&email=${userEmail}&tableName=${encodeURIComponent(invite.tableName)}`;
      } else {
        // Handle error response
        let errorMessage = 'Unknown error occurred';
        
        try {
          const errorData = await joinResponse.json();
          console.error('❌ Join error:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('❌ Could not parse error response:', e);
          errorMessage = `Server error (${joinResponse.status})`;
        }
        
        // Show appropriate alert based on error message
        const lowerMsg = errorMessage.toLowerCase();
        
        if (lowerMsg.includes('full')) {
          alert('🚫 ROOM IS FULL!\n\nThis table has reached maximum capacity.\nPlease try joining another game.');
        } else if (lowerMsg.includes('already started') || lowerMsg.includes('started')) {
          alert('🚫 GAME ALREADY STARTED!\n\nYou cannot join a game that is already in progress.');
        } else if (lowerMsg.includes('finished')) {
          alert('🚫 GAME FINISHED!\n\nThis game has already ended.');
        } else if (lowerMsg.includes('balance') || lowerMsg.includes('insufficient')) {
          alert(`🚫 INSUFFICIENT BALANCE!\n\n${errorMessage}`);
        } else {
          alert(`❌ CANNOT JOIN GAME!\n\n${errorMessage}`);
        }
        
        // Remove the pending invite
        setPendingInvites(prev => prev.filter(inv => inv.gameId !== gameId));
      }
    } catch (error) {
      console.error('❌ Error joining game:', error);
      alert('Failed to join game. Please try again.');
    }
  };

  // Decline invite
  const declineInvite = (invite) => {
    if (!socket) return;
    
    socket.emit('decline_invite', {
      inviteId: invite.timestamp,
      fromUserId: invite.fromUserId,
      userId: userId
    });
    
    // Remove from pending
    setPendingInvites(prev => prev.filter(i => i.timestamp !== invite.timestamp));
    
    console.log('❌ Declined invite from:', invite.fromEmail);
  };

  // Join a public table
  const joinTable = async (table) => {
    try {
      // Join the game
      const joinResponse = await fetch(`${API_BASE}/games/${table.id}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId })
      });
      
      if (joinResponse.ok) {
        const joinedGame = await joinResponse.json();
        console.log('🎮 Joined table:', joinedGame);
        
        // Navigate to game table
        window.location.href = `/game/${table.id}?userId=${userId}&email=${userEmail}&tableName=${encodeURIComponent(table.tableName)}`;
      } else {
        const errorData = await joinResponse.json().catch(() => ({ message: 'Unknown error' }));
        const lowerMsg = errorData.message?.toLowerCase() || '';
        
        if (lowerMsg.includes('full')) {
          alert('🚫 ROOM IS FULL!\n\nThis table has reached maximum capacity.');
        } else if (lowerMsg.includes('started')) {
          alert('🚫 GAME ALREADY STARTED!\n\nYou cannot join a game in progress.');
        } else if (lowerMsg.includes('balance')) {
          alert(`🚫 INSUFFICIENT BALANCE!\n\n${errorData.message}`);
        } else {
          alert(`❌ CANNOT JOIN TABLE!\n\n${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('❌ Error joining table:', error);
      alert('Failed to join table. Please try again.');
    }
  };

  // Open create table modal
  const openCreateModal = () => {
    setShowCreateModal(true);
    setModalStep(1);
    setTableName('');
    setInvitedUsers([]);
  };

  // Go to next step in modal
  const nextStep = () => {
    if (modalStep === 1) {
      // Validate settings
      if (!tableName.trim()) {
        alert('Please enter a table name');
        return;
      }
      setModalStep(2);
    } else if (modalStep === 2) {
      // Create game
      createGame();
    }
  };

  // Create game with invites
  const createGame = async () => {
    try {
      console.log('Creating table with data:', {
        tableId: tableName.replace(/\s+/g, '-').toLowerCase(),
        playerIds: [userId],
        ante: entryFee,
        maxPlayers: maxPlayers
      });

      const response = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: tableName.replace(/\s+/g, '-').toLowerCase(),
          playerIds: [userId], // Start with creator
          ante: entryFee,
          maxPlayers: maxPlayers
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Failed to create game:', errorData);
        alert(`Failed to create game: ${errorData.message || 'Unknown error'}`);
        return;
      }

      const game = await response.json();
      console.log('✅ Game created successfully:', game);
      
      setCurrentGame(game);
      
      // Broadcast table creation to all users via WebSocket
      if (socket && socket.connected) {
        socket.emit('broadcast_table_created', {
          id: game.id,
          tableName: tableName,
          entryFee: entryFee,
          currentPlayers: 1, // Creator just joined
          maxPlayers: maxPlayers,
          status: game.status,
          creatorId: userId,
          creatorEmail: userEmail
        });
        console.log('📡 Broadcasting table creation to all users');
      } else {
        console.warn('⚠️ Socket not connected, cannot broadcast table creation');
      }
      
      // Now send invites with the gameId
      if (socket && socket.connected && invitedUsers.length > 0) {
        invitedUsers.forEach(invitedUserId => {
          const invitedUser = onlineUsers.find(u => u.userId === invitedUserId);
          if (invitedUser) {
            socket.emit('send_invite', {
              fromUserId: userId,
              fromEmail: userEmail,
              toUserId: invitedUser.userId,
              toEmail: invitedUser.email || invitedUser.userId,
              tableName: tableName,
              entryFee: entryFee,
              maxPlayers: maxPlayers,
              gameId: game.id, // Include gameId
              timestamp: new Date().getTime() // Use timestamp to avoid duplicates
            });
            console.log('📤 Sent invite with gameId to:', invitedUser.email);
          }
        });
      }
      
      setShowCreateModal(false);
      
      // Creator automatically joins the table
      console.log('🚀 Navigating to game table:', game.id);
      
      // Use window.location.href for navigation
      const gameUrl = `/game/${game.id}?userId=${userId}&email=${encodeURIComponent(userEmail)}&tableName=${encodeURIComponent(tableName)}`;
      console.log('📍 Navigation URL:', gameUrl);
      window.location.href = gameUrl;
      
    } catch (error) {
      console.error('❌ Error creating game:', error);
      alert(`Failed to create game: ${error.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="game-lobby">
      {/* Header */}
      <header className="lobby-header">
        <h1>🃏 Seka Svara - Game Lobby</h1>
        <div className="user-info">
          <span className="user-email">📧 {userEmail}</span>
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </header>

      {/* Pending Invites Alert */}
      {pendingInvites.length > 0 && (
        <div className="invites-alert">
          <h3>📨 You have {pendingInvites.length} pending invite(s)!</h3>
          {pendingInvites.map((invite, index) => (
            <div key={index} className="invite-card">
              <div className="invite-info">
                <strong>{invite.fromEmail}</strong> invited you to join <strong>{invite.tableName}</strong>
                <br />
                <small>Entry Fee: {invite.entryFee} USDT | Max Players: {invite.maxPlayers}</small>
              </div>
              <div className="invite-actions">
                <button onClick={() => acceptInvite(invite)} className="btn-accept">
                  ✅ Approve
                </button>
                <button onClick={() => declineInvite(invite)} className="btn-decline">
                  ❌ Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="lobby-content">
        {/* Sidebar: Online Users */}
        <aside className="online-users-sidebar">
          <h3>👥 Online Users ({onlineUsers.length})</h3>
          <div className="users-list">
            {onlineUsers.length === 0 ? (
              <p className="no-users">No other users online</p>
            ) : (
              onlineUsers.map((user, index) => (
                <div key={index} className="user-item">
                  <span className="user-avatar">👤</span>
                  <span className="user-email">{user.email || user.userId}</span>
                  <span className="online-indicator">🟢</span>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main: Available Tables */}
        <main className="tables-section">
          <div className="section-header">
            <h2>🎮 Active Tables</h2>
            <button onClick={openCreateModal} className="btn-create-table">
              ➕ Create Table
            </button>
          </div>

          <div className="tables-grid">
            {availableTables.length === 0 ? (
              <div className="no-tables">
                <p>No active tables</p>
                <p>Be the first to create one!</p>
              </div>
            ) : (
              availableTables.map((table) => (
                <div key={table.id} className="table-card">
                  <div className="table-header">
                    <h4>{table.tableName}</h4>
                    <span className="table-status">{table.status === 'pending' ? '🟢 WAITING' : '🎮 IN PROGRESS'}</span>
                  </div>
                  <div className="table-info">
                    <div className="info-item">
                      <span className="label">Entry Fee:</span>
                      <span className="value">{table.entryFee} USDT</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Players:</span>
                      <span className="value">{table.currentPlayers}/{table.maxPlayers}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-join" 
                    onClick={() => joinTable(table)}
                    disabled={table.currentPlayers >= table.maxPlayers || table.status !== 'pending'}
                  >
                    {table.currentPlayers >= table.maxPlayers ? '🔒 Full' : '▶️ Join Table'}
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Create Table Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Table</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            {/* Step 1: Table Settings */}
            {modalStep === 1 && (
              <div className="modal-body">
                <div className="progress-bar">
                  <div className="progress-step active">1. Settings</div>
                  <div className="progress-step">2. Invite Players</div>
                </div>

                <div className="form-group">
                  <label>Table Name</label>
                  <input
                    type="text"
                    placeholder="e.g., High Rollers Only"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Privacy</label>
                  <div className="privacy-options">
                    <div 
                      className={`privacy-option ${isPublic ? 'selected' : ''}`}
                      onClick={() => setIsPublic(true)}
                    >
                      <span className="icon">🌐</span>
                      <strong>Public Table</strong>
                      <small>Anyone can join</small>
                    </div>
                    <div 
                      className={`privacy-option ${!isPublic ? 'selected' : ''}`}
                      onClick={() => setIsPublic(false)}
                    >
                      <span className="icon">🔒</span>
                      <strong>Private Table</strong>
                      <small>Only invited players can join</small>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Entry Fee (USDT)</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={entryFee}
                      onChange={(e) => setEntryFee(Number(e.target.value))}
                      className="form-input"
                    />
                    <div className="range-slider">
                      <input
                        type="range"
                        min="1"
                        max="1000"
                        value={entryFee}
                        onChange={(e) => setEntryFee(Number(e.target.value))}
                      />
                      <span>1 USDT - 1000 USDT</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Max Players</label>
                    <select
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(Number(e.target.value))}
                      className="form-select"
                    >
                      <option value={2}>2 Players</option>
                      <option value={3}>3 Players</option>
                      <option value={4}>4 Players</option>
                      <option value={5}>5 Players</option>
                      <option value={6}>6 Players</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="form-select"
                  >
                    <option>BEP20 (BSC)</option>
                    <option>ERC20 (Ethereum)</option>
                    <option>TRC20 (Tron)</option>
                  </select>
                </div>

                <div className="pot-summary">
                  <div className="summary-item">
                    <span>Total Pot (if full)</span>
                    <strong>{entryFee * maxPlayers} USDT</strong>
                  </div>
                  <div className="summary-item">
                    <span>Platform Fee (2%)</span>
                    <strong>{(entryFee * maxPlayers * 0.02).toFixed(0)} USDT</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Invite Players */}
            {modalStep === 2 && (
              <div className="modal-body">
                <div className="progress-bar">
                  <div className="progress-step completed">1. Settings ✓</div>
                  <div className="progress-step active">2. Invite Players</div>
                </div>

                <div className="invites-section">
                  <h3>Invite Online Players</h3>
                  <p>Select players from the online list to send them an invite</p>

                  <div className="invite-users-list">
                    {onlineUsers.length === 0 ? (
                      <p className="no-users">No users online to invite</p>
                    ) : (
                      onlineUsers.map((user, index) => (
                        <div key={index} className="invite-user-item">
                          <span className="user-avatar">👤</span>
                          <span className="user-email">{user.email || user.userId}</span>
                          {invitedUsers.includes(user.userId) ? (
                            <span className="invited-badge">✓ Invited</span>
                          ) : (
                            <button 
                              onClick={() => sendInvite(user)}
                              className="btn-invite"
                            >
                              📨 Invite
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {invitedUsers.length > 0 && (
                    <div className="invited-count">
                      📤 {invitedUsers.length} player(s) invited
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="modal-footer">
              {modalStep > 1 && (
                <button onClick={() => setModalStep(modalStep - 1)} className="btn-back">
                  ← Back
                </button>
              )}
              <button onClick={() => setShowCreateModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={nextStep} className="btn-next">
                {modalStep === 1 ? 'Next →' : '🎮 Create & Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameLobby;

