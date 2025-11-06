import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../../contexts/SocketContext';

const LiveGameTables = () => {
    const { socket } = useSocket();
    const navigate = useNavigate();
    const [gameTables, setGameTables] = useState([]);

    useEffect(() => {
        if (!socket) return;
        // Ask backend for dynamic tables
        socket.emit('get_active_tables', {}, (response) => {
            if (response?.success) setGameTables(response.tables || []);
        });
        const onActive = (payload) => setGameTables(payload || []);
        socket.on('active_tables', onActive);
        return () => socket.off('active_tables', onActive);
    }, [socket]);

    const handleJoin = (id) => navigate('/gamelobby', { state: { tableId: id } });

    return (
        <div className='live-game-tables-section'>
            <div className='live-game-tables-content'>
                <div className='live-tables-header'>
                    <h2 className='live-tables-title'>Live Game Tables</h2>
                    <button className='view-all-btn'>
                        View All Table
                        <svg className='arrow-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
                
                <div className='tables-grid'>
                    {gameTables.map((table, index) => (
                        <div key={table.id || index} className='table-card'>
                            <div className='table-info'>
                                <h3 className='table-id'>{table.tableName || `Table`}</h3>
                                <p className='players-count'>{table.currentPlayers}/{table.maxPlayers} Players</p>
                                <div className='bet-info'>
                                    <span className='bet-amount'>{Number(table.entryFee || 0)} USDT</span>
                                    <span className='network'>{table.network}</span>
                                </div>
                            </div>
                            
                            <div className='status-tag-container'>
                                <div className={`status-tag ${(table.status || 'waiting').toLowerCase().replace(' ', '-')}`}>
                                    {(table.status || 'waiting').toUpperCase()}
                                </div>
                            </div>
                            
                            <div className='join-btn-container'>
                                <button className='join-btn' onClick={() => handleJoin(table.id)}>
                                    <svg className='play-icon' width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5,3 19,12 5,21"/>
                                    </svg>
                                    Join Now
                                </button>
                            </div>
                        </div>
                    ))}
                    {gameTables.length === 0 && (
                        <div className='no-tables'>No active tables. Please check back soon.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveGameTables;
