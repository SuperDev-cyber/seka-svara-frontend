import React from 'react';

const LiveGameTables = () => {
    const gameTables = [
        {
            id: "Table #001",
            players: "4/6 Players",
            betAmount: "10 USDT",
            network: "BEP20",
            status: "Waiting",
            buttonText: "Join Now"
        },
        {
            id: "Table #001",
            players: "4/6 Players",
            betAmount: "10 USDT",
            network: "BEP20",
            status: "Waiting",
            buttonText: "Join Now"
        },
        {
            id: "Table #002",
            players: "1/5 Players",
            betAmount: "25 USDT",
            network: "TRC20",
            status: "Waiting",
            buttonText: "Join Now"
        },
        {
            id: "Table #004",
            players: "4/6 Players",
            betAmount: "10 USDT",
            network: "BEP20",
            status: "Waiting",
            buttonText: "Join Now"
        },
        {
            id: "Table #005",
            players: "3/6 Players",
            betAmount: "20 USDT",
            network: "BEP20",
            status: "Starting Soon",
            buttonText: "Join Now"
        },
        {
            id: "Table #003",
            players: "2/8 Players",
            betAmount: "15 USDT",
            network: "ERC20",
            status: "Waiting",
            buttonText: "Join Now"
        },
        {
            id: "Table #004",
            players: "5/6 Players",
            betAmount: "30 USDT",
            network: "BEP20",
            status: "Waiting",
            buttonText: "Join Now"
        },
        {
            id: "Table #006",
            players: "1/5 Players",
            betAmount: "50 USDT",
            network: "TRC20",
            status: "Waiting",
            buttonText: "Play Now"
        }
    ];

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
                        <div key={index} className='table-card'>
                            <div className='table-info'>
                                <h3 className='table-id'>{table.id}</h3>
                                <p className='players-count'>{table.players}</p>
                                <div className='bet-info'>
                                    <span className='bet-amount'>{table.betAmount}</span>
                                    <span className='network'>{table.network}</span>
                                </div>
                            </div>
                            
                            <div className='status-tag-container'>
                                <div className={`status-tag ${table.status.toLowerCase().replace(' ', '-')}`}>
                                    {table.status}
                                </div>
                            </div>
                            
                            <div className='join-btn-container'>
                                <button className='join-btn'>
                                    <svg className='play-icon' width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5,3 19,12 5,21"/>
                                    </svg>
                                    {table.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveGameTables;
