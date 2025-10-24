import React, { useState } from 'react';
import WalletBalance from '../../wallet/WalletBalance';
import DepositModal from '../../wallet/DepositModal';

const samplePlayers = [
    { name: 'You', balance: '1247 SEKA', you: true },
    { name: 'CryptoKing', balance: '890 SEKA' },
    { name: 'CardMaster', balance: '1560 SEKA' },
    { name: 'PokerPro', balance: '0 SEKA' },
    { name: 'BluffMaster', balance: '750 SEKA', muted: true }
];

const initialChat = [
    { user: 'CryptoKing', text: 'Good luck everyone!', time: '14:23' },
    { user: 'CardMaster', text: "Let's play!", time: '14:24' },
    { user: 'PokerPro', text: 'All in!', time: '14:26' },
];

const RightPanel = () => {
    const [messages, setMessages] = useState(initialChat);
    const [draft, setDraft] = useState('');
    const [showDepositModal, setShowDepositModal] = useState(false);

    const send = () => {
        if (!draft.trim()) return;
        setMessages(prev => [...prev, { 
            user: 'You', 
            text: draft, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setDraft('');
    };

    const quickReply = (text) => {
        setMessages(prev => [...prev, { 
            user: 'You', 
            text, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
    };

    return (
        <aside className="right-panel">
            {/* Wallet Balance Section */}
            {/* <div className="panel-section wallet">
                <div className="section-title">Your Wallet</div>
                <WalletBalance />
            </div> */}

            {/* <div className="panel-section players">
                <div className="section-title">Players</div>
                <ul className="players-list">
                    {samplePlayers.map(p => (
                        <li key={p.name} className={`player-row ${p.you ? 'you' : ''} ${p.muted ? 'muted' : ''}`}>
                            <span className="player-name">{p.name}</span>
                            <span className="player-balance">{p.balance}</span>
                        </li>
                    ))}
                </ul>
            </div> */}

            <div className="panel-section chat">
                <div className="section-title">Chat</div>
                <div className="chat-scroll">
                    {messages.map((m, i) => (
                        <div key={i} className="chat-line">
                            <span className="chat-user">{m.user}:</span>
                            <span className="chat-text">{m.text}</span>
                            <span className="chat-time">{m.time}</span>
                        </div>
                    ))}
                </div>
                <div className="chat-input-row">
                    <input
                        className="chat-input"
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => { if(e.key === 'Enter') send(); }}
                    />
                    <button className="chat-send" onClick={send}>Send</button>
                </div>
                <div className="quick-replies">
                    <button onClick={() => quickReply('Good luck!')}>Good luck!</button>
                    <button onClick={() => quickReply('Nice hand!')}>Nice hand!</button>
                    <button onClick={() => quickReply('All in!')}>All in!</button>
                    <button onClick={() => quickReply('Well played')}>Well played</button>
                </div>
            </div>

            {/* Deposit Modal */}
            <DepositModal 
                isOpen={showDepositModal} 
                onClose={() => setShowDepositModal(false)} 
            />
        </aside>
    );
};

export default RightPanel;
