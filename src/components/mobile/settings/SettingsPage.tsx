import { useState } from 'react';
import {
  ArrowLeft,
  Globe,
  Monitor,
  Bell,
  Shield,
  Gamepad2,
  Database,
  FileText,
  HelpCircle,
  LogOut,
  Trash2,
  Check,
  ChevronRight,
  AlertCircle } from
'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';
import { toast } from '../ui/use-toast';

interface SettingsPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
}

type Theme = 'dark' | 'light' | 'auto';
type FontSize = 'small' | 'default' | 'large';
type NotificationChannel = 'inapp' | 'email' | 'push';

export function SettingsPage({ language, onLanguageChange, onBack }: SettingsPageProps) {
  const t = useTranslation(language);

  // Settings state
  const [theme, setTheme] = useState<Theme>('dark');
  const [animations, setAnimations] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>('default');
  const [notifyWins, setNotifyWins] = useState(true);
  const [notifyPayments, setNotifyPayments] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);
  const [notifChannel, setNotifChannel] = useState<NotificationChannel>('inapp');
  const [twoFA, setTwoFA] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showFiat, setShowFiat] = useState(false);
  const [selectedStakes, setSelectedStakes] = useState<number[]>([10, 25, 50]);

  const stakes = [10, 25, 50, 100, 250];

  const handleLanguageChange = (lang: Language) => {
    onLanguageChange(lang);
    toast({
      title: t('settings.saved'),
      description: `${t('settings.language')}: ${lang.toUpperCase()}`
    });
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: t('settings.saved'),
      description: `${t('settings.theme')}: ${t(`settings.${newTheme}` as any)}`
    });
  };

  const handleClearCache = () => {
    if (confirm(t('settings.clearCacheConfirm'))) {
      // TODO: Implement cache clearing
      toast({
        title: t('settings.saved'),
        description: t('settings.clearCache')
      });
    }
  };

  const handleResetSettings = () => {
    if (confirm(t('settings.resetConfirm'))) {
      // TODO: Implement settings reset
      toast({
        title: t('settings.saved'),
        description: t('settings.resetLocal')
      });
    }
  };

  const handleLogout = () => {
    if (confirm(t('settings.confirm'))) {
      toast({
        title: t('settings.logout'),
        description: 'Logged out successfully'
      });
      // TODO: Implement logout
    }
  };

  const handleLogoutAll = () => {
    if (confirm(t('settings.confirm'))) {
      toast({
        title: t('settings.logoutAll'),
        description: 'Logged out from all devices'
      });
      // TODO: Implement logout all
    }
  };

  const handleDeleteAccount = () => {
    if (confirm(t('settings.deleteConfirm'))) {
      toast({
        title: t('settings.delete'),
        description: t('profile.deleteWarning'),
        variant: 'destructive'
      });
      // TODO: Implement account deletion
    }
  };

  const toggleStake = (stake: number) => {
    if (selectedStakes.includes(stake)) {
      setSelectedStakes(selectedStakes.filter((s) => s !== stake));
    } else {
      setSelectedStakes([...selectedStakes, stake]);
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-game-darker/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors">

            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-game-gold to-game-green bg-clip-text text-transparent">
            {t('settings.title')}
          </h1>
          <button
            onClick={() => {
              const langs: Language[] = ['uz', 'ru', 'en'];
              const currentIndex = langs.indexOf(language);
              const nextLang = langs[(currentIndex + 1) % langs.length];
              handleLanguageChange(nextLang);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors">

            
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Language & Region */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-game-gold" />
            <h2 className="text-lg font-bold text-foreground">{t('settings.language')}</h2>
          </div>
          <div className="card-game space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {(['uz', 'ru', 'en'] as Language[]).map((lang) =>
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`py-3 px-4 rounded-lg border transition-all duration-200 ${
                language === lang ?
                'border-game-gold bg-game-gold/10 text-game-gold' :
                'border-border bg-game-dark text-muted-foreground hover:border-border-hover'}`
                }>

                  <div className="font-semibold">{lang.toUpperCase()}</div>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Theme & Display */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-game-gold" />
            <h2 className="text-lg font-bold text-foreground">{t('settings.displaySettings')}</h2>
          </div>
          <div className="card-game space-y-4">
            {/* Theme */}
            <div>
              <div className="text-sm font-medium text-foreground mb-2">{t('settings.theme')}</div>
              <div className="grid grid-cols-3 gap-2">
                {(['dark', 'light', 'auto'] as Theme[]).map((themeOption) =>
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`py-2 px-3 rounded-lg border text-sm transition-all duration-200 ${
                  theme === themeOption ?
                  'border-game-gold bg-game-gold/10 text-game-gold' :
                  'border-border bg-game-dark text-muted-foreground hover:border-border-hover'}`
                  }>

                    {t(`settings.${themeOption}` as any)}
                  </button>
                )}
              </div>
            </div>

            {/* Animations */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">{t('settings.animations')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.lowMotion')}</div>
              </div>
              <button
                onClick={() => setAnimations(!animations)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                animations ? 'bg-game-green' : 'bg-border'}`
                }>

                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  animations ? 'translate-x-6' : ''}`
                  } />

              </button>
            </div>

            {/* Font Size */}
            <div>
              <div className="text-sm font-medium text-foreground mb-2">{t('settings.fontSize')}</div>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'default', 'large'] as FontSize[]).map((size) =>
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`py-2 px-3 rounded-lg border text-sm transition-all duration-200 ${
                  fontSize === size ?
                  'border-game-gold bg-game-gold/10 text-game-gold' :
                  'border-border bg-game-dark text-muted-foreground hover:border-border-hover'}`
                  }>

                    {t(`settings.${size}` as any)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-game-gold" />
            <h2 className="text-lg font-bold text-foreground">{t('settings.notifications')}</h2>
          </div>
          <div className="card-game space-y-4">
            {/* Notification Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{t('settings.wins')}</span>
                <button
                  onClick={() => setNotifyWins(!notifyWins)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifyWins ? 'bg-game-green' : 'bg-border'}`
                  }>

                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notifyWins ? 'translate-x-6' : ''}`
                    } />

                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{t('settings.payments')}</span>
                <button
                  onClick={() => setNotifyPayments(!notifyPayments)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifyPayments ? 'bg-game-green' : 'bg-border'}`
                  }>

                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notifyPayments ? 'translate-x-6' : ''}`
                    } />

                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{t('settings.system')}</span>
                <button
                  onClick={() => setNotifySystem(!notifySystem)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifySystem ? 'bg-game-green' : 'bg-border'}`
                  }>

                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notifySystem ? 'translate-x-6' : ''}`
                    } />

                </button>
              </div>
            </div>

            {/* Channel Selection */}
            <div>
              <div className="text-sm font-medium text-foreground mb-2">{t('settings.channel')}</div>
              <div className="grid grid-cols-3 gap-2">
                {(['inapp', 'email', 'push'] as NotificationChannel[]).map((channel) =>
                <button
                  key={channel}
                  onClick={() => setNotifChannel(channel)}
                  className={`py-2 px-3 rounded-lg border text-sm transition-all duration-200 ${
                  notifChannel === channel ?
                  'border-game-gold bg-game-gold/10 text-game-gold' :
                  'border-border bg-game-dark text-muted-foreground hover:border-border-hover'}`
                  }>

                    {t(`settings.${channel}` as any)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-game-gold" />
            <h2 className="text-lg font-bold text-foreground">{t('settings.security')}</h2>
          </div>
          <div className="card-game space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">{t('settings.2fa')}</div>
                <div className="text-xs text-muted-foreground">TOTP</div>
              </div>
              <button
                onClick={() => setTwoFA(!twoFA)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                twoFA ? 'bg-game-green' : 'bg-border'}`
                }>

                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  twoFA ? 'translate-x-6' : ''}`
                  } />

              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">{t('settings.showProfile')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.privacy')}</div>
              </div>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                showProfile ? 'bg-game-green' : 'bg-border'}`
                }>

                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  showProfile ? 'translate-x-6' : ''}`
                  } />

              </button>
            </div>
          </div>
        </section>

        {/* Game & Payments */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5 text-game-gold" />
            <h2 className="text-lg font-bold text-foreground">{t('settings.gamePayments')}</h2>
          </div>
          <div className="card-game space-y-4">
            {/* Stake Presets */}
            <div>
              <div className="text-sm font-medium text-foreground mb-2">
                {t('settings.stakePresets')}
              </div>
              <div className="flex flex-wrap gap-2">
                {stakes.map((stake) =>
                <button
                  key={stake}
                  onClick={() => toggleStake(stake)}
                  className={`py-2 px-4 rounded-lg border transition-all duration-200 ${
                  selectedStakes.includes(stake) ?
                  'border-game-gold bg-game-gold/10 text-game-gold' :
                  'border-border bg-game-dark text-muted-foreground hover:border-border-hover'}`
                  }>

                    {stake} USDT
                    {selectedStakes.includes(stake) && <Check className="w-4 h-4 inline ml-1" />}
                  </button>
                )}
              </div>
            </div>

            {/* Gas Tip Banner */}
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-400">{t('settings.gasTip')}</div>
            </div>

            {/* Currency Display */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">{t('settings.currency')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.showFiat')}</div>
              </div>
              <button
                onClick={() => setShowFiat(!showFiat)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                showFiat ? 'bg-game-green' : 'bg-border'}`
                }>

                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  showFiat ? 'translate-x-6' : ''}`
                  } />

              </button>
            </div>
          </div>
        </section>

        {/* Data & Cache */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-game-gold" />
            <h2 className="text-lg font-bold text-foreground">{t('settings.cache')}</h2>
          </div>
          <div className="card-game space-y-3">
            <button onClick={handleClearCache} className="w-full btn-secondary text-left">
              {t('settings.clearCache')}
            </button>
            <button onClick={handleResetSettings} className="w-full btn-secondary text-left">
              {t('settings.resetLocal')}
            </button>
          </div>
        </section>

        {/* Legal & Docs */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-game-gold" />
            <h2 className="text-lg font-bold text-foreground">{t('settings.legal')}</h2>
          </div>
          <div className="card-game space-y-2">
            {[
            { label: t('settings.terms'), href: '#terms' },
            { label: t('settings.privacyPolicy'), href: '#privacy' },
            { label: t('settings.fairPlay'), href: '#fairplay' },
            { label: t('settings.risk'), href: '#risk' }].
            map((item, index) =>
            <button
              key={index}
              onClick={() =>
              toast({
                title: item.label,
                description: 'Opening document...'
              })
              }
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-game-dark rounded-lg transition-colors text-left">

                <span className="text-sm text-foreground">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <div className="pt-3 text-xs text-muted-foreground text-center border-t border-border">
              {t('settings.legalFooter')}
            </div>
          </div>
        </section>

        {/* Support & About */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-game-gold" />
            <h2 className="text-lg font-bold text-foreground">{t('settings.support')}</h2>
          </div>
          <div className="card-game space-y-2">
            <button
              onClick={() =>
              toast({
                title: t('settings.contact'),
                description: 'Opening contact form...'
              })
              }
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-game-dark rounded-lg transition-colors text-left">

              <span className="text-sm text-foreground">{t('settings.contact')}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() =>
              toast({
                title: t('settings.faq'),
                description: 'Opening FAQ...'
              })
              }
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-game-dark rounded-lg transition-colors text-left">

              <span className="text-sm text-foreground">{t('settings.faq')}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="pt-3 border-t border-border space-y-1 px-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('settings.version')}</span>
                <span className="text-foreground font-mono">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Build</span>
                <span className="text-foreground font-mono">2025.01.11</span>
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            
            
          </div>
          






















        </section>
      </div>
    </div>);

}