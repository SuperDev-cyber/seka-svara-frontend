import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export function ProfilePage({ language, onBack }) {
  const t = useTranslation(language);

  // Mock user data - static UI only
  const userData = {
    nickname: 'Player',
    wallet: '0xA3B5C7D9E1F3A5B7C9D1E3F5A7B9C1D3E5F7A9B1',
    stats: {
      games: 124,
      wins: 68,
      winRate: 54.8,
      totalWinningsUSDT: 915.25,
    },
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
            {t('nav.profile') || 'Profile'}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="card-game">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-game-cardHover flex items-center justify-center">
              <span className="text-2xl font-bold text-game-gold">{userData.nickname[0]}</span>
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{userData.nickname}</div>
              <div className="text-xs text-muted-foreground break-all">{userData.wallet}</div>
            </div>
          </div>
        </div>

        <div className="card-game">
          <h3 className="text-lg font-bold text-foreground mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Games</div>
              <div className="text-2xl font-bold text-foreground">{userData.stats.games}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Wins</div>
              <div className="text-2xl font-bold text-game-green">{userData.stats.wins}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-2xl font-bold text-foreground">{userData.stats.winRate}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Winnings</div>
              <div className="text-2xl font-bold text-game-gold">{userData.stats.totalWinningsUSDT} USDT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

