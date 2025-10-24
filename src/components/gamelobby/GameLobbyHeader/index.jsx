import React from 'react';
import BalanceCard from '../BalanceCard';
import CreateTableButton from '../CreateTableButton';

const GameLobbyHeader = ({ balance, onCreateTable }) => {
    return (
        <div className='game-lobby-header'>
            <div className='header-left'>
                <h1 className='game-lobby-title'>Game Lobby</h1>
                <p className='game-lobby-subtitle'>Choose your table and start playing Seka Svara</p>
            </div>
            <div className='header-right'>
                <BalanceCard balance={balance} />
                <CreateTableButton onClick={onCreateTable} />
            </div>
        </div>
    );
};

export default GameLobbyHeader;
