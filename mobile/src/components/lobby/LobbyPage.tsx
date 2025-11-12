import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';
import { FilterBar } from './FilterBar';
import { TableCard, Table } from './TableCard';
import { CreateTableSection } from './CreateTableSection';
import { JoinGameModal } from './JoinGameModal';
import { EmptyState } from './EmptyState';
import { toast } from '../ui/use-toast';

interface LobbyPageProps {
  language: Language;
  onBack: () => void;
}

export function LobbyPage({ language, onBack }: LobbyPageProps) {
  const t = useTranslation(language);

  // Filters
  const [selectedStake, setSelectedStake] = useState('all');
  const [selectedPlayers, setSelectedPlayers] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Join Modal
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Mock tables data
  const [tables] = useState<Table[]>([
    {
      id: '1',
      stake: 50,
      currentPlayers: 2,
      maxPlayers: 4,
      status: 'waiting',
      pot: 100,
      ping: 35,
      isPrivate: false,
    },
    {
      id: '2',
      stake: 100,
      currentPlayers: 3,
      maxPlayers: 4,
      status: 'waiting',
      pot: 300,
      ping: 42,
      isPrivate: false,
    },
    {
      id: '3',
      stake: 10,
      currentPlayers: 4,
      maxPlayers: 4,
      status: 'inGame',
      pot: 40,
      ping: 28,
      isPrivate: false,
    },
    {
      id: '4',
      stake: 25,
      currentPlayers: 2,
      maxPlayers: 3,
      status: 'waiting',
      pot: 50,
      ping: 51,
      isPrivate: true,
    },
    {
      id: '5',
      stake: 250,
      currentPlayers: 1,
      maxPlayers: 2,
      status: 'waiting',
      pot: 250,
      ping: 38,
      isPrivate: false,
    },
    {
      id: '6',
      stake: 50,
      currentPlayers: 4,
      maxPlayers: 4,
      status: 'finished',
      pot: 200,
      ping: 45,
      isPrivate: false,
    },
  ]);

  // Filter tables
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      // Stake filter
      if (selectedStake !== 'all' && table.stake !== Number(selectedStake)) {
        return false;
      }

      // Players filter
      if (selectedPlayers !== 'all' && table.maxPlayers !== Number(selectedPlayers)) {
        return false;
      }

      // Type filter
      if (selectedType === 'public' && table.isPrivate) return false;
      if (selectedType === 'private' && !table.isPrivate) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          table.id.toLowerCase().includes(query) ||
          table.stake.toString().includes(query)
        );
      }

      return true;
    });
  }, [tables, selectedStake, selectedPlayers, selectedType, searchQuery]);

  const handleJoinTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      setSelectedTable(table);
      setJoinModalOpen(true);
    }
  };

  const handleSpectate = (tableId: string) => {
    toast({ title: 'Spectate', description: `Spectating table ${tableId}...` });
  };

  const handleCreateTable = (stake: number, maxPlayers: number, autoStartTimer: number) => {
    toast({
      title: t('lobby.createTitle'),
      description: `Creating table: ${stake} USDT, ${maxPlayers} players, ${autoStartTimer}s timer`,
    });
  };

  // Recent winners ticker
  const recentWinners = [
    { name: 'Doston', amount: 200 },
    { name: 'Kamola', amount: 75 },
    { name: 'Sardor', amount: 150 },
    { name: 'Aziza', amount: 50 },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
            {t('lobby.title')}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Filters */}
        <FilterBar
          language={language}
          selectedStake={selectedStake}
          selectedPlayers={selectedPlayers}
          selectedType={selectedType}
          searchQuery={searchQuery}
          onStakeChange={setSelectedStake}
          onPlayersChange={setSelectedPlayers}
          onTypeChange={setSelectedType}
          onSearchChange={setSearchQuery}
        />

        {/* Tables Grid */}
        <section>
          {filteredTables.length === 0 ? (
            <EmptyState language={language} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  language={language}
                  onJoin={handleJoinTable}
                  onSpectate={handleSpectate}
                />
              ))}
            </div>
          )}
        </section>

        {/* Create Table */}
        <CreateTableSection language={language} onCreate={handleCreateTable} />

        {/* Recent Winners Ticker */}
        <div className="bg-game-cardBg rounded-lg p-3 overflow-hidden">
          <div className="text-xs text-muted-foreground mb-1">{t('lobby.recentWinners')}:</div>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
              {[...recentWinners, ...recentWinners].map((winner, idx) => (
                <span key={idx} className="text-sm text-foreground">
                  <span className="text-game-gold font-semibold">{winner.name}</span> won{' '}
                  <span className="text-game-green font-bold">{winner.amount} USDT</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Join Game Modal */}
      {selectedTable && (
        <JoinGameModal
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          language={language}
          stake={selectedTable.stake}
          tableId={selectedTable.id}
        />
      )}
    </div>
  );
}
