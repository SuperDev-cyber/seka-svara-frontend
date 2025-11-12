import { ArrowDownToLine, ArrowUpFromLine, Fuel } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';
import { Language } from '../../lib/i18n';

interface BalanceCardProps {
  language: Language;
  usdtBalance: string;
  bnbBalance: string;
  onDeposit: () => void;
  onWithdraw: () => void;
  onBuyGas: () => void;
}

export function BalanceCard({
  language,
  usdtBalance,
  bnbBalance,
  onDeposit,
  onWithdraw,
  onBuyGas,
}: BalanceCardProps) {
  const t = useTranslation(language);

  return (
    <div className="card-game glow-gold border-game-gold/20">
      <div className="space-y-5">
        {/* Balance Display - Larger, more prominent */}
        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground mb-1">{t('balance.title')}</div>
            <div className="text-3xl sm:text-4xl font-bold text-white">{usdtBalance} USDT</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">{t('balance.gas')}</div>
            <div className="text-3xl sm:text-4xl font-bold text-game-green">{bnbBalance} BNB</div>
          </div>
        </div>

        {/* Action Buttons - Horizontal layout matching image */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onDeposit}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-game-green/20 border-2 border-game-green/40 rounded-xl hover:bg-game-green/30 hover:border-game-green/60 transition-all duration-200 active:scale-95"
          >
            <ArrowDownToLine className="w-6 h-6 text-game-green" />
            <span className="text-sm font-semibold text-white">{t('balance.deposit')}</span>
          </button>

          <button
            onClick={onWithdraw}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-game-gold/20 border-2 border-game-gold/40 rounded-xl hover:bg-game-gold/30 hover:border-game-gold/60 transition-all duration-200 active:scale-95"
          >
            <ArrowUpFromLine className="w-6 h-6 text-game-gold" />
            <span className="text-sm font-semibold text-white">{t('balance.withdraw')}</span>
          </button>

          <button
            onClick={onBuyGas}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-orange-500/20 border-2 border-orange-500/40 rounded-xl hover:bg-orange-500/30 hover:border-orange-500/60 transition-all duration-200 active:scale-95"
          >
            <Fuel className="w-6 h-6 text-orange-400" />
            <span className="text-sm font-semibold text-white">{t('balance.buyGas')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
