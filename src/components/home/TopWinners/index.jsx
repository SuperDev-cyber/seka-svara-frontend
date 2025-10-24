import React from 'react';

const TopWinners = () => {
    const winners = [
        {
            rank: 1,
            name: "CryptoKing",
            games: "98 games",
            winnings: "15,247 USDT",
            winRate: "88%",
            isCrown: true
        },
        {
            rank: 2,
            name: "CardMaster",
            games: "86 games",
            winnings: "15,247 USDT",
            winRate: "82%",
            isCrown: false
        },
        {
            rank: 3,
            name: "GameWizard",
            games: "75 games",
            winnings: "12,500 USDT",
            winRate: "78%",
            isCrown: false
        },
        {
            rank: 4,
            name: "PlayPro",
            games: "120 games",
            winnings: "20,000 USDT",
            winRate: "85%",
            isCrown: false
        },
        {
            rank: 5,
            name: "WinSphere",
            games: "50 games",
            winnings: "9,300 USDT",
            winRate: "74%",
            isCrown: false
        }
    ];

    return (
        <div className='top-winners-section'>
            <div className='top-winners-content'>
                <div className='winners-header'>
                    <h2 className='winners-title'>Top Winners</h2>
                    <p className='winners-subtitle'>See who's dominating the tables</p>
                </div>
                
                <div className='winners-list'>
                    {winners.map((winner, index) => (
                        <div key={winner.rank} className='winner-card'>
                            <div className='winner-left'>
                                <div className='rank-container'>
                                    {winner.isCrown ? (
                                        <div className='crown-icon'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
                                                <path d="M12 18l-1.5-2L12 14l1.5 2L12 18z"/>
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className='rank-badge'>
                                            {winner.rank}
                                        </div>
                                    )}
                                </div>
                                <div className='winner-info'>
                                    <h3 className='winner-name'>{winner.name}</h3>
                                    <p className='winner-games'>{winner.games}</p>
                                </div>
                            </div>
                            
                            <div className='winner-right'>
                                <div className='winner-stats'>
                                    <div className='winnings'>{winner.winnings}</div>
                                    <div className='win-rate'>
                                        <span className='rate'>{winner.winRate}</span>
                                        <svg className='trend-icon' width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 14l5-5 5 5"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopWinners;
