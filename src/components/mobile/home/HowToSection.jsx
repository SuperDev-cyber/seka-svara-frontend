import React from 'react';
import { Wallet, ArrowDownToLine, PlayCircle, HelpCircle } from '../lib/icons';
import { useTranslation } from '../lib/i18n';

export function HowToSection({ language, onHelpClick }) {
  const t = useTranslation(language);

  const steps = [
    { icon: Wallet, text: t('howto.step1'), color: 'text-blue-400' },
    { icon: ArrowDownToLine, text: t('howto.step2'), color: 'text-game-green' },
    { icon: PlayCircle, text: t('howto.step3'), color: 'text-game-gold' },
  ];

  return (
    <div className="card-game">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{t('howto.title')}</h3>
          <button
            onClick={onHelpClick}
            className="flex items-center gap-1 text-sm text-game-gold hover:text-game-gold/80 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            {t('howto.link')}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-game-cardHover flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{step.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

