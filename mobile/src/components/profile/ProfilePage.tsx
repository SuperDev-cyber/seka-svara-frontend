
import { useState } from 'react';
import { ArrowLeft, Copy, ExternalLink, Camera, LogOut, Trash2 } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';
import { useWallet } from '../../hooks/useWallet';
import { ProfileStats } from './ProfileStats';
import { RecentGames } from './RecentGames';
import { SecuritySection } from './SecuritySection';
import { ReferralsSection } from './ReferralsSection';
import { EditProfileDialog } from './EditProfileDialog';
import { toast } from '../ui/use-toast';

interface ProfilePageProps {
  language: Language;
  onBack: () => void;
}

export function ProfilePage({ language, onBack }: ProfilePageProps) {
  const t = useTranslation(language);
  const { address } = useWallet();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [showProfile, setShowProfile] = useState(true);

  // Mock user data
  const userData = {
    uid: 'usr_8x2f9',
    nickname: 'Azamat',
    avatar: '', // Empty for now
    wallet: address || '0xA3B5C7D9E1F3A5B7C9D1E3F5A7B9C1D3E5F7A9B1',
    joinedAt: new Date('2025-10-15T12:30:00Z'),
    bio: 'Passionate Seka Svara player 🎮',
    badges: ['early_bird', 'streak_5', 'high_roller'],
    stats: {
      games: 124,
      wins: 68,
      winRate: 54.8,
      totalWinningsUSDT: 915.25,
      highestStakeUSDT: 250,
      longestStreak: 6,
    },
    recentGames: [
      {
        gameId: 12345,
        date: new Date('2025-11-08T18:20:00Z'),
        stake: 50,
        players: 4,
        result: 'win' as const,
        amount: 75,
      },
      {
        gameId: 12312,
        date: new Date('2025-11-07T16:05:00Z'),
        stake: 25,
        players: 3,
        result: 'loss' as const,
        amount: -25,
      },
      {
        gameId: 12289,
        date: new Date('2025-11-06T14:30:00Z'),
        stake: 100,
        players: 4,
        result: 'win' as const,
        amount: 150,
      },
      {
        gameId: 12256,
        date: new Date('2025-11-05T11:15:00Z'),
        stake: 50,
        players: 3,
        result: 'refund' as const,
        amount: 50,
      },
      {
        gameId: 12201,
        date: new Date('2025-11-04T09:45:00Z'),
        stake: 25,
        players: 4,
        result: 'win' as const,
        amount: 37.5,
      },
    ],
    security: {
      twoFA: false,
      devices: [
        { name: 'iPhone 15', lastSeen: new Date('2025-11-10T14:02:00Z') },
        { name: 'Chrome on MacBook', lastSeen: new Date('2025-11-09T22:15:00Z') },
      ],
    },
    referrals: {
      link: 'https://sekasvara.io/r/azm8x2',
      sent: 12,
      signups: 7,
      bonusUSDT: 21,
    },
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    const month = date.toLocaleString(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', {
      month: 'short',
    });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(userData.wallet);
    toast({
      title: t('profile.copied'),
      description: userData.wallet,
    });
  };

  const handleLogout = () => {
    toast({
      title: t('profile.logout'),
      description: 'Logged out successfully',
    });
    // TODO: Implement logout
  };

  const handleDeleteAccount = () => {
    // TODO: Show confirmation dialog
    toast({
      title: t('profile.delete'),
      description: t('profile.deleteWarning'),
      variant: 'destructive',
    });
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
            {t('profile.title')}
          </h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Wallet Badge */}
        <div className="px-4 pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-game-cardBg border border-border rounded-full">
            <div className="w-2 h-2 rounded-full bg-game-green" />
            <span className="text-xs font-mono text-foreground">
              {shortenAddress(userData.wallet)}
            </span>
            <span className="text-xs text-muted-foreground">BSC</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Identity Card */}
        <div className="card-game glow-gold">
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="relative">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.nickname}
                  className="w-20 h-20 rounded-full border-2 border-game-gold"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-game-gold to-game-green flex items-center justify-center border-2 border-game-gold">
                  <span className="text-2xl font-bold text-white">
                    {userData.nickname.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-game-gold hover:bg-game-gold/80 flex items-center justify-center transition-colors">
                <Camera className="w-4 h-4 text-game-darker" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-1">@{userData.nickname}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>
                  {t('profile.uid')}: {userData.uid}
                </span>
                <span>•</span>
                <span>
                  {t('profile.joined')}: {formatDate(userData.joinedAt)}
                </span>
              </div>
              {userData.bio && <p className="text-sm text-foreground">{userData.bio}</p>}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {userData.badges.map((badge, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-game-gold/10 border border-game-gold/30 rounded-full text-xs font-semibold text-game-gold"
              >
                {badge === 'early_bird' && '🐦 Early Bird'}
                {badge === 'streak_5' && '🔥 Streak 5+'}
                {badge === 'high_roller' && '💎 High Roller'}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setEditDialogOpen(true)} className="btn-gold">
              {t('profile.edit')}
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleCopyWallet}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={`https://bscscan.com/address/${userData.wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">{t('profile.stats')}</h2>
          <ProfileStats language={language} stats={userData.stats} />
        </section>

        {/* Recent Games */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('profile.recent')}</h2>
            {userData.recentGames.length > 0 && (
              <button className="text-sm text-game-gold hover:text-game-gold/80 transition-colors">
                {t('wallet.viewAll')}
              </button>
            )}
          </div>
          <RecentGames language={language} games={userData.recentGames} />
        </section>

        {/* Security & Connections */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">{t('profile.security')}</h2>
          <SecuritySection
            language={language}
            twoFA={twoFA}
            devices={userData.security.devices}
            primaryWallet={userData.wallet}
            showProfile={showProfile}
            onToggle2FA={setTwoFA}
            onDeviceSignOut={(deviceName) => {
              toast({
                title: 'Signed out',
                description: `Signed out from ${deviceName}`,
              });
            }}
            onConnectWallet={() => {
              toast({
                title: t('profile.connectWallet'),
                description: 'Feature coming soon',
              });
            }}
            onTogglePrivacy={setShowProfile}
          />
        </section>

        {/* Referrals */}
        <section>
          <ReferralsSection language={language} referrals={userData.referrals} />
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-xl font-bold text-red-400 mb-4">{t('profile.dangerZone')}</h2>
          <div className="space-y-3">
            <button onClick={handleLogout} className="w-full btn-secondary flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              {t('profile.logoutAll')}
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 transition-all duration-200 rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t('profile.delete')}
            </button>
          </div>
        </section>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} />
    </div>
  );
}
