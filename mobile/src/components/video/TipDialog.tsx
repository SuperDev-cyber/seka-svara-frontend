import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Wallet, DollarSign } from 'lucide-react';
import { shortenAddress } from '@/lib/web3';

type TipDialogProps = {
  open: boolean;
  onClose: () => void;
  videoId: string;
  creatorId: string;
  creatorName: string;
};

export function TipDialog({ open, onClose, videoId, creatorId, creatorName }: TipDialogProps) {
  const { account, balance, isConnected, loading, connect, sendTip } = useWallet();
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendTip = async () => {
    if (!user || !account) {
      toast.error('Hamyon ulanmagan');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Miqdorni kiriting');
      return;
    }

    setSending(true);
    try {
      // Get creator's wallet address
      const { data: creatorProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('wallet_address')
        .eq('id', creatorId)
        .single();

      if (profileError) throw profileError;

      if (!creatorProfile?.wallet_address) {
        toast.error('Yaratuvchining hamyon manzili topilmadi');
        return;
      }

      // Send USDT
      const txHash = await sendTip(creatorProfile.wallet_address, amount);

      // Record tip in database
      const { error: tipError } = await supabase.from('tips').insert({
        from_user_id: user.id,
        to_user_id: creatorId,
        video_id: videoId,
        amount: parseFloat(amount),
        tx_hash: txHash,
      });

      if (tipError) throw tipError;

      toast.success('Tip muvaffaqiyatli yuborildi!');
      setAmount('');
      onClose();
    } catch (error: any) {
      console.error('Tip yuborishda xatolik:', error);
      toast.error(error.message || 'Tip yuborishda xatolik');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            {creatorName}ga Tip yuboring
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isConnected ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Tip yuborish uchun hamyoningizni ulang
              </p>
              <Button onClick={connect} disabled={loading} className="w-full gradient-primary">
                <Wallet className="w-4 h-4 mr-2" />
                Hamyonni ulash
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass-effect p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hamyon:</span>
                  <span className="font-medium">{shortenAddress(account!)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Balans:</span>
                  <span className="font-semibold">{balance} USDT</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Miqdor (USDT)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="flex gap-2">
                {['1', '5', '10', '50'].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset)}
                    className="flex-1"
                  >
                    {preset} USDT
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleSendTip}
                disabled={sending || !amount}
                className="w-full gradient-primary"
              >
                {sending ? 'Yuborilmoqda...' : 'Tip yuborish'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
