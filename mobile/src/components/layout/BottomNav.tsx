import { Home, Gamepad2, Wallet, User, Settings } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';
import { Language } from '../../lib/i18n';

interface BottomNavProps {
  language: Language;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ language, activeTab, onTabChange }: BottomNavProps) {
  const t = useTranslation(language);

  const tabs = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'play', icon: Gamepad2, label: t('nav.play') },
    { id: 'wallet', icon: Wallet, label: t('nav.wallet') },
    { id: 'profile', icon: User, label: t('nav.profile') },
    { id: 'settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-game-darker border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[64px] ${
                isActive
                  ? 'text-game-gold bg-game-gold/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
