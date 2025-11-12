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

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  stake: number;
  tableId: string;
}

export function JoinGameModal({
  isOpen,
  onClose,
  language,
  stake,
  tableId,
}: JoinGameModalProps) {
  const t = useTranslation(language);
  const { address, usdtBalance } = useWallet();
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const platformFee = stake * 0.05; // 5%
  const totalAmount = stake;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // TODO: Call smart contract approve function
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsApproved(true);
      toast({
        title: t('lobby.success'),
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
    setIsDepositing(true);
    try {
      // TODO: Call smart contract deposit function
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: t('lobby.success'),
        description: 'Successfully joined the game!',
      });
      onClose();
      // TODO: Navigate to game page
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

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-game-cardBg border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('lobby.modalTitle')} — {stake} USDT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Wallet Info */}
          <div className="space-y-2">
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('balance.title')}</span>
              <span className="font-semibold text-foreground">{usdtBalance} USDT</span>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="bg-game-dark rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('lobby.stake')}</span>
              <span className="font-bold text-foreground">{stake} USDT</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">{t('lobby.platformFee')}</span>
                <Info className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="text-sm text-orange-400">5% ({platformFee.toFixed(2)} USDT)</span>
            </div>
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-game-gold">{totalAmount} USDT</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {!isApproved ? (
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="w-full btn-gold flex items-center justify-center gap-2"
              >
                {isApproving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isApproving ? t('lobby.pending') : t('lobby.approve')}
              </button>
            ) : (
              <button
                onClick={handleDeposit}
                disabled={isDepositing}
                className="w-full btn-green flex items-center justify-center gap-2"
              >
                {isDepositing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDepositing ? t('lobby.pending') : t('lobby.deposit')}
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
