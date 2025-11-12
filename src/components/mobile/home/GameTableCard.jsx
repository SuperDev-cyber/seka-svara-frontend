import React from 'react';
import { Users, Wifi, Eye } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export function GameTableCard({ language, stake, currentPlayers, maxPlayers, ping, onJoin, onSpectate }) {
  const t = useTranslation(language);
  const isFull = currentPlayers >= maxPlayers;

  return (
    <div className="flex-shrink-0 w-[200px] snap-start bg-game-cardBg border border-border rounded-lg p-3">
      <div className="space-y-2">
        <div className="text-center">
          <div className="text-2xl font-bold text-game-gold">{stake} USDT</div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{currentPlayers}/{maxPlayers}</span>
          </div>
          <div className="flex items-center gap-1 text-game-green">
            <Wifi className="w-3 h-3" />
            <span>{ping}ms</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <button
            onClick={onJoin}
            disabled={isFull}
            className={`w-full py-2 px-3 rounded-lg font-semibold text-sm bg-game-gold text-game-dark hover:bg-game-gold/90 transition-all duration-200 active:scale-95 ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('tables.join')}
          </button>
          <button
            onClick={onSpectate}
            className="w-full flex items-center justify-center gap-1 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="w-3 h-3" />
            {t('tables.spectate')}
          </button>
        </div>
      </div>
    </div>
  );
}

