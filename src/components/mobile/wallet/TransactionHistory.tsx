import { ExternalLink } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';

type TransactionType = 'deposit' | 'withdraw' | 'payout' | 'refund';
type TransactionStatus = 'success' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: Date;
  txHash: string;
}

interface TransactionHistoryProps {
  language: Language;
  transactions: Transaction[];
}

export function TransactionHistory({ language, transactions }: TransactionHistoryProps) {
  const t = useTranslation(language);

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
      case 'payout':
        return 'text-game-green';
      case 'withdraw':
      case 'refund':
        return 'text-red-400';
    }
  };

  const getTypeText = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return t('wallet.typeDeposit');
      case 'withdraw':
        return t('wallet.typeWithdraw');
      case 'payout':
        return t('wallet.typePayout');
      case 'refund':
        return t('wallet.typeRefund');
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'success':
        return 'text-game-green';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
    }
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case 'success':
        return t('wallet.statusSuccess');
      case 'pending':
        return t('wallet.statusPending');
      case 'failed':
        return t('wallet.statusFailed');
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  };

  const formatAmount = (amount: number, type: TransactionType) => {
    const sign = type === 'deposit' || type === 'payout' ? '+' : '−';
    return `${sign}${amount.toFixed(2)} USDT`;
  };

  if (transactions.length === 0) {
    return (
      <div className="card-game text-center py-12">
        <div className="text-5xl mb-4">💸</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('wallet.empty')}
        </h3>
        <p className="text-sm text-muted-foreground">{t('wallet.emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="card-game hover:border-border transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left: Type & Date */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold ${getTypeColor(tx.type)}`}>
                  {getTypeText(tx.type)}
                </span>
                <span className={`text-xs ${getStatusColor(tx.status)}`}>
                  ({getStatusText(tx.status)})
                </span>
              </div>
              <div className="text-xs text-muted-foreground">{formatDate(tx.date)}</div>
            </div>

            {/* Right: Amount & Link */}
            <div className="text-right">
              <div className={`text-lg font-bold ${getTypeColor(tx.type)}`}>
                {formatAmount(tx.amount, tx.type)}
              </div>
              <a
                href={`https://bscscan.com/tx/${tx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end gap-1 text-xs text-game-gold hover:text-game-gold/80 transition-colors mt-1"
              >
                {t('wallet.viewTx')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
