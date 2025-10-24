import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContext';
import { useSocket } from '../../contexts/SocketContext';
import cardBack from '../../assets/images/card.png';
import usdtIcon from '../../assets/images/usdt-icon.png';
import tableTop from '../../assets/images/table-top-image.png';
import Banner from '../../components/gameTable/Banner';
import Felt from '../../components/gameTable/Felt';
import Controls from '../../components/gameTable/Controls';
import WinnerModal from '../../components/gameTable/WinnerModal';
import RightPanel from '../../components/gameTable/RightPanel';
import WalletBalance from '../../components/wallet/WalletBalance';
import BettingControls from '../../components/wallet/BettingControls';
import DealerDisplay from '../../components/gameTable/DealerDisplay';
import { useAuth } from '../../contexts/AuthContext';
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
    
    const table = location?.state?.table || { id, network: 'BSC', entryFee: 10, totalPot: 60, playerCount: 6 };
    
    // Game state
    const [gameStatus, setGameStatus] = useState('waiting'); // 'waiting', 'starting', 'in_progress', 'showdown', 'finished'
    const [gameMessage, setGameMessage] = useState('Waiting for players...');
    const [playerCards, setPlayerCards] = useState({}); // { userId: [{ rank: 'A', suit: '♠' }, ...] }
    const [showCards, setShowCards] = useState(false); // Whether to show face-up cards
    const [currentTurnUserId, setCurrentTurnUserId] = useState(null); // Whose turn is it
    const [currentBet, setCurrentBet] = useState(0); // Current bet to call
    const [pot, setPot] = useState(0); // Total pot amount
    const [dealerId, setDealerId] = useState(null); // Current dealer
    
    // Dealer display and animation state
    const [showDealerDisplay, setShowDealerDisplay] = useState(false);
    const [isDealingCards, setIsDealingCards] = useState(false);
    const [dealerInfo, setDealerInfo] = useState(null); // { email, avatar }
    const [cardsDealt, setCardsDealt] = useState(false); // Cards only show AFTER dealer animation
    
    // SEKA balance from wallet (real-time)
    const [sekaBalance, setSekaBalance] = useState(null);
    
    // Track if current user has viewed their cards (to show betting controls)
    const [hasViewedCards, setHasViewedCards] = useState(false);
    
    // Winner modal state
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winnerData, setWinnerData] = useState(null);
    
    // Ready status - REMOVED (auto-start enabled)
    // Countdown timer for game start
    const [countdown, setCountdown] = useState(null);
    const [showCountdown, setShowCountdown] = useState(false)
    
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
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'You', message: 'God Luck', time: '11:18' }
    ]);

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
        if (chatMessage.trim() && socket && tableData) {
            const messageData = {
                tableId: tableData.id,
                userId: user?.id || user?.userId,
                username: user?.username || user?.name || user?.email?.split('@')[0] || 'Player',
                message: chatMessage.trim(),
            };
            
            // Emit to socket
            socket.emit('send_table_chat', messageData);
            
            // Clear input
            setChatMessage('');
        }
    }, [chatMessage, socket, tableData, user]);

    // Game action handlers
    const handleBet = useCallback((amount) => {
        console.log('Bet placed:', amount);
        // In a real implementation, this would interact with the smart contract
    }, []);

    const handleFold = useCallback(() => {
        console.log('Player folded');
        // In a real implementation, this would update the game state
    }, []);

    const handleCall = useCallback((amount) => {
        console.log('Player called:', amount);
        // In a real implementation, this would interact with the smart contract
    }, []);

    const handleRaise = useCallback((amount) => {
        console.log('Player raised:', amount);
        // In a real implementation, this would interact with the smart contract
    }, []);

    const handleAllIn = useCallback((amount) => {
        console.log('Player went all in:', amount);
        // In a real implementation, this would interact with the smart contract
    }, []);

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
        
        socket.emit('join_table', {
            tableId: tableId,
            userId: userId,
            userEmail: userEmail,
            username: userName,
            avatar: userAvatar,
            tableName: 'Invited Game',
            entryFee: 10
        }, (joinResponse) => {
            if (joinResponse && joinResponse.success) {
                console.log('✅ Successfully joined/created table');
            } else {
                console.warn('⚠️ Join table response:', joinResponse);
            }
        });
    }, [socket, socketConnected, tableId, userId, userEmail, userName, userAvatar]); // Complete dependency array

    // Fetch SEKA balance from connected wallet (real-time)
    useEffect(() => {
        const fetchSekaBalance = async () => {
            if (isConnected && currentNetwork) {
                try {
                    const balance = await getBalance(currentNetwork);
                    const balanceNum = parseFloat(balance) || 0;
                    setSekaBalance(balanceNum);
                    console.log('💰 SEKA Balance fetched for game table:', balanceNum);
                } catch (error) {
                    console.error('❌ Error fetching SEKA balance:', error);
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
            setGameStatus('starting');
            setGameMessage(data.message || '🎮 Game is starting! Get ready...');
            
            // Show countdown timer with duration from backend
            const countdownDuration = data.countdown || 10; // Default to 10 seconds
            setShowCountdown(true);
            setCountdown(countdownDuration);
            
            console.log(`⏱️ Starting ${countdownDuration}-second countdown...`);
            
            // Start countdown
            let timeLeft = countdownDuration;
            const countdownInterval = setInterval(() => {
                timeLeft--;
                setCountdown(timeLeft);
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    setShowCountdown(false);
                }
            }, 1000);
            
            // Show notification
            setTimeout(() => {
                setGameMessage('Dealing cards...');
            }, 2000);
        };

        // Listen for game started event
        const handleGameStarted = (data) => {
            console.log('✅ Game has started!', data);
            setGameStatus('in_progress');
            setGameMessage('🎴 Cards dealt! Game is now in progress!');
            
            // Hide countdown if still showing
            setShowCountdown(false);
            
            // Reset card viewing state for new game
            setHasViewedCards(false);
            
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
            
            // Show dealer display and animation (2-3 seconds delay)
            if (data.gameState && data.gameState.dealerId) {
                const dealer = data.gameState.players.find(p => p.userId === data.gameState.dealerId);
                if (dealer) {
                    // Load avatars
                    const avatarModules = import.meta.glob('../../assets/images/users/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });
                    const avatarUrls = Object.values(avatarModules);
                    const dealerAvatar = avatarUrls[0] || ''; // Get first avatar for dealer
                    
                    setDealerInfo({
                        email: dealer.username || dealer.email || (dealer.userId === userId ? userEmail : `Player ${data.gameState.players.indexOf(dealer) + 1}`),
                        avatar: dealer.avatar || dealerAvatar
                    });
                    
                    // RESET card dealt state - cards should NOT show yet
                    setCardsDealt(false);
                    setShowCards(false);
                    setPlayerCards({});
                    
                    // Show dealer after 2 seconds
                    setTimeout(() => {
                        setShowDealerDisplay(true);
                        
                        // Start dealing animation after another 1 second
                        setTimeout(() => {
                            setIsDealingCards(true);
                        }, 1000);
                    }, 2000);
                }
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
            
            // Update game status if phase changed
            if (gameState.phase === 'showdown' || gameState.phase === 'completed') {
                setGameStatus(gameState.phase);
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        };

        // Listen for player actions
        const handlePlayerActionBroadcast = (data) => {
            console.log('🎲 Player action:', data);
            setGameMessage(`${data.userId} performed: ${data.action}`);
        };

        // Handle showdown (reveal hands and determine winner)
        const handleShowdown = (data) => {
            console.log('🏆 SHOWDOWN!', data);
            setGameStatus('showdown');
            setGameMessage('Showdown! Revealing hands...');
            
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
                setShowWinnerModal(true);
                setWinnerData(data);
            }, 2000);
        };

        // Handle game completion
        const handleGameCompleted = (data) => {
            console.log('✅ Game completed!', data);
            setGameStatus('finished');
            setGameMessage('Game finished!');
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
            
            // Reset dealer display and cards dealt state
            setShowDealerDisplay(false);
            setIsDealingCards(false);
            setDealerInfo(null);
            setCardsDealt(false);
            
            // Reset card viewing state for new game
            setHasViewedCards(false);
        };

        // Handle player seeing their cards
        const handlePlayerSeenCards = (data) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('👁️ PLAYER SEEN CARDS EVENT!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if (data.gameState) {
                const cards = {};
                const updatedPlayers = data.gameState.players.map(player => {
                    const isMe = player.userId === userId;
                    
                    if (isMe && player.hasSeenCards) {
                        // Show OUR cards after we've seen them
                        cards[player.userId] = player.hand || [];
                        console.log(`👁️ YOU can now see your cards:`, player.hand);
                        console.log(`   🎯 SCORE: ${player.handScore} pts`);
                        console.log(`   📋 HAND: ${player.handDescription}`);
                        console.log(`   💰 Balance: ${player.balance?.availableBalance || player.balance}`);
                        
                        // ✅ SHOW bottom betting controls, HIDE Controls modal
                        setHasViewedCards(true);
                        console.log('✅ Switching from Controls modal to bottom betting controls!');
                    } else {
                        // Others stay hidden
                        cards[player.userId] = [];
                    }
                    
                    return {
                        ...player,
                        handScore: player.handScore,
                        handDescription: player.handDescription
                    };
                });
                
                setPlayerCards(cards);
                setPlayers(updatedPlayers); // CRITICAL: Update players with hand scores
                setShowCards(true);
                
                console.log('✅ Player list updated with scores');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            }
        };

        const handleDisconnect = () => {
            console.log('❌ Disconnected from game server');
        };

        // Listen for chat messages
        const handleTableChatMessage = (data) => {
            console.log('💬 Received chat message:', data);
            const newMessage = {
                id: Date.now(),
                user: data.userId === (user?.id || user?.userId) ? 'You' : data.username,
                message: data.message,
                time: new Date(data.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                })
            };
            setChatMessages(prev => [...prev, newMessage]);
        };

        // Attach all event listeners
        socket.on('reconnect', handleReconnect);
        socket.on('table_updated', handleTableUpdated);
        socket.on('table_closed', handleTableClosed);
        socket.on('game_starting', handleGameStarting);
        socket.on('game_started', handleGameStarted);
        socket.on('game_terminated', handleGameTerminated);
        socket.on('game_state_updated', handleGameStateUpdated);
        socket.on('player_action_broadcast', handlePlayerActionBroadcast);
        socket.on('showdown', handleShowdown);
        socket.on('game_completed', handleGameCompleted);
        socket.on('player_removed_insufficient_balance', handlePlayerRemovedInsufficientBalance);
        socket.on('table_reset_for_new_game', handleTableResetForNewGame);
        socket.on('player_seen_cards', handlePlayerSeenCards);
        socket.on('table_chat_message', handleTableChatMessage);
        socket.on('disconnect', handleDisconnect);

        return () => {
            // Cleanup event listeners
            socket.off('reconnect', handleReconnect);
            socket.off('table_updated', handleTableUpdated);
            socket.off('table_closed', handleTableClosed);
            socket.off('game_starting', handleGameStarting);
            socket.off('game_started', handleGameStarted);
            socket.off('game_terminated', handleGameTerminated);
            socket.off('game_state_updated', handleGameStateUpdated);
            socket.off('player_action_broadcast', handlePlayerActionBroadcast);
            socket.off('showdown', handleShowdown);
            socket.off('game_completed', handleGameCompleted);
            socket.off('player_removed_insufficient_balance', handlePlayerRemovedInsufficientBalance);
            socket.off('table_reset_for_new_game', handleTableResetForNewGame);
            socket.off('player_seen_cards', handlePlayerSeenCards);
            socket.off('table_chat_message', handleTableChatMessage);
            socket.off('disconnect', handleDisconnect);
            clearInterval(heartbeatInterval);
        };
    }, [socket, socketConnected, tableId, userId]); // Removed players and tableData to prevent infinite loop!

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
        entryFee: 10,
        totalPot: pot > 0 ? pot : 60, // ✅ Use dynamic pot or fallback
        playerCount: '0/6',
        maxPlayers: 6,
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
                usdtIconSrc={usdtIcon} 
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
                onDealingComplete={() => {
                    console.log('🎴 Card dealing animation in Felt complete!');
                    // Animation done, cards will now be visible
                }}
            />
            
            {/* Dealer Display with Card Dealing Animation */}
            {showDealerDisplay && dealerInfo && (
                <DealerDisplay
                    dealerEmail={dealerInfo.email}
                    dealerAvatar={dealerInfo.avatar}
                    isDealing={isDealingCards}
                    playerPositions={players}
                    onDealComplete={() => {
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
                        
                        // Hide dealer display after animation
                        setTimeout(() => {
                            setShowDealerDisplay(false);
                            setIsDealingCards(false);
                        }, 1000);
                    }}
                />
            )}
            
            {/* Controls modal - show AFTER cards dealt but BEFORE viewing cards */}
            {cardsDealt && !hasViewedCards && (
                <Controls 
                    socket={socket}
                    tableId={tableId}
                    userId={userId}
                    gameStatus={gameStatus}
                    isMyTurn={currentTurnUserId === userId}
                    currentBet={currentBet}
                    myBalance={players.find(p => p.userId === userId)?.balance?.availableBalance || 0}
                    minRaise={tableInfo.entryFee || 10}
                    hasSeenCards={players.find(p => p.userId === userId)?.hasSeenCards || false}
                    players={players}
                />
            )}
            {/* <RightPanel /> */}
            
            {/* Wallet Balance Display */}
            {/* <div className="wallet-balance-container">
                <WalletBalance className="game-table" />
            </div> */}
            <div className="chat-button">
                <button className='chat-button-btn' onClick={handleChatToggle}>Chat</button>
            </div>
            {/* SEKA Points-Integrated Betting Controls - Only show AFTER viewing cards */}
            {hasViewedCards && (
                <div className="betting-controls-container">
                    <BettingControls
                        onBet={handleBet}
                        onFold={handleFold}
                        onCall={handleCall}
                        onRaise={handleRaise}
                        onAllIn={handleAllIn}
                        currentBet={25}
                        minBet={25}
                        maxBet={1000}
                        potSize={tableInfo.totalPot}
                        isPlayerTurn={true}
                        playerBalance={parseFloat(user?.balance) || 0}
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
                            {chatMessages.map((msg) => (
                                <div key={msg.id} className="chat-message">
                                    <div className="message-content">
                                        <span className="message-user">{msg.user}:</span>
                                        <span className="message-text">{msg.message}</span>
                                    </div>
                                    <div className="message-time">{msg.time}</div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Chat Input */}
                        <div className="chat-input-section">
                            <input
                                type="text"
                                className="chat-input-field"
                                placeholder="Type a message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button className="chat-send-btn" onClick={handleSendMessage}>
                                Send
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


