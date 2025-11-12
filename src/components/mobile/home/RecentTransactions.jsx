import React from 'react';
import { ArrowDownToLine, ArrowUpFromLine, RotateCcw, ExternalLink } from '../lib/icons';
import { useTranslation } from '../lib/i18n';

export function RecentTransactions({ language, transactions = [], onViewAll }) {
  const t = useTranslation(language);

  const getIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="w-4 h-4 text-game-green" />;
      case 'payout':
        return <ArrowUpFromLine className="w-4 h-4 text-game-gold" />;
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'deposit':
        return t('activity.deposit') || 'Deposit';
      case 'payout':
        return t('activity.payout') || 'Payout';
      case 'refund':
        return t('activity.refund') || 'Refund';
      default:
        return type;
    }
  };

  if (!transactions || transactions.length === 0) {
    return null;
  }

  return (
    <div className="card-game">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{t('activity.title') || 'Recent Activity'}</h3>
          <button
            onClick={onViewAll}
            className="text-sm text-game-gold hover:text-game-gold/80 transition-colors"
          >
            {t('activity.viewAll') || 'View All'} →
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-game-cardHover rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getIcon(tx.type)}</div>
                <div>
                  <div className="text-sm font-medium text-foreground">{getTypeText(tx.type)}</div>
                  <div className="text-xs text-muted-foreground">{tx.timestamp}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-foreground">{tx.amount} USDT</div>
                <a
                  href={`https://bscscan.com/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-game-gold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

