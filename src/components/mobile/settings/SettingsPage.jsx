import React, { useState } from 'react';
import { ArrowLeft } from '../lib/icons';
import { useTranslation } from '../lib/i18n';

// Simple icon components
const Globe = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h6m-9-3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Bell = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const Shield = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

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

