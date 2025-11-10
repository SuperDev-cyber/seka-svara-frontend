import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './index.css';

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openGroup, setOpenGroup] = useState(null);

    const faqData = [
        {
            group: 'Getting Started',
            icon: '📘',
            items: [
                {
                    question: 'How do I start playing Seka Svara?',
                    answer: 'Create an account using Web3Auth, connect your wallet, deposit USDT (BEP20), and join a table from the Game Lobby. You can start playing immediately after connecting your wallet.'
                },
                {
                    question: 'What cryptocurrencies are supported?',
                    answer: 'Currently, we support USDT on BEP20 (BSC) network. You can deposit and withdraw USDT using your Web3Auth wallet.'
                },
                {
                    question: 'Is there a minimum deposit amount?',
                    answer: 'No minimum deposit amount, but we recommend at least 10 USDT for smooth gameplay and to cover entry fees for multiple games.'
                },
                {
                    question: 'How do I connect my wallet?',
                    answer: 'Click the "Connect Wallet" button in the header. This will open the Web3Auth modal where you can sign in with Google or use your existing wallet. Your wallet will be automatically connected and ready to use.'
                }
            ]
        },
        {
            group: 'Wallet & Security',
            icon: '🔒',
            items: [
                {
                    question: 'How secure are my funds?',
                    answer: 'Your funds are managed through Web3Auth, which uses non-custodial wallet technology. We never hold your private keys, and you maintain full control over your funds.'
                },
                {
                    question: 'How long do withdrawals take?',
                    answer: 'Withdrawals are processed on-chain and usually complete within a few minutes, depending on BSC network congestion. You need sufficient BNB for gas fees.'
                },
                {
                    question: 'Are there withdrawal fees?',
                    answer: 'We do not charge withdrawal fees. You only pay the BSC network gas fee (in BNB) for the transaction. The gas fee is typically very low on BSC.'
                },
                {
                    question: 'Can I use multiple wallets?',
                    answer: 'Each account is linked to one Web3Auth wallet. You can only use the wallet that was connected during your initial registration.'
                }
            ]
        },
        {
            group: 'Gameplay',
            icon: '🎮',
            items: [
                {
                    question: 'How many players can join a table?',
                    answer: 'Each table supports up to 6 players (6MAX). You can create a table with any number of players from 2 to 6, and the game will start when all seats are filled or when you choose to start with fewer players.'
                },
                {
                    question: 'What happens if I disconnect during a game?',
                    answer: 'Your hand remains active, but if you do not take action within the time limit, your turn may be auto-folded. We recommend a stable internet connection for the best experience.'
                },
                {
                    question: 'Can I play multiple tables simultaneously?',
                    answer: 'Yes, you can join multiple tables as long as you have sufficient balance for entry fees and your device can handle multiple game sessions.'
                },
                {
                    question: 'How are hand rankings determined?',
                    answer: 'Hands are ranked from highest to lowest: Three of a Kind, Straight, Flush, Pair, and High Card. The player with the highest-ranking hand wins the pot.'
                },
                {
                    question: 'What is the entry fee?',
                    answer: 'Entry fees vary by table. Each table creator sets their own entry fee and betting limits. Check the table details before joining.'
                }
            ]
        },
        {
            group: 'Technical',
            icon: '⚡',
            items: [
                {
                    question: 'Which wallets are compatible?',
                    answer: 'We use Web3Auth for wallet management, which supports Google login and various wallet connections. You can sign in with Google or connect an existing Web3 wallet.'
                },
                {
                    question: 'Why is my transaction stuck?',
                    answer: 'This usually happens due to BSC network congestion or insufficient BNB for gas fees. Try increasing the gas limit or wait a few minutes and try again.'
                },
                {
                    question: 'Can I play on mobile devices?',
                    answer: 'Yes! Seka Svara is fully responsive and works on mobile browsers. You can connect your wallet and play games on any device with a modern web browser.'
                },
                {
                    question: 'What browsers are supported?',
                    answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome or Firefox.'
                }
            ]
        },
        {
            group: 'Account & Profile',
            icon: '👤',
            items: [
                {
                    question: 'How do I update my profile?',
                    answer: 'Go to your Profile page and click "Edit Profile" to upload an avatar or update your information. Your username is automatically generated from your Web3Auth account.'
                },
                {
                    question: 'Can I change my username?',
                    answer: 'Your username is generated from your Web3Auth account. If you signed in with Google, your username is based on your Google account name.'
                },
                {
                    question: 'How do I view my game history?',
                    answer: 'Your game statistics, including total games played, wins, and winnings, are displayed on your Profile page. Detailed game history is available in the Game Lobby.'
                }
            ]
        },
        {
            group: 'Tournaments & Leaderboard',
            icon: '🏆',
            items: [
                {
                    question: 'How do tournaments work?',
                    answer: 'Tournaments are special events where players compete for larger prize pools. Check the Tournament page for upcoming events, entry requirements, and prize structures.'
                },
                {
                    question: 'How is the leaderboard calculated?',
                    answer: 'The leaderboard ranks players by total winnings, games won, and win rate. Top players are displayed on the Leaderboard page with their statistics.'
                },
                {
                    question: 'Do I need to register for tournaments?',
                    answer: 'Yes, tournaments require separate registration. Check the Tournament page for registration details and deadlines.'
                }
            ]
        }
    ];

    const filteredFAQs = faqData.map(group => ({
        ...group,
        items: group.items.filter(item =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(group => group.items.length > 0);

    const toggleGroup = (groupName) => {
        setOpenGroup(openGroup === groupName ? null : groupName);
    };

    return (
        <div className="faq-page">
            <Header />
            <div className="faq-page-content">
                <div className="faq-container">
                    <div className="faq-header">
                        <h1 className="faq-main-title">Frequently Asked Questions</h1>
                        <p className="faq-subtitle">Find answers to common questions about Seka Svara</p>
                    </div>

                    <div className="faq-search-container">
                        <div className="faq-search">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input
                                className="faq-input"
                                placeholder="Search FAQ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="faq-groups">
                        {filteredFAQs.map((group, groupIndex) => (
                            <div key={groupIndex} className="faq-group">
                                <div
                                    className="faq-group-title"
                                    onClick={() => toggleGroup(group.group)}
                                >
                                    <span className="group-icon">{group.icon}</span>
                                    <span className="group-name">{group.group}</span>
                                    <span className="group-count">{group.items.length}</span>
                                    <svg
                                        className={`group-arrow ${openGroup === group.group ? 'open' : ''}`}
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="6,9 12,15 18,9"/>
                                    </svg>
                                </div>
                                <div className={`faq-items ${openGroup === group.group ? 'open' : ''}`}>
                                    {group.items.map((item, itemIndex) => (
                                        <details key={itemIndex} className="faq-item">
                                            <summary>{item.question}</summary>
                                            <p>{item.answer}</p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredFAQs.length === 0 && (
                        <div className="faq-no-results">
                            <p>No results found for "{searchTerm}"</p>
                            <p>Try searching with different keywords</p>
                        </div>
                    )}

                    <div className="faq-footer">
                        <p>Still have questions?</p>
                        <Link to="/support" className="faq-support-link">Contact Support</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQ;

