import React from 'react';
import './LegalContent.css';

const TermsOfServiceContent = () => {
  return (
    <div className="legal-content-page">
      <h1>Terms of Service</h1>
      <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing and using Seka Svara ("the Platform", "we", "us", "our"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Platform.
        </p>
        <p>
          These Terms apply to all users of the Platform, including players, visitors, and anyone who accesses or uses our services.
        </p>
      </section>

      <section>
        <h3>2. Description of Service</h3>
        <p>
          Seka Svara is an online gaming platform that allows users to play card games using blockchain technology. The Platform uses Web3Auth for wallet authentication and supports deposits and withdrawals via BEP20 (BSC) and ERC20 (Ethereum) networks.
        </p>
        <p>
          The Platform provides:
        </p>
        <ul>
          <li>Online card game services (Seka Svara)</li>
          <li>Blockchain wallet integration via Web3Auth</li>
          <li>Deposit and withdrawal services for USDT</li>
          <li>Game lobby and table management</li>
          <li>User profiles and statistics</li>
        </ul>
      </section>

      <section>
        <h3>3. Account Registration and Wallet Connection</h3>
        <p>
          To use the Platform, you must connect a Web3Auth wallet. By connecting your wallet, you:
        </p>
        <ul>
          <li>Automatically create an account on the Platform</li>
          <li>Agree to provide accurate and complete information</li>
          <li>Are responsible for maintaining the security of your wallet</li>
          <li>Accept responsibility for all activities under your account</li>
        </ul>
        <p>
          <strong>Important:</strong> You are solely responsible for the security of your Web3Auth wallet and private keys. The Platform does not store your private keys and cannot recover your wallet if you lose access.
        </p>
      </section>

      <section>
        <h3>4. Eligibility</h3>
        <p>
          You must be at least 18 years old to use the Platform. By using the Platform, you represent and warrant that:
        </p>
        <ul>
          <li>You are at least 18 years of age</li>
          <li>You have the legal capacity to enter into these Terms</li>
          <li>You are not located in a jurisdiction where online gaming is prohibited</li>
          <li>You will comply with all applicable laws and regulations</li>
        </ul>
      </section>

      <section>
        <h3>5. Deposits and Withdrawals</h3>
        <p>
          <strong>Deposits:</strong> You may deposit USDT to your Platform account using supported networks (BEP20 or ERC20). Deposits are credited to your Platform Score after blockchain confirmation.
        </p>
        <p>
          <strong>Withdrawals:</strong> You may withdraw USDT from your Web3Auth wallet to any valid address. Withdrawals are processed using your wallet's private key and require sufficient network tokens (BNB for BEP20, ETH for ERC20) for gas fees.
        </p>
        <p>
          <strong>Important Notes:</strong>
        </p>
        <ul>
          <li>All transactions are processed on the blockchain and are irreversible</li>
          <li>You are responsible for ensuring correct withdrawal addresses</li>
          <li>The Platform is not responsible for losses due to incorrect addresses or network fees</li>
          <li>Minimum deposit and withdrawal amounts may apply</li>
          <li>Transaction fees and gas costs are your responsibility</li>
        </ul>
      </section>

      <section>
        <h3>6. Game Rules and Fair Play</h3>
        <p>
          You agree to play games fairly and in accordance with the official Seka Svara rules. Prohibited activities include:
        </p>
        <ul>
          <li>Collusion or cheating of any kind</li>
          <li>Using automated systems or bots</li>
          <li>Exploiting bugs or vulnerabilities</li>
          <li>Creating multiple accounts to gain unfair advantages</li>
          <li>Any form of fraud or manipulation</li>
        </ul>
        <p>
          Violations may result in immediate account suspension or termination, forfeiture of funds, and legal action.
        </p>
      </section>

      <section>
        <h3>7. Platform Score and Balances</h3>
        <p>
          Your Platform Score represents your available balance for gameplay. Platform Score is separate from your blockchain wallet balance. Deposits increase your Platform Score, while withdrawals deduct from it.
        </p>
        <p>
          The Platform reserves the right to:
        </p>
        <ul>
          <li>Adjust Platform Scores in case of errors or disputes</li>
          <li>Freeze accounts pending investigation</li>
          <li>Deduct Platform Score for violations of these Terms</li>
        </ul>
      </section>

      <section>
        <h3>8. Intellectual Property</h3>
        <p>
          All content on the Platform, including but not limited to text, graphics, logos, images, software, and game designs, is the property of Seka Svara or its licensors and is protected by copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, modify, or create derivative works from any Platform content without express written permission.
        </p>
      </section>

      <section>
        <h3>9. Limitation of Liability</h3>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
        </p>
        <p>
          The Platform shall not be liable for:
        </p>
        <ul>
          <li>Any losses resulting from blockchain transactions</li>
          <li>Loss of funds due to wallet compromise or user error</li>
          <li>Network congestion or blockchain failures</li>
          <li>Interruptions or errors in service</li>
          <li>Loss of data or Platform Score</li>
        </ul>
      </section>

      <section>
        <h3>10. Indemnification</h3>
        <p>
          You agree to indemnify and hold harmless Seka Svara, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
        </p>
        <ul>
          <li>Your use of the Platform</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any applicable laws</li>
          <li>Your blockchain transactions</li>
        </ul>
      </section>

      <section>
        <h3>11. Account Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account at any time, with or without notice, for:
        </p>
        <ul>
          <li>Violation of these Terms</li>
          <li>Fraudulent or illegal activity</li>
          <li>Abuse of the Platform or other users</li>
          <li>Any reason we deem necessary for the security or integrity of the Platform</li>
        </ul>
        <p>
          Upon termination, you may withdraw any remaining Platform Score, subject to applicable fees and verification requirements.
        </p>
      </section>

      <section>
        <h3>12. Changes to Terms</h3>
        <p>
          We reserve the right to modify these Terms at any time. Material changes will be notified through the Platform or via email. Your continued use of the Platform after changes constitutes acceptance of the modified Terms.
        </p>
      </section>

      <section>
        <h3>13. Governing Law and Dispute Resolution</h3>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration or in the appropriate courts.
        </p>
      </section>

      <section>
        <h3>14. Contact Information</h3>
        <p>
          If you have questions about these Terms, please contact us through the Platform's support system.
        </p>
      </section>

      <section>
        <h3>15. Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
        </p>
      </section>
    </div>
  );
};

export default TermsOfServiceContent;

