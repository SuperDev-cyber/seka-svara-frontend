import { useState } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './components/home/HomePage';
import { LobbyPage } from './components/lobby/LobbyPage';
import { WalletPage } from './components/wallet/WalletPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { useLanguage } from './hooks/useLanguage';
import { Toaster } from './components/ui/toaster';

function App() {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-game-dark">
      {activeTab !== 'play' && activeTab !== 'wallet' && (
        <Header language={language} onLanguageChange={setLanguage} />
      )}
      
      <main className="max-w-md mx-auto">
        {activeTab === 'home' && <HomePage language={language} />}
        {activeTab === 'play' && (
          <LobbyPage language={language} onBack={() => setActiveTab('home')} />
        )}
        {activeTab === 'wallet' && (
          <WalletPage language={language} onBack={() => setActiveTab('home')} />
        )}
        {activeTab === 'profile' && (
          <ProfilePage language={language} onBack={() => setActiveTab('home')} />
        )}
        {activeTab === 'settings' && (
          <SettingsPage
            language={language}
            onLanguageChange={setLanguage}
            onBack={() => setActiveTab('home')}
          />
        )}
      </main>

      <BottomNav language={language} activeTab={activeTab} onTabChange={setActiveTab} />
      <Toaster />
    </div>
  );
}

export default App;
