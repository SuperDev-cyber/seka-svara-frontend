import { useTranslation, Language } from '../../lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';

interface CreateTableSectionProps {
  language: Language;
  onCreate: (stake: number, maxPlayers: number, autoStartTimer: number) => void;
}

export function CreateTableSection({ language, onCreate }: CreateTableSectionProps) {
  const t = useTranslation(language);
  const [stake, setStake] = useState('50');
  const [maxPlayers, setMaxPlayers] = useState('4');
  const [autoStart, setAutoStart] = useState('30');

  const stakes = ['10', '25', '50', '100', '250'];
  const playerCounts = ['2', '3', '4'];
  const timers = ['15', '30', '60'];

  const handleCreate = () => {
    onCreate(Number(stake), Number(maxPlayers), Number(autoStart));
  };

  return (
    <div className="card-game glow-green">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">{t('lobby.createTitle')}</h3>

        {/* Settings */}
        <div className="grid grid-cols-1 gap-3">
          {/* Stake */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              {t('lobby.stake')}
            </label>
            <Select value={stake} onValueChange={setStake}>
              <SelectTrigger className="w-full bg-game-dark border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-game-cardBg border-border">
                {stakes.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="text-foreground hover:bg-game-cardHover cursor-pointer"
                  >
                    {s} USDT
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Players */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              {t('lobby.players')}
            </label>
            <Select value={maxPlayers} onValueChange={setMaxPlayers}>
              <SelectTrigger className="w-full bg-game-dark border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-game-cardBg border-border">
                {playerCounts.map((p) => (
                  <SelectItem
                    key={p}
                    value={p}
                    className="text-foreground hover:bg-game-cardHover cursor-pointer"
                  >
                    {p} {t('lobby.players')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Auto-start Timer */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              {t('lobby.autoStart')}
            </label>
            <Select value={autoStart} onValueChange={setAutoStart}>
              <SelectTrigger className="w-full bg-game-dark border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-game-cardBg border-border">
                {timers.map((timer) => (
                  <SelectItem
                    key={timer}
                    value={timer}
                    className="text-foreground hover:bg-game-cardHover cursor-pointer"
                  >
                    {timer}s
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Create Button */}
        <button onClick={handleCreate} className="w-full btn-green">
          {t('lobby.create')}
        </button>
      </div>
    </div>
  );
}
