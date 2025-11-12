import { Calendar, Users, DollarSign, ChevronRight } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';

type GameResult = 'win' | 'loss' | 'refund';

interface Game {
  gameId: number;
  date: Date;
  stake: number;
  players: number;
  result: GameResult;
  amount: number;
}

interface RecentGamesProps {
  language: Language;
  games: Game[];
}

export function RecentGames({ language, games }: RecentGamesProps) {
  const t = useTranslation(language);

  const getResultColor = (result: GameResult) => {
    switch (result) {
      case 'win':
        return 'text-game-green';
      case 'loss':
        return 'text-red-400';
      case 'refund':
        return 'text-yellow-400';
    }
  };

  const getResultBg = (result: GameResult) => {
    switch (result) {
      case 'win':
        return 'bg-game-green/10 border-game-green/30';
      case 'loss':
        return 'bg-red-400/10 border-red-400/30';
      case 'refund':
        return 'bg-yellow-400/10 border-yellow-400/30';
    }
  };

  const getResultText = (result: GameResult) => {
    switch (result) {
      case 'win':
        return t('profile.result.win');
      case 'loss':
        return t('profile.result.loss');
      case 'refund':
        return t('profile.result.refund');
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  };

  const formatAmount = (amount: number, result: GameResult) => {
    const sign = result === 'win' ? '+' : result === 'loss' ? '−' : '';
    return `${sign}${Math.abs(amount).toFixed(2)} USDT`;
  };

  if (games.length === 0) {
    return (
      <div className="card-game text-center py-12">
        <div className="text-5xl mb-4">🎮</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('profile.emptyRecent')}
        </h3>
        <p className="text-sm text-muted-foreground">{t('profile.emptyRecentDesc')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {games.map((game) => (
        <div
          key={game.gameId}
          className="card-game hover:border-border transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left: Game Info */}
            <div className="flex-1 space-y-2">
              {/* Game ID & Date */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  #{game.gameId}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(game.date)}
                </span>
              </div>

              {/* Stake & Players */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {game.stake} USDT
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {game.players}/4
                </span>
              </div>
            </div>

            {/* Right: Result */}
            <div className="text-right space-y-1">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${getResultBg(
                  game.result
                )} ${getResultColor(game.result)}`}
              >
                {getResultText(game.result)}
              </div>
              <div className={`text-lg font-bold ${getResultColor(game.result)}`}>
                {formatAmount(game.amount, game.result)}
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-game-gold transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}
