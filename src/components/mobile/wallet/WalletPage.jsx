import React, { useState } from 'react';
import { ArrowLeft, Wallet, TrendingUp } from '../lib/icons';
import { useTranslation } from '../lib/i18n';

export function WalletPage({ language, onBack }) {
  const t = useTranslation(language);
  
  // Mock data - static UI only
  const [usdtBalance] = useState('245.50');
  const [bnbBalance] = useState('0.045');
  const [address] = useState('0xA3B5C7D9E1F3A5B7C9D1E3F5A7B9C1D3E5F7A9B1');

  const mockTransactions = [
    { id: '1', type: 'deposit', amount: 50, status: 'success', date: '2024-01-15', txHash: '0x1234...5678' },
    { id: '2', type: 'payout', amount: 100, status: 'success', date: '2024-01-14', txHash: '0xabcd...ef01' },
    { id: '3', type: 'withdraw', amount: 25, status: 'pending', date: '2024-01-13', txHash: '0x5678...1234' },
  ];

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
            {t('nav.wallet') || 'Wallet'}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="card-game glow-gold">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-game-gold" />
                <span className="text-sm text-muted-foreground">{t('balance.title') || 'Balance'}</span>
              </div>
              <TrendingUp className="w-5 h-5 text-game-green" />
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-3xl font-bold text-white">{usdtBalance} USDT</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-game-green">{bnbBalance} BNB</div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground break-all">{address}</div>
            </div>
          </div>
        </div>

        <div className="card-game">
          <h3 className="text-lg font-bold text-foreground mb-4">{t('activity.title') || 'Recent Activity'}</h3>
          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-game-cardHover rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">{tx.type}</div>
                  <div className="text-xs text-muted-foreground">{tx.date}</div>
                </div>
                <div className="text-sm font-bold text-foreground">{tx.amount} USDT</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

