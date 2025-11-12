import { Search } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface FilterBarProps {
  language: Language;
  selectedStake: string;
  selectedPlayers: string;
  selectedType: string;
  searchQuery: string;
  onStakeChange: (value: string) => void;
  onPlayersChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function FilterBar({
  language,
  selectedStake,
  selectedPlayers,
  selectedType,
  searchQuery,
  onStakeChange,
  onPlayersChange,
  onTypeChange,
  onSearchChange,
}: FilterBarProps) {
  const t = useTranslation(language);

  const stakes = ['all', '10', '25', '50', '100', '250'];
  const playerCounts = ['all', '2', '3', '4'];
  const gameTypes = ['all', 'public', 'private'];

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        {/* Stake Filter */}
        <Select value={selectedStake} onValueChange={onStakeChange}>
          <SelectTrigger className="w-[140px] bg-game-cardBg border-border shrink-0">
            <SelectValue placeholder={t('lobby.stake')} />
          </SelectTrigger>
          <SelectContent className="bg-game-cardBg border-border">
            {stakes.map((stake) => (
              <SelectItem
                key={stake}
                value={stake}
                className="text-foreground hover:bg-game-cardHover cursor-pointer"
              >
                {stake === 'all'
                  ? t('lobby.all')
                  : `${stake} USDT`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Players Filter */}
        <Select value={selectedPlayers} onValueChange={onPlayersChange}>
          <SelectTrigger className="w-[140px] bg-game-cardBg border-border shrink-0">
            <SelectValue placeholder={t('lobby.players')} />
          </SelectTrigger>
          <SelectContent className="bg-game-cardBg border-border">
            {playerCounts.map((count) => (
              <SelectItem
                key={count}
                value={count}
                className="text-foreground hover:bg-game-cardHover cursor-pointer"
              >
                {count === 'all' ? t('lobby.all') : `${count} ${t('lobby.players')}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Game Type Filter */}
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[140px] bg-game-cardBg border-border shrink-0">
            <SelectValue placeholder={t('lobby.gameType')} />
          </SelectTrigger>
          <SelectContent className="bg-game-cardBg border-border">
            {gameTypes.map((type) => (
              <SelectItem
                key={type}
                value={type}
                className="text-foreground hover:bg-game-cardHover cursor-pointer"
              >
                {type === 'all'
                  ? t('lobby.all')
                  : type === 'public'
                  ? t('lobby.public')
                  : t('lobby.private')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('lobby.search')}
          className="w-full pl-10 pr-4 py-2.5 bg-game-cardBg border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-game-gold/50"
        />
      </div>
    </div>
  );
}
