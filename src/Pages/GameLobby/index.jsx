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
import apiService from '../../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const GameLobby = () => {
    const { user, isAuthenticated } = useAuth();
    const { socket, isConnected } = useSocket(); // Use shared socket
    const { isConnected: walletConnected, currentNetwork, getBalance } = useWallet(); // Wallet context for SEKA balance
    const { loggedIn: safeAuthLoggedIn, account: safeAuthAccount, getUSDTBalance: safeAuthGetUSDTBalance, getPrivateKey: safeAuthGetPrivateKey } = useSafeAuth();
    const [activeTab, setActiveTab] = useState('Active Tables');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('All Network');
    const [feeFilter, setFeeFilter] = useState({ min: 5, max: 100, enabled: false });
    const [balance] = useState('$1,247.50 USDT');
    const [sekaBalance, setSekaBalance] = useState(0); // SEKA balance from wallet (for reference)
    const [usdtBalance, setUsdtBalance] = useState(0); // USDT balance from SafeAuth wallet
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedTableForInvite, setSelectedTableForInvite] = useState(null);
    const [insufficientBalanceModal, setInsufficientBalanceModal] = useState({ isOpen: false, requiredAmount: 0, currentBalance: 0 });
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [availableTables, setAvailableTables] = useState([]);
    const [userId, setUserId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    // Initialize user credentials from AuthContext or fallback
    useEffect(() => {
        if (isAuthenticated && user) {
            const authUserId = user.id || user.userId;
            const authEmail = user.email;
            const authName = user.username || user.name || user.email?.split('@')[0] || 'Player';
            const authAvatar = user.avatar || user.profilePicture || null;
            setUserId(authUserId);
            setUserEmail(authEmail);
            setUserName(authName);
            setUserAvatar(authAvatar);
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
        }
    }, [isAuthenticated, user]);

    // Connectivity diagnostics (console output)
    useEffect(() => {
        (async () => {
            try {
                console.log('🩺 [Diagnostics] Starting connectivity checks from GameLobby...');
                try {
                    const health = await apiService.makeRequest('/health');
                    console.log('✅ [Diagnostics] Backend reachable (/api/v1/health):', health);
                } catch (e) {
                    console.error('❌ [Diagnostics] Backend /health failed:', e?.message || e);
                }
                try {
                    const tables = await apiService.getGameTables();
                    console.log('✅ [Diagnostics] Database query ok (tables):', Array.isArray(tables) ? tables.length : tables);
                } catch (e) {
                    console.error('❌ [Diagnostics] Database query failed (tables):', e?.message || e);
                }
            } catch (e) {
                console.error('❌ [Diagnostics] Unexpected error:', e?.message || e);
            }
        })();
    }, []);

    useEffect(() => {
        const fetchUSDTBalance = async () => {
            if (safeAuthLoggedIn && safeAuthAccount && safeAuthGetUSDTBalance && isAuthenticated) {
                try {
                    const balance = await safeAuthGetUSDTBalance();
                    setUsdtBalance(parseFloat(balance) || 0);
                } catch (error) {
                    setUsdtBalance(0);
                }
            } else {
                setUsdtBalance(0);
            }
        };
        fetchUSDTBalance();
        let interval;
        if (safeAuthLoggedIn && safeAuthAccount && isAuthenticated) {
            interval = setInterval(fetchUSDTBalance, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [safeAuthLoggedIn, safeAuthAccount, isAuthenticated, safeAuthGetUSDTBalance]);

    useEffect(() => {
        const fetchSekaBalance = async () => {
            if (walletConnected && currentNetwork) {
                try {
                    const balance = await getBalance(currentNetwork);
                    setSekaBalance(parseFloat(balance) || 0);
                } catch (error) {
                    setSekaBalance(0);
                }
            } else {
                setSekaBalance(0);
            }
        };
        fetchSekaBalance();
    }, [walletConnected, currentNetwork, getBalance]);

    useEffect(() => {
        if (!socket || !userId || !isConnected) return;

        const handleTableCreated = (data) => {
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
            setAvailableTables(prev => {
                if (prev.some(t => t.id === data.id)) return prev;
                return [...prev, newTable];
            });
        };

        const handleTableUpdated = (data) => {
            setAvailableTables(prev =>
                prev.map(table =>
                    table.id === data.id
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

        const handleTableRemoved = (data) => {
            setAvailableTables(prev => prev.filter(table => table.id !== data.id));
        };

        socket.on('table_created', handleTableCreated);
        socket.on('table_updated', handleTableUpdated);
        socket.on('table_removed', handleTableRemoved);

        socket.emit('user_online', { userId, email: userEmail, username: userName, avatar: userAvatar });

        const savedTableId = sessionStorage.getItem('seka_currentTableId');
        const savedTableName = sessionStorage.getItem('seka_currentTableName');

        if (savedTableId) {
            socket.emit('get_table_details', { tableId: savedTableId }, (detailsResponse) => {
                if (detailsResponse.success) {
                    const gameUrl = `/game/${savedTableId}?userId=${userId}&email=${encodeURIComponent(userEmail)}&tableName=${encodeURIComponent(savedTableName || savedTableId)}`;
                    window.location.href = gameUrl;
                    return;
                } else {
                    sessionStorage.removeItem('seka_currentTableId');
                    sessionStorage.removeItem('seka_currentTableName');
                }
            });
        }

        setTimeout(() => {
            socket.emit('get_active_tables', { userId }, (response) => {
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
                }
            });
        }, 500);

        return () => {
            socket.off('table_created', handleTableCreated);
            socket.off('table_updated', handleTableUpdated);
            socket.off('table_removed', handleTableRemoved);
        };
    }, [socket, userId, userEmail, userName, userAvatar, isConnected]);

    const filteredGameTables = useMemo(() => {
        let tables = availableTables;

        if (activeTab === 'Active Tables') {
            tables = tables.filter(t => t.status === 'Waiting' || t.status === 'In Progress');
        } else if (activeTab === 'My Games' || activeTab === 'History') {
            tables = [];
        }

        // Only BSC
        tables = tables.filter(table =>
            selectedNetwork === 'All Network'
                ? table.network === 'BEP20' || table.network === 'BSC'
                : table.network === 'BEP20' || table.network === 'BSC'
        );

        tables = tables.filter(table => {
            if (table.isPrivate || table.privacy === 'private') {
                return table.creatorId === userId;
            }
            return true;
        });

        if (feeFilter.enabled) {
            tables = tables.filter(table => {
                const entryFee = typeof table.entryFee === 'string'
                    ? parseFloat(table.entryFee.replace(/[^\d.]/g, ''))
                    : table.entryFee;
                return entryFee >= feeFilter.min && entryFee <= feeFilter.max;
            });
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase().trim();
            tables = tables.filter(table => {
                const matchesIdOrNetwork =
                    table.id.toLowerCase().includes(lowerSearch) ||
                    table.network.toLowerCase().includes(lowerSearch);
                const playerCountString = `${table.currentPlayers}/${table.maxPlayers}`;
                const matchesPlayerCount = playerCountString.includes(lowerSearch);
                const matchesCurrentPlayers =
                    !isNaN(lowerSearch) &&
                    table.currentPlayers === parseInt(lowerSearch);
                return matchesIdOrNetwork || matchesPlayerCount || matchesCurrentPlayers;
            });
        }

        return tables;
    }, [availableTables, activeTab, selectedNetwork, searchTerm, feeFilter, userId]);

    const handleCreateTable = () => setIsCreateModalOpen(true);
    const handleCloseModal = () => setIsCreateModalOpen(false);
    const handleInviteFriends = (table) => {
        setSelectedTableForInvite(table);
        setIsInviteModalOpen(true);
    };

    const handleJoinTable = async (table) => {
        if (!table) {
            alert('⚠️ Table data missing. Please try again.');
            return;
        }
        if (!socket) {
            alert('❌ Not connected to server');
            return;
        }
        const entryFee = table.entryFee || 10;
        const entryFeeNum = typeof entryFee === 'string' ? parseFloat(entryFee.replace(/[^\d.]/g, '')) : entryFee;

        if (!safeAuthLoggedIn || !safeAuthAccount) {
            alert('❌ Please connect your wallet first!\n\nYou need to connect your Web3Auth wallet to play.');
            return;
        }
        if (usdtBalance < entryFeeNum) {
            setInsufficientBalanceModal({
                isOpen: true,
                requiredAmount: entryFeeNum,
                currentBalance: usdtBalance
            });
            return;
        }

        let privateKey = null;
        if (safeAuthGetPrivateKey) {
            try {
                privateKey = await safeAuthGetPrivateKey();
            } catch (error) {
                // proceed regardless
            }
        }
        socket.emit('join_table', {
            tableId: table.id,
            userId: userId,
            userEmail: userEmail,
            username: userName,
            avatar: userAvatar,
            tableName: table.tableName || table.name || 'Game Table',
            entryFee: table.entryFee || 10,
            privateKey
        }, (response) => {
            if (response.success) {
                sessionStorage.setItem('seka_currentTableId', table.id);
                sessionStorage.setItem('seka_currentTableName', table.tableName || table.id);
                const gameUrl = `/game/${table.id}?userId=${userId}&email=${encodeURIComponent(userEmail)}&tableName=${encodeURIComponent(table.tableName || table.id)}`;
                window.location.href = gameUrl;
            } else {
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
            const entryFeeNum = tableData.entryFee || 10;
            if (!safeAuthLoggedIn || !safeAuthAccount) {
                alert('❌ Please connect your wallet first!\n\nYou need to connect your Web3Auth wallet to create and join a game.');
                return;
            }
            if (usdtBalance < entryFeeNum) {
                setInsufficientBalanceModal({
                    isOpen: true,
                    requiredAmount: entryFeeNum,
                    currentBalance: usdtBalance
                });
                return;
            }

            socket.emit('create_table', {
                tableName: tableData.tableName,
                entryFee: tableData.entryFee || 10,
                maxPlayers: tableData.maxPlayers || 6,
                privacy: tableData.privacy || 'public',
                creatorId: userId,
                creatorEmail: userEmail,
                creatorUsername: userName,
                creatorAvatar: userAvatar
            }, async (response) => {
                if (response.success) {
                    const tableId = response.tableId;
                    setIsCreateModalOpen(false);

                    let creatorPrivateKey = null;
                    if (safeAuthGetPrivateKey) {
                        try {
                            creatorPrivateKey = await safeAuthGetPrivateKey();
                        } catch (error) {}
                    }
                    socket.emit('join_table', {
                        tableId: tableId,
                        userId: userId,
                        userEmail: userEmail,
                        username: userName,
                        avatar: userAvatar,
                        tableName: tableData.tableName || 'Game Table',
                        entryFee: tableData.entryFee || 10,
                        privateKey: creatorPrivateKey
                    }, (joinResponse) => {
                        if (joinResponse.success) {
                            const gameUrl = `/game/${tableId}?userId=${userId}&email=${encodeURIComponent(userEmail)}&tableName=${encodeURIComponent(tableData.tableName)}`;
                            window.location.href = gameUrl;
                        } else {
                            alert(`❌ Failed to join your own table: ${joinResponse.message}`);
                        }
                    });
                } else {
                    alert(`❌ Failed to create table: ${response.message}`);
                }
            });
        } catch (error) {
            alert(`Failed to create table: ${error.message || 'Please try again.'}`);
        }
    };

    const handleSearch = setSearchTerm;
    const handleNetworkChange = setSelectedNetwork;
    const handleFeeChange = (feeValue) => {
        setFeeFilter(prev => ({
            ...prev,
            max: parseInt(feeValue),
            enabled: true
        }));
    };
    const handleRefresh = () => {};

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
                    feeFilter={feeFilter}
                    onFeeToggle={(enabled) => setFeeFilter(prev => ({ ...prev, enabled }))}
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
