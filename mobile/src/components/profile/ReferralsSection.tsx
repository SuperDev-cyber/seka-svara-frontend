import { Copy, Share2, Users, UserPlus, DollarSign } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';
import { toast } from '../ui/use-toast';

interface Referrals {
  link: string;
  sent: number;
  signups: number;
  bonusUSDT: number;
}

interface ReferralsSectionProps {
  language: Language;
  referrals: Referrals;
}

export function ReferralsSection({ language, referrals }: ReferralsSectionProps) {
  const t = useTranslation(language);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referrals.link);
    toast({
      title: t('profile.copied'),
      description: referrals.link,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Seka Svara',
          text: 'Join me on Seka Svara - play card games and earn USDT!',
          url: referrals.link,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="card-game glow-green">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-game-gold to-game-green flex items-center justify-center">
          <Share2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{t('profile.referrals')}</h3>
          <p className="text-xs text-muted-foreground">Earn 5% of your referrals' deposits</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-game-dark rounded-lg p-3 text-center">
          <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-foreground">{referrals.sent}</div>
          <div className="text-xs text-muted-foreground">{t('profile.invites')}</div>
        </div>
        <div className="bg-game-dark rounded-lg p-3 text-center">
          <UserPlus className="w-5 h-5 text-game-green mx-auto mb-1" />
          <div className="text-xl font-bold text-foreground">{referrals.signups}</div>
          <div className="text-xs text-muted-foreground">{t('profile.signups')}</div>
        </div>
        <div className="bg-game-dark rounded-lg p-3 text-center">
          <DollarSign className="w-5 h-5 text-game-gold mx-auto mb-1" />
          <div className="text-xl font-bold text-game-gold">{referrals.bonusUSDT}</div>
          <div className="text-xs text-muted-foreground">{t('profile.bonus')}</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-game-dark rounded-lg p-3 mb-3">
        <div className="text-xs text-muted-foreground mb-2">{t('profile.referralLink')}</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 text-sm font-mono text-foreground truncate">
            {referrals.link}
          </div>
          <button
            onClick={handleCopyLink}
            className="p-2 hover:bg-game-cardHover rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4 text-game-gold" />
          </button>
        </div>
      </div>

      {/* Share Button */}
      <button onClick={handleShare} className="w-full btn-green flex items-center justify-center gap-2">
        <Share2 className="w-4 h-4" />
        {t('profile.share')}
      </button>
    </div>
  );
}
