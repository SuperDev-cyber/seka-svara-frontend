import { useState } from 'react';
import { useTranslation, Language } from '../../lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Loader2, ExternalLink, Info } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { useWallet } from '../../hooks/useWallet';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function DepositModal({ isOpen, onClose, language }: DepositModalProps) {
  const t = useTranslation(language);
  const { address, usdtBalance } = useWallet();
  const [amount, setAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [txHash, setTxHash] = useState('');

  const minAmount = 10;
  const maxAmount = 1000;
  const platformFee = 0.05; // 5%

  const depositAmount = parseFloat(amount) || 0;
  const feeAmount = depositAmount * platformFee;
  const totalAmount = depositAmount;

  const isValidAmount = depositAmount >= minAmount && depositAmount <= maxAmount && depositAmount <= usdtBalance;

  const handleApprove = async () => {
    if (!isValidAmount) return;
    
    setIsApproving(true);
    try {
      // TODO: Call smart contract approve function
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsApproved(true);
      toast({
        title: t('wallet.success'),
        description: 'USDT approved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve USDT',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!isValidAmount || !isApproved) return;
    
    setIsDepositing(true);
    try {
      // TODO: Call smart contract deposit function
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockTxHash = '0x' + Math.random().toString(16).slice(2, 66);
      setTxHash(mockTxHash);
      
      toast({
        title: t('wallet.success'),
        description: t('wallet.depositSuccess'),
      });
      
      setTimeout(() => {
        onClose();
        setAmount('');
        setIsApproved(false);
        setTxHash('');
      }, 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to deposit USDT',
        variant: 'destructive',
      });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-game-cardBg border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('wallet.depositTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
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
                placeholder={`${minAmount} - ${maxAmount}`}
                min={minAmount}
                max={maxAmount}
                className="w-full px-4 py-3 bg-game-dark border border-border rounded-lg text-foreground text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-game-gold/50"
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
                {t('wallet.max')}: {maxAmount} USDT
              </span>
            </div>
          </div>

          {/* Balance Info */}
          <div className="bg-game-dark rounded-lg p-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-muted-foreground">{t('wallet.balance')}</span>
              <span className="font-semibold text-foreground">{usdtBalance} USDT</span>
            </div>
          </div>

          {/* Fee Info */}
          {depositAmount > 0 && (
            <div className="bg-game-dark rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('wallet.amount')}</span>
                <span className="font-semibold text-foreground">{depositAmount.toFixed(2)} USDT</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">{t('lobby.platformFee')}</span>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="text-orange-400">5% ({feeAmount.toFixed(2)} USDT)</span>
              </div>
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-game-gold">{totalAmount.toFixed(2)} USDT</span>
              </div>
            </div>
          )}

          {/* Platform Fee Notice */}
          <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <Info className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
            <p className="text-xs text-orange-200">{t('wallet.platformFee')}</p>
          </div>

          {/* Transaction Hash */}
          {txHash && (
            <div className="bg-game-green/10 border border-game-green/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-game-green">✅ {t('wallet.depositSuccess')}</span>
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
            {!isApproved ? (
              <button
                onClick={handleApprove}
                disabled={isApproving || !isValidAmount}
                className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isApproving ? t('wallet.pending') : t('wallet.approve')}
              </button>
            ) : (
              <button
                onClick={handleDeposit}
                disabled={isDepositing || !isValidAmount}
                className="w-full btn-green flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDepositing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDepositing ? t('wallet.pending') : t('wallet.depositNow')}
              </button>
            )}

            <button onClick={onClose} className="w-full btn-secondary">
              {t('lobby.cancel')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
