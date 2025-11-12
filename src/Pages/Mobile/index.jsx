import React, { useState } from 'react';

// Minimal mobile app - no complex dependencies
function MobileApp() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070A0D', paddingBottom: '80px' }}>
      {/* Simple Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'rgba(7, 10, 13, 0.95)', 
        borderBottom: '1px solid hsl(220, 10%, 18%)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(to right, #F5C451, #2ECC71)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Seka Svara
        </div>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{ 
            background: '#151A21', 
            color: '#fff', 
            border: '1px solid hsl(220, 10%, 18%)', 
            borderRadius: '8px', 
            padding: '8px 12px'
          }}
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="uz">O'zbek</option>
        </select>
      </header>

      {/* Simple Content */}
      <main style={{ maxWidth: '448px', margin: '0 auto', padding: '16px' }}>
        {activeTab === 'home' && (
          <div>
            <div style={{ 
              backgroundColor: '#151A21', 
              borderRadius: '16px', 
              padding: '20px', 
              marginBottom: '24px',
              border: '1px solid rgba(245, 196, 81, 0.2)'
            }}>
              <div style={{ marginBottom: '12px', fontSize: '14px', color: '#999' }}>Balance</div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>245.50 USDT</div>
              <div style={{ marginBottom: '8px', fontSize: '14px', color: '#999' }}>Gas</div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2ECC71' }}>0.045 BNB</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '20px' }}>
                <button style={{ 
                  padding: '16px', 
                  backgroundColor: 'rgba(46, 204, 113, 0.2)', 
                  border: '2px solid rgba(46, 204, 113, 0.4)', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  Deposit
                </button>
                <button style={{ 
                  padding: '16px', 
                  backgroundColor: 'rgba(245, 196, 81, 0.2)', 
                  border: '2px solid rgba(245, 196, 81, 0.4)', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  Withdraw
                </button>
                <button style={{ 
                  padding: '16px', 
                  backgroundColor: 'rgba(249, 115, 22, 0.2)', 
                  border: '2px solid rgba(249, 115, 22, 0.4)', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  Buy Gas
                </button>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#151A21', 
              borderRadius: '16px', 
              padding: '20px', 
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>Active Tables</h2>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[10, 50, 100, 10, 50, 100].map((stake, i) => (
                  <div key={i} style={{ 
                    minWidth: '200px', 
                    backgroundColor: '#1C232C', 
                    border: '1px solid hsl(220, 10%, 18%)', 
                    borderRadius: '8px', 
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5C451', marginBottom: '8px' }}>{stake} USDT</div>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>2/4 Players</div>
                    <button style={{ 
                      width: '100%', 
                      padding: '8px', 
                      backgroundColor: '#F5C451', 
                      color: '#0B0F14', 
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}>
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Simple Bottom Nav */}
      <nav style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50, 
        backgroundColor: '#070A0D', 
        borderTop: '1px solid hsl(220, 10%, 18%)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px'
      }}>
        {[
          { id: 'home', label: 'Home' },
          { id: 'play', label: 'Play' },
          { id: 'wallet', label: 'Wallet' },
          { id: 'profile', label: 'Profile' },
          { id: 'settings', label: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              minWidth: '64px',
              color: activeTab === tab.id ? '#F5C451' : '#999',
              backgroundColor: activeTab === tab.id ? 'rgba(245, 196, 81, 0.1)' : 'transparent',
              borderRadius: '8px',
              border: 'none',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '20px', height: '20px', backgroundColor: activeTab === tab.id ? '#F5C451' : '#666', borderRadius: '4px' }} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default MobileApp;
