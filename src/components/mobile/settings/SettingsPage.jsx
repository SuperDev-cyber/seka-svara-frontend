import React, { useState } from 'react';
import { ArrowLeft, Globe, Bell, Shield } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export function SettingsPage({ language, onLanguageChange, onBack }) {
  const t = useTranslation(language);

  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  const languages = [
    { code: 'uz', label: 'O\'zbek' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
            {t('nav.settings') || 'Settings'}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="card-game">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-game-gold" />
            <h3 className="text-lg font-bold text-foreground">Language</h3>
          </div>
          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  language === lang.code
                    ? 'bg-game-gold/20 text-game-gold'
                    : 'bg-game-cardHover text-foreground hover:bg-game-cardHover/80'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-game">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-game-gold" />
            <h3 className="text-lg font-bold text-foreground">Notifications</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground">Enable Notifications</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-game-green' : 'bg-game-cardHover'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="card-game">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-game-gold" />
            <h3 className="text-lg font-bold text-foreground">Security</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Security settings are available in the full version.
          </div>
        </div>
      </div>
    </div>
  );
}

