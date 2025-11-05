import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSocket } from '../../../contexts/SocketContext';
import apiService from '../../../services/api';
import './index.css';

const InviteFriendsModal = ({ isOpen, onClose, tableData, onCreateTable }) => {
    const { user } = useAuth();
    const { socket } = useSocket(); // Use shared socket from SocketContext
    const [activeTab, setActiveTab] = useState('friends');
    const [emailAddress, setEmailAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Online users from WebSocket
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const [selectedFriends, setSelectedFriends] = useState([]);
    const [isCreatingTable, setIsCreatingTable] = useState(false);

    // Fetch online users when modal opens
    useEffect(() => {
        if (isOpen && socket) {
            console.log('📱 InviteFriendsModal: Fetching online users via shared socket');
            
            // Request online users
            setIsLoadingUsers(true);
            socket.emit('get_online_users', {}, (response) => {
                console.log('📱 Online users response:', response);
                if (response?.success) {
                    setOnlineUsers(response.onlineUsers || []);
                }
                setIsLoadingUsers(false);
            });

            // Listen for online user updates
            const handleUserJoined = (userData) => {
                console.log('📱 User joined lobby:', userData);
                setOnlineUsers(prev => {
                    const exists = prev.find(u => u.userId === userData.userId);
                    if (!exists) {
                        return [...prev, {
                            userId: userData.userId,
                            email: userData.email,
                            username: userData.username || userData.email?.split('@')[0] || 'Player',
                            avatar: userData.avatar,
                            isOnline: true,
                            lastSeen: new Date().toISOString()
                        }];
                    }
                    return prev;
                });
            };

            const handleUserLeft = (userData) => {
                console.log('📱 User left lobby:', userData);
                setOnlineUsers(prev => prev.filter(u => u.userId !== userData.userId));
            };

            socket.on('user_joined_lobby', handleUserJoined);
            socket.on('user_left_lobby', handleUserLeft);

            return () => {
                socket.off('user_joined_lobby', handleUserJoined);
                socket.off('user_left_lobby', handleUserLeft);
            };
        }
    }, [isOpen, socket, user]);

    const handleEmailInvite = async () => {
        if (!emailAddress.trim()) {
            setMessage('Please enter an email address');
            setMessageType('error');
            return;
        }

        if (!tableData) {
            setMessage('No table data available');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const gameUrl = `${window.location.origin}/game/${tableData.id}?invited=true`;
            
            const response = await apiService.sendEmailInvite({
                to: emailAddress,
                tableName: tableData.tableName || tableData.name,
                joinLink: gameUrl,
            });

            if (response.success) {
                setMessage('Invitation sent successfully!');
                setMessageType('success');
                setEmailAddress('');
            } else {
                setMessage('Failed to send invitation. Please try again.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error sending email invitation:', error);
            setMessage('Failed to send invitation. Please try again.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ INSTANT INVITE: Send invitation IMMEDIATELY when clicking invite button
    const handleFriendInvite = async (friendUser) => {
        // Prevent inviting yourself
        if (friendUser.userId === (user?.id || user?.userId)) {
            setMessage('You cannot invite yourself');
            setMessageType('error');
            return;
        }

        if (!tableData) {
            setMessage('Please configure table settings first');
            setMessageType('error');
            return;
        }

        if (!socket || !socket.connected) {
            setMessage('Socket not connected');
            setMessageType('error');
            return;
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🚀 INSTANT INVITE - SENDING NOW!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('To:', friendUser.username);
        console.log('Table:', tableData.tableName);
        console.log('Entry Fee:', tableData.entryFee);
        
        setIsLoading(true);
        
        try {
            // ✅ FIX: Let invite_request handle BOTH table creation AND invitation sending
            // This prevents duplicate table creation!
            const requestPayload = {
                targetUserId: friendUser.userId,
                existingTableId: tableData.id || null, // ✅ Send existing table ID if available
                tableSettings: {
                    tableName: tableData.tableName || 'Game Table',
                    entryFee: tableData.entryFee || 10,
                    maxPlayers: tableData.maxPlayers || 6,
                    isPrivate: !!tableData.isPrivate,
                    network: tableData.network || 'BEP20'
                },
                creator: {
                    userId: user?.id || user?.userId,
                    email: user?.email,
                    username: user?.username || user?.name || user?.email?.split('@')[0],
                    avatar: user?.avatar
                }
            };

            const response = await new Promise((resolve) => {
                socket.emit('invite_request', requestPayload, (res) => resolve(res));
            });
            
            if (response && response.success) {
                console.log('✅ Invitation delivered successfully!');
                console.log('✅ Table created with ID:', response.table?.id);
                
                // ✅ CRITICAL: Store the created table ID for subsequent invites
                if (response.table?.id) {
                    tableData.id = response.table.id;
                    console.log('💾 Saved table ID for future invites:', tableData.id);
                }
                
                setMessage(`Invitation sent to ${friendUser.username}!`);
                setMessageType('success');
                
                // Mark friend as invited
                if (!selectedFriends.includes(friendUser.userId)) {
                    setSelectedFriends(prev => [...prev, friendUser.userId]);
                }
                
                // ✅ DON'T auto-navigate yet - let user send more invites
                console.log('⏳ Waiting for user to send more invites or click CREATE TABLE');
            } else {
                console.error('❌ Failed to send invitation:', response?.error);
                setMessage(`Failed to send invitation: ${response?.error || 'Unknown error'}`);
                setMessageType('error');
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
        } catch (error) {
            console.error('❌ Error sending invitation:', error);
            setMessage(error.message || 'Failed to send invitation');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ FIXED: Join the existing table that was created during invitation
    const handleCreateAndJoinTable = async () => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎮 CREATE TABLE BUTTON CLICKED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Table already created?', !!tableData.id);
        console.log('Table ID:', tableData.id);
        console.log('Invitations already sent:', selectedFriends.length);
        
        // ✅ CRITICAL FIX: If table was created during invitation, JOIN IT (don't create new one!)
        if (tableData && tableData.id) {
            try {
                setIsCreatingTable(true);
                setMessage('Joining table...');
                
                console.log('✅ Table already exists - joining via WebSocket first...');
                
                // ✅ Step 1: JOIN the existing table via WebSocket
                const joinPromise = new Promise((resolve, reject) => {
                    socket.emit('join_table', {
                        tableId: tableData.id,
                        userId: user?.id || user?.userId,
                        userEmail: user?.email,
                        username: user?.username || user?.name || user?.email?.split('@')[0],
                        avatar: user?.avatar,
                        tableName: tableData.tableName || 'Game Table',
                        entryFee: tableData.entryFee || 10
                    }, (response) => {
                        console.log('📥 Join table response:', response);
                        if (response && response.success) {
                            resolve(response);
                        } else {
                            reject(new Error(response?.message || 'Failed to join table'));
                        }
                    });
                });
                
                await joinPromise;
                console.log('✅ Successfully joined existing table via WebSocket!');
                
                // ✅ Step 2: NOW navigate to the game
                const gameUrl = `/game/${tableData.id}?userId=${user?.id || user?.userId}&email=${encodeURIComponent(user?.email)}&tableName=${encodeURIComponent(tableData.tableName)}`;
                console.log('🚀 Navigating to existing table:', gameUrl);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                onClose();
                window.location.href = gameUrl;
                return;
            } catch (error) {
                console.error('❌ Failed to join existing table:', error);
                setMessage(`Failed to join table: ${error.message}`);
                setMessageType('error');
                return;
            } finally {
                setIsCreatingTable(false);
            }
        }

        if (!onCreateTable) {
            console.error('❌ No onCreateTable function!');
            setMessage('Cannot create table: No table creation function provided');
            setMessageType('error');
            return;
        }

        // ✅ If we reach here, no table was created yet (no invitations sent)
        // This is the case when user clicks CREATE TABLE without sending any invites
        setIsCreatingTable(true);
        setMessage('Creating table...');
        setMessageType('info');

        try {
            // ✅ Create table now (no invitations were sent yet)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🎮 CREATING TABLE NOW');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Table Data:', tableData);
            console.log('Privacy:', tableData.privacy);
            console.log('Creator:', user?.username || user?.name || user?.email);
            
            // Call the parent's onCreateTable with creator data
            const result = await onCreateTable({
                creatorId: user?.id || user?.userId,
                creatorEmail: user?.email,
                creatorUsername: user?.username || user?.name || user?.email?.split('@')[0],
                creatorAvatar: user?.avatar,
            });

            console.log('✅ Table created successfully:', result);
            console.log('   Table ID:', result?.id);
            
            // ✅ SEND INVITATIONS BEFORE CLOSING MODAL
            if (result && result.id && selectedFriends.length > 0) {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📤 SENDING INVITATIONS');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('Selected Friends IDs:', selectedFriends);
                console.log('Available Online Users:', onlineUsers.map(u => ({ id: u.userId, name: u.username })));
                
                // Get full friend data for selected friends
                const friendsToInvite = onlineUsers.filter(u => selectedFriends.includes(u.userId));
                
                console.log('Friends to invite (filtered):', friendsToInvite.map(f => ({ id: f.userId, name: f.username })));
                
                if (friendsToInvite.length === 0) {
                    console.error('❌ No matching friends found in online users!');
                    console.error('   Selected IDs:', selectedFriends);
                    console.error('   Online user IDs:', onlineUsers.map(u => u.userId));
                }
                
                // Send all invitations
                for (const friend of friendsToInvite) {
                    const inviteData = {
                        inviterName: user?.username || user?.name || user?.email?.split('@')[0] || 'Player',
                        fromUserId: user?.id || user?.userId,
                        fromUsername: user?.username || user?.name || user?.email?.split('@')[0],
                        fromEmail: user?.email,
                        fromAvatar: user?.avatar,
                        targetUserId: friend.userId,
                        targetUsername: friend.username,
                        tableName: tableData.tableName || 'Game Table',
                        entryFee: tableData.entryFee || 10,
                        tableId: result.id,
                        gameUrl: `/game/${result.id}`,
                        pending: false,
                    };
                    
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('📤 SENDING INVITATION VIA SOCKET');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('From:', inviteData.inviterName);
                    console.log('To:', friend.username, `(${friend.userId})`);
                    console.log('Table ID:', result.id);
                    console.log('Table Name:', tableData.tableName);
                    console.log('Entry Fee:', tableData.entryFee);
                    console.log('Game URL:', inviteData.gameUrl);
                    console.log('Full data:', JSON.stringify(inviteData, null, 2));
                    console.log('Socket connected:', socket.connected);
                    console.log('Socket ID:', socket.id);
                    
                    // Use Promise to ensure invitation is sent
                    const invitationPromise = new Promise((resolve) => {
                        socket.emit('send_game_invitation', inviteData, (response) => {
                            console.log('📨 Invitation sent response:', response);
                            if (response) {
                                if (response.success) {
                                    console.log('✅ Invitation delivered successfully!');
                                } else {
                                    console.error('❌ Failed to send invitation:', response.error);
                                }
                            } else {
                                console.warn('⚠️ No response from server');
                            }
                            resolve(response);
                        });
                    });
                    
                    await invitationPromise;
                    
                    console.log('✅ Invitation processed for:', friend.username);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                }
                
                console.log('✅ All', friendsToInvite.length, 'invitation(s) sent!');
                setMessage(`Table created! ${friendsToInvite.length} invitation(s) sent!`);
            } else {
                console.log('ℹ️ No invitations to send (selectedFriends:', selectedFriends.length, ')');
                setMessage('Table created! Joining now...');
            }
            
            setMessageType('success');

            // ✅ Wait 1 second before closing modal to ensure invitations are sent
            console.log('⏳ Waiting 1 second before navigation...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('✅ Closing modal and navigating to table...');
            onClose();

        } catch (error) {
            console.error('❌ Error creating table:', error);
            console.error('Stack:', error.stack);
            setMessage(error.message || 'Failed to create table');
            setMessageType('error');
        } finally {
            setIsCreatingTable(false);
        }
    };

    const handleShareLink = () => {
        if (!tableData) return;
        
        const gameUrl = `${window.location.origin}/game/${tableData.id}?invited=true`;
        navigator.clipboard.writeText(gameUrl).then(() => {
            setMessage('Game link copied to clipboard!');
            setMessageType('success');
        }).catch(() => {
            setMessage('Failed to copy link. Please copy manually.');
            setMessageType('error');
        });
    };

    if (!isOpen) return null;

    return (
        <div className="invite-modal-overlay">
            <div className="invite-modal">
                <div className="invite-modal-header">
                    <h2>Invite Friends</h2>
                    <p>Invite friends to join your table.</p>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="invite-modal-tabs">
                        <button 
                        className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
                            onClick={() => setActiveTab('friends')}
                        >
                            Friends List
                        </button>
                        <button 
                        className={`tab-btn ${activeTab === 'share' ? 'active' : ''}`}
                            onClick={() => setActiveTab('share')}
                        >
                            Share Link
                        </button>
                    </div>

                <div className="invite-modal-content">
                    {activeTab === 'friends' && (
                        <>
                            <div className="invite-section">
                                <label>Invite by Email</label>
                                <div className="email-input-group">
                            <input
                                type="email"
                                placeholder="friend@example.com"
                                        value={emailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button 
                                        className="send-btn"
                                        onClick={handleEmailInvite}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : (
                                            <>
                                                <span>📧</span> Send
                                            </>
                                        )}
                            </button>
                        </div>
                    </div>

                            <div className="invite-section">
                                <label>Select Friends</label>
                                <div className="friends-filter">
                                    <select>
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                        <option value="all">All Friends</option>
                                    </select>
                                        </div>
                                <div className="friends-list">
                                    {isLoadingUsers ? (
                                        <div className="loading-users">Loading online users...</div>
                                    ) : (() => {
                                        const currentUserId = user?.id || user?.userId;
                                        const filteredUsers = onlineUsers.filter(onlineUser => onlineUser.userId !== currentUserId);
                                        console.log('Current user ID:', currentUserId);
                                        console.log('Online users:', onlineUsers);
                                        console.log('Filtered users:', filteredUsers);
                                        return filteredUsers.length === 0 ? (
                                            <div className="no-users">No other online users found</div>
                                        ) : (
                                            filteredUsers.map(friendUser => (
                                            <div key={friendUser.userId} className="friend-item">
                                                <div className="friend-info">
                                                    <div className="status-dot online"></div>
                                                    <img 
                                                        src={friendUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friendUser.username)}&background=random`}
                                                        alt={friendUser.username}
                                                        className="friend-avatar"
                                                    />
                                                    <span className="friend-name">{friendUser.username}</span>
                                    </div>
                                    <button 
                                        className={`invite-btn ${selectedFriends.includes(friendUser.userId) ? 'selected' : ''}`}
                                        onClick={() => handleFriendInvite(friendUser)}
                                        disabled={isLoading}
                                    >
                                        {selectedFriends.includes(friendUser.userId) ? (
                                            <>
                                                <span>✓</span> Selected
                                            </>
                                        ) : (
                                            <>
                                                <span>👤</span> Invite
                                            </>
                                        )}
                                    </button>
                                </div>
                                            ))
                                        );
                                    })()}
                        </div>
                    </div>
                        </>
                    )}

                    {activeTab === 'share' && (
                        <div className="share-section">
                            <div className="share-info">
                                <h3>Share Game Link</h3>
                                <p>Copy the link below and share it with your friends:</p>
                                <div className="share-link-container">
                                    <input 
                                        type="text" 
                                        value={tableData ? `${window.location.origin}/game/${tableData.id}?invited=true` : ''}
                                        readOnly
                                        className="share-link-input"
                                    />
                                    <button 
                                        className="copy-btn"
                                        onClick={handleShareLink}
                                        disabled={!tableData}
                                    >
                                        📋 Copy
                        </button>
                    </div>
                </div>
            </div>
                    )}

                    {message && (
                        <div className={`message ${messageType}`}>
                            {message}
            </div>
            )}
                </div>

                <div className="invite-modal-footer">
                    <button className="back-btn" onClick={onClose}>
                        Back
                    </button>
                    <button 
                        className="create-btn"
                        onClick={handleCreateAndJoinTable}
                        disabled={isCreatingTable}
                    >
                        {isCreatingTable ? (
                            <>
                                <span>⏳</span> Creating...
                            </>
                        ) : (
                            <>
                                CREATE TABLE
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteFriendsModal;
