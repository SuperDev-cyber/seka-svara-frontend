import { useState } from 'react';
import { useTranslation } from '../../lib/i18n';
import { Language } from '../../lib/i18n';
import { BalanceCard } from './BalanceCard';
import { GameTableCard } from './GameTableCard';
import { CreateTableCallout } from './CreateTableCallout';
import { HowToSection } from './HowToSection';
import { PromoBanner } from './PromoBanner';
import { RecentTransactions } from './RecentTransactions';
import { ChevronRight } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface HomePageProps {
  language: Language;
}

export function HomePage({ language }: HomePageProps) {
  const t = useTranslation(language);
  
  // Mock data - in real app, fetch from backend/wallet
  const [usdtBalance] = useState('245.50');
  const [bnbBalance] = useState('0.045');

  const mockTables = [
    { id: 1, stake: 10, currentPlayers: 2, maxPlayers: 4, ping: 35 },
    { id: 2, stake: 50, currentPlayers: 3, maxPlayers: 4, ping: 42 },
    { id: 3, stake: 100, currentPlayers: 1, maxPlayers: 4, ping: 28 },
    { id: 4, stake: 10, currentPlayers: 4, maxPlayers: 4, ping: 51 },
    { id: 5, stake: 50, currentPlayers: 2, maxPlayers: 4, ping: 38 },
    { id: 6, stake: 100, currentPlayers: 3, maxPlayers: 4, ping: 45 },
  ];

  const mockTransactions = [
    {
      id: '1',
      type: 'deposit' as const,
      amount: '100.00',
      timestamp: '2 hours ago',
      txHash: '0x1234...5678',
    },
    {
      id: '2',
      type: 'payout' as const,
      amount: '150.00',
      timestamp: '5 hours ago',
      txHash: '0xabcd...ef01',
    },
    {
      id: '3',
      type: 'refund' as const,
      amount: '50.00',
      timestamp: '1 day ago',
      txHash: '0x9876...5432',
    },
  ];

  const handleDeposit = () => {
    toast({ title: 'Deposit', description: 'Opening deposit dialog...' });
  };

  const handleWithdraw = () => {
    toast({ title: 'Withdraw', description: 'Opening withdraw dialog...' });
  };

  const handleBuyGas = () => {
    toast({ title: 'Buy Gas', description: 'Opening BNB purchase...' });
  };

  const handleJoinTable = (tableId: number) => {
    toast({ title: 'Join Game', description: `Joining table ${tableId}...` });
  };

  const handleSpectate = (tableId: number) => {
    toast({ title: 'Spectate', description: `Spectating table ${tableId}...` });
  };

  const handleCreateTable = () => {
    toast({ title: 'Create Table', description: 'Opening table creation...' });
  };

  const handleViewAllTables = () => {
    toast({ title: 'Lobby', description: 'Navigating to lobby...' });
  };

  const handleViewAllTransactions = () => {
    toast({ title: 'History', description: 'Navigating to wallet history...' });
  };

  const handleHelp = () => {
    toast({ title: 'Help', description: 'Opening game rules...' });
  };

  return (
    <div className="pb-20 px-4 space-y-6">
      {/* Balance Card */}
      <div className="pt-4">
        <BalanceCard
          language={language}
          usdtBalance={usdtBalance}
          bnbBalance={bnbBalance}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onBuyGas={handleBuyGas}
        />
      </div>

      {/* Promo Banner */}
      <PromoBanner language={language} />

      {/* Active Tables */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{t('tables.title')}</h2>
          <button
            onClick={handleViewAllTables}
            className="flex items-center gap-1 text-sm text-game-gold hover:text-game-gold/80 transition-colors"
          >
            {t('tables.viewAll')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin -mx-4 px-4">
          {mockTables.slice(0, 6).map((table) => (
            <GameTableCard
              key={table.id}
              language={language}
              stake={table.stake}
              currentPlayers={table.currentPlayers}
              maxPlayers={table.maxPlayers}
              ping={table.ping}
              onJoin={() => handleJoinTable(table.id)}
              onSpectate={() => handleSpectate(table.id)}
            />
          ))}
        </div>
      </section>

      {/* Create Table Callout */}
      <CreateTableCallout language={language} onCreate={handleCreateTable} />

      {/* How To Section */}
      <HowToSection language={language} onHelpClick={handleHelp} />

      {/* Recent Transactions */}
      <RecentTransactions
        language={language}
        transactions={mockTransactions}
        onViewAll={handleViewAllTransactions}
      />
    </div>
  );
}
