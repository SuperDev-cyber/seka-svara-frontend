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

    // NEW: Send invitation immediately when Invite button is clicked
    const handleFriendInvite = (friendUser) => {
        // Prevent inviting yourself
        if (friendUser.userId === (user?.id || user?.userId)) {
            return;
        }

        if (!socket || !socket.connected) {
            console.error('❌ Socket not connected');
            setMessage('Socket not connected');
            setMessageType('error');
            return;
        }

        // Generate a pending table ID (will be created when first person joins)
        const pendingTableId = `pending-${user?.id}-${Date.now()}`;

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📤 SENDING INVITATION (immediate)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const inviteData = {
            fromUserId: user?.id || user?.userId,
            fromUsername: user?.username || user?.name || user?.email?.split('@')[0],
            targetUserId: friendUser.userId,
            targetUsername: friendUser.username,
            tableName: tableData.tableName || 'Game Table',
            tableId: pendingTableId,
            entryFee: tableData.entryFee || 10,
            // Include table settings so it can be created on-demand
            tableSettings: {
                tableName: tableData.tableName,
                privacy: tableData.privacy,
                entryFee: tableData.entryFee,
                maxPlayers: tableData.maxPlayers || 6,
                network: tableData.network
            },
            gameUrl: `${window.location.origin}/game/${pendingTableId}`
        };

        console.log('📤 To:', friendUser.username, '(' + friendUser.userId + ')');
        console.log('📤 Table ID (pending):', pendingTableId);
        console.log('📤 My socket ID:', socket.id);
        
        socket.emit('send_game_invitation', inviteData);
        
        console.log('✅ Invitation sent!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Store pending table info for creator
        sessionStorage.setItem('pendingTableId', pendingTableId);
        sessionStorage.setItem('pendingTableData', JSON.stringify(tableData));
        
        setMessage(`Invitation sent to ${friendUser.username}!`);
        setMessageType('success');
        
        // Mark as invited (visual feedback)
        if (!selectedFriends.includes(friendUser.userId)) {
            setSelectedFriends([...selectedFriends, friendUser.userId]);
        }
    };

    // NEW: Join button - navigate to table (will be created on-demand)
    const handleJoinTable = () => {
        const pendingTableId = sessionStorage.getItem('pendingTableId');
        
        if (!pendingTableId) {
            setMessage('No pending table found. Please send an invitation first.');
            setMessageType('error');
            return;
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎮 JOINING TABLE (will create if needed)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Table ID:', pendingTableId);
        console.log('User:', user?.username || user?.email);
        
        // Navigate to table - it will be created on-demand in GameTable component
        const gameUrl = `/game/${pendingTableId}?userId=${user?.id || user?.userId}&email=${encodeURIComponent(user?.email)}&tableName=${encodeURIComponent(tableData.tableName || 'Game Table')}`;
        console.log('🚀 Navigating to:', gameUrl);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        window.location.href = gameUrl;
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
                    {activeTab === 'friends' && selectedFriends.length > 0 && (
                        <button 
                            className="create-btn"
                            onClick={handleJoinTable}
                            disabled={isLoading}
                        >
                            <span>🎮</span> JOIN TABLE
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InviteFriendsModal;
