import React from 'react';
import './index.css';

const MyGamesSection = () => {
    const myGames = [
        {
            id: "T003",
            network: "BEP20",
            players: "6/6",
            status: "Won",
            amount: "+45 USDT",
            time: "2 hours ago"
        },
        {
            id: "T007",
            network: "TRC20",
            players: "4/4",
            status: "Lost",
            amount: "-25 USDT",
            time: "5 hours ago"
        }
    ];

    const getStatusClass = (status) => {
        return status.toLowerCase() === 'won' ? 'status-won' : 'status-lost';
    };

    return (
        <div className='my-games-section'>
            <div className='my-games-list'>
                {myGames.map((game, index) => (
                    <div key={index} className='my-game-card'>
                        <div className='game-info'>
                            <div className='game-details'>
                                <span className='table-id'>Table {game.id}</span>
                                <span className='network'>{game.network}</span>
                                <span className='players'>{game.players}</span>
                            </div>
                        </div>
                        <div className='game-result'>
                            <div className='result-status'>
                                <span className={`status ${getStatusClass(game.status)}`}>
                                    {game.status}
                                </span>
                                <span className={`amount ${getStatusClass(game.status)}`}>
                                    {game.amount}
                                </span>
                            </div>
                            <div className='game-time'>
                                {game.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyGamesSection;
