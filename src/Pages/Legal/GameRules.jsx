import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './GameRules.css';

const GameRules = () => {
    return (
        <div className="legal-page">
            <Header />
            <div className="legal-page-content">
                <div className="legal-container">
                    <h1>Game Rules</h1>
                    
                    <section className="legal-section">
                        <h2>Overview</h2>
                        <p>
                            Seka Svara is a blockchain-based card game where players compete to win real USDT prizes. 
                            This guide explains the rules, gameplay mechanics, and how to participate.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>1. Game Objective</h2>
                        <p>
                            The objective of Seka Svara is to have the best hand ranking among all players at the table. 
                            Players compete in rounds, placing bets and making strategic decisions to maximize their winnings.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>2. Getting Started</h2>
                        <h3>2.1 Prerequisites</h3>
                        <ul>
                            <li>Connect your Web3Auth wallet to the platform</li>
                            <li>Deposit USDT (BEP20) to your account</li>
                            <li>Ensure you have sufficient balance for game entry fees and bets</li>
                        </ul>

                        <h3>2.2 Joining a Game</h3>
                        <ul>
                            <li>Navigate to the Game Lobby</li>
                            <li>Select an available table or create your own</li>
                            <li>Wait for all players to join or start with fewer players</li>
                            <li>The game begins automatically when ready</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>3. Gameplay Mechanics</h2>
                        
                        <h3>3.1 Hand Rankings</h3>
                        <p>Hands are ranked from highest to lowest:</p>
                        <ol>
                            <li><strong>Three of a Kind</strong> - Three cards of the same rank</li>
                            <li><strong>Straight</strong> - Three consecutive cards of different suits</li>
                            <li><strong>Flush</strong> - Three cards of the same suit</li>
                            <li><strong>Pair</strong> - Two cards of the same rank</li>
                            <li><strong>High Card</strong> - The highest single card</li>
                        </ol>

                        <h3>3.2 Betting Rounds</h3>
                        <ul>
                            <li>Each game consists of multiple betting rounds</li>
                            <li>Players can <strong>Call</strong> (match the current bet), <strong>Raise</strong> (increase the bet), or <strong>Fold</strong> (exit the round)</li>
                            <li>Blind bets are required from designated players</li>
                            <li>Minimum and maximum bet limits are set per table</li>
                        </ul>

                        <h3>3.3 Card Dealing</h3>
                        <ul>
                            <li>Each player receives three cards</li>
                            <li>Cards are dealt face down initially</li>
                            <li>Players can view their cards by clicking "View Cards"</li>
                            <li>During showdown, all cards are revealed</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>4. Winning and Payouts</h2>
                        <ul>
                            <li>The player with the highest-ranking hand wins the pot</li>
                            <li>In case of ties, the pot is split equally among winners</li>
                            <li>Winnings are automatically credited to your account in USDT</li>
                            <li>You can withdraw your winnings at any time</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>5. Fair Play and Conduct</h2>
                        <h3>5.1 Prohibited Activities</h3>
                        <ul>
                            <li>Collusion or team play with other players</li>
                            <li>Using automated scripts or bots</li>
                            <li>Exploiting bugs or vulnerabilities</li>
                            <li>Sharing account information</li>
                            <li>Any form of cheating or manipulation</li>
                        </ul>

                        <h3>5.2 Consequences</h3>
                        <p>
                            Violations of fair play rules may result in:
                        </p>
                        <ul>
                            <li>Immediate account suspension</li>
                            <li>Forfeiture of winnings</li>
                            <li>Permanent ban from the platform</li>
                            <li>Legal action in severe cases</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>6. Technical Requirements</h2>
                        <ul>
                            <li>Stable internet connection</li>
                            <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                            <li>Web3Auth wallet connection</li>
                            <li>Sufficient BNB for gas fees (for withdrawals)</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>7. Tips for Success</h2>
                        <ul>
                            <li>Start with lower-stakes tables to learn the game</li>
                            <li>Understand hand rankings before playing</li>
                            <li>Manage your bankroll wisely</li>
                            <li>Pay attention to betting patterns</li>
                            <li>Don't play when emotional or distracted</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>8. Support</h2>
                        <p>
                            If you have questions about the game rules or need assistance, please visit our 
                            <Link to="/support" className="legal-link"> Help Center</Link> or contact our support team.
                        </p>
                    </section>

                    <div className="legal-actions">
                        <Link to="/" className="legal-back-btn">Back to Home</Link>
                        <Link to="/gamelobby" className="legal-play-btn">Start Playing</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GameRules;

