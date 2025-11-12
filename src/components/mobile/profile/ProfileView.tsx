import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { AuthDialog } from './AuthDialog';
import { EditProfileDialog } from './EditProfileDialog';
import { Wallet, LogOut, Settings, Video } from 'lucide-react';
import { toast } from 'sonner';
import { shortenAddress } from '@/lib/web3';

export function ProfileView() {
  const { user, profile, signOut } = useAuth();
  const { account, balance, isConnected, loading, connect } = useWallet();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Tizimdan chiqdingiz');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connect();
      toast.success('Hamyon ulandi');
    } catch (error: any) {
      toast.error(error.message || 'Hamyonni ulashda xatolik');
    }
  };

  if (!user) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-24 h-24 rounded-full gradient-primary mb-6" />
          <h2 className="text-2xl font-bold mb-2">Profilingizga xush kelibsiz</h2>
          


          <Button
            onClick={() => setShowAuthDialog(true)}
            className="gradient-primary"
            size="lg">

            Kirish / Ro'yxatdan o'tish
          </Button>
        </div>

        <AuthDialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
      </>);

  }

  return (
    <>
      <div className="h-full overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="relative h-32 gradient-primary" />

          {/* Profile info */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-16 mb-6">
              {profile?.avatar_url ?
              <img
                src={profile.avatar_url}
                alt={profile.username || 'User'}
                className="w-32 h-32 rounded-full border-4 border-background" /> :


              <div className="w-32 h-32 rounded-full border-4 border-background gradient-primary" />
              }
              <Button onClick={() => setShowEditDialog(true)} variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Tahrirlash
              </Button>
            </div>

            <div className="space-y-2 mb-6">
              <h1 className="text-2xl font-bold">
                @{profile?.username || 'Anonymous'}
              </h1>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              {profile?.bio &&
              <p className="text-sm">{profile.bio}</p>
              }
            </div>

            {/* Wallet section */}
            <div className="glass-effect rounded-lg p-4 space-y-3 mb-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                USDT Hamyon
              </h3>
              
              {isConnected ?
              <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Manzil:</span>
                    <span className="font-medium">{shortenAddress(account!)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Balans:</span>
                    <span className="font-semibold text-lg">{balance} USDT</span>
                  </div>
                </div> :

              <Button
                onClick={handleConnectWallet}
                disabled={loading}
                variant="outline"
                className="w-full">

                  <Wallet className="w-4 h-4 mr-2" />
                  Hamyonni ulash
                </Button>
              }
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center glass-effect rounded-lg p-4">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Videolar</div>
              </div>
              <div className="text-center glass-effect rounded-lg p-4">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Likelar</div>
              </div>
              <div className="text-center glass-effect rounded-lg p-4">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Ko'rishlar</div>
              </div>
            </div>

            {/* Sign out button */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full">

              <LogOut className="w-4 h-4 mr-2" />
              Chiqish
            </Button>
          </div>
        </div>
      </div>

      <EditProfileDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)} />

    </>);

}