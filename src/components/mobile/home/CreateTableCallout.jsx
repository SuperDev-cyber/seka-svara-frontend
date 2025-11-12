import React from 'react';
import { Plus } from '../lib/icons';
import { useTranslation } from '../lib/i18n';

export function CreateTableCallout({ language, onCreate }) {
  const t = useTranslation(language);

  return (
    <div className="card-game border-game-green/30 glow-green">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm text-foreground font-medium">{t('create.title')}</div>
        </div>
        <button onClick={onCreate} className="btn-green flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          {t('create.button')}
        </button>
      </div>
    </div>
  );
}

