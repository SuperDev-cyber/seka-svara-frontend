import React, { useState, useMemo, useEffect } from 'react';
import './index.css';
import {
    GameLobbyHeader,
    SearchFilterBar,
    NavigationTabs,
    GameTableGrid
} from '../../components/gamelobby';
import CreateTableModal from '../../components/gamelobby/CreateTableModal';
import MyGamesSection from '../../components/gamelobby/MyGamesSection';
import InviteFriendsModal from '../../components/gamelobby/InviteFriendsModal';
import InsufficientBalanceModal from '../../components/common/InsufficientBalanceModal';
import DepositModal from '../../components/wallet/DepositModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useWallet } from '../../contexts/WalletContext';
import { useSafeAuth } from '../../contexts/SafeAuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const GameLobby = () => {
    const { user, isAuthenticated } = useAuth();
    const { socket, isConnected } = useSocket(); // Use shared socket
    const { isConnected: walletConnected, currentNetwork, getBalance } = useWallet(); // Wallet context for SEKA balance
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance } = useSafeAuth();
    const [activeTab, setActiveTab] = useState('Active Tables');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('All Network');
    const [balance] = useState('$1,247.50 USDT');
    const [sekaBalance, setSekaBalance] = useState(0); // SEKA balance from wallet (for reference)
    const [usdtBalance, setUsdtBalance] = useState(0); // USDT balance from SafeAuth wallet
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedTableForInvite, setSelectedTableForInvite] = useState(null);
    const [insufficientBalanceModal, setInsufficientBalanceModal] = useState({ isOpen: false, requiredAmount: 0, currentBalance: 0 });
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    
    // Dynamic game tables from backend
    const [availableTables, setAvailableTables] = useState([]);
    
    // User credentials (get from session or generate)
    const [userId, setUserId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    // Initialize user credentials from AuthContext or fallback
    useEffect(() => {
        if (isAuthenticated && user) {
            // Use authenticated user data
            const authUserId = user.id || user.userId;
            const authEmail = user.email;
            const authName = user.username || user.name || user.email?.split('@')[0] || 'Player';
            const authAvatar = user.avatar || user.profilePicture || null;
            
            setUserId(authUserId);
            setUserEmail(authEmail);
            setUserName(authName);
            setUserAvatar(authAvatar);
            
            console.log('✅ GameLobby using authenticated user data:', { authUserId, authEmail, authName, authAvatar });
        } else {
            // Fallback to sessionStorage or generate new
            const storedUserId = sessionStorage.getItem('userId');
            const storedEmail = sessionStorage.getItem('userEmail');
            const storedName = sessionStorage.getItem('userName');
            
            if (storedUserId && storedEmail) {
                setUserId(storedUserId);
                setUserEmail(storedEmail);
                setUserName(storedName || storedEmail.split('@')[0]);
                setUserAvatar(null);
            } else {
                const randomNum = Math.floor(Math.random() * 10000);
                const newEmail = `player${randomNum}@seka.game`;
                const newId = 'user_' + Math.random().toString(36).substring(2, 9);
                const newName = `Player${randomNum}`;
                
                sessionStorage.setItem('userId', newId);
                sessionStorage.setItem('userEmail', newEmail);
                sessionStorage.setItem('userName', newName);
                
                setUserId(newId);
                setUserEmail(newEmail);
                setUserName(newName);
                setUserAvatar(null);
            }
            
            console.log('⚠️ GameLobby using fallback user data');
        }
    }, [isAuthenticated, user]);

    // ✅ Fetch USDT balance from SafeAuth wallet (for game entry validation)
    useEffect(() => {
        const fetchUSDTBalance = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance && isAuthenticated) {
                try {
                    const balance = await safeAuthGetUSDTBalance();
                    setUsdtBalance(parseFloat(balance) || 0);
                    console.log('💰 USDT Balance updated from SafeAuth:', balance);
                } catch (error) {
                    console.error('Error fetching USDT balance:', error);
                    setUsdtBalance(0);
                }
            } else {
                setUsdtBalance(0);
            }
        };

        fetchUSDTBalance();
        
        // Refresh every 5 seconds when SafeAuth is connected
        let interval;
        if (safeAuthLoggedIn && safeAuthAccount && isAuthenticated) {
            interval = setInterval(fetchUSDTBalance, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [safeAuthLoggedIn, safeAuthAccount, isAuthenticated, safeAuthGetUSDTBalance]);

    // Fetch SEKA balance from connected wallet (for reference)
    useEffect(() => {
        const fetchSekaBalance = async () => {
            if (walletConnected && currentNetwork) {
                try {
                    const balance = await getBalance(currentNetwork);
                    const balanceNum = parseFloat(balance) || 0;
                    setSekaBalance(balanceNum);
                    console.log('💰 SEKA Contract Balance (reference):', balanceNum);
                } catch (error) {
                    console.error('❌ Error fetching SEKA balance:', error);
                    setSekaBalance(0);
                }
            } else {
                setSekaBalance(0);
            }
        };

        fetchSekaBalance();
    }, [walletConnected, currentNetwork, getBalance]);

    // No initial fetch needed - tables come from WebSocket only!

    // Set up WebSocket listeners for real-time updates
    useEffect(() => {
        if (!socket || !userId || !isConnected) {
            console.log('⏳ Waiting for socket connection...', { socket: !!socket, userId, isConnected });
            return;
        }

        console.log('✅ GameLobby: Setting up socket listeners with shared socket');
        console.log('   Socket ID:', socket.id);
        console.log('   User ID:', userId);

        // Listen for new tables (IN-MEMORY) - ATTACH LISTENERS FIRST
        const handleTableCreated = (data) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🎮 TABLE_CREATED EVENT RECEIVED!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📊 Raw Data:', JSON.stringify(data, null, 2));
            console.log('   Table ID:', data.id);
            console.log('   Table Name:', data.tableName);
            console.log('   Entry Fee:', data.entryFee);
            console.log('   Players:', data.currentPlayers, '/', data.maxPlayers);
            console.log('   Status:', data.status);
            console.log('   Creator:', data.creatorEmail);
            
            const newTable = {
                id: data.id,
                tableName: data.tableName,
                status: 'Waiting',
                players: [],
                playerCount: `${data.currentPlayers}/${data.maxPlayers}`,
                entryFee: `${data.entryFee} USDT`,
                totalPot: `${data.entryFee * data.currentPlayers} USDT`,
                network: 'BSC',
                gameId: data.id
            };
            
            console.log('✅ Formatted table:', newTable);
            
            setAvailableTables(prev => {
                console.log(`📋 Current tables count: ${prev.length}`);
                
                // Prevent duplicates
                if (prev.some(t => t.id === data.id)) {
                    console.log('   ⚠️ Duplicate table detected, skipping');
                    return prev;
                }
                
                const newTables = [...prev, newTable];
                console.log(`   ✅ Adding table. New count: ${newTables.length}`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                return newTables;
            });
        };

        // Listen for table updates (IN-MEMORY)
        const handleTableUpdated = (data) => {
            console.log('🔄 Table updated (IN-MEMORY):', data);
            setAvailableTables(prev =>
                prev.map(table =>
                    table.id === data.id  // FIXED: Use table.id instead of table.gameId
                        ? {
                            ...table,
                            playerCount: `${data.currentPlayers}/${data.maxPlayers}`,
                            totalPot: `${data.entryFee * data.currentPlayers} USDT`,
                            status: data.status === 'waiting' ? 'Waiting' : 'In Progress'
                        }
                        : table
                )
            );
        };

        // Listen for table removal (IN-MEMORY - auto-deleted when empty)
        const handleTableRemoved = (data) => {
            console.log('🗑️ Table removed (IN-MEMORY - empty):', data);
            setAvailableTables(prev => prev.filter(table => table.id !== data.id));  // FIXED: Use table.id
        };

        // Attach event listeners FIRST
        socket.on('table_created', handleTableCreated);
        socket.on('table_updated', handleTableUpdated);
        socket.on('table_removed', handleTableRemoved);

        console.log('✅ Socket event listeners attached');

        // NOW join lobby room and request data
        socket.emit('user_online', { userId, email: userEmail, username: userName, avatar: userAvatar });
        console.log('📡 Emitted user_online, joining lobby room...');
        
        // AUTO-REJOIN: Check if user was in a table before refresh/disconnect
        const savedTableId = sessionStorage.getItem('seka_currentTableId');
        const savedTableName = sessionStorage.getItem('seka_currentTableName');
            
        if (savedTableId) {
            console.log('🔄 Found saved table membership:', savedTableId);
            console.log('   Checking if table still exists...');
            
            // Verify table still exists
            socket.emit('get_table_details', { tableId: savedTableId }, (detailsResponse) => {
                if (detailsResponse.success) {
                    console.log('✅ Table still exists! Auto-rejoining...');
                    // Auto-navigate back to game table
                    const gameUrl = `/game/${savedTableId}?userId=${userId}&email=${encodeURIComponent(userEmail)}&tableName=${encodeURIComponent(savedTableName || savedTableId)}`;
                    console.log('🚀 Auto-redirecting to:', gameUrl);
                    window.location.href = gameUrl;
                    return; // Exit early, don't load lobby
                } else {
                    console.log('❌ Saved table no longer exists, clearing sessionStorage');
                    sessionStorage.removeItem('seka_currentTableId');
                    sessionStorage.removeItem('seka_currentTableName');
                }
            });
        }
        
        // Request active tables from memory (with small delay to ensure we're in lobby room)
        setTimeout(() => {
            console.log('📋 Requesting active tables...');
            socket.emit('get_active_tables', { userId }, (response) => { // ✅ Send userId to filter private tables
                if (response.success) {
                    const formattedTables = response.tables.map(table => ({
                        id: table.id,
                        tableName: table.tableName,
                        status: table.status === 'waiting' ? 'Waiting' : 'In Progress',
                        players: [],
                        playerCount: `${table.currentPlayers}/${table.maxPlayers}`,
                        entryFee: `${table.entryFee} USDT`,
                        totalPot: `${table.entryFee * table.currentPlayers} USDT`,
                        network: 'BSC',
                        gameId: table.id
                    }));
                    setAvailableTables(formattedTables);
                    console.log('📋 Loaded', formattedTables.length, 'tables from memory');
                    console.log('📋 Tables:', formattedTables);
                } else {
                    console.log('❌ Failed to load tables:', response);
                }
            });
        }, 500);

        // Cleanup function
        return () => {
            console.log('🧹 GameLobby: Cleaning up socket listeners');
            socket.off('table_created', handleTableCreated);
            socket.off('table_updated', handleTableUpdated);
            socket.off('table_removed', handleTableRemoved);
        };
    }, [socket, userId, userEmail, userName, userAvatar, isConnected]);

    // Filter game tables based on search, network, and tab
    const filteredGameTables = useMemo(() => {
        let tables = availableTables; // Use dynamic data instead of static

        // Filter by tab
        if (activeTab === 'Active Tables') {
            tables = tables.filter(t => t.status === 'Waiting' || t.status === 'In Progress');
        } else if (activeTab === 'My Games') {
            // For now, return empty array - would be populated with user's games
            tables = [];
        } else if (activeTab === 'History') {
            // For now, return empty array - would be populated with game history
            tables = [];
        }

        // Filter by network
        if (selectedNetwork !== 'All Network') {
            tables = tables.filter(table => table.network === selectedNetwork);
        }

        // Filter by search term
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase().trim();
            tables = tables.filter(table => {
                // Search by table ID or network (existing)
                const matchesIdOrNetwork = 
                    table.id.toLowerCase().includes(lowerSearch) ||
                    table.network.toLowerCase().includes(lowerSearch);
                
                // ✅ NEW: Search by player count
                // Supports: "2/6", "2", "3/6", etc.
                const playerCountString = `${table.currentPlayers}/${table.maxPlayers}`;
                const matchesPlayerCount = playerCountString.includes(lowerSearch);
                
                // Match if search is just a number (e.g., "2" matches tables with 2 current players)
                const matchesCurrentPlayers = 
                    !isNaN(lowerSearch) && 
                    table.currentPlayers === parseInt(lowerSearch);
                
                return matchesIdOrNetwork || matchesPlayerCount || matchesCurrentPlayers;
            });
        }

        return tables;
    }, [availableTables, activeTab, selectedNetwork, searchTerm]);

    // Event handlers
    const handleCreateTable = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
    };

    // Handle inviting friends to a table
    const handleInviteFriends = (table) => {
        setSelectedTableForInvite(table);
        setIsInviteModalOpen(true);
    };

    // Handle joining a table
    const handleJoinTable = (table) => {
        console.log('🎯 Joining table:', table.id);
        console.log('   User:', userId, userEmail);
        
        if (!socket) {
            alert('❌ Not connected to server');
            return;
        }

        // ✅ FRONTEND BALANCE VALIDATION
        const entryFee = table.entryFee || 10;
        const entryFeeNum = typeof entryFee === 'string' ? parseFloat(entryFee.replace(/[^\d.]/g, '')) : entryFee;
        
        if (!safeAuthLoggedIn || !safeAuthAccount) {
            alert('❌ Please connect your wallet first!\n\nYou need to connect your Web3Auth wallet to play.');
            return;
        }
        
        // Check USDT balance instead of platformScore
        if (usdtBalance < entryFeeNum) {
            setInsufficientBalanceModal({
                isOpen: true,
                requiredAmount: entryFeeNum,
                currentBalance: usdtBalance
            });
            return;
        }
        
        console.log('✅ Balance check passed:', usdtBalance, '>=', entryFeeNum);
        
        // First, join via WebSocket
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔄 JOINING TABLE:', table.id);
        console.log('   User ID:', userId);
        console.log('   Email:', userEmail);
        
        socket.emit('join_table', {
            tableId: table.id,
            userId: userId,
            userEmail: userEmail,
            username: userName,
            avatar: userAvatar,
            tableName: table.tableName || table.name || 'Game Table',
            entryFee: table.entryFee || 10
        }, (response) => {
            console.log('📥 JOIN_TABLE RESPONSE:', JSON.stringify(response, null, 2));
            
            if (response.success) {
                console.log('✅ Successfully joined table!');
                
                // STORE table membership in sessionStorage for auto-rejoin
                sessionStorage.setItem('seka_currentTableId', table.id);
                sessionStorage.setItem('seka_currentTableName', table.tableName || table.id);
                console.log('💾 Stored table membership in sessionStorage');
                
                // Navigate to game table WITH userId and email
                const gameUrl = `/game/${table.id}?userId=${userId}&email=${encodeURIComponent(userEmail)}&tableName=${encodeURIComponent(table.tableName || table.id)}`;
                console.log('🚀 Navigating to:', gameUrl);
                
                window.location.href = gameUrl;
            } else {
                console.error('❌ Failed to join table:', response.message);
                alert(`❌ Failed to join table: ${response.message}`);
            }
        });
    };

    const handleCreateTableSubmit = async (tableData) => {
        try {
            if (!socket || !socket.connected) {
                alert('❌ Not connected to server. Please refresh the page.');
                return;
            }

            // ✅ FRONTEND BALANCE VALIDATION
            const entryFeeNum = tableData.entryFee || 10;
            
            if (!safeAuthLoggedIn || !safeAuthAccount) {
                alert('❌ Please connect your wallet first!\n\nYou need to connect your Web3Auth wallet to create and join a game.');
                return;
            }
            
            // Check USDT balance instead of platformScore
            if (usdtBalance < entryFeeNum) {
                setInsufficientBalanceModal({
                    isOpen: true,
                    requiredAmount: entryFeeNum,
                    currentBalance: usdtBalance
                });
                return;
            }
            
            console.log('✅ Balance check passed for table creation:', usdtBalance, '>=', entryFeeNum);

            console.log('Creating table (IN-MEMORY) with data:', tableData);
            
            // Create table via WebSocket (IN-MEMORY)
            socket.emit('create_table', {
                tableName: tableData.tableName,
                entryFee: tableData.entryFee || 10,
                maxPlayers: tableData.maxPlayers || 6,
                privacy: tableData.privacy || 'public', // ✅ Add privacy setting
                creatorId: userId,
                creatorEmail: userEmail,
                creatorUsername: userName,
                creatorAvatar: userAvatar
            }, (response) => {
                console.log('📥 CREATE_TABLE RESPONSE:', response);
                
                if (response.success) {
                    const tableId = response.tableId;
                    console.log('✅ Table created successfully!');
                    console.log('   Table ID:', tableId);
                    console.log('   Table Name:', tableData.tableName);
                    
                    setIsCreateModalOpen(false);
                    
                    // IMMEDIATELY JOIN THE TABLE (creator must join before navigating)
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('🔄 CREATOR JOINING TABLE...');
                    console.log('   Table ID:', tableId);
                    console.log('   User ID:', userId);
                    console.log('   Email:', userEmail);
                    
                    socket.emit('join_table', {
                        tableId: tableId,
                        userId: userId,
                        userEmail: userEmail,
                        username: userName,
                        avatar: userAvatar,
                        tableName: tableData.tableName || 'Game Table',
                        entryFee: tableData.entryFee || 10
                    }, (joinResponse) => {
                        console.log('📥 JOIN_TABLE RESPONSE:', JSON.stringify(joinResponse, null, 2));
                        
                        if (joinResponse.success) {
                            console.log('✅ Creator successfully joined table!');
                            
                            // DON'T store session for waiting tables
                            // Only store when game actually starts
                            console.log('⏳ Session will be stored when game starts (prevents duplicate on reopen)');
                            
                            // NOW navigate to game table
                            const gameUrl = `/game/${tableId}?userId=${userId}&email=${encodeURIComponent(userEmail)}&tableName=${encodeURIComponent(tableData.tableName)}`;
                            console.log('🚀 Navigating to:', gameUrl);
                            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                            
                            // Force navigation
                            window.location.href = gameUrl;
                        } else {
                            console.error('❌ Creator failed to join table:', joinResponse.message);
                            alert(`❌ Failed to join your own table: ${joinResponse.message}`);
                        }
                    });
                } else {
                    console.error('❌ Failed to create table:', response.message);
                    alert(`❌ Failed to create table: ${response.message}`);
                }
            });
            
        } catch (error) {
            console.error('❌ Error creating table:', error);
            alert(`Failed to create table: ${error.message || 'Please try again.'}`);
        }
    };

    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);
    };

    const handleNetworkChange = (networkValue) => {
        setSelectedNetwork(networkValue);
    };

    const handleFeeChange = (feeValue) => {
        console.log('Fee changed:', feeValue);
        // Implement fee filtering logic if needed
    };

    const handleRefresh = () => {
        console.log('Refresh clicked');
        // Implement refresh logic
    };

    return (
        <div className='game-lobby-page'>
            <div className='game-lobby-container'>
                <GameLobbyHeader 
                    balance={balance}
                    onCreateTable={handleCreateTable}
                />
                <SearchFilterBar 
                    onSearch={handleSearch}
                    onNetworkChange={handleNetworkChange}
                    onFeeChange={handleFeeChange}
                    onRefresh={handleRefresh}
                />
                <NavigationTabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                    activeTablesCount={availableTables.length}
                />
                {activeTab === 'My Games' ? (
                    <MyGamesSection />
                ) : (
                    <>
                        {console.log('🎯 RENDERING GameTableGrid with tables:', filteredGameTables)}
                        {console.log('   Available tables:', availableTables.length)}
                        {console.log('   Filtered tables:', filteredGameTables.length)}
                        {filteredGameTables.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                color: '#888',
                                fontSize: '18px'
                            }}>
                                {availableTables.length === 0 
                                    ? '📭 No active tables. Create one to start playing!'
                                    : '🔍 No tables match your filters. Try adjusting your search.'}
                            </div>
                        )}
                        <GameTableGrid 
                            gameTables={filteredGameTables} 
                            onJoinTable={handleJoinTable}
                            onInviteFriends={handleInviteFriends}
                        />
                    </>
                )}
            </div>
            
            <CreateTableModal 
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                onCreateTable={handleCreateTableSubmit}
            />
            
            <InviteFriendsModal 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                tableData={selectedTableForInvite}
            />
        </div>
    );
};

export default GameLobby;
