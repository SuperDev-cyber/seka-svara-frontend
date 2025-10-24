import React from 'react';

const MainContent = () => {
    return (
        <div className="support-content">
            <div className="guide-card">
                <div className="guide-header">
                    <span className="guide-badge" />
                    <h2>How to Play Seka Svara</h2>
                    <p className="guide-sub">Master the classic 3-card game</p>
                </div>
                <div className="guide-body">
                    <h3>Game Basics</h3>
                    <p>Seka Svara is a classic 3-card game where each player receives 3 cards and bets on having the best hand. The player with the highest-ranking hand wins the entire pot.</p>

                    <h3>Hand Rankings (Highest to Lowest)</h3>
                    <ol>
                        <li><b>Three of a Kind</b> – Three cards of the same rank (e.g., A A A)</li>
                        <li><b>Straight Flush</b> – Three consecutive cards of the same suit (e.g., 9 10 J)</li>
                        <li><b>Flush</b> – Three cards of the same suit (e.g., K 8 3)</li>
                        <li><b>Straight</b> – Three consecutive cards (e.g., 9 10 J)</li>
                        <li><b>Pair</b> – Two cards of the same rank (e.g., K K Q)</li>
                        <li><b>High Card</b> – When no other hand is made, highest card wins</li>
                    </ol>

                    <h3>Betting Rounds</h3>
                    <p>Players can Check, Raise, Call, or Fold during their turn. The game continues until all active players have matched the highest bet or folded. Then cards are revealed and the best hand wins.</p>

                    <h3>Pot Distribution</h3>
                    <p>The winner takes the entire pot minus a small platform fee (2%). If there's a tie, the pot is split equally among the tied players.</p>
                </div>
            </div>

            <div className="faq-card">
                <div className="faq-title-row">
                    <span className="faq-title-icon">🔄</span>
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                </div>
                <div className="faq-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input className="faq-input" placeholder="Search FAQ..." />
                </div>
                <div className="faq-group">
                    <div className="faq-group-title"><span className="group-icon">📘</span><span>Getting Started</span><span className="count">3</span></div>
                    <details className="faq-item"><summary>How do I start playing Seka Svara?</summary><p>Create an account, connect your wallet, and join a table from the Game Lobby.</p></details>
                    <details className="faq-item"><summary>What cryptocurrencies are supported?</summary><p>USDT on BSC, TRON, and ETH networks.</p></details>
                    <details className="faq-item"><summary>Is there a minimum deposit amount?</summary><p>No minimum, but we recommend at least 10 USDT for smooth play.</p></details>
                </div>
                <div className="faq-group">
                    <div className="faq-group-title"><span className="group-icon">🔒</span><span>Wallet & Security</span><span className="count">3</span></div>
                    <details className="faq-item"><summary>How secure are my funds?</summary><p>Funds are managed by non-custodial smart contracts; we never hold your keys.</p></details>
                    <details className="faq-item"><summary>How long do withdrawals take?</summary><p>Usually within a few minutes depending on network congestion.</p></details>
                    <details className="faq-item"><summary>Are there withdrawal fees?</summary><p>Only the network fee; we do not charge extra withdrawal fees.</p></details>
                </div>
                <div className="faq-group">
                    <div className="faq-group-title"><span className="group-icon">🎮</span><span>Gameplay</span><span className="count">3</span></div>
                    <details className="faq-item"><summary>How many players can join a table?</summary><p>Up to 6 players per table.</p></details>
                    <details className="faq-item"><summary>What happens if I disconnect during a game?</summary><p>Your hand remains; actions may be auto-folded if time runs out.</p></details>
                    <details className="faq-item"><summary>Can I play multiple tables simultaneously?</summary><p>Yes, as long as your device and connection can handle it.</p></details>
                </div>
                <div className="faq-group">
                    <div className="faq-group-title"><span className="group-icon">⚡</span><span>Technical</span><span className="count">3</span></div>
                    <details className="faq-item"><summary>Which wallets are compatible?</summary><p>Metamask (BSC/ETH) and TronLink (TRON).</p></details>
                    <details className="faq-item"><summary>Why is my transaction stuck?</summary><p>Network congestion or low gas. Try increasing gas or wait a bit.</p></details>
                    <details className="faq-item"><summary>Can I play on mobile devices?</summary><p>Yes, via supported mobile browsers/wallets.</p></details>
                </div>
            </div>
        </div>
    );
};

export default MainContent;
