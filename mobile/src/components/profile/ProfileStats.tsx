import { TrendingUp, Award, DollarSign, Star } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';

interface Stats {
  games: number;
  wins: number;
  winRate: number;
  totalWinningsUSDT: number;
  highestStakeUSDT: number;
  longestStreak: number;
}

interface ProfileStatsProps {
  language: Language;
  stats: Stats;
}

export function ProfileStats({ language, stats }: ProfileStatsProps) {
  const t = useTranslation(language);

  const statItems = [
    {
      icon: TrendingUp,
      label: t('profile.games'),
      value: stats.games.toString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      icon: Award,
      label: t('profile.wins'),
      value: `${stats.wins} (${stats.winRate.toFixed(1)}%)`,
      color: 'text-game-green',
      bgColor: 'bg-game-green/10',
    },
    {
      icon: DollarSign,
      label: t('profile.totalWinnings'),
      value: `${stats.totalWinningsUSDT.toFixed(2)} USDT`,
      color: 'text-game-gold',
      bgColor: 'bg-game-gold/10',
    },
    {
      icon: Star,
      label: t('profile.longestStreak'),
      value: stats.longestStreak.toString(),
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="card-game hover:border-border transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
            <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}
