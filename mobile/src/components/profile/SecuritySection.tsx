import { Shield, Smartphone, Wallet, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslation, Language } from '../../lib/i18n';

interface Device {
  name: string;
  lastSeen: Date;
}

interface SecuritySectionProps {
  language: Language;
  twoFA: boolean;
  devices: Device[];
  primaryWallet: string;
  showProfile: boolean;
  onToggle2FA: (enabled: boolean) => void;
  onDeviceSignOut: (deviceName: string) => void;
  onConnectWallet: () => void;
  onTogglePrivacy: (show: boolean) => void;
}

export function SecuritySection({
  language,
  twoFA,
  devices,
  primaryWallet,
  showProfile,
  onToggle2FA,
  onDeviceSignOut,
  onConnectWallet,
  onTogglePrivacy,
}: SecuritySectionProps) {
  const t = useTranslation(language);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      {/* 2FA Toggle */}
      <div className="card-game">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-game-green/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-game-green" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{t('profile.2fa')}</div>
              <div className="text-xs text-muted-foreground">Email / TOTP</div>
            </div>
          </div>
          <button
            onClick={() => onToggle2FA(!twoFA)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              twoFA ? 'bg-game-green' : 'bg-border'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                twoFA ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Connected Wallets */}
      <div className="card-game">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-game-gold/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-game-gold" />
          </div>
          <div>
            <div className="font-semibold text-foreground">{t('profile.connections')}</div>
            <div className="text-xs text-muted-foreground">BSC Network</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-game-dark rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">{t('profile.primaryWallet')}</div>
              <span className="text-sm font-mono text-foreground">
                {shortenAddress(primaryWallet)}
              </span>
            </div>
          </div>
          <button
            onClick={onConnectWallet}
            className="w-full py-2 text-sm text-game-gold hover:text-game-gold/80 transition-colors"
          >
            + {t('profile.connectAnother')}
          </button>
        </div>
      </div>

      {/* Active Devices */}
      <div className="card-game">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="font-semibold text-foreground">{t('profile.devices')}</div>
            <div className="text-xs text-muted-foreground">{devices.length} active</div>
          </div>
        </div>
        <div className="space-y-2">
          {devices.map((device, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-game-dark rounded-lg"
            >
              <div>
                <div className="text-sm font-medium text-foreground">{device.name}</div>
                <div className="text-xs text-muted-foreground">
                  {t('profile.lastSeen')}: {formatDate(device.lastSeen)}
                </div>
              </div>
              <button
                onClick={() => onDeviceSignOut(device.name)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                {t('profile.signOut')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Toggle */}
      <div className="card-game">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center">
              {showProfile ? (
                <Eye className="w-5 h-5 text-purple-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <div>
              <div className="font-semibold text-foreground">{t('profile.privacy')}</div>
              <div className="text-xs text-muted-foreground">{t('profile.showProfile')}</div>
            </div>
          </div>
          <button
            onClick={() => onTogglePrivacy(!showProfile)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              showProfile ? 'bg-game-green' : 'bg-border'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                showProfile ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
