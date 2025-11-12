import React, { useState, useMemo } from 'react';
import { ArrowLeft } from '../lib/icons';
import { useTranslation } from '../lib/i18n';

export function LobbyPage({ language, onBack }) {
  const t = useTranslation(language);

  const [selectedStake, setSelectedStake] = useState('all');
  const [selectedPlayers, setSelectedPlayers] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock tables data - static UI only
  const [tables] = useState([
    { id: '1', stake: 50, currentPlayers: 2, maxPlayers: 4, status: 'waiting', pot: 100, ping: 35, isPrivate: false },
    { id: '2', stake: 100, currentPlayers: 3, maxPlayers: 4, status: 'waiting', pot: 300, ping: 42, isPrivate: false },
    { id: '3', stake: 10, currentPlayers: 4, maxPlayers: 4, status: 'inGame', pot: 40, ping: 28, isPrivate: false },
    { id: '4', stake: 25, currentPlayers: 2, maxPlayers: 3, status: 'waiting', pot: 50, ping: 51, isPrivate: true },
    { id: '5', stake: 250, currentPlayers: 1, maxPlayers: 2, status: 'waiting', pot: 250, ping: 38, isPrivate: false },
  ]);

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      if (selectedStake !== 'all' && table.stake !== Number(selectedStake)) return false;
      if (selectedPlayers !== 'all') {
        const ratio = table.currentPlayers / table.maxPlayers;
        if (selectedPlayers === 'empty' && ratio > 0) return false;
        if (selectedPlayers === 'full' && ratio < 1) return false;
      }
      if (selectedType !== 'all' && table.status !== selectedType) return false;
      return true;
    });
  }, [tables, selectedStake, selectedPlayers, selectedType]);

  const handleJoinTable = (tableId) => {
    console.log('Join table:', tableId);
  };

  const handleSpectate = (tableId) => {
    console.log('Spectate table:', tableId);
  };

  const handleCreateTable = () => {
    console.log('Create table');
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
            {t('lobby.title') || 'Game Lobby'}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map((table) => (
            <div key={table.id} className="card-game">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-game-gold">{table.stake} USDT</div>
                  <div className="text-sm text-muted-foreground">
                    {table.currentPlayers}/{table.maxPlayers} {t('tables.players') || 'Players'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{table.status}</span>
                  <span className="text-xs text-game-green">{table.ping}ms</span>
                </div>
                <button
                  onClick={() => handleJoinTable(table.id)}
                  className="w-full btn-gold"
                  disabled={table.currentPlayers >= table.maxPlayers}
                >
                  {t('tables.join')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card-game border-game-green/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-foreground font-medium">
              {t('create.title') || 'Want to play with friends?'}
            </div>
            <button onClick={handleCreateTable} className="btn-green">
              {t('create.button') || 'Create Table'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

