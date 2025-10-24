import React from 'react';
import GameTableCard from '../GameTableCard';

const GameTableGrid = ({ gameTables, onJoinTable, onInviteFriends }) => {
    return (
        <div className='game-table-grid'>
            {gameTables.map((table, index) => (
                <GameTableCard 
                    key={index} 
                    table={table} 
                    onJoinTable={onJoinTable}
                    onInviteFriends={onInviteFriends}
                />
            ))}
        </div>
    );
};

export default GameTableGrid;
