import { Shield } from 'lucide-react';
import { useTranslation, Language } from '../../lib/i18n';

interface SecurityInfoProps {
  language: Language;
}

export function SecurityInfo({ language }: SecurityInfoProps) {
  const t = useTranslation(language);

  const tips = [
    t('wallet.securityTip1'),
    t('wallet.securityTip2'),
    t('wallet.securityTip3'),
  ];

  return (
    <div className="bg-game-cardBg rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-game-green" />
        <h3 className="text-lg font-bold text-foreground">{t('wallet.securityTitle')}</h3>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-game-green/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-game-green">{index + 1}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
