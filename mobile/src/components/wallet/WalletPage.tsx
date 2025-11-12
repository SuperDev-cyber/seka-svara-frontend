import { useState } from 'react';
import { ArrowLeft, Wallet, TrendingUp, ExternalLink } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';
import { useWallet } from '../../hooks/useWallet';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';
import { TransactionHistory } from './TransactionHistory';
import { SecurityInfo } from './SecurityInfo';

interface WalletPageProps {
  language: Language;
  onBack: () => void;
}

export function WalletPage({ language, onBack }: WalletPageProps) {
  const t = useTranslation(language);
  const { address, usdtBalance, bnbBalance } = useWallet();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const isEscrowConnected = !!address; // Connected if wallet address exists
  
  // Ensure balances are numbers
  const safeUsdtBalance = typeof usdtBalance === 'number' ? usdtBalance : 0;
  const safeBnbBalance = typeof bnbBalance === 'number' ? bnbBalance : 0;

  // Mock transaction data
  const mockTransactions = [
    {
      id: '1',
      type: 'deposit' as const,
      amount: 50,
      status: 'success' as const,
      date: new Date('2024-01-15T14:30:00'),
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    {
      id: '2',
      type: 'payout' as const,
      amount: 100,
      status: 'success' as const,
      date: new Date('2024-01-14T10:15:00'),
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    },
    {
      id: '3',
      type: 'withdraw' as const,
      amount: 25,
      status: 'pending' as const,
      date: new Date('2024-01-13T18:45:00'),
      txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    },
    {
      id: '4',
      type: 'deposit' as const,
      amount: 75,
      status: 'success' as const,
      date: new Date('2024-01-12T09:20:00'),
      txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    },
    {
      id: '5',
      type: 'refund' as const,
      amount: 50,
      status: 'success' as const,
      date: new Date('2024-01-11T16:00:00'),
      txHash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
            {t('wallet.title')}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Balance Overview */}
        <div className="card-game glow-gold">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-sm text-muted-foreground mb-1">{t('wallet.balance')}</h2>
              <div className="text-4xl font-bold text-game-gold mb-1">
                {safeUsdtBalance.toFixed(2)}
                <span className="text-xl ml-2 text-muted-foreground">USDT</span>
              </div>
              <div className="text-sm text-foreground">
                <span className="text-muted-foreground">{t('balance.gas')}:</span>{' '}
                <span className="font-semibold">{safeBnbBalance.toFixed(4)} BNB</span>
              </div>
            </div>
            <Wallet className="w-12 h-12 text-game-gold/40" />
          </div>

          {/* Network Info */}
          <div className="border-t border-border pt-3 space-y-2">
            <div className="text-xs text-muted-foreground">{t('wallet.network')}</div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isEscrowConnected ? 'bg-game-green' : 'bg-red-400'
                }`}
              />
              <span className="text-sm font-semibold text-foreground">
                {isEscrowConnected ? t('wallet.escrowConnected') : t('wallet.escrowDisconnected')}
              </span>
              {isEscrowConnected && <span className="text-game-green">✅</span>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => setDepositModalOpen(true)}
              className="btn-gold"
            >
              {t('wallet.deposit')}
            </button>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="btn-green"
            >
              {t('wallet.withdraw')}
            </button>
          </div>

          {/* Buy BNB Link */}
          <a
            href="https://www.binance.com/en/buy-sell-crypto"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-game-gold hover:text-game-gold/80 transition-colors mt-3"
          >
            <TrendingUp className="w-4 h-4" />
            {t('wallet.buyGas')}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Transaction History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('wallet.history')}</h2>
            {mockTransactions.length > 0 && (
              <button className="text-sm text-game-gold hover:text-game-gold/80 transition-colors">
                {t('wallet.viewAll')}
              </button>
            )}
          </div>
          <TransactionHistory language={language} transactions={mockTransactions} />
        </section>

        {/* Security Info */}
        <SecurityInfo language={language} />
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        language={language}
      />
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        language={language}
      />
    </div>
  );
}
