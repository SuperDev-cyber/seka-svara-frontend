import React, { useState } from 'react';
import '../../styles/mobile.css';
import { Header as MobileHeader } from '../../components/mobile/layout/Header';
import { BottomNav as MobileBottomNav } from '../../components/mobile/layout/BottomNav';
import { HomePage as MobileHomePage } from '../../components/mobile/home/HomePage';
import { LobbyPage as MobileLobbyPage } from '../../components/mobile/lobby/LobbyPage';
import { WalletPage as MobileWalletPage } from '../../components/mobile/wallet/WalletPage';
import { ProfilePage as MobileProfilePage } from '../../components/mobile/profile/ProfilePage';
import { SettingsPage as MobileSettingsPage } from '../../components/mobile/settings/SettingsPage';
import { Toaster } from '../../components/mobile/ui/toaster.jsx';

function MobileApp() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-game-dark">
      {activeTab !== 'play' && activeTab !== 'wallet' && (
        <MobileHeader language={language} onLanguageChange={setLanguage} />
      )}
      
      <main className="max-w-md mx-auto">
        {activeTab === 'home' && <MobileHomePage language={language} />}
        {activeTab === 'play' && (
          <MobileLobbyPage language={language} onBack={() => setActiveTab('home')} />
        )}
        {activeTab === 'wallet' && (
          <MobileWalletPage language={language} onBack={() => setActiveTab('home')} />
        )}
        {activeTab === 'profile' && (
          <MobileProfilePage language={language} onBack={() => setActiveTab('home')} />
        )}
        {activeTab === 'settings' && (
          <MobileSettingsPage
            language={language}
            onLanguageChange={setLanguage}
            onBack={() => setActiveTab('home')}
          />
        )}
      </main>

      <MobileBottomNav language={language} activeTab={activeTab} onTabChange={setActiveTab} />
      <Toaster />
    </div>
  );
}

export default MobileApp;

