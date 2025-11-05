import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContext';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { useGameActions } from '../../hooks/useGameActions';
import apiService from '../../services/api';
import cardBack from '../../assets/images/card.png';
import USDTIcon from '../../assets/images/usdt-icon.png';
import tableTop from '../../assets/images/table-top-image.png';
import Banner from '../../components/gameTable/Banner';
import Felt from '../../components/gameTable/Felt';
import WinnerModal from '../../components/gameTable/WinnerModal';
import RightPanel from '../../components/gameTable/RightPanel';
import WalletBalance from '../../components/wallet/WalletBalance';
import BettingControls from '../../components/wallet/BettingControls';
import CardDealingAnimation from '../../components/gameTable/CardDealingAnimation';
import PlayerActionModal from '../../components/gameTable/PlayerActionModal';
import './index.css';

const GameTablePage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isConnected, getBalance, currentNetwork } = useWallet();
    const { user, isAuthenticated } = useAuth();
    const { socket, isConnected: socketConnected } = useSocket(); // Use shared socket
    
    // Dynamic table data from in-memory storage
    const [tableData, setTableData] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ✅ Read invitation table settings from sessionStorage
    const [invitationSettings, setInvitationSettings] = useState(null);
    useEffect(() => {
        const pendingTableData = sessionStorage.getItem('pendingTableData');
        if (pendingTableData) {
            try {
                const parsedData = JSON.parse(pendingTableData);
                console.log('📋 Found invitation table settings:', parsedData);
                setInvitationSettings(parsedData);
            } catch (error) {
                console.error('❌ Error parsing pendingTableData:', error);
            }
        }
    }, []);
    
    const table = location?.state?.table || invitationSettings || { id, network: 'BSC', entryFee: 10, totalPot: 60, playerCount: 6 };
    
    // Game state
    const [gameStatus, setGameStatus] = useState('waiting'); // 'waiting', 'starting', 'in_progress', 'showdown', 'finished'
    const [gameMessage, setGameMessage] = useState('Waiting for players...');
    const [playerCards, setPlayerCards] = useState({}); // { userId: [{ rank: 'A', suit: '♠' }, ...] }
    const [showCards, setShowCards] = useState(false); // Whether to show face-up cards
    const [currentTurnUserId, setCurrentTurnUserId] = useState(null); // Whose turn is it
    const [currentBet, setCurrentBet] = useState(0); // Current bet to call
    const [pot, setPot] = useState(0); // Total pot amount
    const [dealerId, setDealerId] = useState(null); // Current dealer
    
    // Card dealing animation state (NO dealer avatar - pure Canvas animation)
    const [isDealingCards, setIsDealingCards] = useState(false);
    const [cardsDealt, setCardsDealt] = useState(false); // Cards only show AFTER animation
    
    // SEKA balance from wallet (real-time)
    const [sekaBalance, setSekaBalance] = useState(null);
    
    // ✅ Platform score (backend database) - updates immediately on win
    const [platformScore, setPlatformScore] = useState(0);
    
    // Track if current user has viewed their cards (to show betting controls)
    const [hasViewedCards, setHasViewedCards] = useState(false);
    
    // Track which players have viewed their cards (for card display in Felt)
    const [cardViewers, setCardViewers] = useState([]);
    
    // ✅ NEW: Track which players have called in this round (for detecting game completion)
    const [calledPlayers, setCalledPlayers] = useState([]);
    
    // Winner modal state
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winnerData, setWinnerData] = useState(null);
    
    // Player action notification modal
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionData, setActionData] = useState(null);
    
    // Ready status - REMOVED (auto-start enabled)
    // Countdown timer for game start
    const [countdown, setCountdown] = useState(null);
    const [showCountdown, setShowCountdown] = useState(false);
    const countdownIntervalRef = useRef(null); // Store countdown interval to prevent duplicates
    
    // Extract tableId from params
    // The ID should already be in format: table_xxx
    // If it's not, it might be a cached old version
    const tableId = id.startsWith('table_') ? id : id;
    
    console.log('🎮 GameTable mounted');
    console.log('   URL param id:', id);
    console.log('   Extracted tableId:', tableId);
    
    // Get user data from AuthContext or fallback to URL/sessionStorage
    const urlParams = new URLSearchParams(location.search);
    let userId, userEmail, userName, userAvatar;
    
    if (isAuthenticated && user) {
        // ALWAYS use authenticated user data when available (ignore URL params)
        userId = user.id || user.userId;
        userEmail = user.email;
        userName = user.username || user.name || user.email?.split('@')[0] || 'Player';
        userAvatar = user.avatar || user.profilePicture || null;
        
        console.log('✅ Using authenticated user data (ignoring URL params):');
        console.log('   User ID:', userId);
        console.log('   User Email:', userEmail);
        console.log('   User Name:', userName);
        console.log('   User Avatar:', userAvatar);
    } else {
        // Fallback to URL params or sessionStorage
        userId = urlParams.get('userId') || sessionStorage.getItem('seka_userId');
        userEmail = urlParams.get('email') || sessionStorage.getItem('seka_userEmail');
        userName = urlParams.get('username') || sessionStorage.getItem('seka_userName') || 'Guest Player';
        userAvatar = null;
        
        // If still not found, generate new ones
        if (!userId || !userEmail) {
            const randomNum = Math.floor(Math.random() * 10000);
            userEmail = `player${randomNum}@seka.game`;
            userId = 'user_' + Math.random().toString(36).substring(2, 9);
            userName = `Player${randomNum}`;
            
            sessionStorage.setItem('seka_userId', userId);
            sessionStorage.setItem('seka_userEmail', userEmail);
            sessionStorage.setItem('seka_userName', userName);
            
            console.log('🆕 Generated new user credentials');
        }
        
        console.log('⚠️ Using fallback user data:');
        console.log('   User ID:', userId);
        console.log('   User Email:', userEmail);
        console.log('   User Name:', userName);
    }

    // Slider state
    const [sliderValue, setSliderValue] = useState(25);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);

    // Dropdown state
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    
    // Chat modal state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const chatMessagesEndRef = useRef(null); // For auto-scroll

    // Slider configuration
    const minValue = 25;
    const maxValue = 1000;

    const handleSliderMouseDown = useCallback((e) => {
        setIsDragging(true);
        handleSliderMove(e);
    }, []);

    const handleSliderMove = useCallback((e) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const newValue = Math.round(minValue + (maxValue - minValue) * percentage);

        setSliderValue(newValue);
    }, [minValue, maxValue]);

    const handleSliderMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleOpenDropdown = useCallback(() => {
        setIsOpenDropdown(!isOpenDropdown);
    }, [isOpenDropdown]);
    
    const handleChatToggle = useCallback(() => {
        setIsChatOpen(!isChatOpen);
    }, [isChatOpen]);
    
    const handleSendMessage = useCallback(() => {
        if (!chatMessage.trim()) {
            console.log('⚠️ Cannot send empty message');
            return;
        }
        
        if (!socket || !socket.connected) {
            console.error('❌ Socket not connected');
            alert('Connection lost. Please refresh the page.');
            return;
        }
        
        if (!tableData || !tableData.id) {
            console.error('❌ No table data');
            return;
        }
        
        const messageText = chatMessage.trim();
        
        // Validate message length
        if (messageText.length > 500) {
            alert('Message too long (max 500 characters)');
            return;
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💬 SENDING CHAT MESSAGE');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Table ID:', tableData.id);
        console.log('User:', user?.username || user?.name || user?.email);
        console.log('Message:', messageText);
        
        setIsSendingMessage(true);
        
        const messageData = {
            tableId: tableData.id,
            userId: user?.id || user?.userId,
            username: user?.username || user?.name || user?.email?.split('@')[0] || 'Player',
            message: messageText,
        };
        
        // Emit to socket with callback
        socket.emit('send_table_chat', messageData, (response) => {
            console.log('📨 Chat response:', response);
            setIsSendingMessage(false);
            
            if (response && response.success) {
                console.log('✅ Message sent successfully!');
                // Clear input only on success
                setChatMessage('');
            } else {
                console.error('❌ Failed to send message:', response?.error);
                alert(`Failed to send message: ${response?.error || 'Unknown error'}`);
            }
        });
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, [chatMessage, socket, tableData, user]);

    // ✅ CONSOLIDATED: Use custom hook for all game actions
    const gameActions = useGameActions(socket, tableId, userId);
    
    // Game action handlers - now using the consolidated hook
    const handleBet = useCallback(async (amount) => {
        try {
            console.log('💰 Placing bet:', amount);
            await gameActions.raise(amount); // Bet is implemented as a raise action
            console.log('✅ Bet successful');
        } catch (error) {
            console.error('❌ Bet failed:', error.message);
            alert(`Bet failed: ${error.message}`);
        }
    }, [gameActions]);

    const handleFold = useCallback(async () => {
        try {
            await gameActions.fold();
        } catch (error) {
            console.error('Fold failed:', error.message);
            alert(`Fold failed: ${error.message}`);
        }
    }, [gameActions]);

    const handleCall = useCallback(async (amount) => {
        try {
            await gameActions.call(amount || currentBet);
        } catch (error) {
            console.error('Call failed:', error.message);
            alert(`Call failed: ${error.message}`);
        }
    }, [gameActions, currentBet]);

    const handleRaise = useCallback(async (amount) => {
        try {
            await gameActions.raise(amount);
        } catch (error) {
            console.error('Raise failed:', error.message);
            alert(`Raise failed: ${error.message}`);
        }
    }, [gameActions]);

    const handleAllIn = useCallback(async (amount) => {
        try {
            await gameActions.allIn(amount);
        } catch (error) {
            console.error('All-in failed:', error.message);
            alert(`All-in failed: ${error.message}`);
        }
    }, [gameActions]);

    const handleBlind = useCallback(async (amount) => {
        try {
            await gameActions.blindBet(amount);
            console.log('🎲 Blind bet successful!');
        } catch (error) {
            console.error('Blind bet failed:', error.message);
            alert(`Blind bet failed: ${error.message}`);
        }
    }, [gameActions]);

    // Add global mouse events when dragging
    React.useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e) => handleSliderMove(e);
            const handleMouseUp = () => handleSliderMouseUp();

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleSliderMove, handleSliderMouseUp]);

    // JOIN TABLE ONCE when component mounts (use ref to prevent multiple calls!)
    const hasJoinedTable = useRef(false);
    
    useEffect(() => {
        if (!socket || !socketConnected) {
            console.log('⏳ Waiting for shared socket connection...');
            return;
        }
        
        console.log('🔗 Joining table to ensure it exists...');
        hasJoinedTable.current = true; // Set flag BEFORE emitting to prevent duplicates
        
        // ✅ Use actual entry fee from invitation settings or fallback
        const actualEntryFee = invitationSettings?.entryFee || table?.entryFee || 10;
        const actualTableName = invitationSettings?.tableName || table?.tableName || 'Invited Game';
        
        console.log('📊 Join Table Settings:');
        console.log('   Entry Fee:', actualEntryFee);
        console.log('   Table Name:', actualTableName);
        console.log('   Invitation Settings:', invitationSettings);
        
        socket.emit('join_table', {
            tableId: tableId,
            userId: userId,
            userEmail: userEmail,
            username: userName,
            avatar: userAvatar,
            tableName: actualTableName,
            entryFee: actualEntryFee
        }, (joinResponse) => {
            if (joinResponse && joinResponse.success) {
                console.log('✅ Successfully joined/created table');
                
                // ✅ FIX: Set initial player list from join response for immediate sync
                if (joinResponse.players && joinResponse.players.length > 0) {
                    console.log('👥 Setting initial player list from join response:', joinResponse.players);
                    const formattedPlayers = joinResponse.players.map(player => ({
                        ...player,
                        username: player.username || player.email?.split('@')[0] || 'Player',
                        avatar: player.avatar || null,
                        balance: player.balance || 0
                    }));
                    setPlayers(formattedPlayers);
                    console.log('✅ Player list initialized:', formattedPlayers.length, 'player(s)');
                } else {
                    console.log('⚠️ No player list in join response');
                }
            } else {
                console.warn('⚠️ Join table response:', joinResponse);
            }
        });
    }, [socket, socketConnected, tableId, userId, userEmail, userName, userAvatar, invitationSettings, table]); // ✅ Added invitationSettings and table

    // Fetch SEKA balance from connected wallet (real-time)
    useEffect(() => {
        const fetchSekaBalance = async () => {
            if (isConnected && currentNetwork) {
                try {
                    const balance = await getBalance(currentNetwork);
                    const balanceNum = parseFloat(balance) || 0;
                    setSekaBalance(balanceNum);
                    console.log('💰 USDT Balance fetched for game table:', balanceNum);
                } catch (error) {
                    console.error('❌ Error fetching USDT balance:', error);
                    setSekaBalance(null);
                }
            } else {
                setSekaBalance(null);
            }
        };

        fetchSekaBalance();
        
        // Refresh balance every 10 seconds for real-time updates
        const balanceInterval = setInterval(fetchSekaBalance, 10000);
        
        return () => clearInterval(balanceInterval);
    }, [isConnected, currentNetwork, getBalance]);

    // ✅ Sync platform score from user context (PRIMARY SOURCE)
    // This updates in real-time via socket when winner receives payout
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log("🏆 GameTable - Syncing platformScore from user context:", user.platformScore);
            setPlatformScore(user?.platformScore || 0);
        } else {
            setPlatformScore(0);
        }
    }, [isAuthenticated, user]);

    // ✅ GAME STATE PERSISTENCE HELPERS
    const saveGameState = useCallback(() => {
        if (!tableId) return;
        
        const gameState = {
            tableId,
            userId,
            gameStatus,
            players,
            playerCards,
            pot,
            currentBet,
            currentTurnUserId,
            hasViewedCards,
            cardViewers,
            cardsDealt,
            showCards: false, // Don't persist showCards to prevent spoilers
            timestamp: Date.now()
        };
        
        sessionStorage.setItem(`seka_gameState_${tableId}`, JSON.stringify(gameState));
        console.log('💾 Game state saved to sessionStorage');
    }, [tableId, userId, gameStatus, players, playerCards, pot, currentBet, currentTurnUserId, hasViewedCards, cardViewers, cardsDealt]);

    const restoreGameState = useCallback(() => {
        if (!tableId) return false;
        
        const savedState = sessionStorage.getItem(`seka_gameState_${tableId}`);
        if (!savedState) {
            console.log('📭 No saved game state found');
            return false;
        }
        
        try {
            const gameState = JSON.parse(savedState);
            
            // Check if state is not too old (within 1 hour)
            const ageMs = Date.now() - gameState.timestamp;
            if (ageMs > 3600000) {
                console.log('⏰ Saved state is too old, discarding');
                sessionStorage.removeItem(`seka_gameState_${tableId}`);
                return false;
            }
            
            console.log('📦 Restoring game state from sessionStorage:', gameState);
            
            // Restore state
            setGameStatus(gameState.gameStatus || 'waiting');
            setPlayers(gameState.players || []);
            setPlayerCards(gameState.playerCards || {});
            setPot(gameState.pot || 0);
            setCurrentBet(gameState.currentBet || 0);
            setCurrentTurnUserId(gameState.currentTurnUserId || null);
            setHasViewedCards(gameState.hasViewedCards || false);
            setCardViewers(gameState.cardViewers || []);
            setCardsDealt(gameState.cardsDealt || false);
            
            console.log('✅ Game state restored successfully');
            return true;
        } catch (error) {
            console.error('❌ Error restoring game state:', error);
            sessionStorage.removeItem(`seka_gameState_${tableId}`);
            return false;
        }
    }, [tableId]);

    // Update current user's balance in players array with real-time SEKA balance
    useEffect(() => {
        if (sekaBalance !== null && players.length > 0 && userId) {
            setPlayers(prevPlayers => 
                prevPlayers.map(player => 
                    player.userId === userId || player.email === userEmail
                        ? { ...player, balance: sekaBalance }
                        : player
                )
            );
        }
    }, [sekaBalance, userId, userEmail]);

    // ✅ Save game state whenever critical state changes
    useEffect(() => {
        if (gameStatus === 'in_progress' && players.length > 0) {
            saveGameState();
        }
    }, [gameStatus, players, playerCards, pot, currentBet, currentTurnUserId, hasViewedCards, cardViewers, cardsDealt, saveGameState]);

    // ✅ Restore game state on mount (page refresh)
    useEffect(() => {
        const restored = restoreGameState();
        if (restored) {
            console.log('🔄 Page refreshed - game state restored');
        }
    }, [restoreGameState]);

    // Fetch table data from in-memory storage via WebSocket
    useEffect(() => {
        if (!socket || !socketConnected) {
            console.log('⏳ Waiting for shared socket connection...');
            return;
        }
        
        console.log('🎮 Using shared socket for table:', tableId);
        console.log('✅ Socket already connected');
        
        // Request table details
        console.log('📡 Requesting table details for:', tableId);
        socket.emit('get_table_details', { tableId }, (response) => {
            console.log('📊 Table details response:', JSON.stringify(response, null, 2));
            
            if (response.success) {
                console.log('✅ Table found:', response.table.tableName);
                console.log('   Table ID:', response.table.id);
                console.log('   Players:', response.table.players.length, '/', response.table.maxPlayers);
                console.log('   Player list:', response.table.players.map(p => p.email));
                
                setTableData(response.table);
                setPlayers(response.table.players);
                setError(null);
                setLoading(false);
                
                // STORE table membership for auto-rejoin (ONLY for in-progress games)
                if (response.table.status === 'in_progress') {
                    sessionStorage.setItem('seka_currentTableId', response.table.id);
                    sessionStorage.setItem('seka_currentTableName', response.table.tableName);
                    sessionStorage.setItem('seka_tableStatus', response.table.status);
                    console.log('💾 Stored IN_PROGRESS table membership for reconnection');
                } else {
                    // Waiting table - don't persist (prevents duplicate join on reopen)
                    sessionStorage.removeItem('seka_currentTableId');
                    sessionStorage.removeItem('seka_currentTableName');
                    sessionStorage.removeItem('seka_tableStatus');
                    console.log('🧹 Waiting table - not persisting to session');
                }
            } else {
                console.error('❌ Failed to load table:', response.message);
                console.error('   Requested table ID:', tableId);
                setError(`Table not found: ${tableId}`);
                setLoading(false);
                
                // Clear stale table membership
                sessionStorage.removeItem('seka_currentTableId');
                sessionStorage.removeItem('seka_currentTableName');
                sessionStorage.removeItem('seka_tableStatus');
            }
        });
        
        // RECONNECTION HANDLER: Auto-rejoin after network recovery
        const handleReconnect = () => {
            console.log('🔄 Reconnected to server! Re-syncing table state...');
            
            // Re-fetch table details after reconnection
            socket.emit('get_table_details', { tableId }, (response) => {
                if (response.success) {
                    console.log('✅ Re-synced table state after reconnection');
                    setTableData(response.table);
                    setPlayers(response.table.players);
                    setError(null);
                } else {
                    console.error('❌ Table no longer exists after reconnection');
                    setError('Table no longer available');
                    // Clear sessionStorage
                    sessionStorage.removeItem('seka_currentTableId');
                    sessionStorage.removeItem('seka_currentTableName');
                    sessionStorage.removeItem('seka_tableStatus');
                }
            });
        };

        // Listen for player joins
        const handleTableUpdated = (data) => {
            if (data.id === tableId) {
                console.log('📝 Table updated:', data);
                // Re-fetch table details
                socket.emit('get_table_details', { tableId }, (response) => {
                    if (response.success) {
                        setTableData(response.table);
                        setPlayers(response.table.players);
                    }
                });
            }
        };

        // Listen for table auto-deletion (10-minute idle timeout)
        const handleTableClosed = (data) => {
            console.log('⏱️ Table closed due to timeout:', data);
            alert(`⏱️ Table Closed\n\n${data.reason}\n\nYou will be redirected to the lobby.`);
            
            // Clear sessionStorage
            sessionStorage.removeItem('seka_currentTableId');
            sessionStorage.removeItem('seka_currentTableName');
            sessionStorage.removeItem('seka_tableStatus');
            
            // Redirect to lobby
            window.location.href = '/gamelobby';
        };

        // Listen for game starting event (auto-triggered when table is full)
        const handleGameStarting = (data) => {
            console.log('🎮 Game is starting!', data);
            
            // ✅ FIX: Clear any existing countdown interval before starting new one
            if (countdownIntervalRef.current) {
                console.log('⚠️ Clearing existing countdown interval');
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            
            setGameStatus('starting');
            setGameMessage(data.message || '🎮 Game is starting! Get ready...');
            
            // Show countdown timer with duration from backend
            const countdownDuration = data.countdown || 10; // Default to 10 seconds
            setShowCountdown(true);
            setCountdown(countdownDuration);
            
            console.log(`⏱️ Starting ${countdownDuration}-second countdown...`);
            
            // Start countdown
            let timeLeft = countdownDuration;
            countdownIntervalRef.current = setInterval(() => {
                timeLeft--;
                setCountdown(timeLeft);
                
                if (timeLeft <= 0) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                    setShowCountdown(false);
                }
            }, 1000);
            
            // Show notification
            setTimeout(() => {
                setGameMessage('Dealing cards...');
            }, 2000);
        };

        // ✅ NEW: Listen for game start failure
        const handleGameStartFailed = (data) => {
            console.error('❌ Game failed to start:', data);
            
            // Clear countdown interval
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            
            // Reset to waiting state
            setGameStatus('waiting');
            setShowCountdown(false);
            setGameMessage('');
            
            // Show error message to user
            alert(`❌ Game Failed to Start\n\n${data.message}\n\nError: ${data.error}\n\nPlease try again or leave the table.`);
        };

        // Listen for game started event
        const handleGameStarted = (data) => {
            console.log('✅ Game has started!', data);
            
            // ✅ FIX: Clear countdown interval when game starts
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            
            setGameStatus('in_progress');
            setGameMessage('🎴 Cards dealt! Game is now in progress!');
            
            // Hide countdown if still showing
            setShowCountdown(false);
            
            // ✅ FIX: Reset card viewing state for new game (both flags)
            setHasViewedCards(false);
            setCardViewers([]); // ✅ Clear all card viewers for new round
            setCalledPlayers([]); // ✅ Reset called players tracking for new round
            console.log('🃏 Reset card viewing state: hasViewedCards=false, cardViewers=[]');
            console.log('📞 Reset called players tracking: calledPlayers=[]');
            
            // NOW store table status as in_progress (allows auto-rejoin)
            sessionStorage.setItem('seka_currentTableId', tableId);
            sessionStorage.setItem('seka_currentTableName', tableData?.tableName || tableId);
            sessionStorage.setItem('seka_tableStatus', 'in_progress');
            console.log('💾 Game started - stored IN_PROGRESS status for auto-rejoin');
            
            // FALLBACK: If dealer display doesn't show within 5 seconds, show controls anyway
            setTimeout(() => {
                if (!cardsDealt) {
                    console.log('⚠️ Dealer display timeout - showing controls anyway');
                    setCardsDealt(true);
                    setShowCards(true);
                }
            }, 5000);
            
            // Auto-hide banner after 3 seconds
            setTimeout(() => {
                setGameMessage('');
            }, 3000);
            
            // ✅ Trigger smooth card dealing animation (NO dealer avatar)
            if (data.gameState && data.gameState.dealerId) {
                console.log('🎴 Starting card dealing animation...');
                
                // RESET card dealt state - cards should NOT show yet
                setCardsDealt(false);
                setShowCards(false);
                setPlayerCards({});
                
                // Start smooth Canvas animation after a brief delay
                setTimeout(() => {
                    setIsDealingCards(true);
                }, 500);
            }
            
            // Use real game state from backend - but DON'T show cards yet!
            // Cards will be shown AFTER dealer animation completes
            if (data.gameState) {
                const gameState = data.gameState;
                
                console.log('🔍 RAW gameState received:', JSON.stringify(gameState, null, 2));
                
                // IMMEDIATE FALLBACK: If no dealer found, show controls immediately
                if (!gameState.dealerId) {
                    console.log('⚠️ No dealer found - showing controls immediately');
                    setCardsDealt(true);
                    setShowCards(true);
                }
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🎴 CARDS DEALT - GAME STATE');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📊 Full game state:', gameState);
                console.log('👑 Dealer:', gameState.dealerId);
                console.log('');
                console.log('👥 PLAYERS AND THEIR CARDS:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                // Update players with hand scores and balance
                const updatedPlayers = gameState.players.map((player, index) => {
                    console.log("-------------------------------------->>>>>>>>>>>>", player);
                    
                    console.log(`👤 Player ${index + 1}: ${player.userId}`);
                    console.log(`   Balance:`, player.balance);
                    console.log(`   Has Seen Cards: ${player.hasSeenCards}`);
                    console.log('');
                    
                    return {
                        ...player,
                        handScore: player.handScore,
                        handDescription: player.handDescription
                    };
                });
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('💰 POT:', gameState.pot);
                console.log('💵 Current Bet:', gameState.currentBet);
                console.log('👉 Current Turn:', gameState.currentPlayerId);
                console.log('🎮 Phase:', gameState.phase);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('⏳ Cards will display AFTER dealer animation completes...');
                console.log('');
                
                // Store game state but DON'T display cards yet
                setPlayers(updatedPlayers); // Update players with hand scores and balance
                setPot(gameState.pot);
                setCurrentBet(gameState.currentBet);
                setCurrentTurnUserId(gameState.currentPlayerId);
                setDealerId(gameState.dealerId); // Set dealer
                
                console.log('✅ Game state loaded. Waiting for dealer animation...');
                console.log(`💰 Initial Pot: ${gameState.pot}`);
            } else {
                console.error('❌ No gameState received in game_started event!');
            }
        };

        // Start heartbeat to keep game alive
        const heartbeatInterval = setInterval(() => {
            if (socket.connected) {
                socket.emit('heartbeat', { tableId, userId });
            }
        }, 10000); // Send heartbeat every 10 seconds

        // Listen for game termination
        const handleGameTerminated = (data) => {
            console.log('💀 Game terminated:', data);
            alert(`Game terminated: ${data.reason}\n${data.message}`);
            // Navigate back to lobby
            navigate('/gamelobby');
        };

        // Listen for game state updates
        const handleGameStateUpdated = (gameState) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📊 GAME STATE UPDATED');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`💰 Pot: ${gameState.pot} (updated dynamically)`);
            console.log(`💵 Current Bet: ${gameState.currentBet}`);
            console.log(`👉 Current Turn: ${gameState.currentPlayerId}`);
            
            // Update pot, current bet, and current turn
            setPot(gameState.pot);
            setCurrentBet(gameState.currentBet);
            setCurrentTurnUserId(gameState.currentPlayerId);
            
            // Update players with latest balance and scores
            if (gameState.players) {
                const updatedPlayers = gameState.players.map(player => ({
                    ...player,
                    handScore: player.handScore,
                    handDescription: player.handDescription
                }));
                
                setPlayers(updatedPlayers);
                console.log('🔄 Updated player data with latest balances and scores');
            }
            
            // ✅ FIX: Update cardViewers to maintain hand score badge visibility
            if (gameState.cardViewers) {
                setCardViewers(gameState.cardViewers);
                console.log('👁️ Updated cardViewers from game_state_updated:', gameState.cardViewers);
            }
            
            // Update game status if phase changed
            if (gameState.phase === 'showdown' || gameState.phase === 'completed') {
                setGameStatus(gameState.phase);
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        };

        // Listen for player actions
        const handlePlayerActionBroadcast = (data) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🎲 PLAYER ACTION BROADCAST RECEIVED');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   Action data:', data);
            console.log('   Current user:', userId);
            console.log('   Is it me?:', data.userId === userId);
            
            // ✅ Track CALL actions to detect game completion
            // Log the actual action to debug
            console.log('🎯 ACTION RECEIVED:', data.action, 'from user:', data.userId);
            
            // Make comparison case-insensitive
            const actionLower = data.action?.toLowerCase();
            
            if (actionLower === 'call' && data.userId) {
                setCalledPlayers(prev => {
                    if (!prev.includes(data.userId)) {
                        const updated = [...prev, data.userId];
                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        console.log('📞 PLAYER CALLED!');
                        console.log('📞 Player:', data.userId);
                        console.log('📞 Called players so far:', updated);
                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        return updated;
                    } else {
                        console.log('⚠️ Player already in called list:', data.userId);
                    }
                    return prev;
                });
            } else if (actionLower === 'call') {
                console.error('❌ CALL action but no userId!', data);
            }
            
            // Reset called players if someone raises or bets (new betting round)
            if (actionLower === 'raise' || actionLower === 'bet') {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🔄 RAISE/BET DETECTED - RESETTING CALLED PLAYERS');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                setCalledPlayers([]);
            }
            
            // Only show modal for OTHER players' actions (not your own)
            if (data.userId !== userId) {
                // Find player info to display name
                const player = players.find(p => p.userId === data.userId);
                
                setActionData({
                    actionType: data.action,
                    playerName: player?.username || player?.name,
                    playerEmail: player?.email,
                    amount: data.amount || 0
                });
                setShowActionModal(true);
                
                console.log('👀 Showing action modal for other player\'s action');
            } else {
                console.log('ℹ️  This is my own action, not showing modal');
            }
            
            // Update game message for all players
            const actionText = data.action.toUpperCase();
            const amountText = data.amount > 0 ? ` (${Math.round(Number(data.amount) || 0)} USDT)` : '';
            setGameMessage(`Player ${data.action}ed${amountText}`);
            
            // Update game state if provided
            if (data.gameState) {
                console.log('📊 Updating game state from action broadcast');
                setPot(data.gameState.pot || pot);
                setCurrentBet(data.gameState.currentBet || currentBet);
                setCurrentTurnUserId(data.gameState.currentPlayerId);
                
                // Update players list
                if (data.gameState.players) {
                    setPlayers(data.gameState.players);
                    
                    // ✅ CHECK: Did everyone call? If yes, game should complete
                    const activePlayers = data.gameState.players.filter(p => 
                        p.isActive && !p.hasFolded && p.balance > 0
                    );
                    
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('🎮 CHECKING GAME COMPLETION CONDITIONS');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('📋 Total players in game:', data.gameState.players.length);
                    console.log('📋 Active players (not folded, balance > 0):', activePlayers.length);
                    console.log('📞 Players who have called (state):', calledPlayers.length);
                    console.log('📞 Current action:', data.action);
                    console.log('📞 Current action user:', data.userId);
                    
                    // Calculate how many have called (including current action if it's a call)
                    const actionIsCall = data.action?.toLowerCase() === 'call';
                    const totalCalled = actionIsCall ? calledPlayers.length + 1 : calledPlayers.length;
                    
                    console.log('📊 COMPARISON:');
                    console.log('   Active Players:', activePlayers.map(p => `${p.username || p.email} (${p.userId.substring(0, 8)})`));
                    console.log('   Called Players:', actionIsCall ? [...calledPlayers, data.userId] : calledPlayers);
                    console.log('   Called Count:', totalCalled);
                    console.log('   Need:', activePlayers.length);
                    
                    // Check if all active players have called
                    const allActiveCalled = activePlayers.every(p => {
                        const hasCalled = (actionIsCall && data.userId === p.userId) || calledPlayers.includes(p.userId);
                        console.log(`   ✓ ${p.username || p.email}: ${hasCalled ? 'CALLED ✅' : 'NOT CALLED ❌'}`);
                        return hasCalled;
                    });
                    
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('🎯 ALL CALLED?:', allActiveCalled);
                    console.log('🎯 ENOUGH PLAYERS?:', activePlayers.length > 1);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    
                    if (allActiveCalled && activePlayers.length > 1) {
                        console.log('');
                        console.log('🎉🎉🎉 ALL PLAYERS HAVE CALLED! 🎉🎉🎉');
                        console.log('🎯 Game should complete - requesting showdown...');
                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        
                        // Request server to trigger showdown
                        setTimeout(() => {
                            console.log('📡 Emitting force_showdown to backend...');
                            socket.emit('force_showdown', {
                                tableId: id,
                                reason: 'All players called'
                            });
                        }, 500);
                    } else {
                        console.log('⏳ Game continues - not all players have called yet');
                        if (!allActiveCalled) {
                            console.log('   Reason: Some players haven\'t called');
                        }
                        if (activePlayers.length <= 1) {
                            console.log('   Reason: Not enough active players');
                        }
                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    }
                }
                
                // ✅ FIX: Update cardViewers to maintain hand score badge visibility
                if (data.gameState.cardViewers) {
                    setCardViewers(data.gameState.cardViewers);
                    console.log('👁️ Updated cardViewers:', data.gameState.cardViewers);
                }
                
                console.log('✅ Game state updated:');
                console.log('   Current turn:', data.gameState.currentPlayerId);
                console.log('   Pot:', data.gameState.pot);
                console.log('   Current bet:', data.gameState.currentBet);
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        };

        // Handle showdown (reveal hands and determine winner)
        const handleShowdown = async (data) => {
            console.log('🏆 SHOWDOWN!', data);
            setGameStatus('showdown');
            setGameMessage('Showdown! Revealing hands...');
            
            // ✅ IMMEDIATE BALANCE UPDATE: Balance updates automatically via socket
            // The backend sends 'balance_updated' event to winners
            // SocketContext listener updates AuthContext.user.platformScore
            // This component re-renders automatically when user.platformScore changes
            const isWinner = data.winners && data.winners.includes(userId);
            if (isWinner) {
                console.log('🎉 YOU WON! Balance will update via socket event...');
            }
            
            // NOW everyone sees ALL players' cards AND scores (full reveal)
            const allCards = {};
            const updatedPlayersWithScores = data.players.map(player => {
                allCards[player.userId] = player.hand || [];
                console.log(`🃏 ${player.userId}: ${player.hand?.map(c => c.rank + c.suit).join(' ')}`);
                console.log(`   Score: ${player.handScore} pts - ${player.handDescription || 'Unknown'}`);
                
                return {
                    userId: player.userId,
                    email: player.email || player.userId,
                    hand: player.hand,
                    handScore: player.handScore,
                    handDescription: player.handDescription,
                    balance: player.balance,
                    totalBet: player.totalBet,
                    isWinner: player.isWinner,
                    winnings: player.winnings,
                    hasSeenCards: true // All cards revealed in showdown
                };
            });
            
            setPlayerCards(allCards);
            setPlayers(updatedPlayersWithScores); // Update with scores for display
            setShowCards(true); // Show all cards during showdown
            
            console.log('✅ Showdown: All hands and scores revealed!');
            
            // Display winner modal after a brief delay
            setTimeout(() => {
                console.log('🏆 Setting winner data for modal:');
                console.log('   data:', data);
                console.log('   data.pot:', data.pot);
                console.log('   current pot state:', pot);
                
                // ✅ Use current pot state if data.pot is 0 or undefined
                const winnerInfo = {
                    ...data,
                    pot: data.pot || pot || 0
                };
                console.log('   final winnerData.pot:', winnerInfo.pot);
                
                setShowWinnerModal(true);
                setWinnerData(winnerInfo);
            }, 2000);
        };

        // Handle game completion
        const handleGameCompleted = (data) => {
            console.log('✅ Game completed!', data);
            setGameStatus('finished');
            setGameMessage('Game finished!');
            
            // ✅ Clear saved game state on completion
            if (tableId) {
                sessionStorage.removeItem(`seka_gameState_${tableId}`);
                console.log('🧹 Cleared saved game state (game completed)');
            }
        };

        // READY/START system removed - using auto-start instead

        // Handle player removed due to insufficient balance
        const handlePlayerRemovedInsufficientBalance = (data) => {
            console.log('💰 Player removed - insufficient balance:', data);
            
            if (data.userId === userId) {
                alert(`You have been removed from the table.\nYour balance (${data.balance}) is less than the entry fee (${data.entryFee}).`);
                sessionStorage.removeItem('seka_currentTableId');
                sessionStorage.removeItem('seka_currentTableName');
                sessionStorage.removeItem('seka_tableStatus');
                navigate('/gamelobby');
            }
        };

        // Handle table reset for new game
        const handleTableResetForNewGame = (data) => {
            console.log('🔄 Table reset for new game:', data);
            setGameStatus('waiting');
            setGameMessage('');
            setPlayerCards({});
            setShowCards(false);
            setPot(0);
            setCurrentBet(0);
            setCurrentTurnUserId(null);
            setPlayers(data.players);
            
            // Reset card dealing animation state
            setIsDealingCards(false);
            setCardsDealt(false);
            
            // ✅ FIX: Reset card viewing state for new game (both flags)
            setHasViewedCards(false);
            setCardViewers([]); // ✅ Clear all card viewers for new round
            setCalledPlayers([]); // ✅ Reset called players tracking for new round
            console.log('🃏 Reset card viewing state: hasViewedCards=false, cardViewers=[]');
            console.log('📞 Reset called players tracking: calledPlayers=[]');
            
            // ✅ Clear saved game state on reset
            if (tableId) {
                sessionStorage.removeItem(`seka_gameState_${tableId}`);
                console.log('🧹 Cleared saved game state (table reset)');
            }
        };

        // ✅ Handle game restart countdown (after all players close modal)
        const handleGameRestartCountdown = (data) => {
            console.log('⏰ Game restart countdown:', data);
            setCountdown(data.secondsRemaining);
            setShowCountdown(true);
            setGameMessage(data.message || `Next game starting in ${data.secondsRemaining} seconds...`);
            
            // Hide countdown when it reaches 0
            if (data.secondsRemaining === 0) {
                setShowCountdown(false);
            }
        };

        // Handle player seeing their cards
        const handlePlayerSeenCards = (data) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('👁️ PLAYER SEEN CARDS BROADCAST EVENT');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   Who saw cards?', data.userId);
            console.log('   Current user in this browser:', userId);
            console.log('   Is it me?', data.userId === userId);
            
            if (data.gameState) {
                // ✅ CRITICAL FIX: Only update state if the broadcast is about the CURRENT user
                // This prevents other players' VIEW CARDS clicks from affecting this browser
                if (data.userId === userId) {
                    console.log('✅ This broadcast is about ME! Updating my state...');
                    
                    // Show cards for the current user
                    setPlayerCards(prevCards => {
                        const updatedCards = { ...prevCards }; // Keep existing cards
                        const currentUserData = data.gameState.players.find(p => p.userId === userId);
                        
                        if (currentUserData && currentUserData.hasSeenCards) {
                            updatedCards[userId] = currentUserData.hand || [];
                            console.log(`👁️ YOU (${userId.substring(0,8)}) can now see your cards:`, currentUserData.hand);
                            console.log(`   🎯 SCORE: ${currentUserData.handScore} pts`);
                            console.log(`   📋 HAND: ${currentUserData.handDescription}`);
                        }
                        
                        console.log('🎴 Updated playerCards state:', updatedCards);
                        return updatedCards;
                    });
                    
                    // ✅ SHOW bottom betting controls, HIDE Controls modal (only for current user)
                    setHasViewedCards(true);
                    console.log('✅ Switching from Controls modal to bottom betting controls!');
                    } else {
                    console.log('ℹ️  This broadcast is about another player. Not updating hasViewedCards.');
                    }
                    
                // ✅ ALWAYS update players state with latest game state (includes hasSeenCards flags for ALL players)
                // This is needed so card visibility can be determined for all players
                const updatedPlayers = data.gameState.players.map(player => ({
                        ...player,
                        handScore: player.handScore,
                        handDescription: player.handDescription
                }));
                
                setPlayers(updatedPlayers);
                
                // ✅ UPDATE: Extract and set cardViewers array from broadcast
                if (data.gameState.cardViewers) {
                    setCardViewers(data.gameState.cardViewers);
                    console.log('👁️ UPDATED cardViewers STATE FROM BROADCAST:');
                    console.log('   cardViewers:', data.gameState.cardViewers);
                    console.log('   Total viewers:', data.gameState.cardViewers.length);
                }
                
                console.log('✅ Player list updated with latest hasSeenCards flags');
                console.log('📊 Updated players state:', updatedPlayers.map(p => ({
                    userId: p.userId.substring(0,8),
                    hasSeenCards: p.hasSeenCards
                })));
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            }
        };

        const handleDisconnect = () => {
            console.log('❌ Disconnected from game server');
        };

        // ✅ Listen for real-time balance updates after game win
        const handleBalanceUpdated = (data) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('💰 GAMETABLE: BALANCE UPDATE RECEIVED');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   Data:', data);
            console.log('   Current userId:', userId);
            
            // Update the player's balance in the players array
            if (data.userId === userId) {
                console.log('   ✅ This is MY balance update!');
                console.log('   New balance:', data.platformScore);
                
                // Update the players array with new balance
                setPlayers(prevPlayers => {
                    const updated = prevPlayers.map(player => {
                        if (player.userId === data.userId) {
                            console.log(`   Updating player ${player.userId} balance from ${player.balance} to ${data.platformScore}`);
                            return {
                                ...player,
                                balance: data.platformScore // ✅ Update in-game balance for next round
                            };
                        }
                        return player;
                    });
                    console.log('   Updated players array:', updated);
                    return updated;
                });
                
                console.log('   ✅ Player balance updated in GameTable');
            } else {
                console.log(`   ⚠️ Balance update is for different user: ${data.userId}`);
            }
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        };

        // ✅ NEW: Listen for player list updates when someone joins/leaves
        const handlePlayerListUpdated = (data) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('👥 PLAYER LIST UPDATED');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📋 Updated Players:', data.players);
            
            if (data.players) {
                const updatedPlayers = data.players.map(player => ({
                    ...player,
                    userId: player.userId,
                    email: player.email,
                    username: player.username || player.email?.split('@')[0] || 'Player',
                    avatar: player.avatar || player.profilePicture || null, // ✅ Ensure avatar is included
                    balance: player.balance || 0,
                    handScore: player.handScore,
                    handDescription: player.handDescription
                }));
                
                setPlayers(updatedPlayers);
                console.log('✅ Player list updated with avatars');
                console.log('👥 Updated Players:', updatedPlayers.map(p => ({ 
                    username: p.username, 
                    avatar: p.avatar ? '✓ Has Avatar' : '✗ No Avatar' 
                })));
            }
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        };

        // Listen for chat messages
        const handleTableChatMessage = (data) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('💬 RECEIVED CHAT MESSAGE');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('From:', data.username);
            console.log('User ID:', data.userId);
            console.log('Message:', data.message);
            console.log('Timestamp:', data.timestamp);
            console.log('Is from me?', data.userId === (user?.id || user?.userId));
            
            const newMessage = {
                id: Date.now() + Math.random(), // Ensure unique ID
                user: data.userId === (user?.id || user?.userId) ? 'You' : data.username,
                message: data.message,
                time: new Date(data.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                }),
                isMe: data.userId === (user?.id || user?.userId)
            };
            
            console.log('📝 Adding message to chat:', newMessage);
            setChatMessages(prev => {
                const updated = [...prev, newMessage];
                console.log('💬 Total messages:', updated.length);
                
                // Limit message history to prevent memory issues
                if (updated.length > 100) {
                    console.log('🗑️ Trimming old messages (keeping last 100)');
                    return updated.slice(-100);
                }
                
                return updated;
            });
            
            console.log('✅ Message added to chat UI!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        };

        // Attach all event listeners
        socket.on('reconnect', handleReconnect);
        socket.on('table_updated', handleTableUpdated);
        socket.on('table_closed', handleTableClosed);
        socket.on('game_starting', handleGameStarting);
        socket.on('game_start_failed', handleGameStartFailed); // ✅ NEW: Handle game start failures
        socket.on('game_started', handleGameStarted);
        socket.on('game_terminated', handleGameTerminated);
        socket.on('game_state_updated', handleGameStateUpdated);
        socket.on('player_action_broadcast', handlePlayerActionBroadcast);
        socket.on('showdown', handleShowdown);
        socket.on('game_completed', handleGameCompleted);
        socket.on('player_removed_insufficient_balance', handlePlayerRemovedInsufficientBalance);
        socket.on('table_reset_for_new_game', handleTableResetForNewGame);
        socket.on('game_restart_countdown', handleGameRestartCountdown); // ✅ NEW: Countdown after modal closed
        socket.on('balance_updated', handleBalanceUpdated); // ✅ NEW: Real-time balance update for winner
        socket.on('player_seen_cards', handlePlayerSeenCards);
        socket.on('player_list_updated', handlePlayerListUpdated); // ✅ NEW: Player list updates with avatars
        socket.on('table_chat_message', handleTableChatMessage);
        socket.on('disconnect', handleDisconnect);

        return () => {
            // Cleanup event listeners
            socket.off('reconnect', handleReconnect);
            socket.off('table_updated', handleTableUpdated);
            socket.off('table_closed', handleTableClosed);
            socket.off('game_starting', handleGameStarting);
            socket.off('game_start_failed', handleGameStartFailed); // ✅ NEW: Cleanup game start failure listener
            socket.off('game_started', handleGameStarted);
            socket.off('game_terminated', handleGameTerminated);
            socket.off('game_state_updated', handleGameStateUpdated);
            socket.off('player_action_broadcast', handlePlayerActionBroadcast);
            socket.off('showdown', handleShowdown);
            socket.off('game_completed', handleGameCompleted);
            socket.off('player_removed_insufficient_balance', handlePlayerRemovedInsufficientBalance);
            socket.off('table_reset_for_new_game', handleTableResetForNewGame);
            socket.off('game_restart_countdown', handleGameRestartCountdown); // ✅ NEW: Cleanup countdown listener
            socket.off('balance_updated', handleBalanceUpdated); // ✅ NEW: Cleanup balance update listener
            socket.off('player_seen_cards', handlePlayerSeenCards);
            socket.off('player_list_updated', handlePlayerListUpdated); // ✅ NEW: Cleanup player list listener
            socket.off('table_chat_message', handleTableChatMessage);
            socket.off('disconnect', handleDisconnect);
            clearInterval(heartbeatInterval);
            
            // ✅ FIX: Clear countdown interval on component unmount
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        };
    }, [socket, socketConnected, tableId, userId]); // Removed players and tableData to prevent infinite loop!

    // ✅ Auto-scroll to latest chat message
    useEffect(() => {
        if (chatMessagesEndRef.current && isChatOpen) {
            chatMessagesEndRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'end'
            });
        }
    }, [chatMessages, isChatOpen]);

    // CLEAR session storage when browser closes (not just navigating)
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // Call leave_table to properly remove player from backend
            if (socket && socket.connected && tableId && userId) {
                // Don't allow leaving if game is in progress with other players
                if (gameStatus === 'in_progress' && players.length > 1) {
                e.preventDefault();
                    e.returnValue = 'You are currently in a game. Please finish the game or fold before leaving.';
                return e.returnValue;
                }
                
                // If game not started (waiting) or player is alone, allow leaving
                console.log('🚪 Player leaving table via navigation/close...');
                socket.emit('leave_table', {
                    tableId: tableId,
                    userId: userId,
                    userEmail: userEmail
                });
                
                // Clear session storage
                sessionStorage.removeItem('seka_currentTableId');
                sessionStorage.removeItem('seka_currentTableName');
                sessionStorage.removeItem('seka_tableStatus');
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [socket, tableId, userId, userEmail, gameStatus, players.length]);

    // Derived table data for Banner component
    const tableInfo = tableData ? {
        id: tableData.id,
        tableName: tableData.tableName,
        network: 'BSC',
        entryFee: tableData.entryFee,
        totalPot: pot > 0 ? pot : (tableData.entryFee * tableData.currentPlayers), // ✅ Use dynamic pot from game state
        playerCount: `${tableData.currentPlayers}/${tableData.maxPlayers}`,
        maxPlayers: tableData.maxPlayers,
        currentPlayers: tableData.currentPlayers,
        status: tableData.status
    } : {
        id: tableId,
        network: 'BSC',
        entryFee: invitationSettings?.entryFee || table?.entryFee || 10, // ✅ Use invitation settings
        totalPot: pot > 0 ? pot : ((invitationSettings?.entryFee || table?.entryFee || 10) * (invitationSettings?.maxPlayers || 6)), // ✅ Dynamic based on entry fee
        playerCount: '0/6',
        maxPlayers: invitationSettings?.maxPlayers || table?.maxPlayers || 6,
        currentPlayers: 0
    };

    if (loading) {
        return (
            <div className="game-table-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
                <div style={{ color: 'white', fontSize: '24px' }}>
                    {error ? `❌ ${error}` : 'Loading table...'}
                </div>
                {error && (
                    <button 
                        onClick={() => navigate('/gamelobby')}
                        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
                    >
                        Back to Lobby
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="game-table-page">
            <button className='leave-button'>
                <span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16,17 21,12 16,7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </span>
            </button>
            <Banner table={table} onLeave={() => navigate(-1)} tableTopSrc={tableTop} userId={userId} tableId={tableId} />
            
            {/* Countdown Timer - Large and centered */}
            {showCountdown && countdown !== null && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{
                        fontSize: '120px',
                        fontWeight: 'bold',
                        color: '#FFD700',
                        textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.6)',
                        animation: 'pulse 1s ease-in-out infinite'
                    }}>
                        {countdown}
                    </div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#FFF',
                        background: 'rgba(0, 0, 0, 0.7)',
                        padding: '10px 30px',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        Game Starting...
                    </div>
                </div>
            )}
            
            {/* Game Status Banner - Auto-hides */}
            {gameStatus !== 'waiting' && gameMessage && !showCountdown && (
                <div className="game-status-banner" style={{
                    position: 'absolute',
                    top: '120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: gameStatus === 'starting' ? '#ffa500' : '#4CAF50',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    animation: 'fadeInDown 0.5s ease-in-out',
                    transition: 'opacity 0.5s ease-out'
                }}>
                    {gameMessage}
                </div>
            )}
            
            {/* READY/START buttons REMOVED - Auto-start enabled when 2+ players join */}
            
            <Felt 
                totalPot={tableInfo.totalPot} 
                USDTIconSrc={USDTIcon} 
                cardBackSrc={cardBack} 
                players={players}
                maxPlayers={tableInfo.maxPlayers}
                currentUserId={userId}
                showCards={showCards}
                playerCards={playerCards}
                isShowdown={gameStatus === 'showdown' || gameStatus === 'finished'}
                dealerId={dealerId}
                entryFee={tableInfo.entryFee}
                isDealingCards={isDealingCards}
                cardViewers={cardViewers}
                setCardViewers={setCardViewers}
                onDealingComplete={() => {
                    console.log('🎴 Card dealing animation in Felt complete!');
                    // Animation done, cards will now be visible
                }}
            />
            
            {/* ✅ Smooth Canvas Card Dealing Animation (NO dealer avatar) */}
            <CardDealingAnimation
                players={players}
                isDealing={isDealingCards}
                onComplete={() => {
                    console.log('🎴 Card dealing animation complete!');
                    console.log('✨ NOW showing player cards...');
                    
                    // NOW reveal the cards - extract from players state
                    const cards = {};
                    players.forEach(player => {
                        const isMe = player.userId === userId;
                        
                        if (isMe && player.hasSeenCards) {
                            // Current user who has seen cards
                            cards[player.userId] = player.hand || [];
                        } else {
                            // Everyone else or current user who hasn't seen
                            cards[player.userId] = [];
                        }
                    });
                    
                    setPlayerCards(cards);
                    setShowCards(true);
                    setCardsDealt(true);
                    setIsDealingCards(false);
                    
                    console.log('✅ Cards revealed!');
                }}
            />
            
            {/* ✅ VIEW CARDS button is now inside BettingControls component */}
            {/* <RightPanel /> */}
            
            {/* Wallet Balance Display */}
            {/* <div className="wallet-balance-container">
                <WalletBalance className="game-table" />
            </div> */}
            <div className="chat-button">
                <button className='chat-button-btn' onClick={handleChatToggle}>Chat</button>
            </div>
            {/* SEKA Points-Integrated Betting Controls */}
            {/* ✅ Show when: cards dealt + game in progress (visible even when not your turn) */}
            {cardsDealt && gameStatus === 'in_progress' && (
            <div className="betting-controls-container">
                <BettingControls
                    onBet={handleBet}
                    onFold={handleFold}
                    onCall={handleCall}
                    onRaise={handleRaise}
                    onAllIn={handleAllIn}
                    onBlind={handleBlind}
                    currentBet={currentBet}
                    minBet={tableInfo.entryFee || 10}
                    maxBet={(() => {
                        const player = players.find(p => p.userId === userId);
                        if (!player) return 1000;
                        const balance = typeof player.balance === "object" 
                            ? player.balance.availableBalance 
                            : player.balance;
                        return Number(balance) || 1000;
                    })()}
                    potSize={pot || tableInfo.totalPot || 0}
                    isPlayerTurn={currentTurnUserId === userId}
                    playerBalance={(() => {
                        const player = players.find(p => p.userId === userId);
                        console.log('🔍 Finding player balance for BettingControls:');
                        console.log('   userId:', userId);
                        console.log('   player found:', player);
                        console.log('   player.balance:', player?.balance);
                        if (!player) return 0;
                        const balance = typeof player.balance === "object" 
                            ? player.balance.availableBalance 
                            : player.balance;
                        console.log('   final balance:', balance);
                        return Number(balance) || 0;
                    })()}
                    hasSeenCards={cardViewers.includes(userId)}
                    gameActions={gameActions}
                    userId={userId}
                    playerCards={playerCards}
                    players={players}
                    setPlayerCards={setPlayerCards}
                    setPlayers={setPlayers}
                    setHasViewedCards={setHasViewedCards}
                    setCardsDealt={setCardsDealt}
                    setCardViewers={setCardViewers}
                    cardsDealt={cardsDealt}
                    cardViewers={cardViewers}
                />
            </div>
            )}
            
            {/* Chat Modal */}
            {isChatOpen && (
                <div className="chat-modal-overlay" onClick={handleChatToggle}>
                    <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Chat Header */}
                        <div className="chat-header">
                            <button className="chat-close-btn" onClick={handleChatToggle}>
                                <span>←</span> Close
                            </button>
                        </div>
                        
                        {/* Chat Messages */}
                        <div className="chat-messages">
                            {chatMessages.length === 0 ? (
                                <div className="no-messages">
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                chatMessages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={`chat-message ${msg.isMe ? 'my-message' : 'other-message'}`}
                                    >
                                        <div className="message-content">
                                            <span className="message-user">{msg.user}:</span>
                                            <span className="message-text">{msg.message}</span>
                                        </div>
                                        <div className="message-time">{msg.time}</div>
                                    </div>
                                ))
                            )}
                            {/* Auto-scroll anchor */}
                            <div ref={chatMessagesEndRef} />
                        </div>
                        
                        {/* Chat Input */}
                        <div className="chat-input-section">
                            <input
                                type="text"
                                className="chat-input-field"
                                placeholder="Type a message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isSendingMessage && handleSendMessage()}
                                disabled={isSendingMessage}
                                maxLength={500}
                            />
                            <button 
                                className="chat-send-btn" 
                                onClick={handleSendMessage}
                                disabled={isSendingMessage || !chatMessage.trim()}
                            >
                                {isSendingMessage ? '⏳ Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Winner Modal */}
            <WinnerModal 
                show={showWinnerModal}
                winnerData={winnerData}
                onClose={() => {
                    setShowWinnerModal(false);
                    // Optionally navigate back to lobby after closing
                    // navigate('/gamelobby');
                }}
                currentUserId={userId}
                tableId={tableId}
            />
            
            {/* Player Action Notification Modal */}
            <PlayerActionModal
                action={actionData}
                isVisible={showActionModal}
                onClose={() => setShowActionModal(false)}
            />
            
            {/* Bottom Action Bar - Log, Chat, Slot, Notifications */}
            {/* <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '30px',
                display: 'flex',
                gap: '15px',
                zIndex: 999
            }}>
                <button style={{
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '2px solid #444',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '12px',
                    fontWeight: '600'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.background = '#333';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = '#2a2a2a';
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Log
                </button>
                
                <button onClick={handleChatToggle} style={{
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '2px solid #444',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '12px',
                    fontWeight: '600'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.background = '#333';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = '#2a2a2a';
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Chat
                </button>
                
                <button style={{
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '2px solid #444',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '12px',
                    fontWeight: '600'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.background = '#333';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = '#2a2a2a';
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                        <polyline points="17 2 12 7 7 2"></polyline>
                    </svg>
                    Slot
                </button>
                
                <button style={{
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '2px solid #444',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '12px',
                    fontWeight: '600',
                    position: 'relative'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.background = '#333';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = '#2a2a2a';
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#EF4444',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        border: '2px solid #2a2a2a'
                    }}>1</span>
                </button>
            </div> */}
        </div>
    );
};

export default GameTablePage;


