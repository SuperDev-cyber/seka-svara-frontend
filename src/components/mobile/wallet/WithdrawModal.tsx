import { useState } from 'react';
import { useTranslation, Language } from '../../lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Loader2, ExternalLink } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { useWallet } from '../../hooks/useWallet';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function WithdrawModal({ isOpen, onClose, language }: WithdrawModalProps) {
  const t = useTranslation(language);
  const { address, usdtBalance } = useWallet();
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [txHash, setTxHash] = useState('');

  const minAmount = 10;
  const withdrawAmount = parseFloat(amount) || 0;
  const isValidAmount = withdrawAmount >= minAmount && withdrawAmount <= usdtBalance;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleWithdraw = async () => {
    if (!isValidAmount) return;
    
    setIsWithdrawing(true);
    try {
      // TODO: Call smart contract withdraw function
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockTxHash = '0x' + Math.random().toString(16).slice(2, 66);
      setTxHash(mockTxHash);
      
      toast({
        title: t('wallet.success'),
        description: t('wallet.withdrawSuccess'),
      });
      
      setTimeout(() => {
        onClose();
        setAmount('');
        setTxHash('');
      }, 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to withdraw USDT',
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-game-cardBg border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('wallet.withdrawTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Wallet Address */}
          <div className="bg-game-dark rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('lobby.walletAddress')}</span>
              <a
                href={`https://bscscan.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-game-gold hover:text-game-gold/80 transition-colors"
              >
                {shortenAddress(address || '')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              {t('wallet.amount')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`${minAmount} - ${usdtBalance}`}
                min={minAmount}
                max={usdtBalance}
                className="w-full px-4 py-3 bg-game-dark border border-border rounded-lg text-foreground text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-game-green/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                USDT
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1.5">
              <span>
                {t('wallet.min')}: {minAmount} USDT
              </span>
              <span>
                {t('wallet.balance')}: {usdtBalance} USDT
              </span>
            </div>
          </div>

          {/* Withdraw Summary */}
          {withdrawAmount > 0 && (
            <div className="bg-game-dark rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('wallet.amount')}</span>
                <span className="font-bold text-game-green text-xl">{withdrawAmount.toFixed(2)} USDT</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Funds will be transferred to your wallet address
              </p>
            </div>
          )}

          {/* Transaction Hash */}
          {txHash && (
            <div className="bg-game-green/10 border border-game-green/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-game-green">✅ {t('wallet.withdrawSuccess')}</span>
              </div>
              <a
                href={`https://bscscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-game-gold hover:text-game-gold/80 transition-colors mt-1"
              >
                {t('wallet.viewTx')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing || !isValidAmount}
              className="w-full btn-green flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWithdrawing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isWithdrawing ? t('wallet.pending') : t('wallet.withdrawNow')}
            </button>

            <button onClick={onClose} className="w-full btn-secondary">
              {t('lobby.cancel')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
