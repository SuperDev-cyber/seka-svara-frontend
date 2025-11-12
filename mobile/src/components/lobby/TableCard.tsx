import { Users, Wifi, Trophy, Eye } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';

export type TableStatus = 'waiting' | 'inGame' | 'finished';

export interface Table {
  id: string;
  stake: number;
  currentPlayers: number;
  maxPlayers: number;
  status: TableStatus;
  pot: number;
  ping: number;
  isPrivate: boolean;
}

interface TableCardProps {
  table: Table;
  language: Language;
  onJoin: (tableId: string) => void;
  onSpectate: (tableId: string) => void;
}

export function TableCard({ table, language, onJoin, onSpectate }: TableCardProps) {
  const t = useTranslation(language);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'waiting':
        return 'text-game-green';
      case 'inGame':
        return 'text-blue-400';
      case 'finished':
        return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case 'waiting':
        return t('lobby.waiting');
      case 'inGame':
        return t('lobby.inGame');
      case 'finished':
        return t('lobby.finished');
    }
  };

  const isFull = table.currentPlayers >= table.maxPlayers;
  const canJoin = table.status === 'waiting' && !isFull;

  return (
    <div className="card-game hover:border-game-gold/50 transition-all duration-200">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-game-gold">{table.stake} USDT</div>
            <div className="text-xs text-muted-foreground">
              {table.isPrivate ? '🔒 ' + t('lobby.private') : t('lobby.public')}
            </div>
          </div>
          <div className={`text-sm font-semibold ${getStatusColor(table.status)}`}>
            {getStatusText(table.status)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-border">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {table.currentPlayers}/{table.maxPlayers}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-game-gold" />
            <span className="text-sm font-semibold">{table.pot} USDT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-game-green" />
            <span className="text-sm">{table.ping}ms</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => onJoin(table.id)}
            disabled={!canJoin}
            className={`w-full btn-gold text-sm py-2.5 ${
              !canJoin ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {t('lobby.join')}
          </button>
          <button
            onClick={() => onSpectate(table.id)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-game-gold transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            {t('lobby.spectate')}
          </button>
        </div>
      </div>
    </div>
  );
}
