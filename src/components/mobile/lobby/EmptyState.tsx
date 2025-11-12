import { useTranslation, Language } from '../../lib/i18n';

interface EmptyStateProps {
  language: Language;
}

export function EmptyState({ language }: EmptyStateProps) {
  const t = useTranslation(language);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Animated Cards */}
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-28 bg-gradient-to-br from-game-gold/20 to-game-green/20 rounded-lg border-2 border-game-gold/40 transform rotate-[-15deg] animate-pulse shadow-lg" />
          <div className="absolute w-20 h-28 bg-gradient-to-br from-game-green/20 to-game-gold/20 rounded-lg border-2 border-game-green/40 transform rotate-[15deg] animate-pulse animation-delay-300 shadow-lg" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-xl font-bold text-foreground mb-2">{t('lobby.empty')}</h3>
      <p className="text-muted-foreground text-center">{t('lobby.emptyDesc')}</p>
    </div>
  );
}
